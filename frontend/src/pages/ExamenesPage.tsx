import { useParams } from "react-router-dom";
import Examen from "../components/examenes/Examen";
import ExamenesList from "../components/examenes/ExamenesList";

function ExamenesPage() {
  let { id } = useParams();
  return (
    <main className="">
      {id ? <Examen id={parseInt(id)} /> : <ExamenesList />}
    </main>
  );
}

export default ExamenesPage;
