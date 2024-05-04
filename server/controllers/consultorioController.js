const db = require('../models/db');

const Consultorio= {};

//Obtener consultorios
Consultorio.getAll = (req, res) => {
    db.query("SELECT * FROM Consultorio", (err, result) => {
        if (err) {
            console.error("Error al obtener los consultorios: ", err);
            res.status(500).json({ error: "Error al obtener los consultorios" });
            return;
        }
        res.json(result);
    });
};

//Verificar nombre
Consultorio.checkRoomname = (req, res) => {
    const { nombreConsultorio, idConsultorio } = req.params;
    db.query("SELECT COUNT(*) AS count FROM Consultorio WHERE nombreConsultorio = ? AND id != ?", [nombreConsultorio, idConsultorio], (err, result) => {
        if (err) {
            console.error("Error al verificar el nombre del consultorio:", err);
            res.status(500).json({ error: "Error al verificar el nombre del consultorio" });
            return;
        }
        res.json({ exists: result[0].count > 0 });
    });
};

//Borrar Consultorios
Consultorio.delete = (req, res) => {
    const id = req.params.id;
    
    // Eliminar filas de ConsultorioServicio asociadas al consultorio
    db.query("DELETE FROM ConsultorioServicio WHERE idConsultorio = ?", [id], (err, result) => {
        if (err) {
            console.error("Error al eliminar las filas de ConsultorioServicio: ", err);
            res.status(500).json({ error: "Error al eliminar las filas de ConsultorioServicio" });
            return;
        }

        // Actualizar las citas completadas para establecer idConsultorio como NULL
        db.query("UPDATE Citas SET idConsultorio = NULL WHERE idConsultorio = ? AND Estado = 'COMPLETADA'", [id], (err, result) => {
            if (err) {
                console.error("Error al actualizar las citas completadas: ", err);
                res.status(500).json({ error: "Error al actualizar las citas completadas" });
                return;
            }

            // Eliminar las citas asociadas a este consultorio que no estén completadas
            db.query("UPDATE Citas SET Estado = 'CANCELADA', idConsultorio = NULL WHERE idConsultorio = ? AND Estado != 'COMPLETADA'", [id], (err, result) => {
                if (err) {
                    console.error("Error al eliminar las citas asociadas al consultorio: ", err);
                    res.status(500).json({ error: "Error al eliminar las citas asociadas al consultorio" });
                    return;
                }

                // Una vez eliminadas las citas y las filas de ConsultorioServicio, eliminar el consultorio
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
    });
};


//Actualizar consultorio
Consultorio.updateById = (req, res) => {
    const { idConsultorio } = req.params;
    const { nombreConsultorio, Descripcion, servicios } = req.body;

    // Iniciar una transacción
    db.beginTransaction((err) => {
        if (err) {
            console.error("Error al iniciar la transacción: ", err);
            res.status(500).json({ error: "Error al actualizar el consultorio" });
            return;
        }

        // Ejecutar la consulta SQL para actualizar el consultorio
        db.query(
            "UPDATE Consultorio SET nombreConsultorio = ?, Descripcion = ? WHERE id = ?",
            [nombreConsultorio, Descripcion, idConsultorio],
            (err, result) => {
                if (err) {
                    console.error("Error al actualizar el consultorio: ", err);
                    // Revertir la transacción en caso de error
                    db.rollback(() => {
                        res.status(500).json({ error: "Error al actualizar el consultorio" });
                    });
                    return;
                }

                // Ejecutar la consulta SQL para eliminar los registros de ConsultorioServicio
                db.query(
                    "DELETE FROM ConsultorioServicio WHERE idConsultorio = ?",
                    [idConsultorio],
                    (err) => {
                        if (err) {
                            console.error("Error al eliminar los servicios del consultorio: ", err);
                            // Revertir la transacción en caso de error
                            db.rollback(() => {
                                res.status(500).json({ error: "Error al actualizar el consultorio" });
                            });
                            return;
                        }

                        // Ejecutar la consulta SQL para insertar nuevos registros en ConsultorioServicio
                        const insertQueries = servicios.map((servicioId) => (
                            db.query(
                                "INSERT INTO ConsultorioServicio (idServicio, idConsultorio) VALUES (?, ?)",
                                [servicioId, idConsultorio]
                            )
                        ));

                        // Ejecutar todas las consultas de inserción en paralelo
                        Promise.all(insertQueries)
                            .then(() => {
                                // Confirmar la transacción si todo ha ido bien
                                db.commit((err) => {
                                    if (err) {
                                        console.error("Error al confirmar la transacción: ", err);
                                        res.status(500).json({ error: "Error al actualizar el consultorio" });
                                        return;
                                    }
                                    // Si todo ha ido bien, responder con éxito
                                    res.json({ message: "Consultorio actualizado exitosamente" });
                                });
                            })
                            .catch((err) => {
                                console.error("Error al insertar los nuevos servicios: ", err);
                                // Revertir la transacción en caso de error en las inserciones
                                db.rollback(() => {
                                    res.status(500).json({ error: "Error al actualizar el consultorio" });
                                });
                            });
                    }
                );
            }
        );
    });
};

Consultorio.create = (req, res) => {
    const { nombreConsultorio, Descripcion, servicios } = req.body;

    // Iniciar la transacción
    db.beginTransaction((err) => {
        if (err) {
            console.error("Error al iniciar la transacción: ", err);
            res.status(500).json({ error: "Error al iniciar la transacción" });
            return;
        }

        // Insertar el consultorio
        db.query(
            "INSERT INTO Consultorio (nombreConsultorio, Descripcion) VALUES (?, ?)",
            [nombreConsultorio, Descripcion],
            (err, result) => {
                if (err) {
                    console.error("Error al crear el consultorio: ", err);
                    db.rollback(() => {
                        res.status(500).json({ error: "Error al crear el consultorio" });
                    });
                    return;
                }

                console.log("Consultorio creado: ", result);

                const idConsultorio = result.insertId; // Obtenemos el ID del consultorio recién creado
                
                // Convertir servicios a un arreglo de valores de servicio
                const servicioValues = servicios.map(servicio => servicio.value);

                // Insertar servicios en ConsultorioServicio
                const sql = "INSERT INTO ConsultorioServicio (idServicio, idConsultorio) VALUES ?";
                const values = servicioValues.map(servicioId => [servicioId, idConsultorio]);

                db.query(sql, [values], (err, result) => {
                    if (err) {
                        console.error("Error al agregar servicios al consultorio: ", err);
                        db.rollback(() => {
                            res.status(500).json({ error: "Error al agregar servicios al consultorio" });
                        });
                        return;
                    }

                    console.log("Servicios agregados al consultorio: ", result);

                    // Hacer commit si todo se realizó correctamente
                    db.commit((err) => {
                        if (err) {
                            console.error("Error al hacer commit de la transacción: ", err);
                            db.rollback(() => {
                                res.status(500).json({ error: "Error al hacer commit de la transacción" });
                            });
                            return;
                        }

                        console.log("Transacción completada correctamente");
                        res.json({ message: "Consultorio creado correctamente" });
                    });
                });
            }
        );
    });
};


Consultorio.service = (req, res) => {
    db.query("SELECT * FROM Servicio", (err, result) => {
        if (err) {
            console.error("Error al obtener los servicios: ", err);
            res.status(500).json({ error: "Error al obtener los consultorios" });
            return;
        }
        res.json(result);
    });
};

// Obtener servicios asociados a un consultorio por su ID
Consultorio.serviceById = (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM ConsultorioServicio WHERE idConsultorio = ?", [id], (err, result) => {
        if (err) {
            console.error("Error al obtener los servicios del consultorio:", err);
            res.status(500).json({ error: "Error al obtener los servicios del consultorio" });
            return;
        }
        res.json(result);
    });
};

module.exports = Consultorio;