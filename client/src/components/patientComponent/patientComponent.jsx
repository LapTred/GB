import "./patientComponent.scss";
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom
import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

const PatientComponent = () => {
    const [pacientes, setPacientes] = useState([]);
    const [pageSize] = useState(10); // Tamaño de la página
    const [currentPage, setCurrentPage] = useState(1); // Página actual

    useEffect(() => {
        fetch('http://localhost:3001/pacientes')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener las pacientes');
                }
                return response.json();
            })
            .then(data => {
                setPacientes(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    // Calcular el índice de inicio y fin de los pacientes en la página actual
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, pacientes.length);

    // Función para cambiar a la página anterior
    const goToPreviousPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    // Función para cambiar a la página siguiente
    const goToNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    return (
        <div className="appointmentComponent">
            <div className="containerT">
                <h2>Total de pacientes ({pacientes.length})</h2>
                <div className="iconContainer">
                    <SearchIcon className="searchIcon" />
                </div>
            </div>
            <div className="containerB">
                <h3>Pacientes</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>Dueño</th>
                            <th>Teléfono</th>
                            <th>Opciones</th> {/* Nueva columna para las opciones */}
                        </tr>
                    </thead>
                    <tbody>
                        {pacientes
                            .slice(startIndex, endIndex)
                            .map(paciente => (
                                <tr key={paciente.id}>
                                    <td>{paciente.nombre_paciente}</td>
                                    <td>{paciente.nombre_propietario}</td>
                                    <td>{paciente.telefono}</td>
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
                        onClick={goToNextPage} disabled={endIndex >= pacientes.length}>Siguiente
                    </button>
                </div>
            </div>            
        </div>
    );
};

export default PatientComponent;
