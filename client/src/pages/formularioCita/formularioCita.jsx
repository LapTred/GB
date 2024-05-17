import React, { useState, useEffect } from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./formularioCita.scss";
import Select from 'react-select';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker CSS
import Autosuggest from 'react-autosuggest';
import { Link } from 'react-router-dom';
import ErrorModal from "../../components/modal/ErrorModal"; // Asegúrate de tener la ruta correcta al componente

const Formulario = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [servicios, setServicios] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [horario, setHorario] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date, initialized with current date
  const [duracion, setDuracion] = useState(null);
  const [consultorios, setConsultorios] = useState([]);  
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [consultoriosDisponibles, setConsultoriosDisponibles] = useState([]);
  const [consultoriosFiltrados, setConsultoriosFiltrados] = useState([]); // Nuevo estado para consultorios filtrados por hora
  const [selectedHora, setSelectedHora] = useState(null);
  const [selectedConsultorio, setSelectedConsultorio] = useState(null);
  const [propietarios, setPropietarios] = useState([]);
  const [selectedPropietario, setSelectedPropietario] = useState(null);
  const [suggestions, setSuggestions] = useState([]); // Estado para las sugerencias de propietarios  
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null); // Estado para el paciente seleccionado
  const [showInput, setShowInput] = useState(false); // Estado para mostrar el input
  const [showSelect, setShowSelect] = useState(true); // Estado para mostrar el Select
  const [customHeader, setCustomHeader] = useState("");
  const [customText, setCustomText] = useState("");
  const [redirectToCitas, setRedirectToCitas] = useState(false); // Nuevo estado para la redirección
  


  
  useEffect(() => {
    fetchServices();
    fetchHorario();
    fetchPropietarios();
  }, []);


  useEffect(() => {
    if (selectedService && selectedDate && duracion) {
      fetchConsultorios();
    }
  }, [selectedService, selectedDate, duracion]);

  useEffect(() => {
    if (consultorios.length > 0 && selectedService && selectedDate && duracion) {
      fetchHorarioCitas();
    }
  }, [consultorios, selectedService, selectedDate, duracion]);

  useEffect(() => {
    if (selectedHora) {
      actualizarConsultoriosDisponibles(selectedHora);
    }
  }, [consultorios, selectedService, selectedDate, duracion, selectedHora]);

  const fetchServices = () => {
    fetch('http://localhost:3001/servicios')
      .then(response => response.json())
      .then(data => {
        setServicios(data.map(servicio => ({ value: servicio.id, label: servicio.Nombre })));
      })
      .catch(error => console.error('Error fetching services:', error));
  };

  const fetchHorario = () => {
    fetch('http://localhost:3001/clinica')
      .then(response => response.json())
      .then(data => {
        setHorario(data);
        const today = new Date().getDay();
        const isTodayAvailable = data.some(day => day.nombreDias === getDayName(today) && day.estado);
        
        if (isTodayAvailable) {
          setSelectedDate(new Date());
        } else {
          let nextDayIndex = (today + 1) % 7;
          let nextAvailableDay = null;
          
          while (!nextAvailableDay) {
            const nextDay = data.find(day => day.nombreDias === getDayName(nextDayIndex) && day.estado);
            if (nextDay) {
              const nextDate = new Date();
              nextDate.setDate(nextDate.getDate() + (nextDayIndex - today + 7) % 7);
              nextAvailableDay = nextDate;
            } else {
              nextDayIndex = (nextDayIndex + 1) % 7;
            }
          }
          setSelectedDate(nextAvailableDay);
        }   
      })
      .catch(error => console.error('Error fetching horario:', error));
  }; 

  const fetchHorarioCitas = () => {
    const horarioSeleccionado = horarioFecha(selectedDate);
    if (!horarioSeleccionado) {
      console.error('No se pudo determinar el horario seleccionado.');
      return;
    }

    const formData = {
      fecha: selectedDate.toISOString(),
      horarioInicio: horarioSeleccionado.horarioInicio,
      horarioFinal: horarioSeleccionado.horarioFinal,
      duracion: duracion.value,
      consultorios: consultorios.map(consultorio => consultorio.value)
    };

    fetch(`http://localhost:3001/citas/horario?fecha=${formData.fecha}&horarioInicio=${formData.horarioInicio}&horarioFinal=${formData.horarioFinal}&duracion=${formData.duracion}&consultorios=${formData.consultorios.join(',')}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        const availableHours = data.filter(item => item[2] === true); // Filtrar por disponibilidad true
        const uniqueHours = [...new Set(availableHours.map(item => item[1]))]; // Extraer horas únicas
        setHorasDisponibles(uniqueHours.map(hour => ({ value: hour, label: hour })));
        setConsultoriosDisponibles(data);
      })
      .catch(error => console.error('Error fetching horario de citas:', error));
  };

  const fetchConsultorios = () => {
    fetch(`http://localhost:3001/consultorio/servicio/${selectedService.value}`)
      .then(response => response.json())
      .then(data => {
        setConsultorios(data.map(consultorio => ({ value: consultorio.idConsultorio, label: consultorio.nombreConsultorio })));             
      })
      .catch(error => console.error('Error fetching consultorios:', error));
  };

  const fetchPropietarios = () => {
    fetch('http://localhost:3001/propietarios')
      .then(response => response.json())
      .then(data => {
        setPropietarios(data); // Almacena todos los propietarios
      })
      .catch(error => console.error('Error fetching propietarios:', error));
  };

  const handlePropietarioChange = (event, { newValue }) => {
    setSelectedPropietario(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value)); // Actualiza las sugerencias basadas en el valor del input
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]); // Borra las sugerencias cuando el input está vacío
  };
  const getSuggestions = (value) => {
    console.log(value);
    const inputValue = String(value).trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : propietarios.filter(propietario =>
      propietario.Nombre.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  const renderSuggestion = (suggestion) => (
    <div>
      {suggestion.Nombre}
    </div>
  );

  const horarioFecha = (date) => {
    const dayOfWeek = date.getDay();
    const selectedDayName = getDayName(dayOfWeek);
    const availableDay = horario.find(day => day.nombreDias === selectedDayName && day.estado);
  
    if (availableDay) {
      return { horarioInicio: availableDay.horarioInicio, horarioFinal: availableDay.horarioFinal };
    } else {
      return null;
    }
  };

  const isDateAvailable = (date) => {
    const dayOfWeek = date.getDay();
    const availableDay = horario.find(day => day.nombreDias === getDayName(dayOfWeek) && day.estado);
    return availableDay !== undefined;
  };

  const actualizarConsultoriosDisponibles = (hora) => {
    const availableConsultorios = consultoriosDisponibles
      .filter(item => item[1] === hora.value && item[2] === true)
      .map(item => ({ value: item[0], label: `Consultorio ${item[0]}` }));
    setSelectedConsultorio(null); // Reset selected consultorio
    setConsultoriosFiltrados(availableConsultorios); // Actualizar el estado con los consultorios filtrados
  };

  const getDayName = (dayIndex) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[dayIndex];
  };

  const handleSearch = () => {
    if (selectedPropietario) {
      const propietarioEncontrado = propietarios.find(propietario => propietario.Nombre.toLowerCase() === selectedPropietario.toLowerCase());
      if (propietarioEncontrado) {
        document.getElementById('telefonoInput').disabled = true; // Bloquear el campo de teléfono
        document.getElementById('telefonoInput').value = propietarioEncontrado.Telefono; // Establecer el valor del teléfono del propietario
      }
      else {
        console.error('El propietario ingresado no existe.');
        console.log("no encontrado");
        document.getElementById('telefonoInput').disabled = false;
        document.getElementById('telefonoInput').value = "";
      }
      fetch(`http://localhost:3001/propietario/pacientes?propietario=${selectedPropietario}`)
        .then(response => response.json())
        .then(data => {
          setPacientes(data);
          setSelectedPaciente(null); // Borrar la selección de paciente
        })
        .catch(error => console.error('Error fetching pacientes:', error));
    } else {
      console.error('Debe seleccionar un propietario antes de buscar pacientes.');
    }
  };
  

  const handleAddButtonClick = () => {
    setShowInput(true); // Mostrar el input cuando se hace clic en el botón "Añadir"
    setShowSelect(false); // Ocultar el Select cuando se hace clic en el botón "Añadir"
  };

  const handleBackButtonClick = () => {
    setShowInput(false); // Ocultar el input cuando se hace clic en el botón de retroceso
    setShowSelect(true); // Mostrar el Select cuando se hace clic en el botón de retroceso
  };

  const handleGuardarClick = () => {
    if (
      selectedService &&
      selectedDate &&
      duracion &&
      selectedHora &&
      selectedConsultorio &&
      selectedPropietario &&
      document.getElementById('telefonoInput').value &&
      selectedPaciente // Verificar si se ha seleccionado un paciente
    ) {
      console.log(selectedDate);
      const formData = {
        idServicio: selectedService.value,
        fecha: selectedDate.toISOString(),
        duracion: duracion.value,
        hora: selectedHora.value,
        idConsultorio: selectedConsultorio.value,
        propietario: selectedPropietario,
        telefono: document.getElementById('telefonoInput').value,
        paciente: selectedPaciente.label 
      };
      console.log(formData.fecha);

      fetch('http://localhost:3001/cita/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al crear la cita');
          }
          console.log("Cita creada con éxito");
          setCustomHeader("Cita para " + formData.paciente +  " creada con éxito");
          setCustomText("Clic en cerrar para continuar");
          setModalOpen(true);
                    
          setRedirectToCitas(true); // Habilitar redirección
        })
        .catch(error => {
          console.error('Error al crear la cita:', error);
          // Abre el modal de error
          
          setCustomHeader("Error al guardar la cita");
          setCustomText("Por favor complete todos los campos o verifique los datos antes de crear una cita.");
          setModalOpen(true);
          
        });
    } else {   
      setCustomHeader("Error al guardar la cita");
      setCustomText("Por favor complete todos los campos o verifique los datos antes de crear una cita.");
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Redirigir a /citas solo si redirectToCitas es verdadero
    if (redirectToCitas) {
      window.location.href = '/citas';
    }
  };

  

  return (
    <div className="formulario-cita">
      <Sidebar />
      <div className="formularioContainers">
        <Navbar />
        <div className="formularioContainer">
          
          <div className="formulario">
            <div className="tituloCitas"> 
              <h2>Crear nueva cita</h2>
            </div>  
            <div className="cuerpoFormulario"> 
            <div className="containerA">
              <h2>Servicio</h2>
              <Select
                options={servicios}
                value={selectedService}
                onChange={setSelectedService}
                placeholder="Seleccione un servicio..."
              />
              <h2>Fecha</h2>
              <DatePicker
                className='datePickerCitas'
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy" // Date format
                filterDate={isDateAvailable} // Function to filter available dates
              />
              <h2>Duración</h2>
              <Select
                options={[
                  { value: 15, label: '15 minutos' },
                  { value: 30, label: '30 minutos' },
                  { value: 45, label: '45 minutos' },
                  { value: 60, label: '1 hora' },
                  { value: 90, label: '1 hora 30 minutos' },
                  { value: 120, label: '2 horas' },
                  { value: 150, label: '2 horas 30 minutos' },
                  { value: 180, label: '3 horas' }
                  
                ]}
                value={duracion}
                onChange={setDuracion}
                placeholder="Seleccione la duración..."
              />
              <h2>Hora</h2>
              <Select
                options={horasDisponibles}
                value={selectedHora}
                onChange={setSelectedHora}
                placeholder="Seleccione una hora..."
              />
               {selectedHora && (
                <>
                  <h2>Consultorio</h2>
                  <Select
                    options={consultoriosFiltrados}
                    value={selectedConsultorio}
                    onChange={setSelectedConsultorio}
                    placeholder="Seleccione un consultorio..."
                  />
                </>
              )}
              
            </div>
            <div className="containerB">
              <h2>Propietario</h2>
              <div className="containerBfirst">
                <Autosuggest
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                  getSuggestionValue={(suggestion) => suggestion.Nombre}
                  renderSuggestion={renderSuggestion}
                  inputProps={{
                    placeholder: 'Ingrese un propietario',
                    value: selectedPropietario || '',
                    onChange: handlePropietarioChange,
                    className: 'autosuggest-input' // Añade la clase para el input
                  }}
                  className="autosuggest-container" // Añade la clase para el contenedor              
                  highlightFirstSuggestion={true} // Resaltar la primera sugerencia por defecto
                />
                <div>                  
                  <button 
                  style={{ backgroundColor: '#f2f2f2', color: 'black', border: '0.2vw solid #f2f2f2', padding: '0.5vw 0.5vw', borderRadius: '0.5vw', cursor: 'pointer' }}                  
                  className='containerBfirstButton' onClick={handleSearch}>Buscar</button>
                </div>
              </div>
              <h2>Teléfono</h2>
              <div className="containerBsecondOne">                
                <input id="telefonoInput" className='inputPaciente' type="text" placeholder="Ingrese un número..." />             
              </div>
              <h2>Paciente</h2>
              <div className="containerBsecond">
              {showInput ? (
                  <>
                    <input
                      className='inputPaciente'
                      type="text"
                      placeholder="Ingrese un paciente..."
                      value={selectedPaciente ? selectedPaciente.label : ''}
                      onChange={e => setSelectedPaciente({ value: '', label: e.target.value })}
                    />
                    <button 
                    className='containerBsecondButton' 
                    style={{ backgroundColor: '#f2f2f2', color: 'black', border: '0.2vw solid #f2f2f2', padding: '0.5vw 0.5vw', borderRadius: '0.5vw', cursor: 'pointer' }}

                    onClick={handleBackButtonClick}>Retroceder</button>
                  </>
                ) : showSelect ? (
                  <div className="containerCitaPaciente">
                    <Select
                      options={pacientes.map(paciente => ({ value: paciente.id, label: paciente.nombrePaciente }))}
                      value={selectedPaciente}
                      onChange={setSelectedPaciente}
                      placeholder="Seleccione un paciente..."
                    />
                    <button 
                    className='containerBsecondButton' 
                    style={{ backgroundColor: '#f2f2f2', color: 'black', border: '0.2vw solid #f2f2f2', padding: '0.5vw 0.5vw', borderRadius: '0.5vw', cursor: 'pointer' }}

                    onClick={handleAddButtonClick}>Añadir</button>
                  </div>
                ) : null}
                
              </div>
              <div className="containerBsecond">
              <Link to="/citas" style={{ textDecoration: 'none' }}>
                <button                
                  className='containerBsecondButtons'
                  style={{ backgroundColor: '#f2f2f2', color: 'black', marginTop:'1.5vw',marginRight: '0.5vw', border: '0.2vw solid #f2f2f2', padding: '1vw 1vw', borderRadius: '0.5vw', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
              </Link>
                <button
                  className='containerBsecondButtons'
                  style={{ backgroundColor: '#d8f3dc', color: 'black', marginTop:'1.5vw',marginLeft: '0vw', border: '0.2vw solid #d8f3dc', padding: '1vw 1vw', borderRadius: '0.5vw', cursor: 'pointer' }}
                  onClick={handleGuardarClick}
                >
                  Crear
                </button>
                <ErrorModal isOpen={modalOpen} onClose={handleCloseModal} header={customHeader} text={customText} />
              </div>
            </div> 
            </div>  
                       
          </div>
        </div>
      </div>
    </div>
  );
};

export default Formulario;
