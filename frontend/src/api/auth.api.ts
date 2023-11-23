import axios from "axios";

const authAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "token/",
});

export const postLogin = (email: string, password: string) => {
  const body = {
    email,
    password,
  };
  return authAPI.post("", body);
};

export const postRefresh = (refresh: string) => {
  return authAPI.post("refresh/", {
    refresh,
  });
};
