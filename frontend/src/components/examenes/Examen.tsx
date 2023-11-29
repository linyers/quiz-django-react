import { useEffect } from "react";
import { useExamenStore } from "../../store/examenes";
import { useAuthStore } from "../../store/auth";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import PreguntasList from "../preguntas/PreguntasList";
import { usePreguntaStore } from "../../store/preguntas";
import AlumnoExamen from "../AlumnoExamen";

function Examen({ id }: { id: number }) {
  const requestExamenPreguntas = useExamenStore(
    (state) => state.requestExamenPreguntas
  );
  const examenPreguntas = useExamenStore((state) => state.examenPreguntas);
  const tokens = useAuthStore((state) => state.tokens);

  const setExamenId = usePreguntaStore((state) => state.setExamenId);

  if (examenPreguntas?.id) setExamenId(examenPreguntas?.id);

  useEffect(() => {
    const getExamenPreguntas = () => {
      const accessToken = tokens?.access;

      if (!accessToken) return;

      requestExamenPreguntas(accessToken, id);
    };

    getExamenPreguntas();
  }, []);

  const time =
    new Date(examenPreguntas?.end) - new Date(examenPreguntas?.start);

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
          </div>
          <PreguntasList />
          <div className="md:max-w-4xl my-5 md:mx-auto mx-6 bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-4 flex flex-col gap-5">
              <AlumnoExamen examenId={examenPreguntas.id} />
            </div>
          </div>
        </>
      ) : (
        <p>Error</p>
      )}
    </>
  );
}

export default Examen;
