import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import React, { useState, useEffect } from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link, useNavigate } from 'react-router-dom';
import "./home.scss";

const Home = () => {  
  const [citas, setCitas] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filteredConsultorio, setFilteredConsultorio] = useState('');
  const [selectedCitaIndex, setSelectedCitaIndex] = useState(null);
  const [selectedCitaData, setSelectedCitaData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/citas')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener las citas');
        }
        return response.json();
      })
      .then(data => {
        setCitas(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const handleFilterButtonClick = () => {
    setShowFilterModal(true);
  };

  const handleToggleOptions = (index) => {
    setSelectedCitaIndex(index === selectedCitaIndex ? null : index);
  };

  const handleConsultorioChange = (consultorio) => {
    setFilteredConsultorio(consultorio);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  };

  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const filteredCitas = citas 
  .filter(cita =>
    (!filteredConsultorio || cita.nombre_consultorio === filteredConsultorio) &&
    (cita.estado === "AGENDADA" || cita.estado === "FLEXIBLE") &&
    isToday(cita.fecha)
  )
  .sort((a, b) => a.hora.localeCompare(b.hora))  // Ordenar por hora
  .slice(0, 5);

  const handleViewCita = (id) => {
    fetch(`https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/cita/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener la cita');
        }
        return response.json();
      })
      .then(data => {
        setSelectedCitaData(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleCloseFilterModal = () => {
    setShowFilterModal(false);
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="containers">
          <div className="containerL">
            <div className="containerLfirst">
              <div className="containerLinsideOne">                
                <h2 className="AgendaTitulo">Citas del día: ({filteredCitas.length})</h2>               
                <div className="iconContainerCita">
                  <FilterAltIcon 
                    style={{cursor: 'pointer' }}
                    className="filterIcon" onClick={handleFilterButtonClick} /> 
                       
                </div>
              </div>
              <div className="containerLinsideTwo">
                {filteredCitas.length > 0 ? (
                  <>
                    <table className="citasTable">
                      <thead>
                        <tr>
                          <th className="tableHeader">Paciente</th>
                          <th className="tableHeader">Dueño</th>
                          <th className="tableHeader">Consultorio</th>
                          <th className="tableHeader">Hora</th>
                          <th className="tableHeader">Opciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCitas.map((cita, index) => (
                          <tr key={cita.id_cita}>
                            <td className="tableData">{cita.nombre_paciente}</td>
                            <td className="tableData">{cita.nombre_dueño}</td>
                            <td className="tableData">{cita.nombre_consultorio}</td>
                            <td className="tableData">{cita.hora}</td>
                            <td className="tableData">
                              {selectedCitaIndex === index ? (
                                <div className="containerButtons">        
                                  <button 
                                    style={{ backgroundColor: '#d8f3dc', color: 'black', marginLeft: '0vw', border: '0.2vw solid #d8f3dc', padding: '0.2vw 0.2vw', borderRadius: '0.5vw', cursor: 'pointer' }} 
                                    className="buttonPatients" 
                                    onClick={() => handleViewCita(cita.id_cita)}>
                                    <VisibilityIcon className="iconPatient" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  style={{ backgroundColor: '#f2f2f2', color: 'black', marginLeft: '0vw', border: '0.2vw solid #f2f2f2', padding: '0.2vw 0.5vw', borderRadius: '0.5vw', cursor: 'pointer' }}     
                                  className="buttonPatients"
                                  onClick={() => handleToggleOptions(index)}>...</button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <h3>No se encontraron citas</h3>
                )}
                {showFilterModal && (
                  <div className="filterModal">
                    <div className="modalContent">
                      <div className="modalContentFiltro">
                        <h2>Filtro</h2>                        
                        <span className="closeButtonCita" onClick={handleCloseFilterModal}>×</span> 
                      </div>
                      <div className="modalContentInfo">
                        <label htmlFor="consultorio">Consultorio:</label>
                        <select className="SelectModal" id="consultorio" onChange={(e) => handleConsultorioChange(e.target.value)} value={filteredConsultorio}>
                          <option value="">Todos los consultorios</option>
                          {Array.from(new Set(citas.map(cita => cita.nombre_consultorio))).map(consultorio => (
                            <option key={consultorio} value={consultorio}>{consultorio}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                
              </div>
              <div className="containerLinsideThree">                              
                <Link to="/cita/nueva" className="newCitaLink">
                    <button 
                      style={{ color: 'black',marginLeft: '0vw', border: '0.2vw solid transparent', padding: '0.5vw 0.5vw', borderRadius: '0.5vw', cursor: 'pointer' }}
                      className="newCitaButton">Nueva Cita</button>
                  </Link>
              </div>
            </div>
          </div>
          <div className="containerR">
            <div className="containerRfirst">
            <h2>Información General</h2>
              <div className="containerRinside">
                
                {selectedCitaData ? (
                  <div className="resumenCitacontainer">
                    <div className="resumenCitaBfirst resumenCitaInfoBox">
                      
                      <div className="resumenCitaInfoSeparado">
                        <div className="resumenCitaSeparado">
                          <p>Paciente:</p>
                          <div className="resumenCitaSeparadoInfo">{selectedCitaData.paciente.nombre_paciente}</div>
                        </div>
                        <div className="resumenCitaSeparado">
                          <p>Propietario:</p>
                          <div className="resumenCitaSeparadoInfo">{selectedCitaData.paciente.nombre_propietario}</div>
                        </div>
                        <div className="resumenCitaSeparado">
                          <p>Teléfono:</p>
                          <div className="resumenCitaSeparadoInfo">{selectedCitaData.paciente.telefono_propietario}</div>
                        </div>
                        <div className="resumenCitaSeparado">
                          <p>Consultorio:</p>
                          <div className="resumenCitaSeparadoInfo">{selectedCitaData.paciente.nombre_consultorio}</div>
                        </div>
                        <div className="resumenCitaSeparado">
                          <p>Servicio:</p>
                          <div className="resumenCitaSeparadoInfo">{selectedCitaData.paciente.nombre_servicio}</div>
                        </div>
                        <div className="resumenCitaSeparado">
                          <p>Horario:</p>
                          <div className="resumenCitaSeparadoInfo">{selectedCitaData.paciente.hora_inicio} - {selectedCitaData.paciente.hora_final}</div>
                        </div>
                    </div>
                  </div>
                  {selectedCitaData.paciente.estado_paciente === "ACTIVO" && (
                    <div className="resumenCitaBsecond resumenCitaInfoBox">
                      <h3 className="TituloPequeño">Detalles del Paciente</h3>
                      <div className="resumenCitaInfoSeparado">
                        <div className="resumenCitaSeparado">
                          <p>Fecha de Nacimiento:</p>
                          {selectedCitaData.paciente.fecha_nacimiento ? (
                            <div className="resumenCitaSeparadoInfo">{formatDate(selectedCitaData.paciente.fecha_nacimiento)}</div>
                          ) : (
                            <div className="resumenCitaSeparadoInfo"></div>
                          )}
                        </div>              
                        <div className="resumenCitaSeparado">
                          <p>Sexo:</p>
                          <div className="resumenCitaSeparadoInfo">{selectedCitaData.paciente.sexo_paciente}</div>
                        </div>
                        <div className="resumenCitaSeparado">
                          <p>Peso:</p>
                          <div className="resumenCitaSeparadoInfo">
                            {selectedCitaData.paciente.peso_resumen_cita !== null ? 
                              selectedCitaData.paciente.peso_resumen_cita : (selectedCitaData.paciente.peso_paciente !== null ? 
                                `Registro anterior: ${selectedCitaData.paciente.peso_paciente}` : 'Sin registro')}
                          </div>               
                          <p></p>
                          <p>Kg.</p>
                        </div>
                        
                      </div>
                    </div>
                  )} 
                    <div className="resumenCitaSeparadoButton">                                                                                
                            <button 
                              style={{ color: 'black', marginTop: '1vw', marginLeft: '0vw', border: '0.2vw solid transparent', padding: '0.5vw 0.5vw', borderRadius: '0.5vw', cursor: 'pointer' }}
                              className="newCitaButton"
                              onClick={() => navigate(`/cita/iniciar/${selectedCitaData.paciente.cita_id}`)}>
                              Comenzar Cita
                            </button>                           
                          </div>
                    </div>
                ) : (
                  <p>Selecciona una cita para ver los detalles</p>
                )}
              </div>
            </div>
          </div>
        </div>        
      </div>
    </div>
  );
};

export default Home;
