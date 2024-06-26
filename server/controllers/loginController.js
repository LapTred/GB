const connection = require('../models/db');
const jwt = require('jsonwebtoken');

module.exports.login = (req, res) => {
    const { username, password } = req.body;
    const consult = 'SELECT * FROM Usuario WHERE nombreUsuario = ? AND Clave = ?';

    try {
        connection.query(consult, [username, password], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error', details: err.message });
                return;
            }

            if (result && result.length > 0) {
                console.log(result[0]);
                // Supongamos que la columna de nivel de acceso en tu tabla se llama 'Acceso'
                const userAccess = result[0].Acceso;
                const userNombre = result[0].Nombre;

                // Incluye el nivel de acceso del usuario en el token
                const token = jwt.sign({ username, Acceso: userAccess, Nombre: userNombre}, "Stack", {
                    expiresIn: '3m'  // Establece un tiempo de expiración para el token
                });

                // Envía el token y el nivel de acceso al cliente
                res.json({ token, Acceso: userAccess, Nombre: userNombre});
            } else {
                console.log('wrong user');
                res.status(401).json({ message: 'Wrong username or password' });
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error', details: e.message });
    }
};
