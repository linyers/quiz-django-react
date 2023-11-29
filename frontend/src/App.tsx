import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AlumnosPage from "./pages/AlumnosPage";
import ExamenesPage from "./pages/ExamenesPage";

import PrivateRoutes from "./utils/PrivateRoutes";
import TeacherRoutes from "./utils/TeacherRoutes";
import AlreadyLoggedRoute from "./utils/AlreadyLoggedRoute";

import Header from "./components/Header";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoutes>
                <HomePage />
              </PrivateRoutes>
            }
          />
          <Route
            path="/login"
            element={
              <AlreadyLoggedRoute>
                <LoginPage />
              </AlreadyLoggedRoute>
            }
          />
          <Route
            path="/alumnos"
            element={
              <TeacherRoutes>
                <AlumnosPage />
              </TeacherRoutes>
            }
          />
          <Route
            path="/alumnos/:id"
            element={
              <TeacherRoutes>
                <AlumnosPage />
              </TeacherRoutes>
            }
          />
          <Route
            path="/examenes"
            element={
              <TeacherRoutes>
                <ExamenesPage />
              </TeacherRoutes>
            }
          />
          <Route
            path="/examenes/:id"
            element={
              <TeacherRoutes>
                <ExamenesPage />
              </TeacherRoutes>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
