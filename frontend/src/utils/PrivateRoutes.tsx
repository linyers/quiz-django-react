import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { PrivateRoutesProps } from "../types";

function PrivateRoutes({ children, ...rest }: PrivateRoutesProps) {
  const isAuth = useAuthStore((state) => state.isAuth);

  return !isAuth ? <Navigate to="/login" /> : children;
}

export default PrivateRoutes;
