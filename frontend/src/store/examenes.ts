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
  requestExamenPreguntas: (accessToken: string, slug: string) => void;
  createExamen: (accessToken: string, body: object) => Promise<boolean>;
  updateExamen: (
    accessToken: string,
    body: object,
    slug: string
  ) => Promise<boolean>;
  removeExamen: (accessToken: string, slug: string) => Promise<boolean>;
  setExamenUpdate: (examen: Examen) => void;
  getCurrentTimeExamen: (end: string) => string;
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

    requestExamenPreguntas: async (accessToken: string, slug: string) => {
      const res = await getExamenPreguntas(accessToken, slug);
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

    updateExamen: async (accessToken: string, body: object, slug: string) => {
      try {
        const res = await putExamen(accessToken, body, slug);
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

    removeExamen: async (accessToken: string, slug: string) => {
      const { requestExamenes } = get();
      try {
        await deleteExamen(accessToken, slug);
        requestExamenes(accessToken);
        return true;
      } catch (err) {
        return false;
      }
    },

    getCurrentTimeExamen: (end: string): string => {
      const endDate = new Date(end);
      const today = new Date();
      const difference = endDate.getTime() - today.getTime();
      const currentDateTime = new Date(difference).toISOString().slice(11, 19);
      return currentDateTime;
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
