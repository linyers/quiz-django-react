import {
  faPenToSquare,
  faStar,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { type Pregunta } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useState } from "react";
import Modal from "../Modal";
import { usePreguntaStore } from "../../store/preguntas";
import { useAuthStore } from "../../store/auth";

const AlertDelete = ({
  setShowDeleteAlert,
  id,
}: {
  setShowDeleteAlert: Function;
  id: number;
}) => {
  const tokens = useAuthStore((state) => state.tokens);
  const removePregunta = usePreguntaStore((state) => state.removePregunta);

  const handleDelete = (id: number) => {
    const accessToken = tokens?.access;
    if (!accessToken) return;
    removePregunta(accessToken, id);
    setShowDeleteAlert(false);
  };

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3
                    className="text-base font-semibold leading-6 text-gray-900"
                    id="modal-title"
                  >
                    Eliminar pregunta
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Estas seguro que deseas eliminar este pregunta?
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                onClick={() => handleDelete(id)}
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                Eliminar
              </button>
              <button
                onClick={() => setShowDeleteAlert(false)}
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UpdatePreguntaForm = ({ setShowModal }: { setShowModal: Function }) => {
  const preguntaUpdate = usePreguntaStore((state) => state.preguntaUpdate);

  const tokens = useAuthStore((state) => state.tokens);

  const updatePregunta = usePreguntaStore((state) => state.updatePregunta);
  const errors = usePreguntaStore((state) => state.errors);
  const cleanErrors = usePreguntaStore((state) => state.cleanErrors);
  const examenId = usePreguntaStore((state) => state.examenId);

  const [respuestas, setRespuestas] = useState(preguntaUpdate?.respuestas);

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

    if (!accessToken || !preguntaUpdate) {
      return;
    }

    const created = await updatePregunta(accessToken, data, preguntaUpdate.id);

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
            defaultValue={preguntaUpdate?.pregunta}
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
            defaultValue={preguntaUpdate?.puntaje}
          />
        </div>
      </div>
      {respuestas?.map((respuesta, idx) => {
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
                defaultValue={respuesta.respuesta}
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
                defaultChecked={respuesta.correcta}
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
          Guardar
        </button>
      </div>
    </form>
  );
};

function PreguntaCard({ pregunta }: { pregunta: Pregunta }) {
  const setPreguntaUpdate = usePreguntaStore(
    (state) => state.setPreguntaUpdate
  );
  const [showIcons, setShowIcons] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  return (
    <li>
      <div className="flex flex-col">
        <div className="flex items-center gap-5">
          <span className="font-bold">{pregunta.pregunta}</span>
          <span className="text-3xl slide-in">
            <FontAwesomeIcon
              onClick={() => {
                setShowModalUpdate(true);
                setPreguntaUpdate(pregunta);
              }}
              className="cursor-pointer hover:text-green-600 duration-200"
              icon={faPenToSquare}
            />
            <FontAwesomeIcon
              onClick={() => setShowDeleteAlert(true)}
              className="cursor-pointer hover:text-red-600 duration-200"
              icon={faTrash}
            />
          </span>
        </div>
        <span className="text-base mb-2">Puntaje: {pregunta.puntaje}</span>
        <div className="flex flex-col">
          {pregunta.respuestas.map((respuesta) => {
            return (
              <span
                className={`${
                  respuesta.correcta ? "text-green-600" : "text-gray-500"
                }`}
                key={respuesta.id}
              >
                <FontAwesomeIcon icon={faStar} /> {respuesta.respuesta}
              </span>
            );
          })}
        </div>
      </div>
      {showDeleteAlert && (
        <AlertDelete setShowDeleteAlert={setShowDeleteAlert} id={pregunta.id} />
      )}
      {showModalUpdate && (
        <Modal
          title={"Modificar pregunta"}
          setShowModal={setShowModalUpdate}
          Content={UpdatePreguntaForm}
        />
      )}
    </li>
  );
}

export default PreguntaCard;
