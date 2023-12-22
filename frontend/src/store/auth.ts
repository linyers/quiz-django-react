import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { type authToken, type UserToken } from "../types";
import { postLogin, postRefresh } from "../api/auth.api";
import axios, { AxiosError } from "axios";
import { useQuizStore } from "./quiz";

interface State {
  tokens?: authToken;
  userToken?: UserToken;
  isAuth: boolean;
  errors?: Error | AxiosError;

  requestTokens: (email: string, password: string) => void;
  requestRefresh: () => void;
  setUserToken: (accessToken: string) => void;
  logout: () => void;
  cleanErrors: () => void;
}

export const useAuthStore = create<State>()(
  persist(
    (set, get) => {
      return {
        tokens: undefined,
        userToken: undefined,
        isAuth: false,
        errors: undefined,

        requestTokens: async (email: string, password: string) => {
          const { setUserToken } = get();
          try {
            const res = await postLogin(email, password);
            const data = res.data;
            set({ tokens: data, isAuth: true });

            setUserToken(data.access);
          } catch (err: Error | AxiosError | any) {
            if (axios.isAxiosError(err)) {
              set({ errors: err.response?.data });
            }
          }
        },

        requestRefresh: async () => {
          const { tokens, setUserToken } = get();
          const refresh = tokens?.refresh;

          if (typeof refresh === "string") {
            try {
              const res = await postRefresh(refresh);
              const data = res.data;
              set({ tokens: data, isAuth: true });

              setUserToken(data.access);
            } catch (err: Error | AxiosError | any) {
              if (axios.isAxiosError(err)) {
                set({ errors: err.response?.data });
              }
            }
          }
        },

        setUserToken: (accessToken: string) => {
          const decodeAccessToken = jwtDecode<UserToken>(accessToken);

          set({ userToken: decodeAccessToken });
        },

        logout: () => {
          const removeAllQuiz = useQuizStore.getState().removeAllQuiz;
          removeAllQuiz();
          set({ tokens: undefined, userToken: undefined, isAuth: false });
        },

        cleanErrors: () => {
          set({ errors: undefined });
        },
      };
    },
    {
      name: "authTokens",
    }
  )
);
