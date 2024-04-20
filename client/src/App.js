import Home from "./pages/home/Home";
import Ajustes from "./pages/ajustes/Ajustes";
import Login from "./pages/login/Login";
import Single from "./pages/single/Single";
import Capacitacion from "./pages/capacitacion/capacitacion";
import CapacitacionBody from "./components/capacitacion-body/capacitacion-body";
import Tutoriales from "./pages/tutoriales/tutoriales";
import Asignaciones from "./pages/asignaciones/asignaciones"
import Usuario from "./pages/usuario/usuario"
import Usuario1 from "./pages/usuario1/usuario1"
import UsuarioFormulario from "./pages/usuarioFormulario/usuarioFormulario"
import UsuarioUpdate from "./pages/usuarioUpdate/usuarioUpdate"
import AsignacionFormulario from "./pages/asignacionFormulario/asignacionFormulario"
import AsignacionesJefa from "./pages/asignacionesJefa/asignacionesJefa"
import AsignacionUpdate from "./pages/asignacionUpdate/asignacionUpdate"
import HistorialesJefa from "./pages/historialesJefa/historialesJefa"
import HistorialesJefa2 from "./pages/historialesJefa2/historialesJefa2"
import Asignacion from "./pages/asignacion/asignacion"
import Preguntas from "./pages/preguntas/preguntas"
import Formulario from "./pages/formulario/formulario"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./style/dark.scss";
import React,{ useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import HistorialComponent from "./pages/Historial/RHistorial";
import HistorialGComponent from "./pages/HistorialID/RHistorialID";
import InconformidadesComponent from "./pages/Inconformidades/Inconformidades";
import InconformidadesGComponent from "./pages/InconformidadesID/InconformidadesID";
import VigenciasComponent from "./pages/Vigencias/Vigencias";
import VigenciasGComponent from "./pages/VigenciasID/VigenciasID";
import HomeAuditado from "./pages/homeAuditado/HomeAuditado";
import HomeAuditor from "./pages/homeAuditor/homeAuditor";
import AsignacionesAuditor from "./pages/asignacionesAuditor/asignacionesAuditor";

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
      case 'Jefa':
        return <Navigate to="/home" />;
      case 'Auditor':
        return <Navigate to="/homeAuditor" />;
      case 'auditado':
        return <Navigate to="/homeAuditado" />;
      default:
        return <Navigate to="/login" />;
    }
  } else {
    return <Navigate to="/login" />;
  }
};

function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />

            {/* jefa */}
            <Route path="usuario" element ={<PrivateRoute element={Usuario}/>}/>
            <Route path="/usuario1/:id" element ={<PrivateRoute element={Usuario1}/>}/>
            <Route path="usuarioFormulario" element ={<PrivateRoute element={UsuarioFormulario}/>}/>
            <Route path="usuarioUpdate/:id" element ={<PrivateRoute element={UsuarioUpdate}/>}/>
            <Route path="asignaciones" element ={<PrivateRoute element={Asignaciones}/>}/>
            <Route path="asignacionesJefa" element ={<PrivateRoute element={AsignacionesJefa}/>}/>
            <Route path="asignacionFormulario" element ={<PrivateRoute element={AsignacionFormulario}/>}/>
            <Route path="asignacionUpdate/:id" element ={<PrivateRoute element={AsignacionUpdate}/>}/>
            <Route path="historialesJefa" element ={<PrivateRoute element={HistorialesJefa}/>}/>
            <Route path="historialesJefa2" element ={<PrivateRoute element={HistorialesJefa2}/>}/>
            <Route path="home" element={<PrivateRoute element={Home}/>}/>
            <Route path="ajustes" element={<PrivateRoute element={Ajustes}/>}/>

            {/* Auditor */}
            <Route path="/capacitacion" element={<PrivateRoute2 element={Capacitacion} />} />
            <Route path="/capacitacion-body" element={<PrivateRoute2 element={CapacitacionBody} />} />
            <Route path="/tutoriales" element={<PrivateRoute2 element={Tutoriales} />} />
            <Route path="/asignacion/:id" element={<PrivateRoute2 element={Asignacion} />} />
            <Route path="/preguntas" element={<PrivateRoute2 element={Preguntas} />} />
            <Route path="/asignacion/:id/formulario" element={<PrivateRoute2 element={Formulario} />} />
            <Route path="/single" element={<PrivateRoute2 element={Single} />} />
            <Route path="/homeAuditor" element={<PrivateRoute2 element={HomeAuditor}/>}/>
            <Route path="asignacionesAuditor" element={<PrivateRoute2 element={AsignacionesAuditor}/>}/>
            
            {/* Auditado */}        
            <Route path="/historialComponent" element={<PrivateRoute3 element={HistorialComponent} />} />
            <Route path="/historialGComponent" element={<PrivateRoute3 element={HistorialGComponent} />} />
            <Route path="/inconformidadesComponent" element={<PrivateRoute3 element={InconformidadesComponent} />} />
            <Route path="/inconformidadesGComponent" element={<PrivateRoute3 element={InconformidadesGComponent} />} />
            <Route path="/vigenciasComponent" element={<PrivateRoute3 element={VigenciasComponent} />} />
            <Route path="/vigenciasGComponent" element={<PrivateRoute3 element={VigenciasGComponent} />} />
            <Route path="/homeAuditado" element={<PrivateRoute3 element={HomeAuditado}/>}/>
            
          </Route>
          <Route path="*" element={<CatchAll />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;