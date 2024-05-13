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

  useEffect(() => {
    fetchServices();
    fetchHorario();
  }, []);

  useEffect(() => {
    fetchHorarioCitas();
  }, [selectedService, selectedDate, duracion, consultorios]);

  useEffect(() => {
    if (selectedService && selectedDate && duracion) {
      const horarioSeleccionado = horarioFecha(selectedDate);
      fetchConsultorios();
    }
  }, [selectedService, selectedDate, duracion]);

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
    if (selectedService && selectedDate && duracion && consultorios.length > 0) {
      const horarioSeleccionado = horarioFecha(selectedDate);
      const formData = {
        fecha: selectedDate.toISOString(),
        horarioInicio: horarioSeleccionado.horarioInicio,
        horarioFinal: horarioSeleccionado.horarioFinal,
        duracion: duracion.value,
        consultorios: consultorios.map(consultorio => consultorio.value)
      };
  
      // Elimina el cuerpo de la solicitud fetch
      fetch(`http://localhost:3001/citas/horario?fecha=${formData.fecha}&horarioInicio=${formData.horarioInicio}&horarioFinal=${formData.horarioFinal}&duracion=${formData.duracion}&consultorios=${formData.consultorios.join(',')}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(response => response.json())
      .then(data => {
        // Manipular la respuesta del servidor aquí
        console.log('Horas disponibles y consultorios:', data);
      })
      .catch(error => console.error('Error fetching horario de citas:', error));
    }
  };
  

  const fetchConsultorios = () => {
    // Replace ':id' with the actual id of the selected service
    fetch(`http://localhost:3001/consultorio/servicio/${selectedService.value}`)
      .then(response => response.json())
      .then(data => {
        setConsultorios(data.map(consultorio => ({ value: consultorio.idConsultorio, label: consultorio.nombreConsultorio }))); 
        console.log(consultorios);       
      })
      .catch(error => console.error('Error fetching consultorios:', error));
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
                  { value: 60, label: '60 minutos' },
                  { value: 90, label: '90 minutos' },
                  { value: 120, label: '120 minutos' },
                  { value: 'other', label: 'Seleccionar otra opción' }
                ]}
                value={duracion}
                onChange={setDuracion}
                placeholder="Seleccione la duración..."
              />
              {duracion && duracion.value === 'other' && (
                <input
                  type="number"
                  min="1"
                  placeholder="Ingrese los minutos"
                  onChange={e => setDuracion({ value: parseInt(e.target.value), label: `${e.target.value} minutos` })}
                />
              )}
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
