const db = require('../models/db');

const Clinica= {};

Clinica.getAll = (req, res) => {
    db.query("SELECT * FROM Horario", (err, result) => {
        if (err) {
            console.error("Error al obtener el horario: ", err);
            res.status(500).json({ error: "Error al obtener el horario" });
            return;
        }
        res.json(result);
    });
}

Clinica.update = (req, res) => {
    const updatedClinicaData = req.body; // Datos modificados recibidos del cliente

    // Array para almacenar las promesas de actualización
    const updatePromises = [];

    // Array con los nombres de los días
    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    // Iterar sobre los datos modificados y crear promesas de actualización
    Object.entries(updatedClinicaData).forEach(([index, updatedValues]) => {
        const day = daysOfWeek[index]; // Obtener el nombre del día utilizando el índice

        // Crear una promesa de actualización
        const updatePromise = new Promise((resolve, reject) => {
            // Realizar la actualización en la base de datos
            db.query(
                "UPDATE Horario SET horarioInicio = ?, horarioFinal = ?, estado = ? WHERE nombreDias = ?",
                [updatedValues.horarioInicio, updatedValues.horarioFinal, updatedValues.estado, day],
                (err, result) => {
                    if (err) {
                        console.error('Error al actualizar la clínica:', err);
                        reject(err);
                    } else {
                        console.log('Clínica actualizada para el día', day);
                        resolve();
                    }
                }
            );
        });

        // Agregar la promesa al array de promesas de actualización
        updatePromises.push(updatePromise);
    });

    // Esperar a que todas las promesas se resuelvan y enviar la respuesta al cliente
    Promise.all(updatePromises)
        .then(() => {
            res.status(200).json({ message: 'Actualización de la clínica exitosa' });
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al actualizar la clínica' });
        });
};



module.exports = Clinica;