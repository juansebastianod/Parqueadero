import { pool } from "../db.js";
import {gananciasServices} from '../services/indicadores.services.js'

export const ganancias = async (req, res) => {
    const { id: parqueaderoId } = req.params;
    const {time} =req.body
    const response=await gananciasServices(time,parqueaderoId)
    res.status(response.status).json({
        message:response.message,
        data:response.data,
    });
};

export const buscarVehiculoPorCoincidencia = async (req, res) => {
   
    const  { id }=req.params
    const { placa } = req.body;
    try {
        const query = `
            SELECT *
            FROM Vehiculos v
            INNER JOIN IngresosVehiculos iv ON v.id = iv.vehiculo_id
            WHERE v.placa ILIKE $1
              AND iv.parqueadero_id = $2
              AND iv.fecha_salida IS NULL
        `;
        const { rows } = await pool.query(query, [`${placa}%`, id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Vehículo no encontrado en el parqueadero' });
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al buscar vehículo por coincidencia:', error.message);
        return res.status(500).json({ message: 'Error interno al buscar vehículo por coincidencia' });
    }
};

export const obtenerTopVehiculosRegistrados = async (req, res) => {
    try {
        const query = `
            SELECT placa, cantidad_entradas
            FROM EntradasVehiculo
            ORDER BY cantidad_entradas DESC
            LIMIT 10
        `;
        const { rows } = await pool.query(query);

        res.status(200).json(rows);
    } catch (error) {
        console.error("Error al obtener los vehículos más registrados:", error.message);
        return res.status(500).json({ message: "Error interno al obtener los vehículos más registrados" });
    }
};

export const obtenerVehiculosMasRegistrados = async (req, res) => {
    const { id } = req.params;

    try {
        
        const query = `
            SELECT vehiculo_id, cantidad_entradas
            FROM EntradasParqueadero
            WHERE parqueadero_id = $1
            ORDER BY cantidad_entradas DESC
            LIMIT 10
        `;
        const { rows } = await pool.query(query, [id]);
        res.status(200).json(rows); 
    } catch (error) {
        console.error('Error al obtener vehículos más registrados:', error.message);
        res.status(500).json({ message: 'Error interno al obtener vehículos más registrados' });
    }
};

export const primeraVezParqueadero = async (req, res) => {
    try {
        const { id: parqueaderoId } = req.params;
        const primeraVezParqueaderoQuery = `
            SELECT vehiculo_id, cantidad_entradas
            FROM EntradasParqueadero
            WHERE parqueadero_id = $1
            ORDER BY cantidad_entradas DESC
        `;
        const { rows: vehiculos } = await pool.query(primeraVezParqueaderoQuery, [parqueaderoId]);

        // Crear una lista de vehículos que ingresan por primera vez
        const vehiculosPrimeraVez = vehiculos.filter(v => v.cantidad_entradas === 1).map(v => v.vehiculo_id);

        // Consulta para obtener las placas de los vehículos que ingresan por primera vez
        const placasQuery = `
            SELECT id, placa
            FROM Vehiculos
            WHERE id = ANY($1::int[])
        `;
        const { rows: placas } = await pool.query(placasQuery, [vehiculosPrimeraVez]);

        res.status(200).json({
            parqueaderoId,
            primeraVez: placas
        });
    } catch (error) {
        console.error("Error al verificar la primera vez en el parqueadero:", error.message);
        return res.status(500).json({ message: "Error interno al verificar la primera vez en el parqueadero" });
    }
};