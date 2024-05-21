import { useState } from "react";
import "./login.scss";
import LogoGB from "../../components/login/Logo.png";
import logoImage from "../../components/login/Perro.png";
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import InputAdornment from '@mui/material/InputAdornment';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const data = {
        username: username,
        password: password
    };

    fetch('https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result); 
        if (result.token && result.Acceso && result.Nombre) {
            sessionStorage.setItem('token', result.token);
            sessionStorage.setItem('Acceso', result.Acceso);
            sessionStorage.setItem('nombre', result.Nombre);

            // Redirige al usuario a la ruta /home independientemente del rol
            navigate('/home');
        } else {
          // Manejo de error en el inicio de sesión
          console.error('Inicio de sesión fallido');
        }
      })
      .catch(error => {
        console.error('Error en el inicio de sesión', error);
      }
    );
  };

  return (
    <div className="custom-form">
      <div className="login">
        <div className="loginL">
          <div className="loginLogo">
            <img src={LogoGB} alt="ITTLogo" className="logo"/>
          </div>
          <div className="loginBienvenida">            
            <p className="textoBienvenida">Bienvenido a <br /> Clínica Veterinaria GB</p>
            <form className="flex flex-col pt-3 md:pt-8" onSubmit={handleLogin}>
              <div className="input-container pt-4">
                <TextField
                  onChange={(event) => { setUsername(event.target.value) }}
                  placeholder="Nombre de usuario"
                  type="text"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
  
              <div className="input-container pt-4">
                <TextField
                  onChange={(event) => { setPassword(event.target.value) }}
                  placeholder="Contraseña"
                  type="password"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
  
              <div className="flex flex-col pt-4">
                <button
                  type="submit"
                  className="custom-button"
                >
                  Iniciar Sesión
                </button>
              </div>
            </form>
          </div>
        </div>
  
        <div className="loginR">
          <img src={logoImage} alt="galgo" className="loginGalgo"/>
        </div>
      </div>
    </div>
  );
};

export default Login;
