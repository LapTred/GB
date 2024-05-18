import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './MedicamentoModal.scss';

const MedicamentoModal = ({ isOpen, onClose, onAccept }) => {
  // Estilos para el modal
  const customStyles = {
    content: {
      width: '40%', // Ancho del modal
      height: '50%',
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

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // Limpiar los campos de nombre y descripción al cerrar el modal
  useEffect(() => {
    if (!isOpen) {
      setNombre('');
      setDescripcion('');
    }
  }, [isOpen]);

  const handleAccept = () => {
    const medicamentoData = {
      nombre,
      descripcion,
    };
    onAccept(medicamentoData);
  };

  const isFormValid = () => {
    return nombre.trim() !== '' && descripcion.trim() !== '';
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles} contentLabel="Modal de Medicamento">
      <div className="ModalMedicamento">
        <h2 style={customStyles.header}>Ingresar Medicamento</h2>
        <div className="ModalMedicamentoDato">
          <div className="MedicamentoSeparado">
            <p>Nombre del Medicamento:</p>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
        </div>
        <div className="ModalMedicamentoDato">
          <div className="MedicamentoSeparado">
            <p>Descripción:</p>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
        </div>
        <div className="buttonsMedicamento">
          <button
            style={{ color: 'black', marginLeft: '0vw', border: '0.2vw solid #ccc', padding: '0.5vw 0.5vw', borderRadius: '0.5vw', cursor: 'pointer' }}
            onClick={onClose}
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
            className={`newCitaButtonFinish ${!isFormValid() ? 'disabledButton' : ''}`}
            onClick={handleAccept}
            disabled={!isFormValid()}
          >
            Aceptar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MedicamentoModal;
