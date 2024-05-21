import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./iniciarCita.scss";

import StartCita from "../../components/appointmentComponent/startAppointmentComponent";

const IniciarCita = () => {
  const { id } = useParams();
  const [cita, setCita] = useState(null);

  useEffect(() => {
    // Fetch para obtener los detalles de la cita
    fetch(`https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/cita/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los detalles de la cita");
        }
        return response.json();
      })
      .then((data) => {
        setCita(data);        
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Manejar el error, por ejemplo, redirigir a una página de error
      });
  }, [id]);
 
  return (
    <div className="citaDetalle">
      <Sidebar />
      <div className="citaDetalleContainer">
        <Navbar />
        <div className="citaDetallecontainers">
          
          {cita && cita.paciente && (cita.paciente.estado_cita === "AGENDADA" || cita.paciente.estado_cita === "FLEXIBLE") && cita.paciente.cita_id.toString() === id ? (
            <StartCita id={id} />
          ) : (
            <div className="citaDetalleContainer">
              <p>Cargando o datos no disponible, intente más tarde...</p> {/* Mensaje de carga o error */}
            </div>
          )} 
        </div>
      </div>
    </div>
  );
};

export default IniciarCita;
