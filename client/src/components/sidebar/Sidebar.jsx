import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import logoImage from './logo.jpg';
import './sidebar.scss';

const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  
  return (
    <div className="sidebar">
      <div className="top">
        <img src={logoImage} alt="Logo" className="logo"/>
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
          <Link to="/usuario" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Pacientes</span>
            </li>
          </Link>
          <Link to="/asignacionesJefa" style={{ textDecoration: "none" }}>
            <li>
              <AutoAwesomeMotionIcon className="icon" />
              <span>Citas</span>
            </li>
          </Link>
        </ul>
        <hr className="linea" />
        <ul className="general">
          <p className="title">General</p>          
          <Link to="/reportes" style={{ textDecoration: "none" }}>
            <li>
              <AssessmentIcon className="icon" />
              <span>Ajustes</span>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
