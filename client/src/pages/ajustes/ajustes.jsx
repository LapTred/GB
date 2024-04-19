import React, { useState, useEffect } from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Widget from "../../components/widget/Widget";
import AddIcon from '@mui/icons-material/Add';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PeopleIcon from '@mui/icons-material/People';
import "./ajustes.scss";
import ModifyUserComponent from "../../components/ModifyUserComponent/ModifyUserComponent";
import ModifyRoomComponent from "../../components/ModifyRoomComponent/ModifyRoomComponent";
import { red } from '@mui/material/colors';

const Ajustes = () => {
  const [data, setData] = useState([]);
  const [dataType, setDataType] = useState('consultorios');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmations, setDeleteConfirmations] = useState({});

  useEffect(() => {
    setDeleteConfirmations({});
    setIsEditing(false);
    fetchData(dataType);
  }, [dataType]); 

  const fetchData = (type) => {
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

  const handleModifyItem = (item) => {
    setSelectedItem(item);
    setIsEditing(true);
  };

  const handleCancelModification = () => {
    setSelectedItem(null);
    setIsEditing(false);
  };

  const handleSaveModification = (modifiedItem) => {
    setSelectedItem(null);
    setIsEditing(false);
    fetchData(dataType);
  };

  const handleDeleteUser = (id) => {
    if (deleteConfirmations[id]) {
      fetch(`http://localhost:3001/usuario/delete/${id}`, {
        method: 'PUT'
      })
      .then(response => response.json())
      .then(data => {
        console.log('Acceso del usuario cambiado a INACTIVO:', data);
        setDeleteConfirmations(prevState => ({
          ...prevState,
          [id]: false
        }));
        fetchData(dataType);
      })
      .catch(error => console.error('Error al cambiar el acceso del usuario:', error));
    } else {
      setDeleteConfirmations(prevState => ({
        ...prevState,
        [id]: true
      }));
    }
  };

  const handleDeleteRoom = (id) => {
    if (deleteConfirmations[id]) {
      fetch(`http://localhost:3001/consultorio/delete/${id}`, {
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => {
        console.log('Consultorio eliminado:', data);
        // Establecer deleteConfirmations[id] en false después de eliminar el consultorio
        setDeleteConfirmations(prevState => ({
          ...prevState,
          [id]: false
        }));
        fetchData(dataType);
      })
      .catch(error => console.error('Error al eliminar el consultorio:', error));
    } else {
      // Solo establecer deleteConfirmations[id] en true si no hay confirmación previa
      setDeleteConfirmations(prevState => ({
        ...prevState,
        [id]: true
      }));
    }
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
                <Widget className="widget" type="usuarios" descripcion="Administrar usuarios" onClick={() => setDataType('usuarios')} />
              </div>
            </div>            
          </div>
          <div className="containerR">
            <div className="ajustestituloR">
              <div className="ajustestitulo">
                <h2>{dataType === 'consultorios' ? 'Consultorios' : 'Usuarios'}</h2>
                <div className="iconR">
                  <AddIcon style={{ fontSize: '3vw', border: '0.2vw solid black', borderRadius: '30%', borderColor: '#E0E0E0'}} /> 
                </div>
              </div>              
            </div>
            <div className={`ajustesR ${isEditing ? 'centered' : ''}`}>
              {isEditing ? (
                dataType === 'usuarios' ? (
                  <ModifyUserComponent 
                    user={selectedItem} 
                    onCancel={handleCancelModification} 
                    onSave={handleSaveModification} 
                  />
                ) : (
                  <ModifyRoomComponent 
                    room={selectedItem} 
                    onCancel={handleCancelModification} 
                    onSave={handleSaveModification} 
                  />
                )
              ) : (
                <div className="consultoriosContainer">
                  {dataType === 'consultorios' && (
                    <div className="icono">
                      <MeetingRoomIcon style={{ fontSize: '4.5vw'}} /> 
                    </div>
                  )}
                  {dataType === 'usuarios' && (
                    <div className="icono">
                      <PeopleIcon style={{ fontSize: '4.5vw'}} /> 
                    </div>
                  )}
                  {data.map(item => (
                    <div key={item.id} className="consultorio">
                      <h3>{dataType === 'consultorios' ? item.nombreConsultorio : item.Nombre}</h3>
                      <p>
                        {dataType === 'consultorios' 
                          ? item.Descripcion 
                          : <span>Nombre de usuario: <em>{item.nombreUsuario}</em></span>
                        }
                      </p>
                        {dataType === 'consultorios' && item.horarioInicio && (
                        <p>{"Hora de Inicio: " + item.horarioInicio.slice(0, 5)}</p>
                      )}
                      {dataType === 'consultorios' && item.horarioFinal && (
                        <p>{"Hora de Cierre: " + item.horarioFinal.slice(0, 5)}</p>
                      )}                   
                      <div className="actions">
                        {deleteConfirmations[item.id] ? (
                          <>
                            <p>
                              <em>
                                {dataType === 'consultorios' ? 'Todas las citas asignadas serán canceladas ¿Está seguro?' : '¿Seguro que desea eliminar este usuario?'}
                              </em>
                            </p>
                            <button 
                              style={{ backgroundColor: '#ce796b', color: 'black', marginRight: '0px', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}
                              onClick={() => dataType === 'consultorios' ? handleDeleteRoom(item.id) : handleDeleteUser(item.id)}
                           >
                              Confirmar
                            </button>   
                            <button 
                              style={{ color: 'black', marginRight: '10px', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}
                              onClick={() => setDeleteConfirmations(prevState => ({ ...prevState, [item.id]: false }))}
                            >
                              Cancelar
                            </button>                         
                          </>
                        ) : (
                          <button 
                            style={{ backgroundColor: '#ce796b', color: 'black', marginRight: '1vw', border: 'none', padding: '1vw 2vw', borderRadius: '1vw', cursor: 'pointer' }}
                            onClick={() => setDeleteConfirmations(prevState => ({ ...prevState, [item.id]: true }))}
                          >
                            Eliminar
                          </button>
                        )}
                        <button 
                          style={{ backgroundColor: '#d8f3dc', color: 'black', marginLeft: '0vw', border: 'none', padding: '1vw 2vw', borderRadius: '1vw', cursor: 'pointer' }} 
                          onClick={() => handleModifyItem(item)}
                        >
                          Modificar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>        
      </div>
    </div>
  );
};

export default Ajustes;
