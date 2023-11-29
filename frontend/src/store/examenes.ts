import { create } from "zustand";
import { type Examen, type ExamenPreguntas } from "../types";
import {
  getExamenPreguntas,
  getExamenes,
  postExamen,
  putExamen,
  deleteExamen,
} from "../api/examenes.api";

import axios, { AxiosError } from "axios";

interface State {
  examenes: Examen[];
  examenPreguntas?: ExamenPreguntas;
  examenUpdate?: Examen;
  query: object;
  errors?: object;

  requestExamenes: (accessToken: string) => void;
  requestExamenPreguntas: (accessToken: string, id: number) => void;
  createExamen: (accessToken: string, body: object) => Promise<boolean>;
  updateExamen: (
    accessToken: string,
    body: object,
    id: number
  ) => Promise<boolean>;
  removeExamen: (accessToken: string, id: number) => Promise<boolean>;
  setExamenUpdate: (examen: Examen) => void;
  cleanErrors: () => void;
  cleanQuery: () => void;
}

export const useExamenStore = create<State>((set, get) => {
  return {
    examenes: [],
    examenPreguntas: undefined,
    examenUpdate: undefined,
    query: {},
    errors: undefined,

    requestExamenes: async (accessToken: string) => {
      const { query } = get();
      const res = await getExamenes(accessToken, query);
      const data = res.data;
      set({ examenes: data });
    },

    requestExamenPreguntas: async (accessToken: string, id: number) => {
      const res = await getExamenPreguntas(accessToken, id);
      const data = res.data;
      set({ examenPreguntas: data });
    },

    createExamen: async (accessToken: string, body: object) => {
      try {
        const res = await postExamen(accessToken, body);
        const data = res.data;
        set({ examenes: data });
        return true;
      } catch (err: Error | AxiosError | any) {
        if (axios.isAxiosError(err)) {
          const data = err.response?.data;
          set({ errors: data });
        }
        return false;
      }
    },

    updateExamen: async (accessToken: string, body: object, id: number) => {
      try {
        const res = await putExamen(accessToken, body, id);
        const data = res.data;
        set({ examenes: data });
        return true;
      } catch (err: Error | AxiosError | any) {
        if (axios.isAxiosError(err)) {
          const data = err.response?.data;
          set({ errors: data });
        }
        return false;
      }
    },

    removeExamen: async (accessToken: string, id: number) => {
      const { requestExamenes } = get();
      try {
        await deleteExamen(accessToken, id);
        requestExamenes(accessToken);
        return true;
      } catch (err) {
        return false;
      }
    },

    setExamenUpdate: (examen: Examen) => {
      set({ examenUpdate: examen });
    },

    cleanErrors: () => {
      set({ errors: undefined });
    },
    cleanQuery: () => {
      set({ query: {} });
    },
  };
});
