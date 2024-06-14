import { pool } from "../db.js";


export const registrarIngresoVehiculo = async (req, res) => {
    const { placa, parqueaderoId } = req.body;
    try {
        const consultarCapacidadQuery = `
        SELECT capacidad FROM Parqueaderos WHERE id = $1
       `;
        const consultarCapacidadValues = [parqueaderoId];
        const { rows  } = await pool.query(consultarCapacidadQuery, consultarCapacidadValues);
        // Verificar si se encontró el parqueadero
        if (rows[0].capacidad == 0) {
            return res.status(404).json({ message: "Parqueadero lleno" });
        } 
        ///
        const verificarVehiculoQuery = `
            SELECT id FROM Vehiculos WHERE placa = $1
        `;
        const verificarVehiculoValues = [placa];
        const { rows: vehiculosEncontrados } = await pool.query(verificarVehiculoQuery, verificarVehiculoValues);

        let vehiculoId;
        if (vehiculosEncontrados.length > 0) {
            vehiculoId = vehiculosEncontrados[0].id;
        } else {
            const insertarVehiculoQuery = `
                INSERT INTO Vehiculos (placa)
                VALUES ($1)
                RETURNING id
            `;
            const insertarVehiculoValues = [placa];

            const { rows } = await pool.query(insertarVehiculoQuery, insertarVehiculoValues);
            vehiculoId = rows[0].id;
        }


        const registrarIngresoQuery = `
            INSERT INTO IngresosVehiculos (vehiculo_id, parqueadero_id, fecha_ingreso)
            VALUES ($1, $2, NOW())
            RETURNING id
        `;
        const registrarIngresoValues = [vehiculoId, parqueaderoId];
        const { rows: ingresoVehiculo } = await pool.query(registrarIngresoQuery, registrarIngresoValues);

        const disminuirCapacidadQuery = `
            UPDATE Parqueaderos SET capacidad = capacidad - 1 WHERE id = $1
        `;

        //Disminuir la capacidad del parquedero
        const disminuirCapacidadValues = [parqueaderoId];
        await pool.query(disminuirCapacidadQuery, disminuirCapacidadValues);

        res.status(201).json({ id: ingresoVehiculo[0].id });
    } catch (error) {
        console.error("Error al registrar ingreso de vehículo:", error.message);
        return res.status(500).json({ message: "Error interno al registrar ingreso de vehículo" });
    }
};

export const registrarSalidaVehiculo = async (req, res) => {
    const { placa, parqueaderoId } = req.body;
    try {
        // Verificar si el vehículo está registrado en el parqueadero
        const verificarVehiculoQuery = `
            SELECT iv.id AS ingreso_id, v.id AS vehiculo_id 
            FROM Vehiculos v
            JOIN IngresosVehiculos iv ON v.id = iv.vehiculo_id
            WHERE v.placa = $1 AND iv.parqueadero_id = $2 AND iv.fecha_salida IS NULL
        `;
        const verificarVehiculoValues = [placa, parqueaderoId];
        const { rows: vehiculosEncontrados } = await pool.query(verificarVehiculoQuery, verificarVehiculoValues);

        //console.log(vehiculosEncontrados)
        if (vehiculosEncontrados.length === 0) {
            return res.status(400).json({ message: "No se puede registrar salida, no existe la placa en el parqueadero" });
        }

       // const vehiculoId = vehiculosEncontrados[0].vehiculo_id;
        const ingresoId = vehiculosEncontrados[0].ingreso_id;

        // registrar la fecha de salida en la tabla IngresosVehiculos
        const registrarSalidaQuery = `
            UPDATE IngresosVehiculos
            SET fecha_salida = NOW()
            WHERE id = $1
            RETURNING *
        `;
        const registrarSalidaValues = [ingresoId];
        const { rows: salidaVehiculo } = await pool.query(registrarSalidaQuery, registrarSalidaValues);
    
        // aumentar la capacidad del parqueadero
        const aumentarCapacidadQuery = `
            UPDATE Parqueaderos SET capacidad = capacidad + 1 WHERE id = $1
        `;
        const aumentarCapacidadValues = [parqueaderoId];
        await pool.query(aumentarCapacidadQuery, aumentarCapacidadValues);

        res.status(200).json({ message: "Salida registrada" });
    } catch (error) {
        console.error("Error al registrar salida de vehículo:", error.message);
        return res.status(500).json({ message: "Error interno al registrar salida de vehículo" });
    }
};

