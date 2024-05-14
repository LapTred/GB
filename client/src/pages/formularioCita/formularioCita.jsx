import React, { useState, useEffect } from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./formularioCita.scss";
import Select from 'react-select';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker CSS

const Formulario = () => {
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

    console.log(selectedDate.toISOString());

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
        setPropietarios(data.map(propietario => ({ value: propietario.id, label: propietario.Nombre })));
      })
      .catch(error => console.error('Error fetching propietarios:', error));
  };

  const handlePropietarioChange = propietario => {
    setSelectedPropietario(propietario);
  };

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

  return (
    <div className="formulario-cita">
      <Sidebar />
      <div className="formularioContainers">
        <Navbar />
        <div className="formularioContainer">
          <div className="formulario">
            <div className="containerA">
              <h2>Seleccionar Servicio</h2>
              <Select
                options={servicios}
                value={selectedService}
                onChange={setSelectedService}
                placeholder="Seleccione un servicio..."
              />
              <h2>Seleccionar Fecha</h2>
              <DatePicker
                className='datePickerCitas'
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy" // Date format
                filterDate={isDateAvailable} // Function to filter available dates
              />
              <h2>Seleccionar Duración</h2>
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
              <h2>Seleccionar Hora</h2>
              <Select
                options={horasDisponibles}
                value={selectedHora}
                onChange={setSelectedHora}
                placeholder="Seleccione una hora..."
              />
               {selectedHora && (
                <>
                  <h2>Seleccionar Consultorio</h2>
                  <Select
                    options={consultoriosFiltrados}
                    value={selectedConsultorio}
                    onChange={setSelectedConsultorio}
                    placeholder="Seleccione un consultorio..."
                  />
                </>
              )}
              <h2>Seleccionar Propietario</h2>
              <Select
                options={propietarios}
                value={selectedPropietario}
                onChange={handlePropietarioChange}
                placeholder="Seleccione un propietario..."
              />
            </div>
            <div className="containerB">
              {/* Other elements related to the appointment form */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Formulario;
