import { pool } from "../db.js";


//Consulta de la capacidad
const cantidadParqueadero = async (parqueaderoId) => {
    const consultarCapacidadQuery = `
        SELECT capacidad FROM Parqueaderos WHERE id = $1
    `;
    const consultarCapacidadValues = [parqueaderoId];
    const { rows: capacidadRows } = await pool.query(consultarCapacidadQuery, consultarCapacidadValues);
    return capacidadRows[0].capacidad == 0;
};

//verificar que el usuario sea SOCIO de ese parqueadero
const verificarParqueadero= async(socioId,parqueaderoId)=>{
    const verificarPropietarioQuery = `
            SELECT id FROM Parqueaderos WHERE id = $1 AND socio_id = $2
        `;
       const { rows: parqueaderoRows } = await pool.query(verificarPropietarioQuery, [parqueaderoId, socioId]);
       return parqueaderoRows
}

// crear vehiculo si el vehículo ya está registrado
const crearVehiculo =async(placa)=>{
    const verificarVehiculoQuery = `
    SELECT id FROM Vehiculos WHERE placa = $1
    `;
    const verificarVehiculoValues = [placa];
    const { rows: vehiculosEncontrados } = await pool.query(verificarVehiculoQuery, verificarVehiculoValues);

    let vehiculoId;
    if (vehiculosEncontrados.length > 0) {
    vehiculoId = vehiculosEncontrados[0].id;
    return vehiculoId
    } else {
    const insertarVehiculoQuery = `
        INSERT INTO Vehiculos (placa)
        VALUES ($1)
        RETURNING id
    `;
    const insertarVehiculoValues = [placa];
    const { rows: nuevoVehiculoRows } = await pool.query(insertarVehiculoQuery, insertarVehiculoValues);
    vehiculoId = nuevoVehiculoRows[0].id;
    return vehiculoId
}

}
// Verificar si el vehículo ya está registrado en otro parqueadero
const verificarPlacaParqueadero = async (vehiculoId) => {
    const verificarVehiculoQuery = `
        SELECT iv.id 
        FROM IngresosVehiculos iv 
        WHERE iv.vehiculo_id = $1 AND iv.fecha_salida IS NULL
    `;
    const { rows: vehiculoEnOtroParqueadero } = await pool.query(verificarVehiculoQuery, [vehiculoId]);
    return vehiculoEnOtroParqueadero;
}

const actualizarEntradas= async(parqueaderoId,vehiculoId,placa)=>{
     // Disminuir la capacidad del parqueadero
     const disminuirCapacidadQuery = `
     UPDATE Parqueaderos SET capacidad = capacidad - 1 WHERE id = $1
    `;
    const disminuirCapacidadValues = [parqueaderoId];
    await pool.query(disminuirCapacidadQuery, disminuirCapacidadValues);

    // Actualizar la tabla EntradasParqueadero
    const actualizarEntradasParqueaderoQuery = `
        INSERT INTO EntradasParqueadero (parqueadero_id, vehiculo_id, cantidad_entradas)
        VALUES ($1, $2, 1)
        ON CONFLICT (parqueadero_id, vehiculo_id) DO UPDATE SET cantidad_entradas = EntradasParqueadero.cantidad_entradas + 1
    `;
    await pool.query(actualizarEntradasParqueaderoQuery, [parqueaderoId, vehiculoId]);

    // Actualizar la tabla EntradasVehiculo
    const actualizarEntradasVehiculoQuery = `
        INSERT INTO EntradasVehiculo (placa, cantidad_entradas)
        VALUES ($1, 1)
        ON CONFLICT (placa) DO UPDATE SET cantidad_entradas = EntradasVehiculo.cantidad_entradas + 1
    `;
    await pool.query(actualizarEntradasVehiculoQuery, [placa]);

}

const vehiculoParqueado= async(placa,parqueaderoId)=>{
    //Verifico que el vehiculo existe en el parqueadero
    const verificarVehiculoQuery = `
    SELECT iv.id AS ingreso_id, v.id AS vehiculo_id, iv.fecha_ingreso
    FROM Vehiculos v
    JOIN IngresosVehiculos iv ON v.id = iv.vehiculo_id
    WHERE v.placa = $1 AND iv.parqueadero_id = $2 AND iv.fecha_salida IS NULL
    `;
    const verificarVehiculoValues = [placa, parqueaderoId];
    const { rows: vehiculosEncontrados } = await pool.query(verificarVehiculoQuery, verificarVehiculoValues);
    return vehiculosEncontrados

}


export const registrarIngresoVehiculo = async (req, res) => {
    const { placa, parqueaderoId } = req.body;
    const socioId = req.user.id;
    try {

        const  parqueaderoRows= await verificarParqueadero(socioId,parqueaderoId)
        if (parqueaderoRows.length === 0) {
            return res.status(403).json({ message: 'No tienes permiso para registrar ingresos en este parqueadero' });
        }

        const parqueaderoLleno = await cantidadParqueadero(parqueaderoId);
        if (parqueaderoLleno) {
            return res.status(404).json({ message: "Parqueadero lleno" });
        }

        const vehiculoId= await crearVehiculo(placa);
        const vehiculoEnOtroParqueadero= await verificarPlacaParqueadero(vehiculoId)

        if (vehiculoEnOtroParqueadero.length > 0) {
            return res.status(400).json({ message: 'El vehículo ya está registrado en este parqueadero o en otro' });
        }

        // Registrar el ingreso del vehículo
        const registrarIngresoQuery = `
            INSERT INTO IngresosVehiculos (vehiculo_id, parqueadero_id, fecha_ingreso)
            VALUES ($1, $2, NOW())
            RETURNING id
        `;
        const registrarIngresoValues = [vehiculoId, parqueaderoId];
        const { rows: ingresoVehiculoRows } = await pool.query(registrarIngresoQuery, registrarIngresoValues);

       await actualizarEntradas(parqueaderoId,vehiculoId,placa)
       

        res.status(201).json({ id: ingresoVehiculoRows[0].id });
    } catch (error) {
        console.error("Error al registrar ingreso de vehículo:", error.message);
        return res.status(500).json({ message: "Error interno al registrar ingreso de vehículo" });
    }
};

