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

export const buscarVehiculoPorCoincidenciaRepository = async (parqueaderoId,placa) => {
    try {

        const query = `
            SELECT *
            FROM Vehiculos v
            INNER JOIN IngresosVehiculos iv ON v.id = iv.vehiculo_id
            WHERE v.placa ILIKE $1
              AND iv.parqueadero_id = $2
              AND iv.fecha_salida IS NULL
        `;
        const { rows } = await pool.query(query, [`${placa}%`, parqueaderoId]);
        if (rows.length === 0) {
            const objeto={
                verdad:false,
                found:[]
            }
            return objeto;
        }
        const objeto={
            verdad:true,
            found:rows
        }
        return objeto;
    } catch (error) {
        console.error('Error al buscar vehículo por coincidencia:', error.message);
        return res.status(500).json({ message: 'Error interno al buscar vehículo por coincidencia' });
    }
};

export const obtenerTopVehiculosRegistradosRepository = async () => {
    try {
        const query = `
            SELECT placa, cantidad_entradas
            FROM EntradasVehiculo
            ORDER BY cantidad_entradas DESC
            LIMIT 10
        `;
        const { rows } = await pool.query(query);
      
        return rows;
    } catch (error) {
        console.error("Error al obtener los vehículos más registrados:", error.message);
    }
};

export const obtenerVehiculosMasRegistradosRepository = async (parqueaderoId) => {
    try {
        const query = `
        SELECT ep.vehiculo_id, v.placa, ep.cantidad_entradas
        FROM EntradasParqueadero ep
        JOIN Vehiculos v ON ep.vehiculo_id = v.id
        WHERE ep.parqueadero_id = $1
        ORDER BY ep.cantidad_entradas DESC
        LIMIT 10
    `;
        const { rows } = await pool.query(query, [parqueaderoId]);
        return rows
    } catch (error) {
        console.error('Error al obtener vehículos más registrados:', error.message);
    }
};

export const listVehiculosPrimeraVez=async(parqueaderoId)=>{
    const primeraVezParqueaderoQuery = `
    SELECT vehiculo_id, cantidad_entradas
    FROM EntradasParqueadero
    WHERE parqueadero_id = $1
    ORDER BY cantidad_entradas DESC
    `;
        const { rows: vehiculos } = await pool.query(primeraVezParqueaderoQuery, [parqueaderoId]);

    // Crear una lista de vehículos que ingresan por primera vez
    const vehiculosPrimeraVez = vehiculos.filter(v => v.cantidad_entradas === 1).map(v => v.vehiculo_id);
    return vehiculosPrimeraVez
}

export const primeraVezParqueaderoRepository = async (parqueaderoId,vehiculosPrimeraVez) => {
    try {
        // Consulta para obtener las placas de los vehículos que ingresan por primera vez
        const placasQuery = `
            SELECT id, placa
            FROM Vehiculos
            WHERE id = ANY($1::int[])
        `;
        const { rows: placas } = await pool.query(placasQuery, [vehiculosPrimeraVez]);
         const objeto={
            parqueaderoId,
            primeraVez: placas
         }
        return objeto
       
    } catch (error) {
        console.error("Error al verificar la primera vez en el parqueadero:", error.message);
    }
};