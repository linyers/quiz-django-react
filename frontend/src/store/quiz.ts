import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type QuestionAnswers, type Question, type FinishQuiz } from "../types";
import { getPreguntasProtected } from "../api/preguntas.api";
import { postQuiz, getQuizAlumno } from "../api/quiz.api";

interface State {
  questions: Question[];
  questionAnswers: QuestionAnswers[];
  quizStart: number;
  currentQuestion: number;
  finishedQuizAlumno?: FinishQuiz;

  requestQuiz: (accessToken: string) => void;
  setQuizStart: (examenId: number) => void;
  setNewQuestionAnswers: (product_id: number, respuesta_id: number) => void;
  removeQuestionAnswers: (product_id: number, respuesta_id: number) => void;
  finishQuiz: (accessToken: string) => void;
  fetchFinishedQuiz: (accessToken: string, examen: number) => void;
  goNextQuestion: () => void;
  goPrevQuestion: () => void;
  removeAllQuiz: () => void;
}

export const useQuizStore = create<State>()(
  persist(
    (set, get) => {
      return {
        questions: [],
        questionAnswers: [],
        quizStart: 0,
        currentQuestion: 0,
        finishedQuizAlumno: undefined,

        requestQuiz: async (accessToken: string) => {
          const { quizStart } = get();
          const res = await getPreguntasProtected(accessToken, quizStart);
          const data = res.data;
          set({ questions: data });
        },

        setQuizStart: (examenId: number) => {
          set({ quizStart: examenId });
        },

        setNewQuestionAnswers: (pregunta_id: number, respuesta_id: number) => {
          const { questionAnswers } = get();
          const newQuestionAnswers = structuredClone(questionAnswers);

          const questionIndex = newQuestionAnswers.findIndex(
            (q) => q.pregunta === pregunta_id
          );

          if (questionIndex === -1) {
            newQuestionAnswers.push({
              pregunta: pregunta_id,
              respuestas: [respuesta_id],
            });
            set({ questionAnswers: [...newQuestionAnswers] });
            return;
          }

          newQuestionAnswers[questionIndex].respuestas.push(respuesta_id);

          set({ questionAnswers: [...newQuestionAnswers] });
        },

        removeQuestionAnswers: (pregunta_id: number, respuesta_id: number) => {
          const { questionAnswers } = get();
          const newQuestionAnswers = structuredClone(questionAnswers);

          const questionIndex = newQuestionAnswers.findIndex(
            (q) => q.pregunta === pregunta_id
          );

          if (questionIndex === -1) return;

          const newAnswers = newQuestionAnswers[
            questionIndex
          ].respuestas.filter((r) => r !== respuesta_id);

          newQuestionAnswers[questionIndex].respuestas = newAnswers;

          set({ questionAnswers: [...newQuestionAnswers] });
          return;
        },

        finishQuiz: async (accessToken: string) => {
          const { questionAnswers, removeAllQuiz } = get();

          try {
            await postQuiz(accessToken, questionAnswers);
            removeAllQuiz()
          } catch (error) {
            console.log(error);
          }
        },

        fetchFinishedQuiz: async (accessToken: string, examen: number) => {
          try {
            const res = await getQuizAlumno(accessToken, examen);
            set({ finishedQuizAlumno: res.data })
          } catch (err) {
            console.log(err)
          }
        },

        goNextQuestion: () => {
          const { currentQuestion, questions } = get();
          const nextQuestion = currentQuestion + 1;

          if (nextQuestion < questions.length) {
            set({ currentQuestion: nextQuestion });
          }
        },

        goPrevQuestion: () => {
          const { currentQuestion } = get();
          const nextQuestion = currentQuestion - 1;

          if (nextQuestion >= 0) {
            set({ currentQuestion: nextQuestion });
          }
        },

        removeAllQuiz: () => {
          set({ questions: [], questionAnswers: [], quizStart: 0 });
        }
      };
    },
    {
      name: "quiz-storage",
    }
  )
);
