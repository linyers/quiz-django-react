import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ExamsPage from "./pages/ExamsPage";
import StudentsPage from "./pages/StudentsPage";

function App() {
  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/examenes" element={<ExamsPage />} />
          <Route path="/alumnos" element={<StudentsPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
