import axios from "axios";

const examenesAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getExamenPreguntas = (accessToken: string, slug: string) => {
  return examenesAPI.get(`examen-complete/${slug}`, {
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

export const postExamen = (accessToken: string, body: object) => {
  return examenesAPI.post("/examen-partial/", body, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const putExamen = (accessToken: string, body: object, slug: string) => {
  return examenesAPI.put(`/examen-partial/${slug}/`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const deleteExamen = (accessToken: string, slug: string) => {
  return examenesAPI.delete(`/examen-partial/${slug}/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
