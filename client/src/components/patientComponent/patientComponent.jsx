import "./patientComponent.scss";
import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ErrorModal from "../../components/modal/ErrorModal"; 
import PacienteModal from "../../components/modal/PacienteModal"; 

const PatientComponent = () => {
    const [pacientes, setPacientes] = useState([]);
    const [pageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatientIndex, setSelectedPatientIndex] = useState(null);    
    const [modalOpen, setModalOpen] = useState(false);
    const [customHeader, setCustomHeader] = useState("");
    const [customText, setCustomText] = useState("");
    const [selectedPatientDetails, setSelectedPatientDetails] = useState(null);
    const [selectedPatientModalOpen, setSelectedPatientModalOpen] = useState(false);


    useEffect(() => {
        fetch('https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/pacientes')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los pacientes');
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

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, pacientes.length);

    const goToPreviousPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    const goToNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCloseModal = () => {
        setModalOpen(false);  
        setSelectedPatientModalOpen(false);      
    };

    const handleToggleOptions = (index) => {
        setSelectedPatientIndex(index === selectedPatientIndex ? null : index);
    };

    const handleDeletePatient = (id, nombrePaciente) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este paciente?");
    
        if (confirmDelete) {
            fetch(`https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/paciente/delete/${id}`, {
                method: 'PUT' // Cambiar a PUT
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el paciente');
                }                
                setCustomHeader(`El paciente ${nombrePaciente} ha sido eliminado.`);
                setCustomText("Clic en cerrar para continuar");                
                setModalOpen(true);

                // Actualizar la lista de pacientes después de eliminar uno
                setPacientes(prevPacientes => prevPacientes.filter(paciente => paciente.id !== id));
                
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    };

    const handleViewPatient = (id) => {
        const paciente = pacientes.find(paciente => paciente.id === id);

        if(paciente.Estado === "ACTIVO")
        {
            
            fetch(`https://veternaria-gb-deploy-e24536ab4e1f.herokuapp.com/paciente/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener el paciente');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setSelectedPatientDetails(data); 
                setSelectedPatientModalOpen(true); 
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }else{            
            const pacientePendiente = pacientes.find(paciente=> paciente.id ===id); 
            console.log(pacientePendiente);
            setSelectedPatientDetails(pacientePendiente);
            setSelectedPatientModalOpen(true);
        }
    };
    

    const filteredPacientes = pacientes.filter(paciente =>
        paciente.nombre_paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paciente.nombre_propietario.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="appointmentComponent">
            <div className="containerT">
                <h2>Total de pacientes ({filteredPacientes.length})</h2>
                <div className="iconContainerPaciente">
                    <input 
                        type="text"
                        placeholder="Buscar por paciente o dueño"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="searchInput"
                    />
                    <SearchIcon className="searchIconPaciente" />                    
                </div>
            </div>
            <div className="containerB">
                {filteredPacientes.length > 0 ? (
                    <>
                        <h3>Pacientes</h3>
                        <table className="patientTable">
                            <thead>
                                <tr>
                                    <th className="tableHeader">Paciente</th>
                                    <th className="tableHeader">Dueño</th>
                                    <th className="tableHeader">Teléfono</th>
                                    <th className="tableHeader">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPacientes
                                    .slice(startIndex, endIndex)
                                    .map((paciente, index) => (
                                        <tr key={paciente.id}>
                                            <td className="tableData">{paciente.nombre_paciente}</td>
                                            <td className="tableData">{paciente.nombre_propietario}</td>
                                            <td className="tableData">{paciente.telefono}</td>
                                            <td className="tableData">
                                                {selectedPatientIndex === index ? (
                                                    <>
                                                        <div className="containerButtons">                                                
                                                            <button 
                                                                style={{ backgroundColor: '#ce796b', color: 'black', border: '0.2vw solid #ce796b', padding: '0.2vw 0.2vw', borderRadius: '0.5vw', cursor: 'pointer' }}
                                                                className="buttonPatients" 
                                                                onClick={() => handleDeletePatient(paciente.id, paciente.nombre_paciente)}>
                                                                <DeleteIcon className="iconPatient" />
                                                            </button>
                                                            <button 
                                                                    style={{ backgroundColor: '#d8f3dc', color: 'black', marginLeft: '0vw', border: '0.2vw solid #d8f3dc', padding: '0.2vw 0.2vw', borderRadius: '0.5vw', cursor: 'pointer' }} 
                                                                    className="buttonPatients" 
                                                                    onClick={() => handleViewPatient(paciente.id)}>
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
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <div className="pages">
                            <button 
                                style={{ backgroundColor: 'lightgray', color: 'black', border: '0.1vw solid lightgray', padding: '0.5vw 0.5vw', borderRadius: '0.5vw', cursor: 'pointer' }}
                                onClick={goToPreviousPage} disabled={currentPage === 1}>Anterior
                            </button>
                            <span>Página {currentPage}</span>
                            <button 
                                style={{ backgroundColor: 'lightgray', color: 'black', marginLeft: '1vw', border: '0.1vw solid lightgray', padding: '0.5vw 0.5vw', borderRadius: '0.5vw', cursor: 'pointer' }}
                                onClick={goToNextPage} disabled={endIndex >= filteredPacientes.length}>Siguiente
                            </button>
                        </div>
                        
                    </>
                ) : (
                    <h3>No se encontraron pacientes</h3>
                )}
                <ErrorModal isOpen={modalOpen} onClose={handleCloseModal} header={customHeader} text={customText} />
                <PacienteModal isOpen={selectedPatientModalOpen} onClose={handleCloseModal} pacienteDetails={selectedPatientDetails} />
            </div>
        </div>
    );
};

export default PatientComponent;
