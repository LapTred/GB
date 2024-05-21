import React from 'react';
import Modal from 'react-modal';

const ErrorModal = ({ isOpen, onClose, header, text }) => {
  // Estilos para el modal
  const customStyles = {
    content: {
      width: '40%', // Ancho del modal
      height: '40%', // Alto del modal
      margin: 'auto', // Centrar el modal horizontalmente
      overflow: 'auto', // Permitir desplazamiento si el contenido es demasiado grande
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',      
      justifyContent: 'center',     
    },
    header: {
      marginBottom: '20px', // Espaciado inferior del encabezado
    },
    text: {
      marginBottom: '20px', // Espaciado inferior del texto
    },
    button: {
      backgroundColor: '#007bff', // Color de fondo del botón
      border: 'none', // Borde del botón
      color: 'white', // Color del texto del botón
      padding: '15px 32px', // Espaciado interno del botón
      textAlign: 'center', // Alineación del texto dentro del botón
      textDecoration: 'none', // Decoración de texto
      display: 'inline-block', // Mostrar como bloque en línea
      fontSize: '16px', // Tamaño de fuente del botón
      margin: '4px 2px', // Margen del botón
      cursor: 'pointer', // Cursor al pasar sobre el botón
      borderRadius: '12px', // Borde redondeado del botón
    },
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles} contentLabel="Modal de Error">
    <h2 style={customStyles.header}>{header}</h2>
    <p style={customStyles.text}>{text}</p>
    <button style={customStyles.button} onClick={onClose}>Cerrar</button>
    </Modal>
  );
};

export default ErrorModal;
