import { useParams } from "react-router-dom";
import AlumnosList from "../components/alumnos/AlumnosList";
import Alumno from "../components/alumnos/Alumno";

function AlumnosPage() {
  const { id } = useParams();
  return <main className="">{id ? <Alumno id={id} /> : <AlumnosList />}</main>;
}

export default AlumnosPage;
