import { pool } from "../db.js";


export const gananciasRepository = async (dateCondition,parqueaderoId,time) => {
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
        const objeto={
            verdad:true,
            time,
            parqueaderoId,
            ganancias: rows[0].ganancias || 0 // Si no hay resultados, retornar 0
        }
        return objeto       
    } catch (error) {
        console.error('Error al obtener ganancias:', error.message);
    }
};