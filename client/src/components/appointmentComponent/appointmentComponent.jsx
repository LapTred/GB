import "./appointmentComponent.scss";
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ErrorModal from "../../components/modal/ErrorModal"; 
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const AppointmentComponent = () => {
    const [citas, setCitas] = useState([]);
    const [pageSize] = useState(8); // Tamaño de la página
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filteredConsultorio, setFilteredConsultorio] = useState('');
    const [filteredEstado, setFilteredEstado] = useState('AGENDADA');
    const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
    
    const [selectedCitaIndex, setSelectedCitaIndex] = useState(null);    
    const [modalOpen, setModalOpen] = useState(false);    
    const [selectedCitaModalOpen, setSelectedCitaModalOpen] = useState(false);
    const [customHeader, setCustomHeader] = useState("");
    const [customText, setCustomText] = useState("");
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
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    // Calcular el índice de inicio y fin de las citas en la página actual
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, citas.length);

    // Función para cambiar a la página anterior
    const goToPreviousPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    // Función para cambiar a la página siguiente
    const goToNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    // Función para mostrar el modal de filtro
    const handleFilterButtonClick = () => {
        setShowFilterModal(true);
    };

    // Función para cerrar el modal de filtro
    const handleCloseFilterModal = () => {
        setShowFilterModal(false);
    };

    const handleCloseModal = () => {
        setModalOpen(false);  
        setSelectedCitaModalOpen(false);      
    };

    const handleToggleOptions = (index) => {
        setSelectedCitaIndex(index === selectedCitaIndex ? null : index);
    };

   // Función para manejar el cambio en la selección del consultorio
const handleConsultorioChange = (consultorio) => {
    setFilteredConsultorio(consultorio);
};

