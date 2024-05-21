import React, { useState, useEffect } from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Widget from "../../components/widget/Widget";
import AddIcon from '@mui/icons-material/Add';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PeopleIcon from '@mui/icons-material/People';
import "./ajustes.scss";
import ModifyUserComponent from "../../components/ModifyUserComponent/ModifyUserComponent";
import CreateUserComponent from "../../components/CreateUserComponent/CreateUserComponent"; 
import CreateRoomComponent from "../../components/CreateRoomComponent/CreateRoomComponent"; 
import ModifyRoomComponent from "../../components/ModifyRoomComponent/ModifyRoomComponent";
import CreateHospitalComponent from "../../components/CreateHospitalComponent/CreateHospitalComponent"

const Ajustes = () => {
  const [data, setData] = useState([]);
  const [dataType, setDataType] = useState('consultorios');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmations, setDeleteConfirmations] = useState({});
  const [clinicaData, setClinicaData] = useState(null);

  useEffect(() => {
    setDeleteConfirmations({});
    setIsEditing(false);
    setIsCreating(false);
    fetchData(dataType);
  }, [dataType]); 

  const fetchData = (type) => {
    let url;
    if (type === 'consultorios') {
      url = 'https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/consultorios';
    } else if (type === 'usuarios') {
      url = 'https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/usuarios';
    } else if (type === 'clinica') {
      url = 'https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/clinica';
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (type === 'clinica') {
          setClinicaData(data);
        } else {
          setData(data);
        }
      })
      .catch(error => console.error(`Error fetching ${type}:`, error));
  };

  const handleModifyItem = (item) => {
    setSelectedItem(item);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCancelModification = () => {
    setSelectedItem(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleSaveModification = (modifiedItem) => {
    setSelectedItem(null);
    setIsEditing(false);
    setIsCreating(false);
    fetchData(dataType);
  };

  const handleDeleteUser = (id) => {
    if (deleteConfirmations[id]) {
      fetch(`https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/usuario/delete/${id}`, {
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
      fetch(`https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/consultorio/delete/${id}`, {
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => {
        console.log('Consultorio eliminado:', data);
        setDeleteConfirmations(prevState => ({
          ...prevState,
          [id]: false
        }));
        fetchData(dataType);
      })
      .catch(error => console.error('Error al eliminar el consultorio:', error));
    } else {
      setDeleteConfirmations(prevState => ({
        ...prevState,
        [id]: true
      }));
    }
  };

  const handleShowCreateUser = () => {
    setIsCreating(true);
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
                <Widget className="widget" type="horario" descripcion="Administrar clínica" onClick={() => setDataType('clinica')} />
              </div>
            </div>            
          </div>
          <div className="containerR">
            <div className="ajustestituloR">
              <div className="ajustestitulo">
                <h2>{dataType === 'consultorios' ? 'Consultorios' : dataType === 'usuarios' ? 'Usuarios' : 'Clínica'}</h2>
                {!isEditing && !isCreating && dataType !== 'clinica' && (
                  <div className="iconR">
                    <AddIcon style={{ fontSize: '3vw', border: '0.2vw solid black', borderRadius: '30%', borderColor: '#E0E0E0'}} onClick={handleShowCreateUser} /> 
                  </div>
                )}
              </div>              
            </div>
            <div className={`ajustesR ${isEditing || isCreating ? 'centered' : ''}`}>
              {isCreating && dataType === 'usuarios' && 
                <CreateUserComponent 
                  onCancel={handleCancelModification}                  
                  onSave={handleSaveModification} 
                />} 
              {isCreating && dataType === 'consultorios' && 
                <CreateRoomComponent 
                  onCancel={handleCancelModification}                  
                  onSave={handleSaveModification}               
                />} 
              {isEditing && dataType === 'usuarios' && (
                <ModifyUserComponent 
                  user={selectedItem} 
                  onCancel={handleCancelModification} 
                  onSave={handleSaveModification} 
                />
              )}
              {isEditing && dataType === 'consultorios' && (
                <ModifyRoomComponent 
                  room={selectedItem} 
                  onCancel={handleCancelModification} 
                  onSave={handleSaveModification} 
                />
              )}
              {!isCreating && !isEditing && dataType !== 'clinica' && (
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
                              style={{ backgroundColor: '#ce796b', color: 'black', marginRight: '0px', border: '0.2vw solid #ce796b', padding: '1vw 1vw', borderRadius: '0.5vw', cursor: 'pointer' }}
                              onClick={() => dataType === 'consultorios' ? handleDeleteRoom(item.id) : handleDeleteUser(item.id)}
                           >
                              Confirmar
                            </button>   
                            <button 
                              style={{ backgroundColor: '#f2f2f2', color: 'black', marginRight: '0.5vw', border: '0.2vw solid #f2f2f2', padding: '1vw 1vw', borderRadius: '0.5vw', cursor: 'pointer' }}
                              onClick={() => setDeleteConfirmations(prevState => ({ ...prevState, [item.id]: false }))}
                            >
                              Cancelar
                            </button>                         
                          </>
                        ) : (
                          <button 
                            style={{ backgroundColor: 'white', color: 'black', marginRight: '1vw', border: '0.2vw solid #ce796b', padding: '1vw 1vw', borderRadius: '0.5vw', cursor: 'pointer' }}
                            onClick={() => setDeleteConfirmations(prevState => ({ ...prevState, [item.id]: true }))}
                          >
                            Eliminar
                          </button>
                        )}
                        <button 
                          style={{ backgroundColor: '#d8f3dc', color: 'black', marginLeft: '0vw', border: '0.2vw solid #d8f3dc', padding: '1vw 1vw', borderRadius: '0.5vw', cursor: 'pointer' }} 
                          onClick={() => handleModifyItem(item)}
                        >
                          Modificar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {dataType === 'clinica' && (
                <CreateHospitalComponent clinicaData={clinicaData}  // Pasar los datos de la clínica como prop
                  onCancel={handleCancelModification} 
                  onSave={handleSaveModification} 
                />
              )}
            </div>
          </div>
        </div>        
      </div>
    </div>
  );
};

export default Ajustes;
