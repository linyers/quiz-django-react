import { useEffect } from "react";
import { useAlumnoStore } from "../../store/alumnos";
import { useAuthStore } from "../../store/auth";
import AlumnoExamen from "../AlumnoExamen";

function Alumno({ id }: { id: number }) {
  const requestOneAlumno = useAlumnoStore((state) => state.requestOneAlumno);
  const oneAlumno = useAlumnoStore((state) => state.oneAlumno);
  const tokens = useAuthStore((state) => state.tokens);

  useEffect(() => {
    const getOneAlumno = () => {
      const accessToken = tokens?.access;

      if (!accessToken) return;

      requestOneAlumno(accessToken, id);
    };

    getOneAlumno();
  }, []);

  return (
    <>
      {oneAlumno ? (
        <>
          <div className="md:max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden md:fixed w-full md:right-6">
            <img
              className="w-full h-40 object-cover"
              src={oneAlumno.pic ? oneAlumno.pic : "/user-pic.png"}
              alt={`${oneAlumno.nombre} ${oneAlumno.apellido}`}
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">
                {oneAlumno.nombre} {oneAlumno.apellido}
              </h2>
              <p className="text-gray-600">
                <span className="font-bold">ID:</span> {oneAlumno.id}
              </p>
              <p className="text-gray-600">
                <span className="font-bold">Correo:</span> {oneAlumno.user}
              </p>
              <p className="text-gray-600">
                <span className="font-bold">DNI:</span> {oneAlumno.dni}
              </p>
              <p className="text-gray-600">
                <span className="font-bold">Año y Curso:</span>{" "}
                {`${oneAlumno.año} ${oneAlumno.curso}`}
              </p>
            </div>
          </div>
          <div className="md:max-w-3xl md:mt-0 mt-5 mx-auto bg-white shadow-lg rounded-lg overflow-hidden fixed w-full md:left-6">
            <div className="p-4">
              <AlumnoExamen alumnoId={oneAlumno?.id} />
            </div>
          </div>
        </>
      ) : (
        <p>Error</p>
      )}
    </>
  );
}

export default Alumno;
