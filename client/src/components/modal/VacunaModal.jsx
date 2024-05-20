import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './MedicamentoModal.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const VacunaModal = ({ isOpen, onClose, onAccept }) => {
  // Estilos para el modal
  const customStyles = {
    content: {
      width: '40%', // Ancho del modal
      height: '70%',
      margin: 'auto', // Centrar el modal horizontalmente
      overflow: 'auto', // Permitir desplazamiento si el contenido es demasiado grande
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      marginBottom: '1.67vw', // Espaciado inferior del encabezado
      fontSize: '1.67vw', // Tamaño de fuente del encabezado
    },
    text: {
      marginBottom: '1.67vw', // Espaciado inferior del texto
    },
    button: {
      backgroundColor: '#007bff', // Color de fondo del botón
      border: 'none', // Borde del botón
      color: 'white', // Color del texto del botón
      padding: '0.78vw 1.67vw', // Espaciado interno del botón
      textAlign: 'center', // Alineación del texto dentro del botón
      textDecoration: 'none', // Decoración de texto
      display: 'inline-block', // Mostrar como bloque en línea
      fontSize: '0.83vw', // Tamaño de fuente del botón
      margin: '1vw 2px', // Margen del botón
      cursor: 'pointer', // Cursor al pasar sobre el botón
      borderRadius: '0.62vw', // Borde redondeado del botón
    },
  };

  // Estado para los datos de la vacuna
  const [nombre, setNombre] = useState('');
  const [dosis, setDosis] = useState(1); // Inicializar como null en lugar de una cadena vacía
  const [fechasiguientevacuna, setFechasiguientevacuna] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // Limpiar los campos al abrir o cerrar el modal
  useEffect(() => {
    if (!isOpen) {
      setNombre('');
      setDosis(1);
      setFechasiguientevacuna('');
      setDescripcion('');
    }
  }, [isOpen]);

  // Función para manejar la aceptación de la vacuna
  const handleAccept = () => {
    const descripcionValue = descripcion.trim() === '' ? "Vacuna" : descripcion;
    const fechasiguienVacuna = formatDateSave(fechasiguientevacuna);
    const vacunaData = {
      nombre,
      dosis,
      fechasiguienVacuna,
      descripcion: descripcionValue,     
    };    
    onAccept(vacunaData);
  };

  const formatDateSave = (dateString) => {
    const year = dateString.getFullYear();
    const month = dateString.getMonth();
    const day = dateString.getDate();
    const hours = dateString.getHours();
    const minutes = dateString.getMinutes();
    const seconds = dateString.getSeconds();
      
      // Crear una nueva fecha en UTC
    const utcDate = new Date(Date.UTC(year, month, day, hours, minutes, seconds)); 
    return utcDate.toISOString(); 
  };  

  // Validación del formulario
  const isFormValid = () => {
    return (
      nombre.trim() !== '' &&
      dosis !== null && // Verifica si dosis está definido y no es null
      fechasiguientevacuna 
    );
  };


  
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles} contentLabel="Modal de Vacuna">
      <div className="ModalMedicamento">
        <h2 style={customStyles.header}>Ingresar Vacuna</h2>
        <div className="ModalMedicamentoDato">
          <div className="MedicamentoSeparado">
            <p>Nombre de la vacuna:</p>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>          
        </div>
        <div className="ModalMedicamentoDato">
          <div className="MedicamentoSeparado">
            <p>Dosis:</p>
            <select
              className='selectMedicamentos'
              value={dosis}
              onChange={(e) => setDosis(e.target.value)}
            >
              {[...Array(100)].map((_, index) => (
                <option key={index} value={(index + 1) / 10}>{(index + 1) / 10}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="ModalMedicamentoDato">
          <div className="MedicamentoSeparado">
            <p>Fecha siguiente vacuna:</p>
            <div>
              <DatePicker
                className='datePickerCitas'
                minDate={new Date()} // Permite seleccionar a partir de mañana
                dateFormat="yyyy-MM-dd"
                placeholderText="Seleccionar fecha"
                showYearDropdown                    
                scrollableYearDropdown
                maxDate={new Date(2030,11,30)}
                selected={fechasiguientevacuna}
                onChange={(date) => setFechasiguientevacuna(date)}
              />
            </div>            
          </div>
        </div>
        <div className="ModalMedicamentoDato">
          <div className="MedicamentoSeparado">
            <p>Descripción:</p>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Añade una descripcion (opcional)"
            />
          </div>
        </div>                 
        <div className="buttonsMedicamento">
          <button
            onClick={onClose}
            style={{ color: 'black', marginLeft: '0vw', border: '0.2vw solid #ccc', padding: '0.5vw 0.5vw', borderRadius: '0.5vw', cursor: 'pointer' }}
            className="newCitaButtonPatient"
          >
            Cancelar
          </button>
          <button
            style={{
              color: 'black',
              marginLeft: '1vw',
              border: '0.2vw solid transparent',
              padding: '0.5vw 0.5vw',
              borderRadius: '0.5vw',
              cursor: isFormValid() ? 'pointer' : 'not-allowed',
            }}
            onClick={handleAccept}
            disabled={!isFormValid()}
            className={`newCitaButtonFinish ${!isFormValid() ? 'disabledButton' : ''}`}
          >
            Aceptar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default VacunaModal;