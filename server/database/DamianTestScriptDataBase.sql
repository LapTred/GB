CREATE DATABASE IF NOT EXISTS Veterinaria;

USE Veterinaria;

-- 1 Crear la tabla Propietario
CREATE TABLE IF NOT EXISTS Propietario (
    idPropietario INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL
);

-- 2 Crear la tabla Paciente
CREATE TABLE IF NOT EXISTS Paciente (
    idPaciente INT AUTO_INCREMENT PRIMARY KEY,
    nombrePaciente VARCHAR(128) NOT NULL,
    idPropietario INT,
    Telefono VARCHAR(20),
    FOREIGN KEY (idPropietario) REFERENCES Propietario(idPropietario)
);

-- 3 Crear la tabla Expediente
CREATE TABLE IF NOT EXISTS Expediente (
    idPaciente INT,
    idExpediente INT AUTO_INCREMENT PRIMARY KEY,
    fechaNacimiento DATE,
    Peso FLOAT,
    Sexo CHAR(1),
    Descripcion TEXT,
    FOREIGN KEY (idPaciente) REFERENCES Paciente(idPaciente)
);

-- 4 Crear la tabla Consultorio
CREATE TABLE IF NOT EXISTS Consultorio (
    idConsultorio INT AUTO_INCREMENT PRIMARY KEY,
    nombreConsultorio VARCHAR(255),
    Descripcion TEXT,
    horarioInicio DATE,
    horarioFinal DATE
);

-- 5 Crear la tabla Usuario
CREATE TABLE IF NOT EXISTS Usuario (
	idUsuario INT AUTO_INCREMENT UNIQUE,
    Nombre VARCHAR(255),
    nombreUsuario VARCHAR(128) NOT NULL,
    Clave VARCHAR(128) NOT NULL,    
    PRIMARY KEY (nombreUsuario, Clave),
    Acceso ENUM('Administrador', 'Veterinario', 'Recepcionista')   
);

-- 6 Crear la tabla Servicio
CREATE TABLE IF NOT EXISTS Servicio (
    idServicio INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Duracion INT NOT NULL
);

-- 7 Crear la tabla Citas
CREATE TABLE IF NOT EXISTS Citas (
    idCita INT AUTO_INCREMENT PRIMARY KEY,
    idConsultorio INT,
    idPaciente INT,
    idUsuario INT,
    fechaInicio DATETIME,
    Duracion INT,
    Estado ENUM('CANCELADA', 'PENDIENTE', 'FLEXIBLE', 'PROCESO', 'AGENDADA'),
    FOREIGN KEY (idConsultorio) REFERENCES Consultorio(idConsultorio),
    FOREIGN KEY (idPaciente) REFERENCES Paciente(idPaciente),
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);

-- 8 Crear la tabla ResumenCita
CREATE TABLE IF NOT EXISTS ResumenCita (
    idCita INT,
    IdresumenCita INT AUTO_INCREMENT PRIMARY KEY,
    idExpediente INT,
    idUsuario INT,
    Descripcion TEXT,
    Peso FLOAT,
    FOREIGN KEY (idCita) REFERENCES Citas(idCita),
    FOREIGN KEY (idExpediente) REFERENCES Expediente(idExpediente),
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);

-- 9 Crear la tabla Medicamento
CREATE TABLE IF NOT EXISTS Medicamento (
    idresumenCita INT,
    idMedicamento INT AUTO_INCREMENT PRIMARY KEY,
    nombreMedicamento VARCHAR(255),
    Descripcion TEXT,
    FOREIGN KEY (idresumenCita) REFERENCES ResumenCita(idresumenCita)
);

-- 10 Crear la tabla Vacunas
CREATE TABLE IF NOT EXISTS Vacunas (
    idresumenCita INT,
    idVacuna INT AUTO_INCREMENT PRIMARY KEY,
    nombreVacuna VARCHAR(255),
    fechaVacuna DATE,
    fechasiguienteVacuna DATE,
    FOREIGN KEY (idresumenCita) REFERENCES ResumenCita(idresumenCita)
);

-- 11 Crear la tabla CitaServicio
CREATE TABLE IF NOT EXISTS CitaServicio (
    idServicio INT,
    idCita INT,
    FOREIGN KEY (idServicio) REFERENCES Servicio(idServicio),
    FOREIGN KEY (idCita) REFERENCES Citas(idCita),
    PRIMARY KEY (idServicio, idCita)
);
