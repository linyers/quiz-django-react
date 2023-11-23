import { Link } from "react-router-dom";
import { useAuthStore } from "../store/auth";

function Header() {
  const logout = useAuthStore((state) => state.logout);
  const userToken = useAuthStore((state) => state.userToken);
  const isAuth = useAuthStore((state) => state.isAuth);

  if (!isAuth) {
    return;
  }

  return (
    <header className="px-6 py-5 flex justify-between font-bold text-xl">
      <Link className="hover:text-gray-800" to={"/"}>
        Inicio
      </Link>
      <nav className="flex gap-5">
        {userToken?.is_student ? (
          <>
            <img src={userToken.pic ? userToken.pic : "user-pic.png"} alt="" />
            <Link className="hover:text-gray-800" to={"/dashboard"}>
              {userToken.nombre} {userToken.apellido}
            </Link>
          </>
        ) : (
          <>
            <Link className="hover:text-gray-800" to={"/alumnos"}>
              Alumnos
            </Link>
            <Link className="hover:text-gray-800" to={"/examenes"}>
              Examenes
            </Link>
          </>
        )}
        <a className="cursor-pointer hover:text-gray-800" onClick={logout}>
          Salir
        </a>
      </nav>
    </header>
  );
}

export default Header;
