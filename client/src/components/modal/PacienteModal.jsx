import React from 'react';
import Modal from 'react-modal';
import './PacienteModal.scss';

const PacienteModal = ({ isOpen, onClose, pacienteDetails }) => {
  // Estilos para el modal
  const customStyles = {
    content: {
      width: '50%', // Ancho del modal
      height: '80%',
      margin: 'auto', // Centrar el modal horizontalmente
      overflow: 'auto', // Permitir desplazamiento si el contenido es demasiado grande
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',      
      justifyContent: 'center',     
    },
    header: {
      marginBottom: '20px',// Espaciado inferior del encabezado
      fontSize: '32px', 
    },
    text: {
      marginBottom: '20px', // Espaciado inferior del texto
    },
    button: {
      backgroundColor: '#007bff', // Color de fondo del botón
      border: 'none', // Borde del botón
      color: 'white', // Color del texto del botón
      padding: '15px 32px', // Espaciado interno del botón
      textAlign: 'center', // Alineación del texto dentro del botón
      textDecoration: 'none', // Decoración de texto
      display: 'inline-block', // Mostrar como bloque en línea
      fontSize: '16px', // Tamaño de fuente del botón
      margin: '1vw 2px', // Margen del botón
      cursor: 'pointer', // Cursor al pasar sobre el botón
      borderRadius: '12px', // Borde redondeado del botón
    },
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles} contentLabel="Modal de Expediente">
      <div className="ModalPaciente">
        {pacienteDetails && pacienteDetails.paciente ? (
          <>
            <h2 style={customStyles.header}>Detalles del Paciente</h2>
            <div className="ModalPacienteDato">
              <div className="startCitaSeparado">
                <p>Paciente:</p>
                <div className="startCitaSeparadoInfo">{pacienteDetails.paciente.nombrePaciente}</div>
              </div>
              <div className="startCitaSeparado">
                <p>Fecha de Nacimiento:</p>
                {/* Renderiza la fecha de nacimiento si existe, de lo contrario, renderiza un div vacío */}
                {pacienteDetails.paciente.fechaNacimiento ? (
                  <div className="startCitaSeparadoInfo">{new Date(pacienteDetails.paciente.fechaNacimiento).toLocaleDateString()}</div>
                ) : (
                  <div className="startCitaSeparadoInfo"></div>
                )}
              </div>        
            </div>
            <div className="ModalPacienteDato">  
              <div className="startCitaSeparadoPeso">
                <p>Peso:</p>
                <div className="startCitaSeparadoPesoEnd">
                  <div className="startCitaSeparadoInfo">
                    {pacienteDetails.paciente.peso !== null
                      ? pacienteDetails.paciente.peso
                      : (pacienteDetails.paciente.peso !== null
                        ? `Registro anterior: ${pacienteDetails.paciente.peso}`
                        : 'Sin registro')}                      
                  </div>                
                  <p>Kg.</p>
                </div>                
              </div>
              <div className="startCitaSeparado">
                <p>Sexo:</p>
                <div className="startCitaSeparadoInfo">{pacienteDetails.paciente.sexo}</div>
              </div>
            </div>               
            <div className="ModalPacienteDato">
              <div className="startCitaSeparado">
                <p>Propietario:</p>
                <div className="startCitaSeparadoInfo">{pacienteDetails.paciente.nombrePropietario}</div>
              </div>
              <div className="startCitaSeparado">
                <p>Teléfono:</p>
                <div className="startCitaSeparadoInfo">{pacienteDetails.paciente.telefonoPropietario}</div>
              </div>
            </div>
            <h3 style={customStyles.header}>Citas Previas</h3>
            {pacienteDetails.citas.filter(cita => cita.EstadoCita === 'COMPLETADA').length > 0 ? (
                <table className="patientTable">
                    <thead>
                    <tr>
                        <th className="tableHeader">Descripción</th>
                        <th className="tableHeader">Fecha</th>
                        <th className="tableHeader">Hora</th>
                        <th className="tableHeader">Servicio</th>
                        <th className="tableHeader">Peso</th>
                        <th className="tableHeader">Medicamentos</th>
                        <th className="tableHeader">Vacunas</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pacienteDetails.citas.map((cita, index) => (
                        <tr key={index}>
                        <td className="tableData">{cita.DescripcionResumenCita}</td>
                        <td className="tableData">{new Date(cita.FechaCita).toLocaleDateString()}</td>
                        <td className="tableData">{cita.HoraInicioCita} - {cita.HoraFinalCita}</td>
                        <td className="tableData">{cita.NombreServicio}</td>
                        <td className="tableData">{cita.PesoResumenCita}</td>
                        <td className="tableData">
                            {pacienteDetails.medicamentos
                            .filter(medicamento => medicamento.idResumenCita === cita.idResumenCita)
                            .map((medicamento, index) => (
                                <div key={index}>
                                <p>Medicamento: {medicamento.NombreMedicamento}</p>
                                <p>Descripción: {medicamento.DescripcionMedicamento}</p>
                                </div>
                            ))}
                        </td>
                        <td className="tableData">
                            {pacienteDetails.vacunas
                            .filter(vacuna => vacuna.idResumenCitaVacuna === cita.idResumenCita)
                            .map((vacuna, index) => (
                                <div key={index}>
                                <p>Vacuna: {vacuna.NombreVacuna}</p>
                                <p>Fecha próxima vacuna: {new Date(vacuna.FechaSiguienteVacuna).toLocaleDateString()}</p>
                                <p>Dosis: {vacuna.DosisVacuna}</p>
                                </div>
                            ))}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
            <p style={customStyles.text}>No hay citas previas</p>
            )}           
            
            <button style={customStyles.button} onClick={onClose}>Cerrar</button>
          </>
        ) : (
          <div>
            <h2 style={customStyles.header}>Detalles del Paciente</h2>
            {pacienteDetails ? (
              <div className="ModalPacienteDato">
                <p style={customStyles.text}>Paciente: {pacienteDetails.nombre_paciente}</p>
                <p style={customStyles.text}>Propietario: {pacienteDetails.telefono}</p>
                <p style={customStyles.text}>Telefono: {pacienteDetails.nombre_propietario}</p>
                
              </div>
            ) : null}
            <p style={customStyles.text}>Finalice una cita para más información</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PacienteModal;
