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

Paciente.propietarios = (req, res) => {
    db.query("Select * From Propietario", (err, result) => {
        if (err) {
            console.error("Error al obtener los propietarios: ", err);
            res.status(500).json({ error: "Error al obtener los propietarios" });
            return;
        }
        console.log(result);
        res.json(result);
    });
}

Paciente.pacientesById = (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM Paciente WHERE idPropietario = ?", [id], (err, result) => {
        if (err) {
            console.error("Error al obtener los pacientes del propietario:", err);
            res.status(500).json({ error: "Error al obtener los pacientes del propietario" });
            return;
        }
        res.json(result);
    });
};

module.exports = Paciente;
