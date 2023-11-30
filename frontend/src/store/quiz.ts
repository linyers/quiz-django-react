import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type QuestionAnswers, type Question } from "../types";
import { getPreguntasProtected } from "../api/preguntas.api";

interface State {
  questions: Question[];
  questionAnswers: QuestionAnswers[];
  quizStart: number;
  currentQuestion: number;

  requestQuiz: (accessToken: string) => void;
  setQuizStart: (examenId: number) => void;
  setQuestionAnswers: (newQuestionAnswers: QuestionAnswers[]) => void;
  goNextQuestion: () => void;
  goPrevQuestion: () => void;
}

export const useQuizStore = create<State>()(
  persist(
    (set, get) => {
      return {
        questions: [],
        questionAnswers: [],
        quizStart: 0,
        currentQuestion: 0,

        requestQuiz: async (accessToken: string) => {
          const { quizStart } = get();
          const res = await getPreguntasProtected(accessToken, quizStart);
          const data = res.data;
          set({ questions: data });
        },

        setQuizStart: (examenId: number) => {
          set({ quizStart: examenId });
        },

        setQuestionAnswers: (newQuestionAnswers: QuestionAnswers[]) => {
          set({ questionAnswers: [...newQuestionAnswers] });
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
      };
    },
    {
      name: "quiz-storage",
    }
  )
);
