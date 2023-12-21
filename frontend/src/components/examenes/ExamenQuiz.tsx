import { useEffect } from "react";
import { useAuthStore } from "../../store/auth";
import { useQuizStore } from "../../store/quiz";
import { type Question } from "../../types";

const Question = ({ question }: { question: Question }) => {
  const questionAnswers = useQuizStore((state) => state.questionAnswers);
  const setNewQuestionAnswers = useQuizStore(
    (state) => state.setNewQuestionAnswers
  );
  const removeQuestionAnswers = useQuizStore(
    (state) => state.removeQuestionAnswers
  );

  const handleAnswer = (id: number) => () => {
    // The question not in the array
    if (!questionAnswers.find((q) => q.pregunta === question.id)) {
      setNewQuestionAnswers(question.id, id);
      return;
    }

    // The question in array, but the answer dont
    if (!questionAnswers.find((q) => q.respuestas.includes(id))) {
      setNewQuestionAnswers(question.id, id);
      return;
    }

    // The question in array and asnwer too
    removeQuestionAnswers(question.id, id);
  };

  return (
    <>
      <span>{question.pregunta}</span>
      <span>{question.puntaje}</span>
      <ul>
        {question.respuestas.map((respuesta, idx) => {
          return (
            <li onClick={handleAnswer(respuesta.id)} key={idx}>
              {respuesta.respuesta}
            </li>
          );
        })}
      </ul>
    </>
  );
};

function ExamenQuiz() {
  const tokens = useAuthStore((state) => state.tokens);
  const requestQuiz = useQuizStore((state) => state.requestQuiz);
  const questions = useQuizStore((state) => state.questions);

  const currentQuestion = useQuizStore((state) => state.currentQuestion);
  const goNextQuestion = useQuizStore((state) => state.goNextQuestion);
  const goPrevQuestion = useQuizStore((state) => state.goPrevQuestion);

  const finishQuiz = useQuizStore((state) => state.finishQuiz);

  useEffect(() => {
    const fetchQuiz = async () => {
      const accessToken = tokens?.access;

      if (accessToken) {
        requestQuiz(accessToken);
      }
    };
    fetchQuiz();
  }, [questions.length]);

  const questionInfo = questions[currentQuestion];

  if (questions.length === 0) {
    return;
  }

  const handleFinishQuiz = () => () => {
    const accessToken = tokens?.access;
    if (!accessToken) return;
    finishQuiz(accessToken);
  };

  return (
    <div className="">
      <button onClick={() => goPrevQuestion()}>anterior</button>
      <span>Pregunta: {currentQuestion + 1}</span>
      <button onClick={() => goNextQuestion()}>siguiente</button>
      <Question question={questionInfo} />
      <button onClick={handleFinishQuiz()}>Terminar</button>
    </div>
  );
}

export default ExamenQuiz;
