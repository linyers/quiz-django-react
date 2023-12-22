import { useEffect } from "react";
import { useExamenStore } from "../../store/examenes";
import { useAuthStore } from "../../store/auth";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClockRotateLeft,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import PreguntasList from "../preguntas/PreguntasList";
import { usePreguntaStore } from "../../store/preguntas";
import AlumnoExamen from "../AlumnoExamen";
import ExamenQuiz from "./ExamenQuiz";
import { useQuizStore } from "../../store/quiz";
import { type Pregunta, type AlumnoQuiz } from "../../types";

const FinishedQuizAnswers = ({
  pregunta,
  alumnoQuiz,
}: {
  pregunta: Pregunta;
  alumnoQuiz?: AlumnoQuiz;
}) => {
  const respuestasCorrectas = pregunta.respuestas.filter((r) => r.correcta);
  const alumnoAnswers = alumnoQuiz?.alumno_answers;

  let isCorrect = false;

  if (alumnoAnswers) {
    isCorrect = respuestasCorrectas.every((respuesta) =>
      alumnoAnswers.includes(respuesta.id)
    );
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <span className="font-bold">{pregunta.pregunta}</span>
        <span>
          {isCorrect ? (
            <FontAwesomeIcon
              className="text-3xl text-green-500"
              icon={faCheck}
            />
          ) : !alumnoAnswers ? (
            <FontAwesomeIcon
              className="text-3xl text-gray-500"
              icon={faQuestion}
            />
          ) : (
            <FontAwesomeIcon className="text-3xl text-red-500" icon={faXmark} />
          )}
        </span>
      </div>
      <span className="text-base mb-2">pts: {pregunta.puntaje}</span>
      <ul className="border rounded-md">
        {pregunta.respuestas.map((respuesta, idx) => {
          const isCorrect = respuestasCorrectas.includes(respuesta);
          const isAlumnoAnswer = alumnoAnswers?.includes(respuesta.id);

          let bgColor = "transparent";
          if (isCorrect && isAlumnoAnswer) bgColor = "bg-green-500";
          if (!isCorrect && isAlumnoAnswer) bgColor = "bg-red-500";
          if (isCorrect && !isAlumnoAnswer) bgColor = "bg-gray-200";
          return (
            <li className={`${bgColor} p-1 ${idx === 0 && "rounded-t-md"}`}>
              {respuesta.respuesta}
            </li>
          );
        })}
      </ul>
    </>
  );
};

