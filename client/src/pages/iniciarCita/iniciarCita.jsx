import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ResumenCita from "../../components/appointmentComponent/resumenCita";
import VerCita from "../../components/appointmentComponent/verCita";
import "./iniciarCita.scss";

const IniciarCita = () => {
  const { id } = useParams();
  const [cita, setCita] = useState(null);

  useEffect(() => {
    // Fetch para obtener los detalles de la cita
    fetch(`http://localhost:3001/cita/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los detalles de la cita");
        }
        return response.json();
      })
      .then((data) => {
        setCita(data);
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
          {/* Mostrar el componente adecuado basado en el estado
          {cita && estado === "COMPLETADA" && cita.paciente.estado_cita === estado ? (
            <ResumenCita id={id} />
          ) : (
            <VerCita id={id} />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default IniciarCita;
