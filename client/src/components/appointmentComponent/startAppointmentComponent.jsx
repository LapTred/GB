import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./startCita.scss";
import PacienteModal from "../../components/modal/PacienteModal";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MedicamentoModal from "../../components/modal/MedicamentoModal";
import VacunaModal from "../../components/modal/VacunaModal"; // Importar el VacunaModal

const StartAppointmentComponent = ({ id }) => {
  const [cita, setCita] = useState(null);
  const [selectedPatientDetails, setSelectedPatientDetails] = useState(null);
  const [selectedPatientModalOpen, setSelectedPatientModalOpen] = useState(false);
  const [isMedicamentoModalOpen, setIsMedicamentoModalOpen] = useState(false); // Estado para controlar la apertura/cierre del modal
  const [isVacunaModalOpen, setIsVacunaModalOpen] = useState(false); // Estado para el modal de vacunas
  const [weight, setWeight] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [medicamentos, setMedicamentos] = useState([]); // Estado para almacenar los medicamentos
  const [vacunas, setVacunas] = useState([]); // Estado para almacenar las vacunas
  const navigate = useNavigate();
  const [sex, setSex] = useState(''); // Estado para el sexo del paciente  
  const [notas, setNotas] = useState(''); // Estado para las notas

  useEffect(() => {
    fetch(`https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/cita/${id}`)
      .then(response => response.json())
      .then(data => setCita(data))
      .catch(error => console.error('Error:', error));
  }, [id]);

  if (!cita) {
    return <p>Cargando...</p>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  };

  const formatDateSave = (dateString) => {
    const year = dateString.getFullYear();
    const month = dateString.getMonth();
    const day = dateString.getDate();
    const hours = dateString.getHours();
    const minutes = dateString.getMinutes();
    const seconds = dateString.getSeconds();
      
      // Crear una nueva fecha en UTC
    const utcDate = new Date(Date.UTC(year, month, day, hours, minutes, seconds)); 
    return utcDate.toISOString(); 
  };

  const handleFinishCita = () => {
    const data = {
      peso: weight,
      fechaNacimiento: cita.paciente.fecha_nacimiento ? cita.paciente.fecha_nacimiento : birthDate ? formatDateSave(birthDate) : null,
      sexo: cita.paciente.sexo_paciente ? cita.paciente.sexo_paciente : sex ? sex : null,
      descripcion: notas,
      medicamentos: medicamentos,
      vacunas: vacunas,
      idCita: id
    };
    console.log(data);

    if (!data.fechaNacimiento || !data.peso || !data.sexo) {
      console.log('Por favor, complete todos los campos requeridos.');
      return;
    }

    console.log(data);

    fetch(`https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/cita/finalizar/${cita.paciente.id_Paciente}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al finalizar la cita');
      }
      return response.json();
    })
    .then(data => {
      console.log('Cita finalizada:', data);
      navigate('/citas'); // Navegar a la lista de citas o alguna otra página adecuada
    })
    .catch(error => {
      console.error('Error:', error);
      console.log('Ocurrió un error al finalizar la cita. Por favor, inténtelo de nuevo.');
    });
  };

  const handleCloseModal = () => {
    setSelectedPatientModalOpen(false);
  };

  // Función para abrir el modal de medicamento
  const openMedicamentoModal = () => {
    setIsMedicamentoModalOpen(true);
  };

  // Función para cerrar el modal de medicamento
  const closeMedicamentoModal = () => {
    setIsMedicamentoModalOpen(false);
  };

  // Función para manejar la aceptación del medicamento
  const handleAcceptMedicamento = (medicamentoData) => {
    setMedicamentos([...medicamentos, medicamentoData]); // Agregar el nuevo medicamento al array de medicamentos
    setIsMedicamentoModalOpen(false); // Cerrar el modal
  };

  const handleDeleteMedicamento = (index) => {
    const updatedMedicamentos = [...medicamentos];
    updatedMedicamentos.splice(index, 1); // Eliminar el medicamento en el índice dado
    setMedicamentos(updatedMedicamentos);
  };

  // Función para abrir el modal de vacuna
  const openVacunaModal = () => {
    setIsVacunaModalOpen(true);
  };

  // Función para cerrar el modal de vacuna
  const closeVacunaModal = () => {
    setIsVacunaModalOpen(false);
  };

  // Función para manejar la aceptación de la vacuna
  const handleAcceptVacuna = (vacunaData) => {
    setVacunas([...vacunas, vacunaData]); // Agregar la nueva vacuna al array de vacunas
    setIsVacunaModalOpen(false); // Cerrar el modal
  };

  const handleDeleteVacuna = (index) => {
    const updatedVacunas = [...vacunas];
    updatedVacunas.splice(index, 1); // Eliminar la vacuna en el índice dado
    setVacunas(updatedVacunas);
  };

  const handleViewPatient = (id) => {
    fetch(`https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/paciente/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener el paciente');
        }
        return response.json();
      })
      .then(data => {
        setSelectedPatientDetails(data);
        setSelectedPatientModalOpen(true);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleWeightChange = (e) => {
    const { value } = e.target;

    // Verificar si el valor ingresado es válido (un número o un punto decimal)
    const regex = /^[0-9]*\.?[0-9]*$/;

    if (regex.test(value) && parseFloat(value) <= 200) {
      // Actualizar el estado del peso si el valor ingresado es válido
      setWeight(value);
    } else if (value.trim() === '') {
      setWeight('');
    }
  };

  const handleNotasChange = (e) => {
    setNotas(e.target.value);
  };

  const handleSexChange = (e) => {
    setSex(e.target.value);
  };

  return (
    <div className="startCitaComponent">
      <div className="startCitaContainerT">
        <h2>Cita # {cita?.paciente?.cita_id} en curso</h2>        
        <div className="startCitaInfo">
          <div className="startCitaInfoDatos">
            <h3 className="TituloPequeñoStartCita">Fecha:</h3>
            <p className="TituloPequeñoStartCita">{formatDate(cita?.paciente?.fecha_cita)}</p>
          </div>
          <div className="startCitaInfoDatos">
            <h3 className="TituloPequeñoStartCita">Horario:</h3>
            <p className="TituloPequeñoStartCita">{cita?.paciente?.hora_inicio} - {cita?.paciente?.hora_final}</p>
          </div>
        </div>
      </div>
      <div className="startCitacontainerB">
        <div className="startCitaContainerTitulo">
          <h2 className="Titulo">{cita?.paciente?.nombre_consultorio}</h2>
          <span className="Titulo">Servicio: {cita?.paciente?.nombre_servicio}</span>
        </div>
        <div className="startCitacontainer">
          <div className="startCitaBfirst startCitaInfoBox">
            <h3 className="TituloPequeñoStartCita">Información General</h3>
            <div className="startCitaInfoSeparado">
              <div className="startCitaSeparado">
                <p>Paciente:</p>
                <div className="startCitaSeparadoInfo">{cita?.paciente?.nombre_paciente}</div>
              </div>
              <div className="startCitaSeparado">
                <p>Propietario:</p>
                <div className="startCitaSeparadoInfo">{cita?.paciente?.nombre_propietario}</div>
              </div>
              <div className="startCitaSeparado">
                <p>Peso:</p>
                <div className="startCitaSeparadoInput">
                  <input
                    type="text"
                    value={weight.toString()} // Convertir el peso a una cadena antes de mostrarlo en el input
                    onChange={handleWeightChange}
                    className="startCitaInput"
                  />
                  <p>Kg.</p>
                </div>
              </div>
              {!cita?.paciente?.fecha_nacimiento && (
                <div className="startCitaSeparado">
                  <p>Fecha de Nacimiento:</p>
                  <DatePicker
                    className='datePickerCitas'
                    selected={birthDate}
                    onChange={(date) => setBirthDate(date)}
                    dateFormat="dd-MM-yyyy"
                    minDate={new Date(1990, 0, 1)} // Establece la fecha mínima como el 1 de enero de 1990
                    maxDate={new Date()} // Establece la fecha máxima como hoy
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={30} // Muestra 30 años hacia atrás en el dropdown
                    dropdownMode="select" // Permite seleccionar el año en el dropdown
                    placeholderText="Seleccionar fecha"
                  />                  
                </div>
              )}

              {!cita?.paciente?.sexo_paciente && (
                <div className="startCitaSeparado">
                  <p>Sexo:</p>
                  <div className="inputRadioContainer">
                    <input type="radio" id="M" name="gender" value="M" onChange={handleSexChange}/>
                    <label className="inputRadio" htmlFor="M">M</label>
                    <input type="radio" id="H" name="gender" value="H" onChange={handleSexChange}/>
                    <label className="inputRadio" htmlFor="H">H</label>
                  </div>
                </div>
              )}
              <div className="startCitaSeparado">
                <p>Notas:</p>
                <textarea value={notas} onChange={handleNotasChange} />
              </div>
            </div>
          </div>
          <div className="startCitaBsecond startCitaInfoBox">
            <div className="buttonsMedicamentos">
              <h3 className="TituloPequeñoStartCita">Medicamentos</h3>
              <button
                style={{ color: 'black', marginLeft: '1vw', border: '0.2vw solid transparent', padding: '0.5vw 0.5vw', borderRadius: '0.5vw', cursor: 'pointer' }}
                className="newCitaButtonMedicamento"
                onClick={openMedicamentoModal}
              >
                Añadir medicamento
              </button>
            </div>
            {/* Mostrar la tabla de medicamentos solo si hay medicamentos */}
            {medicamentos.length > 0 && (
                <table className="citasTable">
                  <thead>
                    <tr>
                      <th className="tableHeader">Nombre</th>
                      <th className="tableHeader">Descripción</th>
                      <th className="tableHeader">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicamentos.map((medicamento, index) => (
                      <tr key={index}>
                        <td className="tableData">{medicamento.nombre}</td>
                        <td className="tableData">{medicamento.descripcion}</td>
                        <td className="tableData">
                          <div className="containerButtonsStart"> 
                            <button
                              style={{ backgroundColor: '#ce796b', color: 'black', border: '0.2vw solid #ce796b', padding: '0.2vw 0.2vw', borderRadius: '0.5vw', cursor: 'pointer' }}
                              className="buttonDeleteCita" 
                              onClick={() => handleDeleteMedicamento(index)}
                            >
                              Eliminar
                            </button>
                          </div> 
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            )}
            <div className="buttonsMedicamentos">
              <h3 className="TituloPequeñoStartCita">Vacunas</h3>
              <button
                style={{ color: 'black',border: '0.2vw solid transparent', padding: '0.5vw 0.5vw', borderRadius: '0.5vw', cursor: 'pointer' }}
                className="newCitaButtonMedicamento"
                onClick={openVacunaModal}
              >
                Añadir vacuna
              </button>
            </div>

            
            
            {/* Mostrar la tabla de vacunas solo si hay vacunas */}
            {vacunas.length > 0 && (
                <table className="citasTable">
                  <thead>
                    <tr>
                      <th className="tableHeader">Nombre</th>
                      <th className="tableHeader">Descripción</th>
                      <th className="tableHeader">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vacunas.map((vacuna, index) => (
                      <tr key={index}>
                        <td className="tableData">{vacuna.nombre}</td>
                        <td className="tableData">{vacuna.descripcion}</td>
                        <td className="tableData">
                          <div className="containerButtonsStart"> 
                            <button
                              style={{ backgroundColor: '#ce796b', color: 'black', border: '0.2vw solid #ce796b', padding: '0.2vw 0.2vw', borderRadius: '0.5vw', cursor: 'pointer' }}
                              className="buttonDeleteCita" 
                              onClick={() => handleDeleteVacuna(index)}
                            >
                              Eliminar
                            </button>
                          </div> 
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            )}  
          </div>
        </div>
        <div className="buttonsStartCita">
          <button
            style={{ color: 'black', marginLeft: '0vw', border: '0.2vw solid #87CEFA', padding: '0.5vw 0.5vw', borderRadius: '0.5vw', cursor: 'pointer' }}
            className="newCitaButtonPatient"
            onClick={() => handleViewPatient(cita?.paciente?.id_Paciente)}
          >
            Ver expediente
          </button>
          <button
            style={{ color: 'black', marginLeft: '1vw', border: '0.2vw solid transparent', padding: '0.5vw 0.5vw', borderRadius: '0.5vw', cursor: 'pointer' }}
            className="newCitaButtonFinish"
            onClick={handleFinishCita}
          >
            Finalizar cita
          </button>
        </div>
        <PacienteModal isOpen={selectedPatientModalOpen} onClose={handleCloseModal} pacienteDetails={selectedPatientDetails} />
        <MedicamentoModal isOpen={isMedicamentoModalOpen} onClose={closeMedicamentoModal} onAccept={handleAcceptMedicamento} />
        <VacunaModal isOpen={isVacunaModalOpen} onClose={closeVacunaModal} onAccept={handleAcceptVacuna} /> {/* Añadir el modal de vacuna */}
      </div>
    </div>
  );
};

export default StartAppointmentComponent;