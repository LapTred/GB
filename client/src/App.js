import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Ajustes from "./pages/ajustes/ajustes";
import Login from "./pages/login/Login";
import Pacientes from "./pages/pacientes/pacientes";
import Citas from "./pages/citas/citas";
import Cita from "./pages/cita/cita";
import formularioCita from "./pages/formularioCita/formularioCita";
import IniciarCita from "./pages/iniciarCita/iniciarCita";
import "./style/dark.scss";

const PrivateRoute = ({ element: Element, requiredAccess, ...rest }) => {
  const isAuthenticated = sessionStorage.getItem('token');
  const userAccess = sessionStorage.getItem('Acceso');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredAccess && userAccess !== requiredAccess) {
    return <Navigate to="/login" />;
  }

  return <Element {...rest} />;
};

const CatchAll = () => {
  const isAuthenticated = sessionStorage.getItem('token');
  const userAccess = sessionStorage.getItem('Acceso');

  if (isAuthenticated && userAccess) {
    return <Navigate to="/home" />;
  } else {
    return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas compartidas por todos los roles */}
          <Route path="/home" element={<PrivateRoute element={Home} />} />
          <Route path="/pacientes" element={<PrivateRoute element={Pacientes} />} />
          <Route path="/citas" element={<PrivateRoute element={Citas} />} />
          <Route path="/cita/nueva" element={<PrivateRoute element={formularioCita} />} />
          <Route path="/cita/:id" element={<PrivateRoute element={Cita} />} />
          <Route path="/cita/iniciar/:id" element={<PrivateRoute element={IniciarCita} />} />

          {/* Rutas específicas para Administrador */}
          <Route path="/ajustes" element={<PrivateRoute element={Ajustes} requiredAccess="Administrador" />} />

          <Route path="*" element={<CatchAll />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
