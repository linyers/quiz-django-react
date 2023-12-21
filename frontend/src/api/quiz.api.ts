import axios from "axios";

const quizAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "quiz/",
});

export const postQuiz = async (accessToken: string, data: any) => {
  return await quizAPI.post("", data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getQuizAlumno = async (accessToken: string, examen: number) => {
  return await quizAPI.get("", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    params: {
      examen
  }
  })
}
