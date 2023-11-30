import { useEffect } from "react";
import { useAuthStore } from "../../store/auth";
import { useQuizStore } from "../../store/quiz";
import { type Question } from "../../types";

const Question = ({ question }: { question: Question }) => {
  const questionAnswers = useQuizStore((state) => state.questionAnswers);
  const setQuestionAnswers = useQuizStore((state) => state.setQuestionAnswers);

  const handleAnswer = (id: number) => () => {
    // The question not in the array
    if (!questionAnswers.find((q) => q.pregunta_id === question.id)) {
      setQuestionAnswers([
        ...questionAnswers,
        { pregunta_id: question.id, respuesta_id: [id] },
      ]);
      return;
    }

    // The question in array, but the answer dont
    if (!questionAnswers.find((q) => q.respuesta_id.includes(id))) {
      console.log("no esta seleccionado pero esta la pregunta en el array");
      return;
    }

    // The question in array and asnwer too
    const newAnswers = [...questionAnswers]
      .find((q) => q.pregunta_id === question.id)
      ?.respuesta_id.filter((r) => r !== id);

    if (!newAnswers) return;

    const newQuestionAnswers = [...questionAnswers].filter(
      (q) => q.pregunta_id !== question.id
    );

    setQuestionAnswers([
      ...newQuestionAnswers,
      {
        product_id: question.id,
        respuesta_id: newAnswers,
      },
    ]);
  };

  console.log(questionAnswers);

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

  return (
    <div className="">
      <button onClick={() => goPrevQuestion()}>anterior</button>
      <span>Pregunta: {currentQuestion + 1}</span>
      <button onClick={() => goNextQuestion()}>siguiente</button>
      <Question question={questionInfo} />
    </div>
  );
}

export default ExamenQuiz;
