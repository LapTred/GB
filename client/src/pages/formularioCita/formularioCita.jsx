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

  useEffect(() => {
    fetchServices();
    fetchHorario();
  }, []);

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
        // Encontrar la fecha más cercana disponible
        const today = new Date();
        const closestAvailableDate = data.find(day => new Date(day.horarioInicio) >= today && day.estado);
        if (closestAvailableDate) {
          setSelectedDate(new Date(closestAvailableDate.horarioInicio));
        }
      })
      .catch(error => console.error('Error fetching horario:', error));
  };

  // Function to check if a date is available in the schedule
  const isDateAvailable = (date) => {
    const dayOfWeek = date.getDay(); // Get day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const availableDay = horario.find(day => day.nombreDias === getDayName(dayOfWeek) && day.estado); // Check if the day is available
    return availableDay !== undefined;
  };

  // Function to get the name of the day from its index
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
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy" // Date format
                filterDate={isDateAvailable} // Function to filter available dates
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
