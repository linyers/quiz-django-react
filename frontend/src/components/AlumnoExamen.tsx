import { useEffect } from "react";
import { useAlumnoExamenStore } from "../store/alumnoExamen";
import { useAuthStore } from "../store/auth";

const AlumnosPerExamen = ({ examenId }: { examenId: number }) => {
  const alumnoExamens = useAlumnoExamenStore((state) => state.alumnoExamens);
  const requestAlumnoExamens = useAlumnoExamenStore(
    (state) => state.requestAlumnoExamens
  );
  const setQuery = useAlumnoExamenStore((state) => state.setQuery);
  const tokens = useAuthStore((state) => state.tokens);

  useEffect(() => {
    const getAlumnoExamens = () => {
      const accessToken = tokens?.access;

      if (!accessToken) return;

      setQuery({
        by_examen: examenId,
      });

      requestAlumnoExamens(accessToken);
    };

    getAlumnoExamens();
  }, [alumnoExamens.length]);

  if (alumnoExamens.length === 0) {
    return (
      <span className="text-xl font-semibold">
        No hay alumnos que hayan hecho el examen
      </span>
    );
  }

  return <span className="text-xl font-semibold">Alumnos:</span>;
};

const ExamenesPerAlumno = ({ alumnoId }: { alumnoId: number }) => {
  const alumnoExamens = useAlumnoExamenStore((state) => state.alumnoExamens);
  const requestAlumnoExamens = useAlumnoExamenStore(
    (state) => state.requestAlumnoExamens
  );
  const setQuery = useAlumnoExamenStore((state) => state.setQuery);
  const tokens = useAuthStore((state) => state.tokens);

  useEffect(() => {
    const getAlumnoExamens = () => {
      const accessToken = tokens?.access;

      if (!accessToken) return;

      setQuery({
        by_alumno: alumnoId,
      });

      requestAlumnoExamens(accessToken);
    };

    getAlumnoExamens();
  }, [alumnoExamens.length]);

  if (alumnoExamens.length === 0) {
    return (
      <span className="text-xl font-semibold">No tiene examenes hechos</span>
    );
  }

  return <span className="text-xl font-semibold">Examenes hechos:</span>;
};

function AlumnoExamen({
  alumnoId,
  examenId,
}: {
  alumnoId?: number;
  examenId?: number;
}) {
  if (alumnoId) {
    return <ExamenesPerAlumno alumnoId={alumnoId} />;
  }
  if (examenId) {
    return <AlumnosPerExamen examenId={examenId} />;
  }
}

export default AlumnoExamen;
