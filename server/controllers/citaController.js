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
            LEFT JOIN
        Consultorio Co ON C.idConsultorio = Co.id
    WHERE 
        C.Estado != 'CANCELADA';
    `, (err, result) => {
        if (err) {
            console.error("Error al obtener las citas: ", err);
            res.status(500).json({ error: "Error al obtener las citas" });
            return;
        }
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
                
                console.log("\n");
                console.log(horarioInicioFormat);
                console.log(horarioFinalFormat);


                // Consultar si existe alguna cita para el consultorio en la fecha, hora y duración especificadas
                try {
                    const result = await query(
                        "SELECT COUNT(*) AS citas_programadas FROM Citas WHERE idConsultorio = ? AND Fecha = ? AND horaInicio <= ? AND horaInicio >= ? OR idConsultorio = ? AND Fecha = ? AND horaFinal > ? AND horaFinal <= ? OR  idConsultorio = ? AND Fecha = ? AND horaFinal >= ? AND horaFinal >= ? AND horaInicio <= ? AND horaInicio <= ?",
                        [consultorioId, fechaFormato, horarioFinalFormat, horarioInicioFormat, consultorioId, fechaFormato, horarioInicioFormat, horarioFinalFormat, consultorioId, fechaFormato, horarioFinalFormat, horarioInicioFormat, horarioFinalFormat, horarioInicioFormat]
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
        const { idServicio, fecha, duracion, hora, idConsultorio, propietario, telefono, paciente, estado } = req.body;
        
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
                        insertarExpediente(pacienteId); // Llama a la función para insertar en Expediente
                    });
                } else {
                    pacienteId = results[0].id;
                    insertarCitaEnCitas(pacienteId);
                }
            });
        }

          // Función para insertar en la tabla Expediente
          function insertarExpediente(pacienteId) {
            db.query('INSERT INTO Expediente (idPaciente) VALUES (?)', [pacienteId], (error, results) => {
                if (error) {
                    console.error('Error al insertar en Expediente:', error);
                    // No se necesita return res.status(500).json aquí porque solo queremos continuar con el flujo
                }
            });
        }

        // Función para insertar la cita en la tabla Citas
        function insertarCitaEnCitas(pacienteId) {
            db.query('INSERT INTO Citas (idConsultorio, idPaciente, Fecha, horaInicio, horaFinal, Duracion, Estado) VALUES (?, ?, ?, ?, ?, ?, ?)', [idConsultorio, pacienteId, fechaFormato, hora, horarioFinalFormat, duracion, estado], (error, results) => {
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

Cita.getById = (req, res) => {
    const { id } = req.params;
    
    // Consulta para obtener los datos del paciente y la cita
    db.query(`
        SELECT 
            Citas.id AS cita_id,
            Citas.Fecha AS fecha_cita,
            Citas.horaInicio AS hora_inicio,
            Citas.horaFinal AS hora_final,
            Citas.Duracion AS duracion,
            Citas.Estado AS estado_cita,
            Propietario.Nombre AS nombre_propietario,
            Propietario.Telefono AS telefono_propietario,
            Paciente.nombrePaciente AS nombre_paciente,
            Paciente.Estado AS estado_paciente,
            Paciente.id AS id_Paciente,
            Servicio.Nombre AS nombre_servicio,
            Consultorio.nombreConsultorio AS nombre_consultorio,
            Expediente.fechaNacimiento AS fecha_nacimiento,
            Expediente.Peso AS peso_paciente,
            Expediente.Sexo AS sexo_paciente,
            Expediente.Descripcion AS descripcion_expediente,
            ResumenCita.Descripcion AS descripcion_resumen_cita,
            ResumenCita.Peso AS peso_resumen_cita
        FROM Citas
        LEFT JOIN Paciente ON Citas.idPaciente = Paciente.id        
        LEFT JOIN Propietario ON Paciente.idPropietario = Propietario.id
        LEFT JOIN Consultorio ON Citas.idConsultorio = Consultorio.id
        LEFT JOIN Expediente ON Citas.idPaciente = Expediente.idPaciente
        LEFT JOIN ResumenCita ON Citas.id = ResumenCita.idCita
        LEFT JOIN CitaServicio ON Citas.id = CitaServicio.idCita
        LEFT JOIN Servicio ON CitaServicio.idServicio = Servicio.id
        WHERE Citas.id = ?;
    `, [id], (err, pacienteResult) => {
        if (err) {
            console.error("Error al obtener los datos del paciente y cita: ", err);
            res.status(500).json({ error: "Error al obtener los datos del paciente y cita" });
            return;
        }

        // Consulta para obtener los datos de los medicamentos del paciente
        db.query(`
            SELECT 
                m.id AS idMedicamento,
                m.idResumenCita AS idResumenCita,
                m.nombreMedicamento AS NombreMedicamento,
                m.Descripcion AS DescripcionMedicamento
            FROM 
                Medicamento m
            LEFT JOIN 
                ResumenCita rc ON m.idResumenCita = rc.id
            WHERE 
                rc.idCita = ?;
        `, [id], (err, medicamentosResult) => {
            if (err) {
                console.error("Error al obtener los medicamentos del paciente: ", err);
                res.status(500).json({ error: "Error al obtener los medicamentos del paciente" });
                return;
            }

            // Consulta para obtener los datos de las vacunas del paciente
            db.query(`
                SELECT 
                    v.id AS idVacuna,
                    v.idResumenCita AS idResumenCitaVacuna,
                    v.nombreVacuna AS NombreVacuna,
                    v.dosis AS DosisVacuna,
                    v.fechaVacuna AS FechaVacuna,
                    v.fechaSiguienteVacuna AS FechaSiguienteVacuna
                FROM 
                    Vacunas v
                LEFT JOIN
                    ResumenCita rc ON v.idResumenCita = rc.id
                WHERE 
                    rc.idCita = ?;
            `, [id], (err, vacunasResult) => {
                if (err) {
                    console.error("Error al obtener las vacunas del paciente: ", err);
                    res.status(500).json({ error: "Error al obtener las vacunas del paciente" });
                    return;
                }

                // Construir el objeto de respuesta con todos los datos obtenidos
                const citaData = {
                    paciente: pacienteResult[0],
                    medicamentos: medicamentosResult,
                    vacunas: vacunasResult
                };
                console.log(id);
                console.log(citaData);
                // Enviar la respuesta JSON con todos los datos del paciente
                res.json(citaData);
            });
        });
        
    });
};

Cita.finalizar = (req, res) => {
    const { id } = req.params;
    try {
        // Obtiene los datos de la cita
        const { medicamentos, vacunas, peso, fechaNacimiento, sexo, descripcion, idCita } = req.body;
        
        // Convertir fecha a formato YYYY-MM-DD
        const fechaFormato = new Date(fechaNacimiento).toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];

        // Actualizar el expediente del paciente
        db.query('UPDATE Expediente SET Peso = ?, Sexo = ?, fechaNacimiento = ? WHERE idPaciente = ?', [peso, sexo, fechaFormato, id], (error, results, fields) => {
            if (error) {
                console.error('Error al actualizar el expediente:', error);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }            
            if (results.affectedRows > 0) {
                // Cambiar el estado del paciente a "ACTIVO"
                db.query('UPDATE Paciente SET Estado = "ACTIVO" WHERE id = ?', [id], (error) => {
                    if (error) {
                        console.error('Error al actualizar el estado del paciente:', error);
                        return res.status(500).json({ error: 'Error interno del servidor' });
                    }

                    // Cambiar el estado de la cita a "COMPLETADA"
                    db.query('UPDATE Citas SET Estado = "COMPLETADA" WHERE id = ?', [idCita], (error) => {
                        if (error) {
                            console.error('Error al actualizar el estado de la cita:', error);
                            return res.status(500).json({ error: 'Error interno del servidor' });
                        }

                        // Obtener el expediente actualizado
                        db.query('SELECT id FROM Expediente WHERE idPaciente = ?', [id], (error, results) => {
                            if (error) {
                                console.error('Error al obtener el expediente actualizado:', error);
                                return res.status(500).json({ error: 'Error interno del servidor' });
                            }

                            if (results.length > 0) {
                                const expedienteId = results[0].id;
                                console.log('Expediente actualizado, ID:', expedienteId);
                                CrearResumen(expedienteId);
                            } else {
                                return res.status(404).json({ error: 'Expediente no encontrado después de la actualización' });
                            }
                        });
                    });
                });
            } else {
                console.log('No se encontró el expediente para actualizar');
                return res.status(404).json({ error: 'Expediente no encontrado' });
            }
        });

        // Insertar el resumen de la cita
        function CrearResumen(idExpediente) {
            db.query('INSERT INTO ResumenCita (idCita, idExpediente, Peso, Descripcion) VALUES (?, ?, ?, ?)', [idCita, idExpediente, peso, descripcion], (error, results, fields) => {
                if (error) {
                    console.error('Error al insertar el resumen:', error);
                    return res.status(500).json({ error: 'Error interno del servidor' });
                }
                if (results.affectedRows > 0) {
                    // Obtener el id del Resumen
                    db.query('SELECT id FROM ResumenCita WHERE idExpediente = ?', [idExpediente], (error, results, fields) => {
                        if (error) {
                            console.error('Error al obtener el resumen:', error);
                            return res.status(500).json({ error: 'Error interno del servidor' });
                        }            
                        if (results.length > 0) {
                            const resumenId = results[0].id;
                            console.log('Resumen creado, ID:', resumenId);
                            InsertarMedicamentos(resumenId);
                            InsertarVacunas(resumenId);
                            return res.status(200).json({ message: 'Resumen encontrado exitosamente', id: idExpediente });
                        } else {
                            return res.status(404).json({ error: 'Resumen no encontrado' });
                        }
                    });
                } else {
                    console.log('No se pudo crear el resumen de la cita');
                    return res.status(404).json({ error: 'Resumen no creado' });
                }
            });
        }

        // Función para insertar los medicamentos
        function InsertarMedicamentos(resumenId) {
            medicamentos.forEach(medicamento => {
                db.query('INSERT INTO Medicamento (idResumenCita, nombreMedicamento, Descripcion) VALUES (?, ?, ?)', [resumenId, medicamento.nombre, medicamento.descripcion], (error, results) => {
                    if (error) {
                        console.error('Error al insertar en Medicamentos:', error);
                    }
                });
            });
        }

        // Función para insertar las vacunas
        function InsertarVacunas(resumenId) {
            vacunas.forEach(vacuna => {
                // Convertir fecha a formato YYYY-MM-DD
                const fechaVacuna = new Date(vacuna.fechasiguienVacuna).toISOString().split('T')[0];
                db.query('INSERT INTO Vacunas (idResumenCita, nombreVacuna, Dosis, fechaVacuna, fechaSiguienteVacuna) VALUES (?, ?, ?, ?, ?)', [resumenId, vacuna.nombre, vacuna.dosis, today, fechaVacuna], (error, results) => {
                    if (error) {
                        console.error('Error al insertar en Vacunas:', error);
                    }
                });
            });
        }       
    } catch (error) {
        // Maneja el error
        console.error('Error al finalizar la cita:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


//Recibo la id con const { id } = req.params;
//Update Expediente Where idPaciente sea igual al idPaciente de Citas, aquí poner la fecha de nacimiento, el sexo, el peso y actualizar estado a ACTIVO
//Insertar en resumen cita con el id del expediente creado y el de la cita, el peso y la descripción
//Insertar en vacunas y medicamentos, el nombre y descripcion, fecha de siguiente vacuna en base a el resumen cita obtenido
//Cambiar estado de la cita a "COMPLETADO" 

module.exports = Cita;
