import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Patient from "../../components/patientComponent/patientComponent";
import "./pacientes.scss";

const Pacientes = () => {
  return (
    <div className="pacientes">
      <Sidebar />
      <div className="pacientesContainer">
        <Navbar />
        <div className="containers">
          <Patient/>
        </div>        
      </div>
    </div>
  );
};

export default Pacientes;
