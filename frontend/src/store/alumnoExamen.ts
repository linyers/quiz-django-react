import { create } from "zustand";
import { type AlumnoExamen } from "../types";
import { getAlumnoExamenes } from "../api/alumnoExamen.api";

interface State {
  alumnoExamens: AlumnoExamen[];
  query: object;

  requestAlumnoExamens: (accessToken: string) => void;
  setQuery: (query: object) => void;
  cleanQuery: () => void;
}

export const useAlumnoExamenStore = create<State>((set, get) => {
  return {
    alumnoExamens: [],
    query: {},

    requestAlumnoExamens: async (accessToken: string) => {
      const { query } = get();
      const res = await getAlumnoExamenes(accessToken, query);
      const data = res.data;
      set({ alumnoExamens: data });
    },

    setQuery: (query: object) => {
      set({ query: { ...query } });
    },

    cleanQuery: () => {
      set({ query: {} });
    },
  };
});
