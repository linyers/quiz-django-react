import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth";
import { useExamenStore } from "../../store/examenes";
import Modal from "../Modal";
import ExamenesCard from "./ExamenesCard";
import ExamenesFilter from "./ExamenesFilter";

const CreateForm = ({ setShowModal }: { setShowModal: Function }) => {
  const tokens = useAuthStore((state) => state.tokens);

  const createExamen = useExamenStore((state) => state.createExamen);
  const errors = useExamenStore((state) => state.errors);
  const cleanErrors = useExamenStore((state) => state.cleanErrors);

  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const accessToken = tokens?.access;

    if (!accessToken) {
      return;
    }

    const created = await createExamen(accessToken, { ...data, image });

    if (!created) return;

    setShowModal(false);
  };

  const isImage = (file: File) => {
    return file && file["type"].split("/")[0] === "image";
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <label
        htmlFor="input-image"
        className="cursor-pointer mb-2 w-full h-32 self-center"
      >
        <img
          className={`object-cover w-full h-full rounded-md ${
            errors?.image && "border-2 border-red-500 rounded-full"
          }`}
          src={
            image && isImage(image)
              ? URL.createObjectURL(image)
              : "user-pic.png"
          }
          alt=""
        />
        <input
          type="file"
          name="image"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          id="input-image"
          className="hidden"
        />
      </label>

      <div className="flex flex-col">
        <label className="mb-2 font-bold text-lg text-gray-900">Titulo</label>
        <input
          className={`border py-2 px-3 text-grey-800 ${
            errors?.title && "border-red-500"
          }`}
          type="text"
          name="title"
          placeholder="Titulo"
        />
      </div>

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

function ExamenesList() {
  const requestExamenes = useExamenStore((state) => state.requestExamenes);
  const examenes = useExamenStore((state) => state.examenes);
  const tokens = useAuthStore((state) => state.tokens);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchExamenes = async () => {
      const accessToken = tokens?.access;
      if (accessToken) {
        requestExamenes(accessToken);
      }
    };
    fetchExamenes();
  }, [examenes.length]);

  return (
    <>
      <div className="flex items-center justify-between mx-6 my-5">
        <button
          className="p-3 font-bold bg-gray-900 shadow-md text-lg text-white rounded-lg duration-200 hover:bg-gray-700 hover:shadow-lg"
          type="button"
          onClick={() => setShowModal(true)}
        >
          Agregar Examen
        </button>
        {showModal && (
          <Modal
            title={"Agregar examen"}
            setShowModal={setShowModal}
            Content={CreateForm}
          />
        )}
        {examenes.length > 0 && <ExamenesFilter />}
      </div>
      {examenes.length > 0 ? (
        <>
          <ul className="mx-6 flex flex-wrap gap-5">
            {examenes.map((examen, idx) => {
              return <ExamenesCard examen={examen} key={idx} />;
            })}
          </ul>
        </>
      ) : (
        <span className="mx-6 p-6 bg-gray-100 flex flex-col gap-5 items-center justify-center font-bold text-2xl shadow-md">
          No hay examenes. Agrega con el boton de arriba!
        </span>
      )}
    </>
  );
}

export default ExamenesList;
