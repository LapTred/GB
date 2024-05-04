import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./formularioCita.scss";

const Formulario = () => {
  return (
    <div className="formulario-cita">
      <Sidebar />
      <div className="citasContainer">
        <Navbar />
        <div className="containers">

        </div>        
      </div>
    </div>
  );
};

export default Formulario;
