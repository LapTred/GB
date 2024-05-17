import Home from "./pages/home/Home";
import Ajustes from "./pages/ajustes/ajustes";
import Login from "./pages/login/Login";
import Pacientes from "./pages/pacientes/pacientes";
import Citas from "./pages/citas/citas";
import Cita from "./pages/cita/cita";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./style/dark.scss";
import React,{ useContext } from "react";
import formularioCita from "./pages/formularioCita/formularioCita";
import IniciarCita from "./pages/iniciarCita/iniciarCita";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = sessionStorage.getItem('token');
  const userAccess = sessionStorage.getItem('Acceso');

  return isAuthenticated && userAccess === 'Administrador' ? <Element {...rest} /> : <Navigate to="/login" />;
};

const PrivateRoute2 = ({ element: Element, ...rest }) => {
  const isAuthenticated = sessionStorage.getItem('token');
  const userAccess = sessionStorage.getItem('Acceso');

  return isAuthenticated && userAccess === 'Veterinario' ? <Element {...rest} /> : <Navigate to="/login" />;
};

const PrivateRoute3 = ({ element: Element, ...rest }) => {
  const isAuthenticated = sessionStorage.getItem('token');
  const userAccess = sessionStorage.getItem('Acceso');

  return isAuthenticated && userAccess === 'Recepcionista' ? <Element {...rest} /> : <Navigate to="/login" />;
};

const CatchAll = () => {
  const isAuthenticated = sessionStorage.getItem('token');
  const userAccess = sessionStorage.getItem('Acceso');

  if (isAuthenticated && userAccess) {
    switch (userAccess) {
      case 'Veterinario':
        return <Navigate to="/home" />;
      case 'Recepcionista':
        return <Navigate to="/home" />;
      case 'Administrador':
        return <Navigate to="/home" />;
      default:
        return <Navigate to="/login" />;
    }
  } else {
    return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <div className={"app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />

            {/* Administrador */}
            <Route path="home" element={<PrivateRoute element={Home}/>}/>
            <Route path="ajustes" element={<PrivateRoute element={Ajustes}/>}/> 
            <Route path="pacientes" element={<PrivateRoute element={Pacientes}/>}/>             
            <Route path="citas" element={<PrivateRoute element={Citas}/>}/>      
            <Route path="cita/nueva" element={<PrivateRoute element={formularioCita}/>}/>    
            <Route path="cita/:id" element={<PrivateRoute element={Cita}/>}/>
            <Route path="cita/iniciar/:id" element={<PrivateRoute element={IniciarCita}/>}/>   
 
          </Route>
          <Route path="*" element={<CatchAll />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
