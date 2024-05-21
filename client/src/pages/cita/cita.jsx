import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ResumenCita from "../../components/appointmentComponent/resumenCita";
import VerCita from "../../components/appointmentComponent/verCita";
import "./cita.scss";

const Cita = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const estado = queryParams.get("estado");

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
      })
      .catch((error) => {
        console.error("Error:", error);
        // Manejar el error, por ejemplo, redirigir a una página de error
      });
  }, [id]);

  useEffect(() => {
    // Redirigir a /citas si cita.paciente es null o undefined
    if (cita && cita.paciente === undefined) {
      navigate("/citas");      
      return; // Salir del efecto para evitar errores adicionales
    }
  
    // Verificar si el estado es válido y coincide con el estado de la cita
    if (cita && cita.paciente.estado_cita !== estado) {
      navigate(`/cita/${id}?estado=${cita.paciente.estado_cita}`);
    }
  }, [cita, estado, id, navigate]);
 
  return (
    <div className="citaDetalle">
      <Sidebar />
      <div className="citaDetalleContainer">
        <Navbar />
        <div className="citaDetallecontainers">
          {/* Mostrar el componente adecuado basado en el estado */}
          {cita && estado === "COMPLETADA" && cita.paciente.estado_cita === estado ? (
            <ResumenCita id={id} />
          ) : (
            <VerCita id={id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Cita;
