import "./widget.scss";
import PeopleIcon from '@mui/icons-material/People';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

const Widget = ({ type, descripcion, onClick }) => {
  let data;
  //temporary
  const amount = 100;

  switch (type) {    
    case "citas":
      data = {
        title: "Citas del día",
        link: "Ver todo",
        icon: (
          <ChevronRightIcon
            className="icon"
            style={{
              backgroundColor: "rgba(0, 128, 0, 0.2)"
            }}
          />
        ),
      };
    break;
    case "pacientes":
      data = {
        title: "Pacientes",
        link: "Ver todo",
        icon: (
          <ChevronRightIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)"
          }}
          />
        ),
      };
    break;
    case "consultorios":
      data = {
        title: "Consultorios",        
        ajustes : true,
        link: "Ver todo",
        iconConsultorio:(
          <MeetingRoomIcon
            className="icon"
          />
        ),
        icon: (
          <ChevronRightIcon
            className="icon"
          />
        ),
      };
    break;
    case "usuarios":
      data = {
        ajustes:true,
        title: "Usuarios",
        link: "Ver todo",
        iconConsultorio:(<PeopleIcon
          className="icon"
        />),
        icon: (
          <ChevronRightIcon
            className="icon"            
          />
        ),
      };
    break;
    case "horario":
      data = {
        ajustes:true,
        title: "Clínica",
        link: "Ver todo",
        iconConsultorio:(<HealthAndSafetyIcon
          className="icon"
        />),
        icon: (
          <ChevronRightIcon
            className="icon"            
          />
        ),
      };
    break;
    case "ajustes":
      data = {
        title: "--",
        link: "Ver todo",
        icon: (
          <ChevronRightIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)"
          }}
          />
        ),
      };
    break;
    case "ajustestitulo":
      data = {
        title: "Ajustes",
        isTitle : true,
      };
    break;
    case "agenda":
      data = {
        title: "Agenda",
        link: "Ver todo",
        icon: (
          <ChevronRightIcon
            className="icon"
            style={{
              backgroundColor: "rgba(0, 128, 0, 0.2)"
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget" onClick={onClick}>
      <div className="left">               
        {data.ajustes && 
          <div className="icon">        
            {data.iconConsultorio}
          </div> 
        }
        <div className="lefts">        
          <span className="title">{data.title}</span>
          <span className="counter">            
            {!data.isTitle && descripcion}
          </span>
        </div>         
      </div>
      <div className="right">      
        {!data.isTitle && <span className="link">{data.link}</span> && 
          <div className="icon">        
            {data.icon}
          </div> 
        }                  
      </div>
    </div>
  );
};

export default Widget;
