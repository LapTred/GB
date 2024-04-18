import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Widget from "../../components/widget/Widget";
import AddIcon from '@mui/icons-material/Add';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PeopleIcon from '@mui/icons-material/People';
import { useState, useEffect } from 'react';
import "./ajustes.scss";

const Ajustes = () => {
  const [data, setData] = useState([]);
  const [dataType, setDataType] = useState('');

  useEffect(() => {
    fetchData(dataType);
  }, [dataType]); // Se ejecutará cada vez que el valor de dataType cambie

  const fetchData = (type) => {
    // Realizar la solicitud HTTP según el tipo de datos requeridos
    let url;
    if (type === 'consultorios') {
      url = 'http://localhost:3001/consultorios';
    } else if (type === 'usuarios') {
      url = 'http://localhost:3001/usuarios';
    }

    fetch(url)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error(`Error fetching ${type}:`, error));
  };

  return (
    <div className="ajustes">
      <Sidebar />
      <div className="ajustesContainer">
        <Navbar />
        <div className="containers">
          <div className="containerL">
            <div className="containersL">
              <div className="widgetsT">              
                <Widget className="widget" type="ajustestitulo"/>             
              </div>
              <div className="widgetsB">              
                <Widget className="widget" type="consultorios" descripcion="Administrar consultorios" onClick={() => setDataType('consultorios')} />
                <Widget className="widget" type="usuarios" descripcion="Administración y registro de usuarios" onClick={() => setDataType('usuarios')} />
              </div>
            </div>            
          </div>
          <div className="containerR">
            <div className="ajustestituloR">
              <div className="ajustestitulo">
                <h2>{dataType === 'consultorios' ? 'Consultorios' : 'Usuarios'}</h2>
                <div className="iconR">
                  <AddIcon style={{ fontSize: 40, border: '2px solid black', borderRadius: '30%', borderColor: '#E0E0E0'}} /> 
                </div>
              </div>              
            </div>
            <div className="ajustesR">
              <div className="consultoriosContainer">
                {dataType === 'consultorios' && (
                  <div className="icono">
                    <MeetingRoomIcon style={{ fontSize: 80}} /> 
                  </div>
                )}
                {dataType === 'usuarios' && (
                  <div className="icono">
                    <PeopleIcon style={{ fontSize: 80}} /> 
                  </div>
                )}
                {data.map(item => (
                  <div key={item.id} className="consultorio">
                    <h3>{dataType === 'consultorios' ? item.nombreConsultorio : item.Nombre}</h3>
                    <p>{dataType === 'consultorios' ? item.Descripcion : item.Acceso}</p>
                    <div className="actions">
                      <button style={{ color: 'black', marginRight: '10px', border: '1px solid red', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}>Eliminar</button>
                      <button style={{ backgroundColor: '#d8f3dc', color: 'black', marginLeft: '10px', border: '1px solid black', borderColor: '#d8f3dc', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}>Modificar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>        
      </div>
    </div>
  );
};

export default Ajustes;
