CREATE DATABASE IF NOT EXISTS Veterinaria;

USE Veterinaria;

-- 1 Crear la tabla Propietario que puede tener varias mascotas
CREATE TABLE IF NOT EXISTS Propietario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,    
    Telefono VARCHAR(20)
);

-- 2 Crear la tabla Paciente que pertenecen a un propietario
CREATE TABLE IF NOT EXISTS Paciente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombrePaciente VARCHAR(128) NOT NULL,
    idPropietario INT,
    FOREIGN KEY (idPropietario) REFERENCES Propietario(id)
);

-- 3 Crear la tabla Servicio que almacena los diferentes servicios que tiene el consultorio
CREATE TABLE IF NOT EXISTS Servicio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL
);

-- 4 Horario general que maneja la clínica veterinaria -- "UPDATE Citas SET Estado = 'CANCELADA' WHERE idConsultorio = ? AND (Hora < ? OR Hora > ?) AND Estado != 'COMPLETADA'"
CREATE TABLE IF NOT EXISTS Horario (
	id INT AUTO_INCREMENT PRIMARY KEY,    
    nombreDias ENUM ('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'),    
    horarioInicio TIME,
    horarioFinal TIME,
    estado BOOLEAN
);

-- 5 Crear la tabla Consultorio
CREATE TABLE IF NOT EXISTS Consultorio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombreConsultorio VARCHAR(255),
    Descripcion TEXT
);

-- 6 Crear la tabla ConsultorioServicio para saber que servicios tiene ese consultorio (para actualizar usa delete from where idConsultorio y después el put)
CREATE TABLE IF NOT EXISTS ConsultorioServicio (
	id INT AUTO_INCREMENT PRIMARY KEY,
	idServicio INT,
	idConsultorio INT,    
    FOREIGN KEY (idConsultorio) REFERENCES Consultorio(id),    
    FOREIGN KEY (idServicio) REFERENCES Servicio(id)
);     

-- 7 Crear la tabla Expediente
CREATE TABLE IF NOT EXISTS Expediente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idPaciente INT,
    fechaNacimiento DATE,
    Peso FLOAT,
    Sexo CHAR(1),
    Descripcion TEXT,
    FOREIGN KEY (idPaciente) REFERENCES Paciente(id)
);

-- 8 Crear la tabla Usuario
CREATE TABLE IF NOT EXISTS Usuario (
	id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(255),
    nombreUsuario VARCHAR(128) NOT NULL,
    Clave VARCHAR(128) NOT NULL,    
    Acceso ENUM('Administrador', 'Veterinario', 'Recepcionista', 'INACTIVO')   
);

-- 9 Crear la tabla Citas
CREATE TABLE IF NOT EXISTS Citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idConsultorio INT,
    idPaciente INT,
    idUsuario INT,
    Fecha DATE,
    Hora TIME,
    Duracion INT,
    Estado ENUM('CANCELADA', 'PENDIENTE', 'FLEXIBLE', 'PROCESO', 'AGENDADA', 'COMPLETADA'),
    FOREIGN KEY (idConsultorio) REFERENCES Consultorio(id),
    FOREIGN KEY (idPaciente) REFERENCES Paciente(id),
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id)
);

-- 10 Crear la tabla ResumenCita
CREATE TABLE IF NOT EXISTS ResumenCita (
    idCita INT,
    id INT AUTO_INCREMENT PRIMARY KEY,
    idExpediente INT,
    idUsuario INT,
    Descripcion TEXT,
    Peso FLOAT,
    FOREIGN KEY (idCita) REFERENCES Citas(id),
    FOREIGN KEY (idExpediente) REFERENCES Expediente(id),
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id)
);

-- 11 Crear la tabla Medicamento
CREATE TABLE IF NOT EXISTS Medicamento (
    idResumenCita INT,
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombreMedicamento VARCHAR(255),
    Descripcion TEXT,
    FOREIGN KEY (idResumenCita) REFERENCES ResumenCita(id)
);

-- 12 Crear la tabla Vacunas
CREATE TABLE IF NOT EXISTS Vacunas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idResumenCita INT,
    nombreVacuna VARCHAR(255),
    dosis FLOAT,
    fechaVacuna DATE,
    fechaSiguienteVacuna DATE,
    FOREIGN KEY (idResumenCita) REFERENCES ResumenCita(id)
);

-- 11 Crear la tabla CitaServicio donde almacena que servicio tendrá la cita
CREATE TABLE IF NOT EXISTS CitaServicio (
    idServicio INT,
    idCita INT,
    FOREIGN KEY (idServicio) REFERENCES Servicio(id),
    FOREIGN KEY (idCita) REFERENCES Citas(id),
    PRIMARY KEY (idServicio, idCita)
);
