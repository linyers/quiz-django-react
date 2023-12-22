import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth";
import { useQuizStore } from "../../store/quiz";
import { type Question } from "../../types";
import { useExamenStore } from "../../store/examenes";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      <span className="text-2xl font-bold mb-5">{question.pregunta}</span>
      <ul className="border-t border-r border-l mb-5 text-center flex flex-col text-lg w-full shadow-">
        {question.respuestas.map((respuesta, idx) => {
          const selected = questionAnswers.some((q) =>
            q.respuestas.includes(respuesta.id)
          );
          return (
            <li
              className={`p-1 cursor-pointer border-b hover:bg-gray-100 duration-200 ${
                selected && "bg-gray-200"
              }`}
              onClick={handleAnswer(respuesta.id)}
              key={idx}
            >
              {respuesta.respuesta}
            </li>
          );
        })}
      </ul>
      <span>Puntaje: {question.puntaje}</span>
    </>
  );
};

function ExamenQuiz({ end }: { end: string }) {
  const tokens = useAuthStore((state) => state.tokens);
  const requestQuiz = useQuizStore((state) => state.requestQuiz);
  const questions = useQuizStore((state) => state.questions);

  const currentQuestion = useQuizStore((state) => state.currentQuestion);
  const goNextQuestion = useQuizStore((state) => state.goNextQuestion);
  const goPrevQuestion = useQuizStore((state) => state.goPrevQuestion);

  const finishQuiz = useQuizStore((state) => state.finishQuiz);

  const getCurrentTimeExamen = useExamenStore(
    (state) => state.getCurrentTimeExamen
  );
  const [currentTime, setCurrentTime] = useState(getCurrentTimeExamen(end));

  useEffect(() => {
    const fetchQuiz = async () => {
      const accessToken = tokens?.access;

      if (accessToken) {
        requestQuiz(accessToken);
      }
    };
    fetchQuiz();

    const intervalId = setInterval(() => {
      setCurrentTime(getCurrentTimeExamen(end));
      const today = new Date();
      if (today > new Date(end)) {
        handleFinishQuiz()();
      }
    }, 1000);

    return () => clearInterval(intervalId);
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
    <div className="flex w-full justify-center mt-16">
      <div className="flex flex-col items-center p-5 border rounded-md md:w-1/2 w-2/3 shadow-md bg-gray-50">
        <div className="flex justify-between w-full items-center mb-5">
          <button
            className="bg-gray-200 p-2 rounded-md hover:bg-gray-100 duration-150 font-bold text-gray-700"
            onClick={() => goPrevQuestion()}
          >
            Anterior
          </button>
          <span className="font-bold">Pregunta: {currentQuestion + 1}</span>
          <button
            className="bg-gray-200 p-2 rounded-md hover:bg-gray-100 duration-150 font-bold text-gray-700"
            onClick={() => goNextQuestion()}
          >
            Siguiente
          </button>
        </div>
        <Question question={questionInfo} />
        <div className="flex items-baseline justify-between w-full">
          <span className="flex items-center font-semibold text-gray-900">
            Quedan: {currentTime}{" "}
            <FontAwesomeIcon className="text-3xl" icon={faClockRotateLeft} />
          </span>
          <button
            className="bg-green-500 p-3 rounded mt-5 font-bold hover:bg-green-400 text-gray-50 duration-150"
            onClick={handleFinishQuiz()}
          >
            Terminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExamenQuiz;