const FinishedQuiz = ({ examen }: { examen: number }) => {
  const tokens = useAuthStore((state) => state.tokens);
  const fetchFinishedQuiz = useQuizStore((state) => state.fetchFinishedQuiz);
  const finishedQuizAlumno = useQuizStore((state) => state.finishedQuizAlumno);

  useEffect(() => {
    const fetchQuiz = () => {
      const accessToken = tokens?.access;
      if (!accessToken) return;
      fetchFinishedQuiz(accessToken, examen);
    };
    fetchQuiz();
  }, [examen]);

  return (
    <div className="md:max-w-4xl my-5 md:mx-auto mx-6 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 flex flex-col gap-2">
        <span className="text-lg mb-5 font-bold text-gray-600">
          Nota final:{" "}
          <span className="font-normal">{finishedQuizAlumno?.nota}</span>
        </span>
        <div className="flex gap-5 justify-center">
          <span className="flex items-center">
            <FontAwesomeIcon
              className="text-3xl text-green-500"
              icon={faCheck}
            />{" "}
            Correcta
          </span>
          <span className="flex items-center">
            <FontAwesomeIcon className="text-3xl text-red-500" icon={faXmark} />{" "}
            Incorrecta
          </span>
          <span className="flex items-center">
            <FontAwesomeIcon
              className="text-3xl text-gray-500"
              icon={faQuestion}
            />{" "}
            Sin responder
          </span>
        </div>
        <div className="flex flex-col text-lg gap-5">
          <ul className="flex flex-col gap-5">
            {finishedQuizAlumno?.preguntas.map((pregunta, idx) => {
              const alumnoQuiz = finishedQuizAlumno?.quiz.find(
                (q) => q.pregunta === pregunta.id
              );
              return (
                <li className="flex flex-col">
                  <FinishedQuizAnswers
                    pregunta={pregunta}
                    alumnoQuiz={alumnoQuiz}
                    key={idx}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

const StartButton = ({
  start,
  end,
  examenId,
  isDone,
}: {
  start: Date;
  end: Date;
  examenId: number;
  isDone: boolean;
}) => {
  const today = new Date();

  if (isDone) {
    return (
      <button className="bg-gray-400 text-white cursor-default font-bold uppercase text-sm shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 w-full p-3">
        Examen completado
      </button>
    );
  }
  if (today < new Date(start) || today > new Date(end)) {
    return (
      <button className="bg-gray-400 text-white cursor-default font-bold uppercase text-sm shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 w-full p-3">
        No disponible
      </button>
    );
  }

  const setQuizStart = useQuizStore((state) => state.setQuizStart);

  return (
    <button
      onClick={() => setQuizStart(examenId)}
      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 w-full p-3"
    >
      Empezar
    </button>
  );
};

function Examen({ slug }: { slug: string }) {
  const requestExamenPreguntas = useExamenStore(
    (state) => state.requestExamenPreguntas
  );
  const examenPreguntas = useExamenStore((state) => state.examenPreguntas);
  const tokens = useAuthStore((state) => state.tokens);
  const userToken = useAuthStore((state) => state.userToken);

  const setExamenId = usePreguntaStore((state) => state.setExamenId);
  const quizStart = useQuizStore((state) => state.quizStart);

  if (examenPreguntas?.id) setExamenId(examenPreguntas?.id);

  useEffect(() => {
    const getExamenPreguntas = () => {
      const accessToken = tokens?.access;

      if (!accessToken) return;

      requestExamenPreguntas(accessToken, slug);
    };

    getExamenPreguntas();
  }, []);

  const time =
    new Date(examenPreguntas?.end) - new Date(examenPreguntas?.start);

  if (quizStart === examenPreguntas?.id) {
    return <ExamenQuiz end={examenPreguntas.end.toString()} />;
  }

  return (
    <>
      {examenPreguntas ? (
        <>
          <div className="md:max-w-4xl md:mx-auto mx-6 bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              className="w-full h-40 object-cover"
              src={
                examenPreguntas.image ? examenPreguntas.image : "/user-pic.png"
              }
            />
            <div className="p-4">
              <h2 className="text-xl mb-2 font-semibold">
                {examenPreguntas.title}
              </h2>
              <p className="text-gray-600">
                <span className="font-bold">Materia:</span>
                <span className="capitalize"> {examenPreguntas.materia}</span>
              </p>
              <p className="text-gray-600">
                <span className="font-bold">Año y Curso:</span>{" "}
                {`${examenPreguntas.año} ${examenPreguntas.curso}`}
              </p>
              <p className="text-gray-600">
                <span className="font-bold">Nota maxima:</span>
                {examenPreguntas.max_nota ? (
                  <span className="capitalize">
                    {" "}
                    {examenPreguntas.max_nota}
                  </span>
                ) : (
                  <span className="capitalize"> - </span>
                )}
              </p>
              <p className="text-gray-600 flex">
                <span className="font-bold">Tiempo: </span>
                <span className="flex w-fit items-center">
                  {" "}
                  {moment(time).format("HH:mm")}{" "}
                  <FontAwesomeIcon
                    className="text-2xl"
                    icon={faClockRotateLeft}
                  />
                </span>
              </p>
              <p className="text-gray-600">
                <span className="font-bold">Empieza: </span>
                <span>{moment(examenPreguntas.start).format("LL HH:mm")}</span>
              </p>
              <p className="text-gray-600">
                <span className="font-bold">Termina: </span>
                <span>{moment(examenPreguntas.end).format("LL HH:mm")}</span>
              </p>
            </div>
            <StartButton
              start={examenPreguntas.start}
              end={examenPreguntas.end}
              examenId={examenPreguntas.id}
              isDone={examenPreguntas.is_done}
            />
          </div>
          {examenPreguntas.is_done && (
            <FinishedQuiz examen={examenPreguntas.id} />
          )}
          {!userToken?.is_student && (
            <>
              <PreguntasList />
              <div className="md:max-w-4xl my-5 md:mx-auto mx-6 bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-4 flex flex-col gap-5">
                  <AlumnoExamen examenId={examenPreguntas.id} />
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <p>Error</p>
      )}
    </>
  );
}

export default Examen;
