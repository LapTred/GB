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
            C.Hora AS hora
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
}

module.exports = Cita;
