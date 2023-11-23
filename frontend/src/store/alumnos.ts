import { create } from "zustand";
import { type Alumno, type AlumnoErrors } from "../types";
import {
  getAlumnos,
  getAlumno,
  postAlumno,
  putAlumno,
  deleteAlumno,
} from "../api/alumnos.api";
import axios, { AxiosError } from "axios";

interface State {
  alumnos: Alumno[];
  oneAlumno?: Alumno;
  query: object;
  alumnoUpdate?: Alumno;
  errors?: AlumnoErrors;

  requestAlumnos: (accessToken: string) => void;
  requestOneAlumno: (accessToken: string, id: number) => void;
  createAlumno: (accessToken: string, body: object) => Promise<boolean>;
  updateAlumno: (
    accessToken: string,
    body: object,
    id: number
  ) => Promise<boolean>;
  removeAlumno: (accessToken: string, id: number) => Promise<boolean>;
  setAlumnoUpdate: (alumno: Alumno) => void;
  cleanErrors: () => void;
  cleanQuery: () => void;
}

export const useAlumnoStore = create<State>((set, get) => {
  return {
    alumnos: [],
    oneAlumno: undefined,
    query: {},
    errors: undefined,

    requestAlumnos: async (accessToken: string) => {
      const { query } = get();
      const res = await getAlumnos(accessToken, query);
      const data = res.data;
      set({ alumnos: data });
    },
    requestOneAlumno: async (accessToken: string, id: number) => {
      const res = await getAlumno(accessToken, id);
      const data = res.data;
      set({ oneAlumno: data });
    },
    createAlumno: async (accessToken: string, body: object) => {
      const { cleanErrors } = get();
      try {
        const res = await postAlumno(accessToken, body);
        const data = res.data;
        set({ alumnos: data });
        cleanErrors();
        return true;
      } catch (err: Error | AxiosError | any) {
        if (axios.isAxiosError(err)) {
          set({ errors: err.response?.data });
        }
        return false;
      }
    },
    updateAlumno: async (accessToken: string, body: object, id: number) => {
      const { cleanErrors, requestAlumnos } = get();
      try {
        await putAlumno(accessToken, body, id);
        requestAlumnos(accessToken);
        cleanErrors();
        set({ alumnoUpdate: undefined });
        return true;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          set({ errors: err.response?.data });
        }
        return false;
      }
    },
    removeAlumno: async (accessToken: string, id: number) => {
      const { cleanErrors } = get();
      const { requestAlumnos } = get();
      try {
        await deleteAlumno(accessToken, id);
        requestAlumnos(accessToken);
        cleanErrors();
        return true;
      } catch (err) {
        return false;
      }
    },
    setAlumnoUpdate: (alumno: Alumno) => {
      set({ alumnoUpdate: alumno });
    },
    cleanErrors: () => {
      set({ errors: undefined });
    },
    cleanQuery: () => {
      set({ query: {} });
    },
  };
});
