import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import "./ModifyRoomComponent.scss";

const ModifyRoomComponent = ({ room, onCancel, onSave }) => {
  const [modifiedRoom, setModifiedRoom] = useState({ ...room, servicios: [] });
  const [roomNameExistsError, setRoomNameExistsError] = useState(false);
  const [servicios, setServicios] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    fetchServices();

    return () => {
      setIsMounted(false); // Cuando el componente se desmonte, setIsMounted en false
    };
  }, []);

  const fetchServices = () => {
    fetch('https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/servicios')
      .then(response => response.json())
      .then(data => {
        const allServices = data.map(servicio => ({ value: servicio.id, label: servicio.Nombre }));
        if (isMounted) {          
          setServicios(allServices);  
          setAvailableServices(allServices);
          fetch(`https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/consultorio-servicio/${room.id}`)
          .then(response => response.json())
          .then(data => {
            const selectedServiceIds = data.map(servicio => servicio.idServicio);
            const selectedServices = allServices.filter(servicio => selectedServiceIds.includes(servicio.value));
            if (isMounted) setSelectedServices(selectedServices);
          })
          .catch(error => console.error('Error fetching room services:', error));
        }
      })
      .catch(error => console.error('Error fetching services:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModifiedRoom({ ...modifiedRoom, [name]: value });
  };

  const handleServiceChange = (selectedOptions) => {
    setSelectedServices(selectedOptions);
    const selectedServiceValues = selectedOptions.map(option => option.value);
    // Filtra los servicios disponibles basándote en todos los servicios y los servicios seleccionados actualmente
    const updatedAvailableServices = servicios.filter(servicio => !selectedServiceValues.includes(servicio.value));
    setAvailableServices(updatedAvailableServices);
    setModifiedRoom({ ...modifiedRoom, servicios: selectedServiceValues }); // Actualiza modifiedRoom.servicios con los valores seleccionados
  };
  
  const handleSave = () => {
    fetch(`https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/consultorio/check-roomname/${modifiedRoom.nombreConsultorio}/${modifiedRoom.id}`)
      .then(response => response.json())
      .then(data => {
        if (data.exists) {
          setRoomNameExistsError(true);
        } else {
          const modifiedData = {
            ...modifiedRoom,
            servicios: selectedServices.map(service => service.value) // Obtener solo los valores de los servicios seleccionados
          };
  
          fetch(`https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/consultorio/${modifiedRoom.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(modifiedData), // Enviar los datos modificados, incluidos los servicios seleccionados
          })
            .then(response => response.json())
            .then(data => {
              onSave(data);
            })
            .catch(error => console.error(modifiedRoom.id, 'Error saving room:', error));
        }
      })
      .catch(error => console.error('Error checking room name:', error));
  };

  return (
    <div className="modify-room">
      <h2>Modificar Consultorio</h2>
      <div className="container">
        <label htmlFor="nombreConsultorio">Nombre del Consultorio:</label>
        <input type="text" name="nombreConsultorio" value={modifiedRoom.nombreConsultorio} onChange={handleInputChange} />
        {roomNameExistsError && <span style={{ color: 'red' }}>El nombre del consultorio ya está en uso. Por favor, elija otro.</span>}
        <label htmlFor="descripcion">Descripción:</label>
        <input type="text" name="Descripcion" value={modifiedRoom.Descripcion} onChange={handleInputChange} />

        <label htmlFor="servicios">Seleccione los servicios:</label>
        <Select
          value={selectedServices}
          onChange={handleServiceChange}
          options={availableServices}
          placeholder="Selecciona una sección"
          isMulti
        />

        <div className="actions">
          <button
            style={{ backgroundColor: '#f2f2f2', color: 'black', marginRight: '0.5vw', border: '0.2vw solid #f2f2f2', padding: '1vw 1vw', borderRadius: '0.5vw', cursor: 'pointer' }}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            style={{ backgroundColor: '#d8f3dc', color: 'black', marginLeft: '0vw', border: '0.2vw solid #d8f3dc', padding: '1vw 1vw', borderRadius: '0.5vw', cursor: 'pointer' }}
            onClick={handleSave}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifyRoomComponent;
