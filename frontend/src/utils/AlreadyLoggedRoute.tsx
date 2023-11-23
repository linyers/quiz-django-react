import { Navigate } from "react-router-dom";
import { PrivateRoutesProps } from "../types";
import { useAuthStore } from "../store/auth";

function AlreadyLoggedRoute({ children, ...rest }: PrivateRoutesProps) {
  const isAuth = useAuthStore((state) => state.isAuth);

  return isAuth ? <Navigate to="/" /> : children;
}

export default AlreadyLoggedRoute;
