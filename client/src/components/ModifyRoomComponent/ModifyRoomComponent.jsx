import React, { useState } from 'react';
import "./ModifyRoomComponent.scss";

const ModifyRoomComponent = ({ room, onCancel, onSave }) => {
  const [modifiedRoom, setModifiedRoom] = useState({ ...room });
  const [roomNameExistsError, setRoomNameExistsError] = useState(false); // Nuevo estado para el error de nombre de consultorio existente
  
  const [startTimeError, setStartTimeError] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModifiedRoom({ ...modifiedRoom, [name]: value });
  };

  const handleSave = () => {
    // Verificar si el nombre del consultorio ya existe exceptuando el consultorio actual
    fetch(`http://localhost:3001/consultorio/check-roomname/${modifiedRoom.nombreConsultorio}/${modifiedRoom.id}`)
      .then(response => response.json())
      .then(data => {
        if (data.exists) {
          setRoomNameExistsError(true); // Establecer el estado de error de nombre de consultorio existente
        } else {
          // Si el nombre del consultorio no existe, continuar con la modificación del consultorio
          fetch(`http://localhost:3001/consultorio/${modifiedRoom.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(modifiedRoom),
          })
            .then(response => response.json())
            .then(data => {
              onSave(data);
            })
            .catch(error => console.error('Error saving room:', error));
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

export default ModifyRoomComponent;
