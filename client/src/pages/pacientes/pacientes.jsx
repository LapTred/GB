import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Widget from "../../components/widget/Widget";
import "./pacientes.scss";

const Pacientes = () => {
  return (
    <div className="pacientes">
      <Sidebar />
      <div className="pacientesContainer">
        <Navbar />
        <div className="containers">
          <div className="containerL">
            <div className="widgets">
              <Widget className="widget" type="citas" />
              <Widget className="widget" type="pacientes" />
            </div>
          </div>
          <div className="containerR">
            <div className="widgets">
              <Widget className="widget" type="agenda" />
            </div>
          </div>
        </div>        
      </div>
    </div>
  );
};

export default Pacientes;
