const db = require('../models/db');

const Cita = {};

Cita.getAll = (req, res) => {
    db.query(`
        SELECT 
            P.id AS id_paciente,
            P.nombrePaciente AS nombre_paciente,
            Pr.id AS id_dueño,
            Pr.Nombre AS nombre_dueño,
            Co.id AS id_consultorio,
            Co.nombreConsultorio AS nombre_consultorio,
            C.Estado AS estado,
            C.Fecha AS fecha,
            C.horaInicio AS hora
        FROM
            Citas C
                JOIN
            Paciente P ON C.idPaciente = P.id
                JOIN
            Propietario Pr ON P.idPropietario = Pr.id
                JOIN
            Consultorio Co ON C.idConsultorio = Co.id
        WHERE C.Estado != 'CANCELADA';
    `, (err, result) => {
        if (err) {
            console.error("Error al obtener las citas: ", err);
            res.status(500).json({ error: "Error al obtener las citas" });
            return;
        }
        console.log(result);
        res.json(result);
    });
}
Cita.disponibilidad = async (req, res) => {
    const { fecha, horarioInicio, horarioFinal, duracion, consultorios } = req.query;

    // Convertir fecha a formato YYYY-MM-DD
    const fechaFormato = new Date(fecha).toISOString().split('T')[0];
  
    // Convertir horarioInicio a objeto Time
    const horarioInicioTime = new Date(`1970-01-01T${horarioInicio}`);

    // Convertir horarioFinal a objeto Time
    const horarioFinalTime = new Date(`1970-01-01T${horarioFinal}`);

    try {
        const disponibilidadPorConsultorio = [];

        // Iterar sobre cada consultorio
        for (const consultorio of consultorios.split(',')) {
            const consultorioId = parseInt(consultorio);

            // Bucle para verificar la disponibilidad de cada hora en el rango de tiempo
            for (let hora = horarioInicioTime; hora <= horarioFinalTime - duracion; hora += 15) {
                let disponible = true;

                // Obtener las partes de la hora
                const horas = hora.getHours().toString().padStart(2, '0');
                const minutos = hora.getMinutes().toString().padStart(2, '0');
                const segundos = hora.getSeconds().toString().padStart(2, '0');

                // Formatear la cadena del horario
                const horarioFormateado = `${horas}:${minutos}:${segundos}`;

                // Consultar si existe alguna cita para el consultorio en la fecha, hora y duración especificadas
                const result = await db.query(
                    `SELECT COUNT(*) AS citas_programadas
                    FROM Citas
                    WHERE idConsultorio = ? 
                    AND Fecha = ? 
                    AND horaInicio <= ?
                    AND horaFinal >= ADDTIME(?, SEC_TO_TIME(? * 60))`,
                    [consultorioId, fechaFormato, horarioFormateado, horarioFormateado, duracion]
                );                
                console.log(consultorioId);
                console.log(fechaFormato);
                console.log(horarioFormateado);
                console.log(duracion);

                if (Array.isArray(result) && result.length > 0) {
                    // Acceder a la propiedad citas_programadas si existe
                    if (result[0].citas_programadas > 0) {
                        disponible = false;
                    }
                } else {
                    // Manejar el caso donde result no tiene resultados
                    console.log('La consulta SQL no devolvió resultados.');
                }
                
                // Guardar la disponibilidad para el consultorio actual y la hora actual
                disponibilidadPorConsultorio.push([consultorioId, hora, disponible]);
            }
        }
        res.json(disponibilidadPorConsultorio);
    } catch (error) {
        console.error('Error al verificar disponibilidad de citas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

  

module.exports = Cita;
