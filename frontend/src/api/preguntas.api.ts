import axios from "axios";

const preguntasAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "preguntas/",
});

export const getPreguntas = (accessToken: string) => {
  return preguntasAPI.get("/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getPregunta = (accessToken: string, id: number) => {
  return preguntasAPI.get(`/${id}/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const postPregunta = (accessToken: string, body: object) => {
  return preguntasAPI.post("/", body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const putPregunta = (accessToken: string, body: object, id: number) => {
  return preguntasAPI.put(`/${id}/`, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const deletePregunta = (accessToken: string, id: number) => {
  return preguntasAPI.delete(`/${id}/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
