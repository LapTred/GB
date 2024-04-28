import React, { useState, useEffect } from 'react';
import "./CreateRoomComponent.scss";

const CreateRoomComponent = ({ onCancel, onSave }) => {
  const initialRoom = { nombreConsultorio: "", Descripcion: ""};
  const [modifiedRoom, setModifiedRoom] = useState(initialRoom);
  const [roomNameExistsError, setRoomNameExistsError] = useState(false);
  const [roomNameError, setRoomNameError] = useState(false); // Nuevo estado para el error de nombre de consultorio vacío


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModifiedRoom({ ...modifiedRoom, [name]: value });

    if (name === "nombreConsultorio") {
      setRoomNameError(false);
    }
  };

  const handleSave = () => {
    if (modifiedRoom.nombreConsultorio.trim() === '') {
      setRoomNameError(true); // Establecer el estado de error si el nombre está vacío
      return;
    }  

    // Verificar si el nombre del consultorio ya existe
    fetch(`http://localhost:3001/consultorio/check-roomname/${modifiedRoom.nombreConsultorio}/null`)
      .then(response => response.json())
      .then(data => {
        if (data.exists) {
          setRoomNameExistsError(true); // Establecer el estado de error de nombre de consultorio existente
        } else {
          // Si el nombre del consultorio no existe, continuar con la creación del consultorio
          fetch('http://localhost:3001/consultorio/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(modifiedRoom),
          })
            .then(response => response.json())
            .then(data => {
              onSave(data);
              setModifiedRoom(initialRoom); // Resetear el formulario después de guardar con éxito
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
        {roomNameError && <span style={{ color: 'red' }}>Ingrese un nombre</span>} {/* Mensaje de error */}        
        {roomNameExistsError && <span style={{ color: 'red' }}>El nombre del consultorio ya está en uso. Por favor, elija otro.</span>}
        <label htmlFor="descripcion">Descripción:</label>
        <input type="text" name="Descripcion" value={modifiedRoom.Descripcion} onChange={handleInputChange} />        
        <div className="actions">
          <button 
            style={{ backgroundColor: '#f2f2f2', color: 'black', marginRight: '0.5vw', border: '0.2vw solid #f2f2f2', padding: '1vw 1vw', borderRadius: '0.5vw', cursor: 'pointer' }}                              
            onClick={onCancel
            }>Cancelar
          </button>
          <button 
            style={{ backgroundColor: '#d8f3dc', color: 'black', marginLeft: '0vw', border: '0.2vw solid #d8f3dc', padding: '1vw 1vw', borderRadius: '0.5vw', cursor: 'pointer' }} 
            onClick={handleSave}
            >Guardar
          </button>
        </div>
      </div>      
    </div>
  );
};

export default CreateRoomComponent;
