import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { PrivateRoutesProps } from "../types";

function TeacherRoutes({ children, ...rest }: PrivateRoutesProps) {
  const userToken = useAuthStore((state) => state.userToken);

  return userToken?.is_student ? <Navigate to="/" /> : children;
}

export default TeacherRoutes;
