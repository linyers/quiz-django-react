import { Link } from "react-router-dom";
import { useAuthStore } from "../store/auth";

function HomePage() {
  const userToken = useAuthStore((state) => state.userToken);

  return (
    <main className="flex mt-52 justify-center items-center gap-10">
      {userToken?.is_student ? (
        <Link
          className="px-6 py-3 font-bold bg-gray-900 shadow-md text-2xl text-white rounded-lg duration-200 hover:bg-gray-700 hover:shadow-lg"
          to={"/mis-examenes"}
        >
          Examenes
        </Link>
      ) : (
        <>
          <Link
            className="px-6 py-3 font-bold bg-gray-900 shadow-md text-2xl text-white rounded-lg duration-200 hover:bg-gray-700 hover:shadow-lg"
            to={"/alumnos"}
          >
            Alumnos
          </Link>
          <Link
            className="px-6 py-3 font-bold bg-gray-900 shadow-md text-2xl text-white rounded-lg duration-200 hover:bg-gray-700 hover:shadow-lg"
            to={"/examenes"}
          >
            Examenes
          </Link>
        </>
      )}
    </main>
  );
}

export default HomePage;
