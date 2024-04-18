const db = require('../models/db');

const Consultorio= {};

Consultorio.getAll = (req, res) => {
    db.query("SELECT * FROM Consultorio", (err, result) => {
        if (err) {
            console.error("Error al obtener los consultorios: ", err);
            res.status(500).json({ error: "Error al obtener los consultorios" });
            return;
        }
        console.log("Consultorios encontrados: ", result);
        res.json(result);
    });
};

module.exports = Consultorio;