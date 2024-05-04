import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Appointment from "../../components/appointmentComponent/appointmentComponent";
import "./citas.scss";

const Citas = () => {
  return (
    <div className="citas">
      <Sidebar />
      <div className="citasContainer">
        <Navbar />
        <div className="containers">
          <Appointment/>
        </div>        
      </div>
    </div>
  );
};

export default Citas;
