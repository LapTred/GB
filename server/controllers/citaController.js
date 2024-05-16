const db = require('../models/db');

const Cita = {};

Cita.getAll = (req, res) => {
    db.query(`
        SELECT 
            P.id AS id_paciente,
            P.nombrePaciente AS nombre_paciente,
            Pr.id AS id_dueño,
            Pr.Nombre AS nombre_dueño,
            Co.id AS id_consultorio,
            Co.nombreConsultorio AS nombre_consultorio,
            C.id AS id_cita,
            C.Estado AS estado,
            C.Fecha AS fecha,
            C.horaInicio AS hora
        FROM
            Citas C
                JOIN
            Paciente P ON C.idPaciente = P.id
                JOIN
            Propietario Pr ON P.idPropietario = Pr.id
                JOIN
            Consultorio Co ON C.idConsultorio = Co.id
        WHERE C.Estado != 'CANCELADA';
    `, (err, result) => {
        if (err) {
            console.error("Error al obtener las citas: ", err);
            res.status(500).json({ error: "Error al obtener las citas" });
            return;
        }
        console.log(result);
        res.json(result);
    });
};

const moment = require('moment');
const util = require('util');

Cita.disponibilidad = async (req, res) => {
    const { fecha, horarioInicio, horarioFinal, duracion, consultorios } = req.query;

    // Convertir fecha a formato YYYY-MM-DD
    const fechaFormato = new Date(fecha).toISOString().split('T')[0];
    
    // Convertir horarioInicio y horarioFinal a objetos moment
    const horarioInicioTime = moment(`1970-01-01T${horarioInicio}`);
    const horarioFinalTime = moment(`1970-01-01T${horarioFinal}`);

    try {
        const disponibilidadPorConsultorio = [];

        // Promisify db.query
        const query = util.promisify(db.query).bind(db);
        
        // Iterar sobre cada consultorio
        for (const consultorio of consultorios.split(',')) {
            const consultorioId = parseInt(consultorio);

            // Bucle para verificar la disponibilidad de cada hora en el rango de tiempo
            for (let hora = horarioInicioTime.clone(); hora.isSameOrBefore(horarioFinalTime.clone().subtract(duracion, 'minutes')); hora.add(15, 'minutes')) {
                let disponible = true;

                // Formatear la cadena del horario
                const horarioInicioFormat = hora.format('HH:mm:ss');
                const horarioFinal = hora.clone().add(duracion, 'minutes');
                const horarioFinalFormat = horarioFinal.format('HH:mm:ss');

                // Consultar si existe alguna cita para el consultorio en la fecha, hora y duración especificadas
                try {
                    const result = await query(
                        "SELECT COUNT(*) AS citas_programadas FROM Citas WHERE idConsultorio = ? AND Fecha = ? AND horaInicio <= ? AND horaFinal >= ?",
                        [consultorioId, fechaFormato, horarioInicioFormat, horarioFinalFormat]
                    );

                    if (Array.isArray(result) && result.length > 0 && result[0].citas_programadas > 0) {
                        disponible = false;
                    }

                    // Guardar la disponibilidad para el consultorio actual y la hora actual
                    disponibilidadPorConsultorio.push([consultorioId, horarioInicioFormat, disponible]);
                } catch (err) {
                    console.error("Error al obtener las citas: ", err);
                    res.status(500).json({ error: "Error al obtener las citas" });
                    return;
                }
            }
        }

        console.log("resultado final");
        console.log(disponibilidadPorConsultorio);
        res.json(disponibilidadPorConsultorio);
    } catch (error) {
        console.error('Error al verificar disponibilidad de citas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

Cita.delete = (req, res) => {
    const { id } = req.params;
    db.query(
        "UPDATE Citas SET Estado = 'CANCELADA' WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                console.error("Error al eliminar la cita: ", err);
                res.status(500).json({ error: "Error al eliminar la cita" });
                return;
            }
            console.log("Estado de cita cambiado a CANCELADA: ", result);
            res.json(result);
        }
    );
};

// Método para crear una nueva cita

Cita.create = (req, res) => {
    try {
        // Obtiene los datos del formulario
        const { idServicio, fecha, duracion, hora, idConsultorio, propietario, telefono, paciente } = req.body;
        
        // Convertir fecha a formato YYYY-MM-DD
        const fechaFormato = new Date(fecha).toISOString().split('T')[0];
        

        
        const horarioFinalTime = moment(`1970-01-01T${hora}`);

        const horarioFinal = horarioFinalTime.clone().add(duracion, 'minutes');
        const horarioFinalFormat = horarioFinal.format('HH:mm:ss');

        // Verifica si el propietario existe en la base de datos
        let propietarioId;
        db.query('SELECT id FROM Propietario WHERE Nombre = ?', [propietario], (error, results, fields) => {
            if (error) {
                console.error('Error al verificar el propietario:', error);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            // Si no existe, crea un nuevo propietario
            if (results.length === 0) {
                db.query('INSERT INTO Propietario (Nombre, Telefono) VALUES (?, ?)', [propietario, telefono], (error, results, fields) => {
                    if (error) {
                        console.error('Error al insertar el propietario:', error);
                        return res.status(500).json({ error: 'Error interno del servidor' });
                    }
                    propietarioId = results.insertId;
                    insertarCita(propietarioId);
                });
            } else {
                propietarioId = results[0].id;
                insertarCita(propietarioId);
            }
        });

        // Función para insertar la cita una vez que se ha verificado el propietario
        function insertarCita(propietarioId) {
            // Verifica si el paciente existe para el propietario especificado
            let pacienteId;
            db.query('SELECT id FROM Paciente WHERE nombrePaciente = ? AND idPropietario = ?', [paciente, propietarioId], (error, results, fields) => {
                if (error) {
                    console.error('Error al verificar el paciente:', error);
                    return res.status(500).json({ error: 'Error interno del servidor' });
                }

                // Si no existe, crea un nuevo paciente
                if (results.length === 0) {
                    db.query('INSERT INTO Paciente (nombrePaciente, idPropietario, Estado) VALUES (?, ?, "PENDIENTE")', [paciente, propietarioId], (error, results, fields) => {
                        if (error) {
                            console.error('Error al insertar el paciente:', error);
                            return res.status(500).json({ error: 'Error interno del servidor' });
                        }
                        pacienteId = results.insertId;
                        insertarCitaEnCitas(pacienteId);
                    });
                } else {
                    pacienteId = results[0].id;
                    insertarCitaEnCitas(pacienteId);
                }
            });
        }

        // Función para insertar la cita en la tabla Citas
        function insertarCitaEnCitas(pacienteId) {
            db.query('INSERT INTO Citas (idConsultorio, idPaciente, Fecha, horaInicio, horaFinal, Duracion, Estado) VALUES (?, ?, ?, ?, ?, ?, "AGENDADA")', [idConsultorio, pacienteId, fechaFormato, hora, horarioFinalFormat, duracion], (error, results) => {
                if (error) {
                    console.error('Error al insertar la cita:', error);
                    return res.status(500).json({ error: 'Error interno del servidor' });
                }
                const idCita = results.insertId; // Obtiene el ID de la cita recién creada
                insertarCitaServicio(idServicio, idCita); // Llama a la función para insertar en CitaServicio
            });
        }

        // Función para insertar en la tabla CitaServicio
        function insertarCitaServicio(idServicio, idCita) {
            db.query('INSERT INTO CitaServicio (idServicio, idCita) VALUES (?, ?)', [idServicio, idCita], (error) => {
                if (error) {
                    console.error('Error al insertar en CitaServicio:', error);
                    return res.status(500).json({ error: 'Error interno del servidor' });
                }
                res.status(200).json({ message: 'Cita y CitaServicio creadas exitosamente' });
            });
        }
    } catch (error) {
        // Maneja el error
        console.error('Error al crear la cita:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = Cita;
