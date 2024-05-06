const db = require('../models/db');

const Paciente = {};

Paciente.getAll = (req, res) => {
    db.query(`
        SELECT 
            p.id AS id,
            p.nombrePaciente AS nombre_paciente,
            pro.Nombre AS nombre_propietario,
            pro.Telefono AS telefono
        FROM 
            Paciente p
        JOIN 
            Propietario pro ON p.idPropietario = pro.id;
    `, (err, result) => {
        if (err) {
            console.error("Error al obtener los pacientes: ", err);
            res.status(500).json({ error: "Error al obtener los pacientes" });
            return;
        }
        console.log(result);
        res.json(result);
    });
}

module.exports = Paciente;
