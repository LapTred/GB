import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import React, { useState, useEffect } from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import "./home.scss";

const Home = () => {  
  const [citas, setCitas] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filteredConsultorio, setFilteredConsultorio] = useState('');
  const [selectedCitaIndex, setSelectedCitaIndex] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/citas')
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
      (cita.estado === "AGENDADA") &&
      isToday(cita.fecha)
    )
    .slice(0, 5);

  const handleViewCita = () => {
    // Manejar lógica para vista de cita
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
                                    onClick={() => handleViewCita()}>
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
              <div className="containerRinside">
                Datos de la Cita seleccionada
              </div>
            </div>
          </div>
        </div>        
      </div>
    </div>
  );
};

export default Home;
