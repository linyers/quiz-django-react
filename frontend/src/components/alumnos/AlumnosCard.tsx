import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useAlumnoStore } from "../../store/alumnos";
import { useAuthStore } from "../../store/auth";
import Modal from "./Modal";
import { Link } from "react-router-dom";

const AlertDelete = ({
  setShowDeleteAlert,
  id,
}: {
  setShowDeleteAlert: Function;
  id: number;
}) => {
  const tokens = useAuthStore((state) => state.tokens);
  const removeAlumno = useAlumnoStore((state) => state.removeAlumno);

  const handleDelete = (id: number) => {
    const accessToken = tokens?.access;
    if (!accessToken) return;
    removeAlumno(accessToken, id);
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
                    Eliminar alumno
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Estas seguro que deseas eliminar este alumno?
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

const UpdateAlumnoForm = ({ setShowModal }: { setShowModal: Function }) => {
  const alumnoUpdate = useAlumnoStore((state) => state.alumnoUpdate);

  const tokens = useAuthStore((state) => state.tokens);

  const updateAlumno = useAlumnoStore((state) => state.updateAlumno);
  const errors = useAlumnoStore((state) => state.errors);
  const cleanErrors = useAlumnoStore((state) => state.cleanErrors);

  const [pic, setPic] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const accessToken = tokens?.access;

    if (!accessToken || !alumnoUpdate) {
      return;
    }

    const created = await updateAlumno(
      accessToken,
      { ...data, pic },
      alumnoUpdate.id
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
        className="cursor-pointer mb-2 w-fit self-center"
      >
        <img
          className={`object-cover w-20 h-20 rounded-full ${
            errors?.pic && "border-2 border-red-500 rounded-full"
          }`}
          src={
            pic && isImage(pic)
              ? URL.createObjectURL(pic)
              : alumnoUpdate?.pic
              ? alumnoUpdate.pic
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
      <div className="flex gap-5">
        <div className="flex flex-col">
          <label className="mb-2 font-bold text-lg text-gray-900">Nombre</label>
          <input
            className={`border py-2 px-3 text-grey-800 ${
              errors?.nombre && "border-red-500"
            }`}
            type="text"
            name="nombre"
            placeholder="Nombre"
            defaultValue={alumnoUpdate?.nombre}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-bold text-lg text-gray-900 self-end">
            Apellido
          </label>
          <input
            className={`border py-2 px-3 text-grey-800 ${
              errors?.apellido && "border-red-500"
            }`}
            type="text"
            name="apellido"
            placeholder="Apellido"
            defaultValue={alumnoUpdate?.apellido}
          />
        </div>
      </div>

      <div className="flex gap-5">
        <div className="flex flex-col">
          <label className="mt-4 mb-2 font-bold text-lg text-gray-900">
            DNI
          </label>
          <input
            className={`border py-2 px-3 text-grey-800 ${
              errors?.dni && "border-red-500"
            }`}
            type="number"
            name="dni"
            placeholder="DNI"
            defaultValue={alumnoUpdate?.dni}
          />
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
            defaultValue={alumnoUpdate?.año}
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
            defaultValue={alumnoUpdate?.curso}
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

function AlumnosCard({ alumno }: any) {
  const [showIcons, setShowIcons] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  const setAlumnoUpdate = useAlumnoStore((state) => state.setAlumnoUpdate);

  return (
    <>
      <li
        className="flex justify-between p-4 bg-gray-50 shadow-sm hover:shadow-md duration-200 text-xl items-center"
        onMouseEnter={() => setShowIcons(true)}
        onMouseLeave={() => setShowIcons(false)}
      >
        <Link to={`/alumnos/${alumno.id}`}>
          <section className="flex gap-2 items-center">
            <img
              className="w-16 h-16 object-cover rounded-full"
              src={alumno.pic ? alumno.pic : "user-pic.png"}
              alt=""
            />
            <span className="capitalize">
              {alumno.nombre} {alumno.apellido}
            </span>
          </section>
        </Link>

        <Link to={`/alumnos/${alumno.id}`}>
          <section className="flex items-center gap-5">
            <span>{alumno.dni}</span>
            <span>
              {alumno.año} {alumno.curso}
            </span>
          </section>
        </Link>
        {showIcons && (
          <span className="absolute right-9 mb-20 text-4xl slide-in">
            <FontAwesomeIcon
              onClick={() => {
                setShowModalUpdate(true);
                setAlumnoUpdate(alumno);
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
        <AlertDelete setShowDeleteAlert={setShowDeleteAlert} id={alumno.id} />
      )}
      {showModalUpdate && (
        <Modal
          title={"Modificar alumno"}
          setShowModal={setShowModalUpdate}
          Content={UpdateAlumnoForm}
        />
      )}
    </>
  );
}

export default AlumnosCard;
