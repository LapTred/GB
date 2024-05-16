const db = require('../models/db');

const Paciente = {};

Paciente.getAll = (req, res) => {
    db.query(`
        SELECT 
            p.id AS id,
            p.Estado AS Estado,
            p.nombrePaciente AS nombre_paciente,
            pro.Nombre AS nombre_propietario,
            pro.Telefono AS telefono
        FROM 
            Paciente p
        JOIN 
            Propietario pro ON p.idPropietario = pro.id
        WHERE 
            p.Estado = 'ACTIVO' OR p.Estado = 'PENDIENTE';
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

Paciente.pacientesByPropietario = (req, res) => {
    const { propietario } = req.query;

    db.query(`
        SELECT 
            p.id AS idPaciente,
            p.nombrePaciente,
            pro.Nombre AS nombrePropietario
        FROM 
            Paciente p
        JOIN 
            Propietario pro ON p.idPropietario = pro.id
        WHERE 
            pro.Nombre = ? AND p.Estado = 'ACTIVO';
    `, [propietario], (err, result) => {
        if (err) {
            console.error("Error al obtener los pacientes del propietario:", err);
            res.status(500).json({ error: "Error al obtener los pacientes del propietario" });
            return;
        }
        console.log(result);
        console.log(propietario);
        res.json(result);
    });
};

Paciente.delete = (req, res) => {
    const { id } = req.params;
    db.query(
        "UPDATE Paciente SET Estado = 'ELIMINADO' WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                console.error("Error al eliminar el paciente: ", err);
                res.status(500).json({ error: "Error al eliminar el paciente" });
                return;
            }
            console.log("Estado de paciente cambiado a Eliminado: ", result);
            res.json(result);
        }
    );
};


// Función para obtener toda la información de un paciente por su ID
Paciente.getById = (req, res) => {
    const { id } = req.params;
    
    // Consulta para obtener los datos del paciente
    db.query(`
        SELECT 
            p.id AS idPaciente,
            p.nombrePaciente AS nombrePaciente,
            p.idPropietario AS idPropietario,
            p.Estado AS EstadoPaciente,
            e.id AS idExpediente,
            e.fechaNacimiento AS fechaNacimiento,
            e.Peso AS peso,
            e.Sexo AS sexo,
            e.Descripcion AS descripcionExpediente,
            pr.Nombre AS nombrePropietario,
            pr.Telefono AS telefonoPropietario
        FROM 
            Paciente p
        JOIN 
            Expediente e ON p.id = e.idPaciente
        JOIN 
            Propietario pr ON p.idPropietario = pr.id
        WHERE
            p.id = ?;
    `, [id], (err, pacienteResult) => {
        if (err) {
            console.error("Error al obtener los datos del paciente: ", err);
            res.status(500).json({ error: "Error al obtener los datos del paciente" });
            return;
        }

        // Consulta para obtener los datos de las citas del paciente
        db.query(`
            SELECT 
                rc.id AS idResumenCita,
                rc.Descripcion AS DescripcionResumenCita,
                rc.Peso AS PesoResumenCita,
                c.id AS idCita,
                c.idConsultorio,
                c.idUsuario AS idUsuarioCita,
                c.Fecha AS FechaCita,
                c.horaInicio AS HoraInicioCita,
                c.horaFinal AS HoraFinalCita,
                c.Duracion AS DuracionCita,
                c.Estado AS EstadoCita,
                s.Nombre AS NombreServicio    
            FROM 
                ResumenCita rc
            JOIN 
                Citas c ON rc.idCita = c.id
            JOIN
                CitaServicio cs ON c.id = cs.idCita
            JOIN 
                Servicio s ON cs.idServicio = s.id
            JOIN
                Expediente e ON rc.idExpediente = e.id
            WHERE 
                e.idPaciente = ?;
        `, [id], (err, citasResult) => {
            if (err) {
                console.error("Error al obtener las citas del paciente: ", err);
                res.status(500).json({ error: "Error al obtener las citas del paciente" });
                return;
            }

            // Consulta para obtener los datos de los medicamentos del paciente
            db.query(`
                SELECT 
                    m.id AS idMedicamento,
                    m.idResumenCita AS idResumenCita,
                    m.nombreMedicamento AS NombreMedicamento,
                    m.Descripcion AS DescripcionMedicamento
                FROM 
                    Medicamento m
                LEFT JOIN 
                    ResumenCita rc ON m.idResumenCita = rc.id
                LEFT JOIN
                    Expediente e ON rc.idExpediente = e.id
                WHERE 
                    e.idPaciente = ?;
            `, [id], (err, medicamentosResult) => {
                if (err) {
                    console.error("Error al obtener los medicamentos del paciente: ", err);
                    res.status(500).json({ error: "Error al obtener los medicamentos del paciente" });
                    return;
                }

                // Consulta para obtener los datos de las vacunas del paciente
                db.query(`
                    SELECT 
                        v.id AS idVacuna,
                        v.idResumenCita AS idResumenCitaVacuna,
                        v.nombreVacuna AS NombreVacuna,
                        v.dosis AS DosisVacuna,
                        v.fechaVacuna AS FechaVacuna,
                        v.fechaSiguienteVacuna AS FechaSiguienteVacuna
                    FROM 
                        Vacunas v
                    LEFT JOIN
                        ResumenCita rc ON v.idResumenCita = rc.id
                    LEFT JOIN
                        Expediente e ON rc.idExpediente = e.id
                    WHERE 
                        e.idPaciente = ?;
                `, [id], (err, vacunasResult) => {
                    if (err) {
                        console.error("Error al obtener las vacunas del paciente: ", err);
                        res.status(500).json({ error: "Error al obtener las vacunas del paciente" });
                        return;
                    }

                    // Construir el objeto de respuesta con todos los datos obtenidos
                    const pacienteData = {
                        paciente: pacienteResult[0],
                        citas: citasResult,
                        medicamentos: medicamentosResult,
                        vacunas: vacunasResult
                    };

                    // Enviar la respuesta JSON con todos los datos del paciente
                    res.json(pacienteData);
                });
            });
        });
    });
};

module.exports = Paciente;
