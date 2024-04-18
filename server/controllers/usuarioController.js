const db = require('../models/db');

const Usuario= {};

Usuario.getAll = (req, res) => {
    db.query("SELECT * FROM Usuario", (err, result) => {
        if (err) {
            console.error("Error al obtener los usuarios: ", err);
            res.status(500).json({ error: "Error al obtener los usuarios" });
            return;
        }
        console.log("Usuarios encontrados: ", result);
        res.json(result);
    });
};

module.exports = Usuario;