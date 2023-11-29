import { useParams } from "react-router-dom";
import AlumnosList from "../components/alumnos/AlumnosList";
import Alumno from "../components/alumnos/Alumno";

function AlumnosPage() {
  let { id } = useParams();
  return (
    <main className="">
      {id ? <Alumno id={parseInt(id)} /> : <AlumnosList />}
    </main>
  );
}

export default AlumnosPage;
