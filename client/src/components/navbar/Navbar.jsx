import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const [openProfile, setOpenProfile] = useState(false);  
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 10000); // Actualizar la fecha y hora cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  const handleProfileClick = () => {
    setOpenProfile(prevState => !prevState);
  };


  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="center-text">  
          <div className="rol">  
            <p>Rol de usuario</p>     
          </div>
          <div className="nombre">  
            <p>Nombre</p>              
          </div>             
        </div>       
        
        <div className="items">     
          <div className="item center-text">
            <p>{formatDateTime(currentDateTime)}</p> {/* Muestra fecha y hora en formato personalizado */}
          </div>      
          <div className="item">
            <LogoutIcon className="avatar" onClick={handleProfileClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Función para formatear la fecha y hora
const formatDateTime = (dateTime) => {
  return dateTime.toLocaleString('es-ES', {
    month: 'long',   // Mes en formato largo
    day: '2-digit',  // Día del mes en formato de dos dígitos
    year: 'numeric', // Año en formato numérico
    hour: '2-digit', // Hora en formato de dos dígitos
    minute: '2-digit' // Minuto en formato de dos dígitos
  });
};


export default Navbar;
