import { useState } from 'react';
import "./ModifyRoomComponent.scss";

const ModifyRoomComponent = ({ room, onCancel, onSave }) => {
  const [modifiedRoom, setModifiedRoom] = useState({ ...room });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModifiedRoom({ ...modifiedRoom, [name]: value });
  };

  const handleSave = () => {
    onSave(modifiedRoom);
  };

  return (
    <div className="modify-room">
      <h2>Modificar Consultorio</h2>
      <label htmlFor="nombreConsultorio">Nombre del Consultorio:</label>
      <input type="text" name="nombreConsultorio" value={modifiedRoom.nombreConsultorio} onChange={handleInputChange} />
      <label htmlFor="descripcion">Descripción:</label>
      <textarea name="descripcion" value={modifiedRoom.Descripcion} onChange={handleInputChange} />
      <label htmlFor="horarioInicio">Horario de Inicio:</label>
      <input type="time" name="horarioInicio" value={modifiedRoom.horarioInicio} onChange={handleInputChange} />
      <label htmlFor="horarioFinal">Horario de Finalización:</label>
      <input type="time" name="horarioFinal" value={modifiedRoom.horarioFinal} onChange={handleInputChange} />
      <div className="actions">
        <button onClick={onCancel}>Cancelar</button>
        <button onClick={handleSave}>Guardar</button>
      </div>
    </div>
  );
};

export default ModifyRoomComponent;
