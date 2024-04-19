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

Consultorio.delete = (req, res) => {
    const id = req.params.id;
    
    // Actualizar las citas completadas para establecer idConsultorio como NULL
    db.query("UPDATE Citas SET idConsultorio = NULL WHERE idConsultorio = ? AND Estado = 'COMPLETADA'", [id], (err, result) => {
        if (err) {
            console.error("Error al actualizar las citas completadas: ", err);
            res.status(500).json({ error: "Error al actualizar las citas completadas" });
            return;
        }

        // Eliminar las citas asociadas a este consultorio que no estén completadas
        db.query("DELETE FROM Citas WHERE idConsultorio = ? AND Estado != 'COMPLETADA'", [id], (err, result) => {
            if (err) {
                console.error("Error al eliminar las citas asociadas al consultorio: ", err);
                res.status(500).json({ error: "Error al eliminar las citas asociadas al consultorio" });
                return;
            }

            // Una vez eliminadas las citas, eliminar el consultorio
            db.query("DELETE FROM Consultorio WHERE id = ?", [id], (err, result) => {
                if (err) {
                    console.error("Error al eliminar el consultorio: ", err);
                    res.status(500).json({ error: "Error al eliminar el consultorio" });
                    return;
                }
                console.log("Consultorio eliminado correctamente.");
                res.json({ message: "Consultorio eliminado correctamente." });
            });
        });
    });
};

Consultorio.updateById = (req, res) => {
    const { idConsultorio } = req.params;
    const { nombreConsultorio, Descripcion, horarioInicio, horarioFinal } = req.body;
    db.query(
        "UPDATE Consultorio SET nombreConsultorio = ?, Descripcion = ?, horarioInicio = ?, horarioFinal = ? WHERE id = ?",
        [nombreConsultorio, Descripcion, horarioInicio, horarioFinal, idConsultorio],
        (err, result) => {
            if (err) {
                console.error("Error al actualizar el consultorio: ", err);
                res.status(500).json({ error: "Error al actualizar el consultorio" });
                return;
            }
            console.log("Consultorio actualizado: ", result);
            res.json(result);
        }
    );
};

module.exports = Consultorio;