import React, { useEffect, useState } from "react";
import "./resumenCita.scss";

const ResumenCita = ({ id }) => {
  const [cita, setCita] = useState(null);

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
        </div>
        <div className="resumenCitacontainer">
          <div className="resumenCitaBfirst resumenCitaInfoBox">
            <h3 className="TituloPequeño">Información General</h3>
            <div className="resumenCitaInfoSeparado">
              <div className="resumenCitaSeparado">
                <p>Descripción:</p>
                <div className="resumenCitaSeparadoInfo">{cita.paciente.descripcion_resumen_cita}</div>
              </div>
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
                <div className="resumenCitaSeparadoInfo">{formatDate(cita.paciente.fecha_nacimiento)}</div>
              </div>
              <div className="resumenCitaSeparado">
                <p>Peso del Paciente:</p>
                <div className="resumenCitaSeparadoInfo">{cita.paciente.peso_paciente}</div>
              </div>
              <div className="resumenCitaSeparado">
                <p>Sexo del Paciente:</p>
                <div className="resumenCitaSeparadoInfo">{cita.paciente.sexo_paciente}</div>
              </div>
              <div className="resumenCitaSeparado">
                <p>Peso:</p>
                <div className="resumenCitaSeparadoInfo">{cita.paciente.peso_resumen_cita}</div>                
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
            <h3 className="TituloPequeño">No se administraron medicamentos</h3>
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
            <h3 className="TituloPequeño">No se administraron vacunas</h3>
          </div>          
        )}
      </div>
    </div>
  );
};

export default ResumenCita;