export const registrarSalidaVehiculo = async (req, res) => {
    const { placa, parqueaderoId } = req.body;
    const socioId = req.user.id;
    try {
       
        const  parqueaderoRows= await verificarParqueadero(socioId,parqueaderoId)
        if (parqueaderoRows.length === 0) {
            return res.status(403).json({ message: 'No tienes permiso para registrar ingresos en este parqueadero' });
        } 

        const vehiculosEncontrados= await vehiculoParqueado(placa,parqueaderoId)
        if (vehiculosEncontrados.length === 0) {
            return res.status(400).json({ message: "No se puede registrar salida, no existe la placa en el parqueadero" });
        }

        const ingresoId = vehiculosEncontrados[0].ingreso_id;
        const fechaIngreso = vehiculosEncontrados[0].fecha_ingreso;

        // registrar salida
        const registrarSalidaQuery = `
            UPDATE IngresosVehiculos
            SET fecha_salida = NOW()
            WHERE id = $1
            RETURNING fecha_ingreso, fecha_salida
        `;
        const registrarSalidaValues = [ingresoId];
        const { rows: salidaVehiculo } = await pool.query(registrarSalidaQuery, registrarSalidaValues);

        if (salidaVehiculo.length === 0) {
            return res.status(400).json({ message: "Error al registrar salida del vehículo" });
        }

        const { fecha_ingreso, fecha_salida } = salidaVehiculo[0];
        const fechaIngresoDate = new Date(fecha_ingreso);
        const fechaSalidaDate = new Date(fecha_salida);

        // Calcular la diferencia en milisegundos
        const diferenciaMilisegundos = fechaSalidaDate - fechaIngresoDate;

        console.log(fecha_ingreso)
        console.log(fecha_salida)
        console.log(diferenciaMilisegundos)

        // Calcular la duración en horas y fracción de horas
        let duracionHoras = diferenciaMilisegundos / (1000 * 60 * 60); // Convertir diferencia a horas
        
        duracionHoras = Math.ceil(duracionHoras);
        console.log(duracionHoras)

        //Obtener el costo por hora del parqueadero
        const obtenerCostoHoraQuery = `
            SELECT costo_hora FROM Parqueaderos WHERE id = $1
        `;
        const obtenerCostoHoraValues = [parqueaderoId];
        const { rows: parqueadero } = await pool.query(obtenerCostoHoraQuery, obtenerCostoHoraValues);

        if (parqueadero.length === 0) {
            return res.status(400).json({ message: "No se encontró el parqueadero" });
        }

        const costoHora = parqueadero[0].costo_hora;

        // Calcular las ganancias
        const ganancias = duracionHoras * costoHora;

        // Insertar el registro en la tabla HistorialVehiculos
        const insertarHistorialQuery = `
            INSERT INTO HistorialVehiculos (vehiculo_id, parqueadero_id, fecha_ingreso, fecha_salida, pago)
            VALUES ($1, $2, $3, $4, $5)
        `;
        const insertarHistorialValues = [vehiculosEncontrados[0].vehiculo_id, parqueaderoId, fechaIngreso, fecha_salida, ganancias];
        await pool.query(insertarHistorialQuery, insertarHistorialValues);

        // Aumentar la capacidad del parqueadero
        const aumentarCapacidadQuery = `
            UPDATE Parqueaderos SET capacidad = capacidad + 1 WHERE id = $1
        `;
        await pool.query(aumentarCapacidadQuery, [parqueaderoId]);

        res.status(200).json({ message: "Salida registrada correctamente", ganancias });
    } catch (error) {
        console.error("Error al registrar salida de vehículo:", error.message);
        return res.status(500).json({ message: "Error interno al registrar salida de vehículo" });
    }
};

export const listParqueadero = async (req, res) => {
    const socioId = req.user.id; // Obtengo el id del usuario logueado

    try {
        const query = `
            SELECT * FROM Parqueaderos
            WHERE socio_id = $1
        `;
        const { rows } = await pool.query(query, [socioId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron parqueaderos para este usuario' });
        }
        
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al listar parqueaderos:', error.message);
        return res.status(500).json({ message: 'Error interno al listar parqueaderos' });
    }
};

export const detalleVehiculo = async (req, res) => {
    const socioId = req.user.id; 

    try {
        const { id: parqueaderoId } = req.params; 

        if(req.user.role!=1){
        const verificarSocioQuery = `
            SELECT 1 AS socio_verificado
            FROM Parqueaderos
            WHERE id = $1 AND socio_id = $2
        `;
        const { rows: socioRows } = await pool.query(verificarSocioQuery, [parqueaderoId, socioId]);

        if (socioRows.length === 0) {
            return res.status(403).json({ message: 'Este no es su parqueadero' });
        }
     }
        const query = `
            SELECT v.id, v.placa, iv.fecha_ingreso
            FROM Vehiculos v
            INNER JOIN IngresosVehiculos iv ON v.id = iv.vehiculo_id
            WHERE iv.parqueadero_id = $1 AND iv.fecha_salida IS NULL 
        `;
        const { rows } = await pool.query(query, [parqueaderoId]);

        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron vehículos en este parqueadero o todos han salido' });
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener detalles de vehículos:', error.message);
        return res.status(500).json({ message: 'Error interno al obtener detalles de vehículos' });
    }
};

