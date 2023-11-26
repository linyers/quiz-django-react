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
  query: object;
  errors?: object;

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
  cleanQuery: () => void;
  cleanErrors: () => void;
}

export const usePreguntaStore = create<State>((set, get) => {
  return {
    preguntas: [],
    onePregunta: undefined,
    preguntaUpdate: undefined,
    query: {},
    errors: undefined,

    requestPreguntas: async (accessToken: string) => {
      const { query } = get();
      const res = await getPreguntas(accessToken);
      const data = res.data;
      set({ preguntas: data });
    },

    requestPregunta: async (accessToken: string, id: number) => {
      const res = await getPregunta(accessToken, id);
      const data = res.data;
      set({ onePregunta: data });
    },

    createPregunta: async (accessToken: string, body: object) => {
      try {
        const res = await postPregunta(accessToken, body);
        const data = res.data;
        set({ preguntas: data });
        return true;
      } catch (err: Error | AxiosError | any) {
        if (axios.isAxiosError(err)) {
          const data = err.response?.data;
          set({ errors: data });
        }
        return false;
      }
    },

    updatePregunta: async (accessToken: string, body: object, id: number) => {
      try {
        const res = await putPregunta(accessToken, body, id);
        const data = res.data;
        set({ preguntas: data });
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
    cleanQuery: () => {
      set({ query: {} });
    },
  };
});
