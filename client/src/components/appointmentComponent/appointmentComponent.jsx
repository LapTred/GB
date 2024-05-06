import "./appointmentComponent.scss";
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom
import React, { useEffect, useState } from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const AppointmentComponent = () => {
    const [citas, setCitas] = useState([]);
    const [pageSize] = useState(10); // Tamaño de la página
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filteredConsultorio, setFilteredConsultorio] = useState('');
    const [filteredEstado, setFilteredEstado] = useState('');

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

    // Función para manejar el cambio en la selección del consultorio
    const handleConsultorioChange = (consultorio) => {
        setFilteredConsultorio(consultorio);
    };

    // Función para manejar el cambio en la selección del estado
    const handleEstadoChange = (estado) => {
        setFilteredEstado(estado);
    };

    // Función para formatear la fecha en formato DD--MM--AA
    const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
    };

    return (
        <div className="appointmentComponent">
            <div className="containerT">
                <h2>Total de citas ({citas.length})</h2>
                <div className="iconContainer">
                    <FilterAltIcon className="filterIcon" onClick={handleFilterButtonClick} />
                    <SearchIcon className="searchIcon" />
                    <Link to="/cita/nueva">
                        <AddCircleOutlineIcon className="sumIcon" />
                    </Link>
                </div>
            </div>
            <div className="containerB">
                <h3>Citas</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre Paciente</th>
                            <th>Nombre Dueño</th>
                            <th>Nombre Consultorio</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Opciones</th> {/* Nueva columna para las opciones */}
                        </tr>
                    </thead>
                    <tbody>
                        {citas
                            .filter(cita => (!filteredConsultorio || cita.nombre_consultorio === filteredConsultorio) && (!filteredEstado || cita.estado === filteredEstado))
                            .slice(startIndex, endIndex)
                            .map(cita => (
                                <tr key={cita.id_cita}>
                                    <td>{cita.nombre_paciente}</td>
                                    <td>{cita.nombre_dueño}</td>
                                    <td>{cita.nombre_consultorio}</td>
                                    <td>{cita.estado}</td>
                                    <td>{formatDate(cita.fecha)}</td>
                                    <td>{cita.hora}</td>
                                    <td>...</td> {/* Celda para las opciones, se pueden añadir botones u otros elementos según sea necesario */}
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
                        onClick={goToNextPage} disabled={endIndex >= citas.length}>Siguiente
                    </button>
                </div>
            </div>
            {/* Modal de filtro */}
            {showFilterModal && (
                <div className="filterModal">
                    <div className="modalContent">
                        {/* Contenido del modal */}
                        <span className="closeButton" onClick={handleCloseFilterModal}>×</span>
                        <h2>Filtro</h2>
                        {/* Campo de selección para el nombre del consultorio */}
                        <label htmlFor="consultorio">Seleccionar Consultorio:</label>
                        <select id="consultorio" onChange={(e) => handleConsultorioChange(e.target.value)}>
                            <option value="">Todos los consultorios</option>
                            {/* Mapea sobre los consultorios únicos */}
                            {Array.from(new Set(citas.map(cita => cita.nombre_consultorio))).map(consultorio => (
                                <option key={consultorio} value={consultorio}>{consultorio}</option>
                            ))}
                        </select>
                        {/* Campo de selección para el estado de la cita */}
                        <label htmlFor="estado">Seleccionar Estado:</label>
                        <select id="estado" onChange={(e) => handleEstadoChange(e.target.value)}>
                            <option value="">Todos los estados</option>
                            {/* Mapea sobre los estados únicos */}
                            {['PENDIENTE', 'FLEXIBLE', 'PROCESO', 'AGENDADA', 'COMPLETADA'].map(estado => (
                                <option key={estado} value={estado}>{estado}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentComponent;
