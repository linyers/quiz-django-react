import { useParams } from "react-router-dom";
import Examen from "../components/examenes/Examen";
import ExamenesList from "../components/examenes/ExamenesList";

function ExamenesPage() {
  let { slug } = useParams();
  return (
    <main className="">{slug ? <Examen slug={slug} /> : <ExamenesList />}</main>
  );
}

export default ExamenesPage;
