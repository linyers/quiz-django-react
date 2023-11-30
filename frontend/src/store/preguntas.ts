import { create } from "zustand";
import { type Pregunta } from "../types";
import {
  getPreguntas,
  getPregunta,
  postPregunta,
  putPregunta,
  deletePregunta,
} from "../api/preguntas.api";
import axios, { AxiosError } from "axios";

interface State {
  preguntas: Pregunta[];
  onePregunta?: Pregunta;
  preguntaUpdate?: Pregunta;
  errors?: object;
  examenId?: number;

  requestPreguntas: (accessToken: string) => void;
  requestPregunta: (accessToken: string, id: number) => void;
  createPregunta: (accessToken: string, body: object) => Promise<boolean>;
  updatePregunta: (
    accessToken: string,
    body: object,
    id: number
  ) => Promise<boolean>;
  removePregunta: (accessToken: string, id: number) => Promise<boolean>;
  setPreguntaUpdate: (pregunta: Pregunta) => void;
  cleanErrors: () => void;
  setExamenId: (id: number) => void;
}

export const usePreguntaStore = create<State>((set, get) => {
  return {
    preguntas: [],
    onePregunta: undefined,
    preguntaUpdate: undefined,
    errors: undefined,
    examenId: undefined,

    requestPreguntas: async (accessToken: string) => {
      const { examenId } = get();
      const res = await getPreguntas(accessToken, examenId);
      const data = res.data;
      set({ preguntas: data });
    },

    requestPregunta: async (accessToken: string, id: number) => {
      const res = await getPregunta(accessToken, id);
      const data = res.data;
      set({ onePregunta: data });
    },

    createPregunta: async (accessToken: string, body: object) => {
      const { requestPreguntas } = get();
      try {
        await postPregunta(accessToken, body);
        requestPreguntas(accessToken);
        return true;
      } catch (err: Error | AxiosError | any) {
        if (axios.isAxiosError(err)) {
          console.log(err.response?.data);
          const data = err.response?.data;
          set({ errors: data });
        }
        return false;
      }
    },

    updatePregunta: async (accessToken: string, body: object, id: number) => {
      const { requestPreguntas } = get();
      try {
        await putPregunta(accessToken, body, id);
        requestPreguntas(accessToken);
        return true;
      } catch (err: Error | AxiosError | any) {
        if (axios.isAxiosError(err)) {
          const data = err.response?.data;
          set({ errors: data });
        }
        return false;
      }
    },

    removePregunta: async (accessToken: string, id: number) => {
      const { requestPreguntas } = get();
      try {
        await deletePregunta(accessToken, id);
        requestPreguntas(accessToken);
        return true;
      } catch (err) {
        return false;
      }
    },

    setPreguntaUpdate: (pregunta: Pregunta) => {
      set({ preguntaUpdate: pregunta });
    },

    cleanErrors: () => {
      set({ errors: undefined });
    },

    setExamenId: (id: number) => {
      set({ examenId: id });
    },
  };
});
