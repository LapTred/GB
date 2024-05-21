import DashboardIcon from "@mui/icons-material/Dashboard";
import PetsIcon from '@mui/icons-material/Pets';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';


import { Link } from "react-router-dom";
import logoImage from './logo.jpg';
import './sidebar.scss';



const Sidebar = () => {  

  const rol = sessionStorage.getItem('Acceso');


  return (
    <div className="sidebar">
      <div className="top">
        <img src={logoImage} alt="Logo" className="logo"/>
        <span className="vet-text">GB</span> {/* Texto "VET" al lado del logo */}
      </div>
      <div className="center">
        <ul>
          <p className="title">Menú</p>
          <Link to="/home" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Inicio</span>
            </li>
          </Link>
          <Link to="/pacientes" style={{ textDecoration: "none" }}>
            <li>
              <PetsIcon className="icon" />
              <span>Pacientes</span>
            </li>
          </Link>
          <Link to="/citas" style={{ textDecoration: "none" }}>
            <li>
              <CalendarTodayIcon className="icon" />
              <span>Citas</span>
            </li>
          </Link>
        </ul>
        {rol === "Administrador" && (
          <div>
            <hr className="linea" />        
            <ul className="general">
              <p className="title">General</p>          
              <Link to="/ajustes" style={{ textDecoration: "none" }}>
                <li>
                  <SettingsIcon className="icon" />
                  <span>Ajustes</span>
                </li>
              </Link>
            </ul>
          </div>
        )}
        
      
      </div>
    </div>
  );
};

export default Sidebar;
