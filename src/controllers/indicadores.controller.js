import { pool } from "../db.js";

export const ganancias = async (req, res) => {
    const { id: parqueaderoId, time } = req.params;
    let dateCondition;
    switch (time) {
        case '1': // Hoy
            dateCondition = "CURRENT_DATE";
            break;
        case '2': // Esta semana
            dateCondition = "date_trunc('week', CURRENT_DATE)";
            break;
        case '3': // Este mes
            dateCondition = "date_trunc('month', CURRENT_DATE)";
            break;
        case '4': // Este año
            dateCondition = "date_trunc('year', CURRENT_DATE)";
            break;
        default:
            return res.status(400).json({ message: 'Período no válido' });
    }

    try {
        const query = `
            SELECT 
                SUM(pago) AS ganancias
            FROM 
                HistorialVehiculos
            WHERE 
                parqueadero_id = $1 AND
                fecha_salida IS NOT NULL AND
                fecha_ingreso >= ${dateCondition}
        `;
        const { rows } = await pool.query(query, [parqueaderoId]);

        res.status(200).json({
            time,
            parqueaderoId,
            ganancias: rows[0].ganancias || 0 // Si no hay resultados, retornar 0
        });
    } catch (error) {
        console.error('Error al obtener ganancias:', error.message);
        return res.status(500).json({ message: 'Error interno al obtener ganancias' });
    }
};