// Función para manejar el cambio en la selección del estado
const handleEstadoChange = (estado) => {
    setFilteredEstado(estado);
};

    const handleViewCita = (id_cita, estado) => {
        navigate(`/cita/${id_cita}?estado=${estado}`);
    };


    // Función para formatear la fecha en formato DD--MM--AA
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${day}-${month}-${year}`;
    };

    // Función para manejar el cambio en el campo de búsqueda
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    
    // Función para convertir una hora en formato HH:MM a un objeto Date
    const parseTime = (timeString) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    // Filtrar citas en función del término de búsqueda, consultorio y estado
    const filteredCitas = citas
    .filter(cita =>
        (cita.nombre_paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cita.nombre_dueño.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!filteredConsultorio || cita.nombre_consultorio === filteredConsultorio) &&
        (!filteredEstado || cita.estado === filteredEstado)
    )
    .sort((a, b) => {
        const dateComparison = new Date(a.fecha) - new Date(b.fecha);
        if (dateComparison !== 0) return dateComparison;
        return parseTime(a.hora) - parseTime(b.hora);
    });

    
    
    const handleDeleteCita = (id_cita, nombre_dueño) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta cita?");
        console.log(citas);
        if (confirmDelete) {
            fetch(`https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/cita/delete/${id_cita}`, {
                method: 'PUT' // Cambiar a PUT
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar la cita');
                }                
                setCustomHeader(`La cita a nombre de ${nombre_dueño} ha sido eliminada.`);
                setCustomText("Clic en cerrar para continuar");                
                setModalOpen(true);

                // Actualizar la lista de pacientes después de eliminar uno
                setCitas(prevCitas => prevCitas.filter(cita => cita.id_cita !== id_cita));
                
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    };

    return (
        <div className="appointmentComponent">
            <div className="containerT">
                <h2>Total de citas ({filteredCitas.length})</h2>
                <div className="iconContainer">
                    <div className="iconContainerSub">
                        <input 
                            type="text"
                            placeholder="Buscar por paciente o dueño"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="searchInput"
                        />                    
                        <SearchIcon className="searchIcon" />
                    </div>                    
                    <FilterAltIcon 
                        style={{cursor: 'pointer' }}
                        className="filterIcon" onClick={handleFilterButtonClick} />
                    
                    <Link to="/cita/nueva">
                        <AddCircleOutlineIcon className="sumIcon" />
                    </Link>
                </div>
            </div>
            <div className="containerB">
            {filteredCitas.length > 0 ? (
                    <>
                <h3>Citas</h3>
                <table className="citasTable">
                    <thead>
                        <tr>
                            <th className="tableHeader">Nombre Paciente</th>
                            <th className="tableHeader">Nombre Dueño</th>
                            <th className="tableHeader">Nombre Consultorio</th>
                            <th className="tableHeader">Estado</th>
                            <th className="tableHeader">Fecha</th>
                            <th className="tableHeader">Hora</th>
                            <th className="tableHeader">Opciones</th> {/* Nueva columna para las opciones */}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCitas
                            .filter(cita => (!filteredConsultorio || cita.nombre_consultorio === filteredConsultorio) && (!filteredEstado || cita.estado === filteredEstado))
                            .slice(startIndex, endIndex)
                            .map((cita, index) => (
                                <tr key={cita.id_cita}>
                                    <td className="tableData">{cita.nombre_paciente}</td>
                                    <td className="tableData">{cita.nombre_dueño}</td>
                                    <td className="tableData">{cita.nombre_consultorio}</td>
                                    <td className="tableData">{cita.estado}</td>
                                    <td className="tableData">{formatDate(cita.fecha)}</td>
                                    <td className="tableData">{cita.hora}</td>
                                    <td className="tableData">
                                        {selectedCitaIndex === index ? (
                                            <>
                                                <div className="containerButtons">                                                
                                                    <button 
                                                        style={{ backgroundColor: '#ce796b', color: 'black', border: '0.2vw solid #ce796b', padding: '0.2vw 0.2vw', borderRadius: '0.5vw', cursor: 'pointer' }}
                                                        className="buttonPatients" 
                                                        onClick={() => handleDeleteCita(cita.id_cita, cita.nombre_dueño)}>
                                                        <DeleteIcon className="iconPatient" />
                                                    </button>
                                                    <button 
                                                            style={{ backgroundColor: '#d8f3dc', color: 'black', marginLeft: '0vw', border: '0.2vw solid #d8f3dc', padding: '0.2vw 0.2vw', borderRadius: '0.5vw', cursor: 'pointer' }} 
                                                            className="buttonPatients" 
                                                            onClick={() => handleViewCita(cita.id_cita, cita.estado)}>                                                            
                                                            <VisibilityIcon className="iconPatient" />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <button
                                                style={{ backgroundColor: '#f2f2f2', color: 'black', marginLeft: '0vw', border: '0.2vw solid #f2f2f2', padding: '0.2vw 0.5vw', borderRadius: '0.5vw', cursor: 'pointer' }}     
                                                className="buttonPatients"
                                                onClick={() => handleToggleOptions(index)}>...</button>
                                        )}
                                    </td> {/* Celda para las opciones, se pueden añadir botones u otros elementos según sea necesario */}
                                </tr>
                            ))}
                    </tbody>
                </table>
                {/* Botones de paginación */}
                <div className="pages">
                    <button 
                        style={{ backgroundColor: 'lightgray', color: 'black', border: '0.1vw solid lightgray', padding: '0.5vw 0.5vw', borderRadius: '0.5vw', cursor: 'pointer' }}
                        onClick={goToPreviousPage} disabled={currentPage === 1}>Anterior
                    </button>
                    <span>Página {currentPage}</span>
                    <button 
                        style={{ backgroundColor: 'lightgray', color: 'black', marginLeft: '1vw', border: '0.1vw solid lightgray', padding: '0.5vw 0.5vw', borderRadius: '0.5vw', cursor: 'pointer' }}
                        onClick={goToNextPage} disabled={endIndex >= filteredCitas.length}>Siguiente
                    </button>
                </div>
                </>
                ) : (
                    <h3>No se encontraron citas</h3>
                )}
            </div>
            
            {/* Modal de filtro */}
            {showFilterModal && (
                <div className="filterModal">
                    <div className="modalContent">
                        {/* Contenido del modal */}
                        <div className="modalContentFiltro">
                            <h2>Filtro</h2>                        
                            <span className="closeButtonCita" onClick={handleCloseFilterModal}>×</span> 
                        </div>
                        <div className="modalContentInfo">
                            {/* Campo de selección para el nombre del consultorio */}
                            <label htmlFor="consultorio">Consultorio:</label>
                            <select className="SelectModal" id="consultorio" onChange={(e) => handleConsultorioChange(e.target.value)} value={filteredConsultorio}>
                                <option value="">Todos los consultorios</option>
                                {/* Mapea sobre los consultorios únicos */}
                                {Array.from(new Set(citas.map(cita => cita.nombre_consultorio))).map(consultorio => (
                                    <option key={consultorio} value={consultorio}>{consultorio}</option>
                                ))}
                            </select>
                        </div>
                        <div className="modalContentInfo">
                            {/* Campo de selección para el estado de la cita */}
                            <label htmlFor="estado">Estado de la cita:</label>
                            <select className="SelectModal" id="estado" onChange={(e) => handleEstadoChange(e.target.value)} value={filteredEstado}>
                                <option value="">Todos los estados</option>
                                {/* Mapea sobre los estados únicos */}
                                {['FLEXIBLE', 'AGENDADA', 'COMPLETADA'].map(estado => (
                                    <option key={estado} value={estado}>{estado}</option>
                                ))}
                            </select>    
                        </div>                      
                    </div>
                </div>
            )}
            <ErrorModal isOpen={modalOpen} onClose={handleCloseModal} header={customHeader} text={customText} />
                
        </div>
    );
};

export default AppointmentComponent;
