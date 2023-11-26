import axios from "axios";

const examenesAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getExamenPreguntas = (accessToken: string, id: number) => {
  return examenesAPI.get(`examen-complete/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getExamenes = (accessToken: string, query: object) => {
  return examenesAPI.get("/examen-partial/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getExamen = (accessToken: string, id: number) => {
  return examenesAPI.get(`/examen-partial/${id}/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const postExamen = (accessToken: string, body: object) => {
  return examenesAPI.post("/examen-partial/", body, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const putExamen = (accessToken: string, body: object, id: number) => {
  return examenesAPI.put(`/examen-partial/${id}/`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const deleteExamen = (accessToken: string, id: number) => {
  return examenesAPI.delete(`/examen-partial/${id}/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
