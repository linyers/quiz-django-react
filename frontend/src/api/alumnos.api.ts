import axios from "axios";

const alumnosAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getAlumnos = (accessToken: string, query: object) => {
  return alumnosAPI.get("/alumnos/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getAlumno = (accessToken: string, id: number) => {
  return alumnosAPI.get(`/alumnos/${id}/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const postAlumno = (accessToken: string, body: object) => {
  return alumnosAPI.post("/alumnos-create/", body, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const putAlumno = (accessToken: string, body: object, id: number) => {
  return alumnosAPI.put(`/alumnos/${id}/`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const deleteAlumno = (accessToken: string, id: number) => {
  return alumnosAPI.delete(`/alumnos/${id}/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
