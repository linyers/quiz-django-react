import { useEffect, useState } from "react";
import { useAlumnoStore } from "../../store/alumnos";
import { useAuthStore } from "../../store/auth";
import AlumnosCard from "./AlumnosCard";
import AlumnosFilter from "./AlumnosFilter";
import Modal from "./Modal";

const CreateForm = ({ setShowModal }: { setShowModal: Function }) => {
  const tokens = useAuthStore((state) => state.tokens);

  const createAlumno = useAlumnoStore((state) => state.createAlumno);
  const errors = useAlumnoStore((state) => state.errors);
  const cleanErrors = useAlumnoStore((state) => state.cleanErrors);

  const [pic, setPic] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const accessToken = tokens?.access;

    if (!accessToken) {
      return;
    }

    const created = await createAlumno(accessToken, { ...data, pic });

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
          src={pic && isImage(pic) ? URL.createObjectURL(pic) : "user-pic.png"}
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
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>
      </div>
      <label className="mt-4 mb-2 font-bold text-lg text-gray-900">Email</label>
      <input
        className={`border py-2 px-3 text-grey-800 ${
          errors?.email && "border-red-500"
        }`}
        type="email"
        name="email"
        placeholder="Email"
      />
      <div className="flex gap-5">
        <div className="flex flex-col">
          <label className="mt-4 mb-2 font-bold text-lg text-gray-900">
            Contraseña
          </label>
          <input
            className={`border py-2 px-3 text-grey-800 ${
              errors?.password && "border-red-500"
            }`}
            type="password"
            name="password"
            placeholder="Contraseña"
          />
        </div>
        <div className="flex flex-col">
          <label className="mt-4 mb-2 font-bold text-lg text-gray-900">
            Confirmar contraseña
          </label>
          <input
            className={`border py-2 px-3 text-grey-800 ${
              errors?.repeat_password && "border-red-500"
            }`}
            type="password"
            name="repeat_password"
            placeholder="Confirmar contraseña"
          />
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
          Agregar
        </button>
      </div>
    </form>
  );
};

function AlumnosList() {
  const requestAlumnos = useAlumnoStore((state) => state.requestAlumnos);
  const alumnos = useAlumnoStore((state) => state.alumnos);
  const tokens = useAuthStore((state) => state.tokens);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAlumnos = async () => {
      const accessToken = tokens?.access;
      if (accessToken) {
        requestAlumnos(accessToken);
      }
    };
    fetchAlumnos();
  }, [alumnos.length]);

  return (
    <>
      <div className="flex items-center justify-between mx-6 my-5">
        <button
          className="p-3 font-bold bg-gray-900 shadow-md text-lg text-white rounded-lg duration-200 hover:bg-gray-700 hover:shadow-lg"
          type="button"
          onClick={() => setShowModal(true)}
        >
          Agregar Alumno
        </button>
        {showModal && (
          <Modal
            title={"Agregar alumno"}
            setShowModal={setShowModal}
            Content={CreateForm}
          />
        )}
        {alumnos.length > 0 && <AlumnosFilter />}
      </div>
      {alumnos.length > 0 ? (
        <>
          <ul className="mx-6 flex flex-col gap-5">
            {alumnos.map((alumno, idx) => {
              return <AlumnosCard alumno={alumno} key={idx} />;
            })}
          </ul>
        </>
      ) : (
        <span className="mx-6 p-6 bg-gray-100 flex flex-col gap-5 items-center justify-center font-bold text-2xl shadow-md">
          No hay alumnos. Agrega con el boton de arriba!
        </span>
      )}
    </>
  );
}

export default AlumnosList;
