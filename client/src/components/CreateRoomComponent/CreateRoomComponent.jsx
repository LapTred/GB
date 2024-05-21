import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import "./CreateRoomComponent.scss";

const CreateRoomComponent = ({ onCancel, onSave }) => {
  const initialRoom = { nombreConsultorio: "", Descripcion: "", servicios: []};
  const [modifiedRoom, setModifiedRoom] = useState(initialRoom);
  const [roomNameExistsError, setRoomNameExistsError] = useState(false);
  const [roomNameError, setRoomNameError] = useState(false);
  const [servicios, setServicios] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);


  const fetchServices = () => {
    fetch('https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/servicios')
      .then(response => response.json())
      .then(data => {
        setServicios(data.map(servicio => ({ value: servicio.id, label: servicio.Nombre })));
        setAvailableServices(data.map(servicio => ({ value: servicio.id, label: servicio.Nombre })));
      })
      .catch(error => console.error('Error fetching services:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModifiedRoom({ ...modifiedRoom, [name]: value });

    if (name === "nombreConsultorio") {
      setRoomNameError(false);
    }
  };

  const handleServiceChange = (selectedOptions) => {
    setModifiedRoom({ ...modifiedRoom, servicios: selectedOptions });
    const selectedServiceValues = selectedOptions.map(option => option.value);
    const updatedAvailableServices = servicios.filter(servicio => !selectedServiceValues.includes(servicio.value));
    setAvailableServices(updatedAvailableServices);
  };

  const handleSave = () => {
    if (modifiedRoom.nombreConsultorio.trim() === '') {
      setRoomNameError(true);
      return;
    }

    fetch(`https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/consultorio/check-roomname/${modifiedRoom.nombreConsultorio}/null`)
      .then(response => response.json())
      .then(data => {
        if (data.exists) {
          setRoomNameExistsError(true);
        } else {
          fetch('https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/consultorio/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(modifiedRoom),
          })
            .then(response => response.json())
            .then(data => {
              onSave(data);
              setModifiedRoom(initialRoom);
            })
            .catch(error => console.error('Error creating room:', error));
        }
      })
      .catch(error => console.error('Error checking room name:', error));
  };

  return (
    <div className="create-room">
      <h2>Crear Consultorio</h2>
      <div className="container">
        <label htmlFor="nombreConsultorio">Nombre del Consultorio:</label>
        <input type="text" name="nombreConsultorio" value={modifiedRoom.nombreConsultorio} onChange={handleInputChange} />
        {roomNameError && <span style={{ color: 'red' }}>Ingrese un nombre</span>}
        {roomNameExistsError && <span style={{ color: 'red' }}>El nombre del consultorio ya está en uso. Por favor, elija otro.</span>}
        <label htmlFor="descripcion">Descripción:</label>
        <input type="text" name="Descripcion" value={modifiedRoom.Descripcion} onChange={handleInputChange} />

        <label htmlFor="servicios">Seleccione los servicios:</label>
        <Select
          value={modifiedRoom.servicios}
          onChange={handleServiceChange}
          options={availableServices}
          placeholder="Selecciona un servicio"
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

export default CreateRoomComponent;
