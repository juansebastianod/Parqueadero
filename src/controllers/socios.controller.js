import { pool } from "../db.js";


export const registrarIngresoVehiculo = async (req, res) => {
    const { placa, parqueaderoId } = req.body;

    try {
        const verificarVehiculoQuery = `
            SELECT id FROM Vehículos WHERE placa = $1
        `;
        const verificarVehiculoValues = [placa];
        const { rows: vehiculosEncontrados } = await pool.query(verificarVehiculoQuery, verificarVehiculoValues);

        let vehiculoId;
        if (vehiculosEncontrados.length > 0) {
            // El vehículo ya está registrado, obtener su ID
            vehiculoId = vehiculosEncontrados[0].id;
        } else {
            // El vehículo no está registrado, insertarlo en la base de datos
            const insertarVehiculoQuery = `
                INSERT INTO Vehículos (placa)
                VALUES ($1)
                RETURNING id
            `;
            const insertarVehiculoValues = [placa];

            const { rows } = await pool.query(insertarVehiculoQuery, insertarVehiculoValues);
            vehiculoId = rows[0].id;
        }

        // Registrar el ingreso del vehículo en el parqueadero
        const registrarIngresoQuery = `
            INSERT INTO IngresosVehículos (vehiculo_id, parqueadero_id, fecha_ingreso)
            VALUES ($1, $2, NOW())
            RETURNING id
        `;
        const registrarIngresoValues = [vehiculoId, parqueaderoId];

        const { rows: ingresoVehiculo } = await pool.query(registrarIngresoQuery, registrarIngresoValues);

        // Enviar respuesta con el ID del registro de ingreso
        res.status(201).json({ id: ingresoVehiculo[0].id });
    } catch (error) {
        console.error("Error al registrar ingreso de vehículo:", error.message);
        return res.status(500).json({ message: "Error interno al registrar ingreso de vehículo" });
    }
};