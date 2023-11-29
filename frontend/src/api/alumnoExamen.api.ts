import axios from "axios";

const alumnoExamenAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "alumnos-examen/",
});

export const getAlumnoExamenes = (accessToken: string, query: object) => {
  return alumnoExamenAPI.get("/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: query,
  });
};
