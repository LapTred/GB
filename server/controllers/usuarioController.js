const db = require('../models/db');

const Usuario= {};

// Método para obtener todos los usuarios cuyo acceso no sea 'Administrador'
Usuario.getAll = (req, res) => {
    db.query("SELECT * FROM Usuario WHERE Acceso != 'Administrador' AND Acceso !='INACTIVO'", (err, result) => {
        if (err) {
            console.error("Error al obtener los usuarios: ", err);
            res.status(500).json({ error: "Error al obtener los usuarios" });
            return;
        }
        console.log("Usuarios encontrados: ", result);
        res.json(result);
    });
};

// Método para actualizar un usuario por su id
Usuario.updateById = (req, res) => {
    const { idUsuario } = req.params;
    const { Nombre, nombreUsuario, Clave, Acceso } = req.body;
    db.query(
        "UPDATE Usuario SET Nombre = ?, nombreUsuario = ?, Clave = ?, Acceso = ? WHERE id = ?",
        [Nombre, nombreUsuario, Clave, Acceso, idUsuario],
        (err, result) => {
            if (err) {
                console.error("Error al actualizar el usuario: ", err);
                res.status(500).json({ error: "Error al actualizar el usuario" });
                return;
            }
            console.log("Usuario actualizado: ", result);
            res.json(result);
        }
    );
};

// Método para cambiar el acceso de un usuario a 'INACTIVO' por su ID
Usuario.delete = (req, res) => {
    const { id } = req.params;
    db.query(
        "UPDATE Usuario SET Acceso = 'INACTIVO' WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                console.error("Error al cambiar el acceso del usuario: ", err);
                res.status(500).json({ error: "Error al cambiar el acceso del usuario" });
                return;
            }
            console.log("Acceso del usuario cambiado a INACTIVO: ", result);
            res.json(result);
        }
    );
};

// Método para crear un nuevo usuario
Usuario.create = (req, res) => {
    const { Nombre, nombreUsuario, Clave, Acceso } = req.body;
    db.query(
        "INSERT INTO Usuario (Nombre, nombreUsuario, Clave, Acceso) VALUES (?, ?, ?, ?)",
        [Nombre, nombreUsuario, Clave, Acceso],
        (err, result) => {
            if (err) {
                console.error("Error al crear el usuario: ", err);
                res.status(500).json({ error: "Error al crear el usuario" });
                return;
            }
            console.log("Usuario creado: ", result);
            res.json(result);
        }
    );
};

// Método para verificar si un nombre de usuario ya existe
Usuario.checkUsername = (req, res) => {
    const { nombreUsuario } = req.params;
    db.query(
        "SELECT COUNT(*) AS count FROM Usuario WHERE nombreUsuario = ?",
        [nombreUsuario],
        (err, result) => {
            if (err) {
                console.error("Error al verificar el nombre de usuario: ", err);
                res.status(500).json({ error: "Error al verificar el nombre de usuario" });
                return;
            }
            const exists = result[0].count > 0;
            res.json({ exists });
        }
    );
};

module.exports = Usuario;