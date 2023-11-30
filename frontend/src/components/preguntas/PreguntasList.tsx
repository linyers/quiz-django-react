import { ChangeEvent, useEffect, useState } from "react";
import PreguntaCard from "./PreguntaCard";
import Modal from "../Modal";
import { usePreguntaStore } from "../../store/preguntas";
import { useAuthStore } from "../../store/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const CreateForm = ({ setShowModal }: { setShowModal: Function }) => {
  const tokens = useAuthStore((state) => state.tokens);
  const createPregunta = usePreguntaStore((state) => state.createPregunta);
  const errors = usePreguntaStore((state) => state.errors);
  const cleanErrors = usePreguntaStore((state) => state.cleanErrors);
  const examenId = usePreguntaStore((state) => state.examenId);

  const [respuestas, setRespuestas] = useState([
    { respuesta: "", correcta: false },
  ]);

  const addRespuesta = () => {
    setRespuestas([...respuestas, { respuesta: "", correcta: false }]);
  };

  const handleChange = (idx: number, e: ChangeEvent<HTMLInputElement>) => {
    let newRespuestas: any = [...respuestas];
    newRespuestas[idx][e.target.name] =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setRespuestas(newRespuestas);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      pregunta: e.currentTarget.pregunta.value,
      puntaje: parseInt(e.currentTarget.puntaje.value),
      respuestas,
      examen: examenId,
    };

    const accessToken = tokens?.access;

    if (!accessToken) {
      return;
    }

    const created = await createPregunta(accessToken, data);

    if (!created) return;

    setShowModal(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <div className="flex gap-5">
        <div className="flex flex-col">
          <label className="mb-2 font-bold text-lg text-gray-900">
            Pregunta
          </label>
          <input
            className={`border py-2 px-3 text-grey-800 ${
              errors?.pregunta && "border-red-500"
            }`}
            type="text"
            name="pregunta"
            placeholder="Pregunta"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-bold text-lg text-gray-900">
            Puntaje
          </label>
          <input
            className={`border py-2 px-3 text-grey-800 ${
              errors?.puntaje && "border-red-500"
            }`}
            type="number"
            name="puntaje"
            placeholder="Puntaje"
          />
        </div>
      </div>
      {respuestas.map((respuesta, idx) => {
        return (
          <div key={idx} className="flex mt-5 gap-5">
            <div className="flex flex-col">
              <div className="flex justify-end w-fit">
                {respuestas.length !== 1 && (
                  <FontAwesomeIcon
                    className="text-red-600 text-2xl hover:text-red-500 cursor-pointer"
                    icon={faTrash}
                    onClick={() => {
                      const newRespuestas = [...respuestas];
                      newRespuestas.splice(idx, 1);
                      setRespuestas(newRespuestas);
                    }}
                  />
                )}
                <label className="font-bold mb-2 text-lg text-gray-900">
                  Respuesta
                </label>
              </div>
              <input
                className={`border py-2 px-3 text-grey-800 ${
                  errors?.respuesta && "border-red-500"
                }`}
                type="text"
                name="respuesta"
                placeholder="Respuesta"
                onChange={(e) => handleChange(idx, e)}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-lg mb-2 text-gray-900">
                Correcta?
              </label>
              <input
                className={`border py-2 px-3 text-grey-800 ${
                  errors?.correcta && "border-red-500"
                }`}
                type="checkbox"
                name="correcta"
                placeholder="Respuesta"
                onChange={(e) => handleChange(idx, e)}
              />
            </div>
          </div>
        );
      })}
      <button
        className="mt-5 bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={addRespuesta}
      >
        Agregar Campo
      </button>
      {/*footer*/}
      <div className="flex gap-2 items-center mt-6 justify-end rounded-b">
        <button
          className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => {
            setShowModal(false);
            cleanErrors();
          }}
        >
          Cerrar
        </button>
        <button
          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
          type="submit"
        >
          Agregar
        </button>
      </div>
    </form>
  );
};

function PreguntasList() {
  const [showModal, setShowModal] = useState(false);
  const requestPreguntas = usePreguntaStore((state) => state.requestPreguntas);
  const preguntas = usePreguntaStore((state) => state.preguntas);
  const tokens = useAuthStore((state) => state.tokens);
  const examenId = usePreguntaStore((state) => state.examenId);

  useEffect(() => {
    const fetchPreguntas = async () => {
      const accessToken = tokens?.access;
      if (accessToken) {
        requestPreguntas(accessToken);
      }
    };
    fetchPreguntas();
  }, [examenId]);

  return (
    <div className="md:max-w-4xl mt-5 md:mx-auto mx-6 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 flex flex-col gap-5">
        <h2 className="text-2xl mb-2 font-semibold text-center">Preguntas</h2>
        <button
          className="p-2 font-bold bg-gray-900 shadow-md text-lg text-white rounded-lg duration-200 hover:bg-gray-700 hover:shadow-lg"
          type="button"
          onClick={() => setShowModal(true)}
        >
          Agrega preguntas
        </button>
        {showModal && (
          <Modal
            title={"Agregar pregunta"}
            setShowModal={setShowModal}
            Content={CreateForm}
          />
        )}
        {preguntas.length === 0 ? (
          <span className="font-bold text-gray-500">No hay preguntas...</span>
        ) : (
          <ul className="flex flex-col text-lg gap-5">
            {preguntas.map((pregunta, idx) => {
              return <PreguntaCard pregunta={pregunta} key={idx} />;
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PreguntasList;
