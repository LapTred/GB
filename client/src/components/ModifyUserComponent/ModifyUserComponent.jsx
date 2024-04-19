import React, { useState, useEffect } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import "./ModifyUserComponent.scss";

const ModifyUserComponent = ({ user, onCancel, onSave }) => {
  const initialUser = user || { nombreUsuario: "", Nombre: "", Clave: "", RepetirClave: "", Acceso: "Veterinario" };
  const [modifiedUser, setModifiedUser] = useState(initialUser);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [passwordRequirementsError, setPasswordRequirementsError] = useState(false);
  const [usernameLengthError, setUsernameLengthError] = useState(false);
  const [fullNameFormatError, setFullNameFormatError] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false); // Estado para indicar si la contraseña ha sido modificada

  useEffect(() => {
    // Compare passwords when both Clave and RepetirClave have been changed
    if (passwordChanged) {
      setPasswordMatchError(modifiedUser.RepetirClave !== modifiedUser.Clave);
    }
  }, [modifiedUser.Clave, modifiedUser.RepetirClave, passwordChanged]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value.trim(); // Remove leading and trailing whitespaces

    if (name === "nombreUsuario") {
      newValue = newValue.replace(/[^A-Za-z]/g, ''); // Remove non-alphabetic characters
      setUsernameLengthError(newValue.length < 6); // Check username length
    } else if (name === "Nombre") {
      // Remove non-alphabetic characters and extra whitespaces      
      newValue = newValue.replace(/[^A-Za-z\s]+/g, '').replace(/\s{2,}/g, ' ');
      const nameParts = newValue.split(" ");
      setFullNameFormatError(nameParts.length < 2 || nameParts.some(part => part.length === 0)); // Check full name format
    }

    setModifiedUser({ ...modifiedUser, [name]: newValue });

    if (name === "Clave") {
      setPasswordMatchError(newValue !== modifiedUser.RepetirClave); // Compare passwords when Clave changes
      setPasswordRequirementsError(!validatePassword(newValue));
      setPasswordChanged(true); // Indicate that the password has been changed
    } else if (name === "RepetirClave" && passwordChanged) {
      setPasswordMatchError(newValue !== modifiedUser.Clave); // Compare passwords when RepetirClave changes and password has been changed
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
  };

  const handleSave = () => {
    if (modifiedUser.Clave !== modifiedUser.RepetirClave) {
      setPasswordMatchError(true);
      return;
    }

    if (!validatePassword(modifiedUser.Clave)) {
      setPasswordRequirementsError(true);
      return;
    }

    if (usernameLengthError || fullNameFormatError) {
      return; // Stop execution if there are validation errors
    }

    fetch(`http://localhost:3001/usuario/${modifiedUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modifiedUser),
    })
      .then(response => response.json())
      .then(data => {
        onSave(data);
      })
      .catch(error => console.error('Error updating user:', error));
  };

  return (
    <div className="modify-user">
      <h2>Modificar Usuario</h2>
      <div className="container">
        <label htmlFor="nombreUsuario">Usuario</label>
        <input type="text" name="nombreUsuario" value={modifiedUser.nombreUsuario} onChange={handleInputChange} />
        {usernameLengthError && <span style={{ color: 'red' }}>El nombre de usuario debe tener al menos 6 caracteres</span>}
        <label htmlFor="nombre">Nombre Completo</label>
        <input type="text" name="Nombre" value={modifiedUser.Nombre} onChange={handleInputChange} />
        {fullNameFormatError && <span style={{ color: 'red' }}>El nombre completo debe tener al menos un nombre y un apellido</span>}
        <label htmlFor="clave">Contraseña</label>
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            name="Clave"
            value={modifiedUser.Clave}
            onChange={handleInputChange}
          />
          <div className="icon">
            <div className="password-icon" onClick={handleTogglePasswordVisibility}>
              {showPassword ? <VisibilityOff style={{ fontSize: '2vw'}}/> : <Visibility style={{ fontSize: '2vw'}} />}
            </div>
          </div>
          
        </div>

        {passwordRequirementsError && <span style={{ color: 'red' }}>La contraseña debe contener por lo menos: una letra mayúscula, un dígito y 6 caracteres </span>}
        <label htmlFor="repetirClave">Repetir Contraseña</label>
        <input
          type="password"
          name="RepetirClave"
          value={modifiedUser.RepetirClave}
          onChange={handleInputChange}
        />
        {passwordMatchError && !passwordRequirementsError && <span style={{ color: 'red' }}>Las contraseñas no coinciden</span>}
        <label htmlFor="acceso">Tipo de Acceso</label>
        <select name="Acceso" value={modifiedUser.Acceso} onChange={handleInputChange}>
          <option value="Veterinario">Veterinario</option>
          <option value="Recepcionista">Recepcionista</option>
        </select>
        <div className="actions">
          <button onClick={onCancel}>Cancelar</button>
          <button onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default ModifyUserComponent;
