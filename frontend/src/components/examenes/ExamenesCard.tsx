import { useState } from "react";
import { type Examen } from "../../types";
import { useExamenStore } from "../../store/examenes";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal";
import { useAuthStore } from "../../store/auth";
import DateExamen from "./DateExamen";

const AlertDelete = ({
  setShowDeleteAlert,
  id,
}: {
  setShowDeleteAlert: Function;
  id: number;
}) => {
  const tokens = useAuthStore((state) => state.tokens);
  const removeExamen = useExamenStore((state) => state.removeExamen);

  const handleDelete = (id: number) => {
    const accessToken = tokens?.access;
    if (!accessToken) return;
    removeExamen(accessToken, id);
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
                    Eliminar examen
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Estas seguro que deseas eliminar este examen?
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

const UpdateExamenForm = ({ setShowModal }: { setShowModal: Function }) => {
  const examenUpdate = useExamenStore((state) => state.examenUpdate);

  const tokens = useAuthStore((state) => state.tokens);

  const updateExamen = useExamenStore((state) => state.updateExamen);
  const errors = useExamenStore((state) => state.errors);
  const cleanErrors = useExamenStore((state) => state.cleanErrors);

  const [pic, setPic] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const accessToken = tokens?.access;

    if (!accessToken || !examenUpdate) {
      return;
    }

    const created = await updateExamen(
      accessToken,
      { ...data, pic },
      examenUpdate.id
    );

    if (!created) return;

    setShowModal(false);
  };

  const isImage = (file: File) => {
    return file && file["type"].split("/")[0] === "image";
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <label
        htmlFor="input-profile-pic"
        className="cursor-pointer mb-2 w-full h-32 self-center"
      >
        <img
          className={`object-cover w-full h-full rounded-md ${
            errors?.image && "border-2 border-red-500 rounded-full"
          }`}
          src={
            pic && isImage(pic)
              ? URL.createObjectURL(pic)
              : examenUpdate?.image
              ? examenUpdate.image
              : "user-pic.png"
          }
          alt=""
        />
        <input
          type="file"
          name="pic"
          onChange={(e) => setPic(e.target.files ? e.target.files[0] : null)}
          id="input-profile-pic"
          className="hidden"
        />
      </label>

      <label className="mb-2 font-bold text-lg text-gray-900">Titulo</label>
      <input
        className={`border py-2 px-3 text-grey-800 ${
          errors?.title && "border-red-500"
        }`}
        type="text"
        name="title"
        placeholder="Titulo"
        defaultValue={examenUpdate?.title}
      />

      <div className="flex gap-5">
        <div className="flex flex-col">
          <label className="mt-4 mb-2 font-bold text-lg text-gray-900">
            Fecha de inicio
          </label>
          <input
            className={`border py-2 px-3 text-grey-800 ${
              errors?.start && "border-red-500"
            }`}
            type="datetime-local"
            defaultValue={examenUpdate?.start}
            name="start"
          />
        </div>
        <div className="flex flex-col">
          <label className="mt-4 mb-2 font-bold text-lg text-gray-900">
            Fecha de fin
          </label>
          <input
            className={`border py-2 px-3 text-grey-800 ${
              errors?.end && "border-red-500"
            }`}
            type="datetime-local"
            defaultValue={examenUpdate?.end}
            name="end"
          />
        </div>
      </div>

      <div className="flex gap-5">
        <div className="flex flex-col">
          <label className="mt-4 mb-2 font-bold text-lg text-gray-900">
            Materia
          </label>
          <select
            className={`border py-2 px-3 text-grey-800 ${
              errors?.materia && "border-red-500"
            }`}
            name="materia"
            defaultValue={examenUpdate?.materia}
          >
            <option value="historia">Historia</option>
            <option value="etica">Etica</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mt-4 mb-2 font-bold text-lg text-gray-900">
            Año
          </label>
          <select
            className={`border py-2 px-3 text-grey-800 ${
              errors?.año && "border-red-500"
            }`}
            name="año"
            defaultValue={examenUpdate?.año}
          >
            <option value="1°">1°</option>
            <option value="2°">2°</option>
            <option value="3°">3°</option>
            <option value="4°">4°</option>
            <option value="5°">5°</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mt-4 mb-2 font-bold text-lg text-gray-900">
            Curso
          </label>
          <select
            className={`border py-2 px-3 text-grey-800 ${
              errors?.curso && "border-red-500"
            }`}
            name="curso"
            defaultValue={examenUpdate?.curso}
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>
      </div>
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

function ExamenesCard({ examen }: { examen: Examen }) {
  const [showIcons, setShowIcons] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  const setExamenUpdate = useExamenStore((state) => state.setExamenUpdate);

  return (
    <>
      <li
        className="flex flex-col w-72 md:w-80 justify-between pb-4 bg-gray-50 shadow-sm hover:shadow-md duration-200 text-xl items-center rounded-md"
        onMouseEnter={() => setShowIcons(true)}
        onMouseLeave={() => setShowIcons(false)}
      >
        <Link to={`/examenes/${examen.id}`}>
          <section className="flex gap-2 items-center w-full h-36">
            <img
              className="object-cover h-full w-screen rounded-t-md"
              src={examen.image ? examen.image : "user-pic.png"}
              alt=""
            />
          </section>
        </Link>
        <Link
          to={`/examenes/${examen.id}`}
          className="capitalize mt-6 mb-4 font-bold text-2xl text-center"
        >
          {examen.title}
        </Link>
        <Link to={`/examenes/${examen.id}`}>
          <section className="flex items-center gap-3">
            <span className="capitalize">{examen.materia}</span>
            <span>
              {examen.año} {examen.curso}
            </span>
          </section>
        </Link>
        <DateExamen start={examen.start} end={examen.end} />
        {showIcons && (
          <span className="absolute text-white text-4xl slide-in">
            <FontAwesomeIcon
              onClick={() => {
                setShowModalUpdate(true);
                setExamenUpdate(examen);
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
        )}
      </li>
      {showDeleteAlert && (
        <AlertDelete setShowDeleteAlert={setShowDeleteAlert} id={examen.id} />
      )}
      {showModalUpdate && (
        <Modal
          title={"Modificar examen"}
          setShowModal={setShowModalUpdate}
          Content={UpdateExamenForm}
        />
      )}
    </>
  );
}
export default ExamenesCard;
