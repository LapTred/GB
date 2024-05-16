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
    Estado ENUM('ELIMINADO', 'ACTIVO', 'PENDIENTE'),
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
    horaInicio TIME,
    horaFinal TIME,
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

-- Inserciones en la tabla Propietario
INSERT INTO Propietario (Nombre, Telefono) VALUES ('María López', '987-654-3210');
INSERT INTO Propietario (Nombre, Telefono) VALUES ('Pedro Martinez', '555-555-5555');
INSERT INTO Propietario (Nombre, Telefono) VALUES ('Ana García', '123-456-7890');

-- Inserciones en la tabla Paciente
INSERT INTO Paciente (nombrePaciente, idPropietario, Estado) VALUES ('Max', 1, 'ACTIVO');
INSERT INTO Paciente (nombrePaciente, idPropietario, Estado) VALUES ('Luna', 2, 'ACTIVO');
INSERT INTO Paciente (nombrePaciente, idPropietario, Estado) VALUES ('Toby', 3, 'ACTIVO');

-- Inserciones en la tabla Servicio
INSERT INTO Servicio (Nombre) VALUES ('Vacunación');
INSERT INTO Servicio (Nombre) VALUES ('Consulta General');
INSERT INTO Servicio (Nombre) VALUES ('Cirugía');

-- Inserciones en la tabla Horario
INSERT INTO Horario (nombreDias, horarioInicio, horarioFinal, estado) VALUES ('Lunes', '08:00:00', '17:00:00', 1);
INSERT INTO Horario (nombreDias, horarioInicio, horarioFinal, estado) VALUES ('Martes', '08:00:00', '17:00:00', 1);
INSERT INTO Horario (nombreDias, horarioInicio, horarioFinal, estado) VALUES ('Miércoles', '08:00:00', '17:00:00', 1);
INSERT INTO Horario (nombreDias, horarioInicio, horarioFinal, estado) VALUES ('Jueves', '08:00:00', '17:00:00', 1);
INSERT INTO Horario (nombreDias, horarioInicio, horarioFinal, estado) VALUES ('Viernes', '08:00:00', '17:00:00', 1);
INSERT INTO Horario (nombreDias, horarioInicio, horarioFinal, estado) VALUES ('Sábado', '09:00:00', '14:00:00', 1);
INSERT INTO Horario (nombreDias, horarioInicio, horarioFinal, estado) VALUES ('Domingo', '09:00:00', '14:00:00', 0);

-- Inserciones en la tabla Consultorio
INSERT INTO Consultorio (nombreConsultorio, Descripcion) VALUES ('Consultorio 1', 'Consultorio para consultas generales');
INSERT INTO Consultorio (nombreConsultorio, Descripcion) VALUES ('Consultorio 2', 'Consultorio para cirugías');
INSERT INTO Consultorio (nombreConsultorio, Descripcion) VALUES ('Consultorio 3', 'Consultorio para vacunaciones');

-- Inserciones en la tabla ConsultorioServicio
INSERT INTO ConsultorioServicio (idServicio, idConsultorio) VALUES (1, 3); -- Vacunación en Consultorio 3
INSERT INTO ConsultorioServicio (idServicio, idConsultorio) VALUES (2, 1); -- Consulta General en Consultorio 1
INSERT INTO ConsultorioServicio (idServicio, idConsultorio) VALUES (3, 2); -- Cirugía en Consultorio 2

-- Inserciones en la tabla Expediente
INSERT INTO Expediente (idPaciente, fechaNacimiento, Peso, Sexo, Descripcion) VALUES (1, '2019-05-20', 5.6, 'M', 'Historial médico de Max');
INSERT INTO Expediente (idPaciente, fechaNacimiento, Peso, Sexo, Descripcion) VALUES (2, '2018-10-15', 4.2, 'F', 'Historial médico de Luna');
INSERT INTO Expediente (idPaciente, fechaNacimiento, Peso, Sexo, Descripcion) VALUES (3, '2020-02-10', 7.1, 'M', 'Historial médico de Toby');

-- Inserciones en la tabla Usuario
INSERT INTO Usuario (Nombre, nombreUsuario, Clave, Acceso) VALUES ('Admin', 'admin', 'admin123', 'Administrador');
INSERT INTO Usuario (Nombre, nombreUsuario, Clave, Acceso) VALUES ('Veterinario1', 'vet1', 'vet123', 'Veterinario');
INSERT INTO Usuario (Nombre, nombreUsuario, Clave, Acceso) VALUES ('Recepcionista1', 'rec1', 'rec123', 'Recepcionista');

-- Inserciones en la tabla Citas
INSERT INTO Citas (idConsultorio, idPaciente, idUsuario, Fecha, horaInicio, horaFinal, Duracion, Estado) VALUES (1, 1, 2, '2024-05-16', '09:00:00', '09:30:00', 30, 'AGENDADA');
INSERT INTO Citas (idConsultorio, idPaciente, idUsuario, Fecha, horaInicio, horaFinal, Duracion, Estado) VALUES (2, 2, 3, '2024-05-16', '10:30:00', '11:30:00', 60, 'COMPLETADA');
INSERT INTO Citas (idConsultorio, idPaciente, idUsuario, Fecha, horaInicio, horaFinal, Duracion, Estado) VALUES (3, 3, 3, '2024-05-16', '14:00:00', '14:45:00', 45, 'AGENDADA');

-- Inserciones en la tabla ResumenCita
INSERT INTO ResumenCita (idCita, idExpediente, idUsuario, Descripcion, Peso) VALUES (1, 1, 2, 'Consulta de rutina', 5.6);
INSERT INTO ResumenCita (idCita, idExpediente, idUsuario, Descripcion, Peso) VALUES (2, 2, 3, 'Cirugía de esterilización', 4.2);
INSERT INTO ResumenCita (idCita, idExpediente, idUsuario, Descripcion, Peso) VALUES (3, 3, 3, 'Vacunación contra la rabia', 7.1);

-- Inserciones en la tabla Medicamento
INSERT INTO Medicamento (idResumenCita, nombreMedicamento, Descripcion) VALUES (1, 'Amoxicilina', 'Antibiótico para tratar infecciones');
INSERT INTO Medicamento (idResumenCita, nombreMedicamento, Descripcion) VALUES (2, 'Meloxicam', 'Antiinflamatorio para aliviar el dolor');
INSERT INTO Medicamento (idResumenCita, nombreMedicamento, Descripcion) VALUES (3, 'Vacuna antirrábica', 'Prevención contra la rabia');

-- Inserciones en la tabla Vacunas
INSERT INTO Vacunas (idResumenCita, nombreVacuna, dosis, fechaVacuna, fechaSiguienteVacuna) VALUES (3, 'Rabia', 1.0, '2024-05-15', '2025-05-15');
INSERT INTO Vacunas (idResumenCita, nombreVacuna, dosis, fechaVacuna, fechaSiguienteVacuna) VALUES (2, 'Moquillo', 1.0, '2024-05-15', '2025-05-15');
INSERT INTO Vacunas (idResumenCita, nombreVacuna, dosis, fechaVacuna, fechaSiguienteVacuna) VALUES (1, 'Parvovirus', 1.0, '2024-05-15', '2025-05-15');

-- Insertar datos en la tabla CitaServicio
INSERT INTO CitaServicio (idServicio, idCita) VALUES 
(3, 1),
(2, 2),
(1, 3);

select * from Citas;
