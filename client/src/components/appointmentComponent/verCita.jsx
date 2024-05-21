import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import "./resumenCita.scss";

const VerCita = ({ id }) => {
  const [cita, setCita] = useState(null);
  const navigate = useNavigate(); // Usa useNavigate para la navegación

  useEffect(() => {
    // Lógica para cargar los detalles de la cita basada en el id
    fetch(`https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/cita/${id}`)
      .then(response => response.json())
      .then(data => setCita(data))
      .catch(error => console.error('Error:', error));
  }, [id]);

  if (!cita) {
    return <p>Cargando...</p>;
  }

  // Función para formatear la fecha en formato DD--MM--AA
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  };

  const handleStartCita = () => {
    navigate(`/cita/iniciar/${id}`); // Usa navigate para redirigir
  };

  return (
    <div className="resumenCitaComponent">
      <div className="resumenCitaContainerT">
        <h2>Detalles de la Cita # {cita.paciente.cita_id}</h2>
        <div className="resumenCitaInfo">
          <div className="resumenCitaInfoDatos">
            <h3 className="TituloPequeño">Fecha:</h3>
            <p className="TituloPequeño">{formatDate(cita.paciente.fecha_cita)}</p>
          </div>
          <div className="resumenCitaInfoDatos">            
            <h3 className="TituloPequeño">Horario:</h3>
            <p className="TituloPequeño">{cita.paciente.hora_inicio} - {cita.paciente.hora_final}</p>
          </div>
        </div>
      </div>
      <div className="resumenCitacontainerB">
        <div className="resumenCitaContainerTitulo">
          <h2 className="Titulo">{cita.paciente.nombre_consultorio}</h2>
          <span className="Titulo">Servicio: {cita.paciente.nombre_servicio}</span>
          <div className="buttonIniciarCita">
            <button
              style={{ color: 'black',marginLeft: '0vw', border: '0.2vw solid transparent', padding: '0.5vw 0.5vw', borderRadius: '0.5vw', cursor: 'pointer' }}
              className="newCitaButton"
              onClick={handleStartCita}>Comenzar Cita
            </button>
          </div>          
        </div>
        <div className="resumenCitacontainer">
          <div className="resumenCitaBfirst resumenCitaInfoBox">
            <h3 className="TituloPequeño">Información General</h3>
            <div className="resumenCitaInfoSeparado">
              <div className="resumenCitaSeparado">
                <p>Paciente:</p>
                <div className="resumenCitaSeparadoInfo">{cita.paciente.nombre_paciente}</div>
              </div>
              <div className="resumenCitaSeparado">
                <p>Propietario:</p>
                <div className="resumenCitaSeparadoInfo">{cita.paciente.nombre_propietario}</div>
              </div>
              <div className="resumenCitaSeparado">
                <p>Teléfono:</p>
                <div className="resumenCitaSeparadoInfo">{cita.paciente.telefono_propietario}</div>
              </div>
            </div>
          </div>
          <div className="resumenCitaBsecond resumenCitaInfoBox">
            <h3 className="TituloPequeño">Detalles del Paciente</h3>
            <div className="resumenCitaInfoSeparado">
              <div className="resumenCitaSeparado">
                <p>Fecha de Nacimiento:</p>
                {/* Renderiza la fecha de nacimiento si existe, de lo contrario, renderiza un div vacío */}
                {cita.paciente.fecha_nacimiento ? (
                  <div className="resumenCitaSeparadoInfo">{formatDate(cita.paciente.fecha_nacimiento)}</div>
                ) : (
                  <div className="resumenCitaSeparadoInfo">Sin registro</div>
                )}
              </div>              
              <div className="resumenCitaSeparado">
                <p>Sexo:</p>
                {cita.paciente.sexo_paciente ? (
                  <div className="resumenCitaSeparadoInfo">{cita.paciente.sexo_paciente}</div>
                ) : (
                  <div className="resumenCitaSeparadoInfo">Sin registro</div>
                )}
              </div>
              <div className="resumenCitaSeparado">
                <p>Peso:</p>
                <div className="resumenCitaSeparadoInfo">
                {cita.paciente.peso_resumen_cita !== null ? 
                  cita.paciente.peso_resumen_cita : (cita.paciente.peso_paciente !== null ? 
                    `Registro anterior: ${cita.paciente.peso_paciente}` : 'Sin registro')}
                </div>               
                <p></p>
                <p>Kg.</p>
              </div>
            </div>
          </div>
        </div>
        {cita.medicamentos.length > 0 ? (
          <div className="resumenCitacontainerTable">
            <h3 className="TituloPequeño">Medicamentos</h3>
            <table className="citasTable">
              <thead>
                <tr>
                  <th className="tableHeader">Nombre</th>
                  <th className="tableHeader">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {cita.medicamentos.map(medicamento => (
                  <tr key={medicamento.idMedicamento}>
                    <td className="tableData">{medicamento.NombreMedicamento}</td>
                    <td className="tableData">{medicamento.DescripcionMedicamento}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="resumenCitacontainerTable">
            <h3 className="TituloPequeño"></h3>
          </div>          
        )}
        {cita.vacunas.length > 0 ? (
          <div className="resumenCitacontainerTable">
            <h3 className="TituloPequeño">Vacunas</h3>
            <table className="citasTable">
              <thead>
                <tr>
                  <th className="tableHeader">Nombre</th>
                  <th className="tableHeader">Dosis</th>
                  <th className="tableHeader">Fecha</th>
                  <th className="tableHeader">Próxima Fecha</th>
                </tr>
              </thead>
              <tbody>
                {cita.vacunas.map(vacuna => (
                  <tr key={vacuna.idVacuna}>
                    <td className="tableData">{vacuna.NombreVacuna}</td>
                    <td className="tableData">{vacuna.DosisVacuna}</td>
                    <td className="tableData">{formatDate(vacuna.FechaVacuna)}</td>
                    <td className="tableData">{formatDate(vacuna.FechaSiguienteVacuna)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="resumenCitacontainerTable">
            <h3 className="TituloPequeño">Inicie la cita para administrar vacunas/vacunas</h3>
          </div>          
        )}        
      </div>
    </div>
  );
};

export default VerCita;
