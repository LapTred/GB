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
  

module.exports = Cita;
