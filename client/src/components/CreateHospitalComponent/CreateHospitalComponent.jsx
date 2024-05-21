import React, { useState, useEffect } from 'react';
import "./CreateHospitalComponent.scss"
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

const CreateHospitalComponent = ({ onSave, clinicaData }) => {
  const initialClinica = {
    Lunes: { horarioInicio: "", horarioFinal: "", estado: false },
    Martes: { horarioInicio: "", horarioFinal: "", estado: false },
    Miercoles: { horarioInicio: "", horarioFinal: "", estado: false },
    Jueves: { horarioInicio: "", horarioFinal: "", estado: false },
    Viernes: { horarioInicio: "", horarioFinal: "", estado: false },
    Sabado: { horarioInicio: "", horarioFinal: "", estado: false },
    Domingo: { horarioInicio: "", horarioFinal: "", estado: false }
  };
  const [modifiedClinica, setModifiedClinica] = useState(initialClinica);
  const [startTimeError, setStartTimeError] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);

  useEffect(() => {
    if (clinicaData) {
      // Si clinicaData está definido, utilizamos sus valores para prellenar el formulario
      setModifiedClinica(clinicaData);
    }
  }, [clinicaData]);

  const handleInputChange = (e, day, field) => {
    const { value } = e.target;
    setModifiedClinica(prevState => ({
      ...prevState,
      [day]: {
        ...prevState[day],
        [field]: value,
      }
    }));
  };

  const handleCheckboxChange = (e, day) => {
    const { checked } = e.target;
    setModifiedClinica(prevState => ({
      ...prevState,
      [day]: {
        ...prevState[day],
        estado: checked,
      }
    }));
  };

  const handleSave = () => {
    // Realizar la solicitud fetch para enviar los datos modificados al servidor
    fetch('https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/clinica/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modifiedClinica),
    })
    .then(response => response.json())
    .then(data => {
      onSave(data); // Llamar a la función onSave con los datos actualizados del servidor
    })
    .catch(error => console.error('Error al guardar los cambios:', error));
  };

  return (
    <div className="create-hospital">
        <div className="icono">
            <HealthAndSafetyIcon style={{ fontSize: '4.5vw'}} /> 
        </div>
      <h2>Administrar Clínica</h2>
      <div className="container">
        <table>
          <thead>
            <tr>
              <th>Día</th>
              <th>Apertura</th>
              <th>Cierre</th>
              <th>Abierto</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(modifiedClinica).map(([day, value]) => {
              // Validar si nombreDias está presente antes de renderizar la fila
              if (value.horarioInicio !== null && value.horarioFinal !== null) {
                return (
                  <tr key={day}>
                    <td>{value.nombreDias}</td>
                    <td>
                      <input
                        type="time"
                        value={value.horarioInicio}
                        onChange={(e) => handleInputChange(e, day, "horarioInicio")}
                        disabled={!value.estado} // Desactivar el campo si el estado es falso
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        value={value.horarioFinal}
                        onChange={(e) => handleInputChange(e, day, "horarioFinal")}
                        disabled={!value.estado} // Desactivar el campo si el estado es falso
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={value.estado}
                        onChange={(e) => handleCheckboxChange(e, day)}
                      />
                    </td>
                  </tr>
                );
              } else {
                return null; // Omitir la renderización si horarioInicio o horarioFinal no están definidos
              }
            })}
          </tbody>
        </table>
        <div className="actions">
          <button 
            style={{ backgroundColor: '#d8f3dc', color: 'black', marginLeft: '0vw', border: '0.2vw solid #d8f3dc', padding: '1vw 1vw', borderRadius: '0.5vw', cursor: 'pointer' }} 
            onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default CreateHospitalComponent;
