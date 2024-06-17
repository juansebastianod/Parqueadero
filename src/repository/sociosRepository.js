import { object } from "zod";
import { pool } from "../db.js";
import {Parqueadero} from '../services/Entity/parqueaderoEntity.js'

//Metodos de 
//verificar que el usuario sea SOCIO de ese parqueadero Terminado
export const verificarSocioParqueadero = async (socioId, parqueaderoId,role) => {

    if(role==1){return true}
    const verificarPropietarioQuery = `
            SELECT id FROM Parqueaderos WHERE id = $1 AND socio_id = $2
        `;
    const { rows: parqueaderoRows } = await pool.query(verificarPropietarioQuery, [parqueaderoId, socioId]);
    if (parqueaderoRows.length === 0) {
        return false
    } else {
        return true
    }
}

//Consulta si esta lleno Terminado
export const cantidadParqueadero = async (parqueaderoId) => {
    const consultarCapacidadQuery = `
        SELECT capacidad FROM Parqueaderos WHERE id = $1
    `;
    const consultarCapacidadValues = [parqueaderoId];
    const { rows: capacidadRows } = await pool.query(consultarCapacidadQuery, consultarCapacidadValues);

    if (capacidadRows[0].capacidad == 0) {
        return false;
    } else {
        return true;

    }
};

// crear vehiculo si el vehículo ya está registrado Terminado
export const crearVehiculo = async (placa) => {
    const verificarVehiculoQuery = `
    SELECT placa FROM Vehiculos WHERE placa = $1
    `;
    const verificarVehiculoValues = [placa];
    const { rows: vehiculosEncontrados } = await pool.query(verificarVehiculoQuery, verificarVehiculoValues);

    let vehiculoId;
    if (vehiculosEncontrados.length > 0) {
        vehiculoId = vehiculosEncontrados[0].placa;
        return vehiculoId
    } else {
        const insertarVehiculoQuery = `
        INSERT INTO Vehiculos (placa)
        VALUES ($1)
        RETURNING placa
    `;
        const insertarVehiculoValues = [placa];
        const { rows: nuevoVehiculoRows } = await pool.query(insertarVehiculoQuery, insertarVehiculoValues);
        vehiculoId = nuevoVehiculoRows[0].placa;
        return vehiculoId
    }

}
// Verificar si el vehículo ya está registrado en otro parqueadero No puedo probar todavia bien
export const verificarPlacaParqueadero = async (vehiculoId) => {
    const verificarVehiculoQuery = `
        SELECT iv.id 
        FROM IngresosVehiculos iv 
        WHERE iv.placa = $1 AND iv.fecha_salida IS NULL
    `;
    const { rows: vehiculoEnOtroParqueadero } = await pool.query(verificarVehiculoQuery, [vehiculoId]);
    if(vehiculoEnOtroParqueadero.length > 0){
        return false
    }else{
    return true;
    }
}
 
//Actualiza los datos de las diferentes tablas ya sea la cantidad el numero de entrada etc
const actualizarEntradas = async (parqueaderoId, vehiculoId) => {
    // Disminuir la capacidad del parqueadero
    const disminuirCapacidadQuery = `
     UPDATE Parqueaderos SET capacidad = capacidad - 1 WHERE id = $1
    `;
    const disminuirCapacidadValues = [parqueaderoId];
    await pool.query(disminuirCapacidadQuery, disminuirCapacidadValues);

    // Actualizar la tabla EntradasParqueadero
    const actualizarEntradasParqueaderoQuery = `
       INSERT INTO EntradasParqueadero (parqueadero_id, placa, cantidad_entradas)
        VALUES ($1, $2, 1)
        ON CONFLICT (parqueadero_id, placa) DO UPDATE 
        SET cantidad_entradas = EntradasParqueadero.cantidad_entradas + 1
    `;
    await pool.query(actualizarEntradasParqueaderoQuery, [parqueaderoId, vehiculoId]);

    // Actualizar la tabla EntradasVehiculo
    const actualizarEntradasVehiculoQuery = `
        INSERT INTO EntradasVehiculo (placa, cantidad_entradas)
        VALUES ($1, 1)
        ON CONFLICT (placa) DO UPDATE
        SET cantidad_entradas = EntradasVehiculo.cantidad_entradas + 1
        RETURNING cantidad_entradas;
    `;
    await pool.query(actualizarEntradasVehiculoQuery, [vehiculoId]);

}

//---------------------------------------------------------------------
//Metodos de salida

//Verifico que el vehiculo existe en el parqueadero
export const vehiculoSalidaParqueado = async (placa, parqueaderoId) => {

    const verificarVehiculoQuery = `
        SELECT iv.id AS ingreso_id, v.placa, iv.fecha_ingreso
        FROM IngresosVehiculos iv
        JOIN Vehiculos v ON v.placa = iv.placa
        WHERE v.placa = $1
        AND iv.parqueadero_id = $2
        AND iv.fecha_salida IS NULL;
    `;
    const verificarVehiculoValues = [placa, parqueaderoId];
    const { rows:vehiculosEncontrados  } = await pool.query(verificarVehiculoQuery, verificarVehiculoValues);
    if (vehiculosEncontrados .length === 0){
   //falta objeto 
   const objeto ={
        verdad:true,
        found:[]
   }
        return objeto
    }else{
        const objeto ={
            verdad:false,
            found:vehiculosEncontrados 
       }
        return objeto
    }
   
}

//Actualizar datos de la salida 
const actualizarDatosSalida = async(datos,parqueaderoId,fechaIngreso,vehiculosEncontrados)=>{
    const { fecha_ingreso, fecha_salida }=datos
    const fechaIngresoDate = new Date(fecha_ingreso);
    const fechaSalidaDate = new Date(fecha_salida);
    // Calcular la diferencia en milisegundos
    const diferenciaMilisegundos = fechaSalidaDate - fechaIngresoDate;
    // Calcular la duración en horas y fracción de horas
    let duracionHoras = diferenciaMilisegundos / (1000 * 60 * 60); // Convertir diferencia a horas
    duracionHoras = Math.ceil(duracionHoras);
    //Obtener el costo por hora del parqueadero
    const obtenerCostoHoraQuery = `
    SELECT costo_hora FROM Parqueaderos WHERE id = $1
    `;
    const obtenerCostoHoraValues = [parqueaderoId];
    const { rows: parqueadero } = await pool.query(obtenerCostoHoraQuery, obtenerCostoHoraValues);
    const costoHora = parqueadero[0].costo_hora;

    // Calcular las ganancias
    const ganancias = duracionHoras * costoHora;

    // Insertar el registro en la tabla HistorialVehiculos
    const insertarHistorialQuery = `
        INSERT INTO HistorialVehiculos ( parqueadero_id, fecha_ingreso, fecha_salida, pago)
        VALUES ($1, $2, $3, $4)
    `;
    const insertarHistorialValues = [ parqueaderoId, fechaIngreso, fecha_salida, ganancias];
    await pool.query(insertarHistorialQuery, insertarHistorialValues);

    // Aumentar la capacidad del parqueadero
    const aumentarCapacidadQuery = `
        UPDATE Parqueaderos SET capacidad = capacidad + 1 WHERE id = $1
    `;
    await pool.query(aumentarCapacidadQuery, [parqueaderoId]);

}

export const registrarIngresoVehiculoRepository = async (vehiculoId,parqueaderoId) => {
    try {
        const registrarIngresoQuery = `
            INSERT INTO IngresosVehiculos (placa, parqueadero_id, fecha_ingreso)
            VALUES ($1, $2, NOW())
            RETURNING id
        `;
        const registrarIngresoValues = [vehiculoId, parqueaderoId];
        const { rows: ingresoVehiculoRows } = await pool.query(registrarIngresoQuery, registrarIngresoValues);
        await actualizarEntradas(parqueaderoId, vehiculoId)
        if(ingresoVehiculoRows.length>0){
            return true 
        }
    } catch (error) {
        console.error("Error al registrar ingreso de vehículo:", error.message);
    }
};

export const registrarSalidaVehiculoRepository = async (parqueaderoId,ingresoId,fechaIngreso,vehiculosEncontrados) => {
    try {
        const registrarSalidaQuery = `
            UPDATE IngresosVehiculos
            SET fecha_salida = NOW()
            WHERE id = $1
            RETURNING fecha_ingreso, fecha_salida
        `;
        const registrarSalidaValues = [ingresoId];
        const { rows: salidaVehiculo } = await pool.query(registrarSalidaQuery, registrarSalidaValues);

        if (salidaVehiculo.length === 0) {
            return false
        }
        await actualizarDatosSalida(salidaVehiculo[0],parqueaderoId,fechaIngreso,vehiculosEncontrados)
        return true
    } catch (error) {
        console.error("Error al registrar salida de vehículo:", error.message);
        return res.status(500).json({ message: "Error interno al registrar salida de vehículo" });
    }
};

export const listParqueaderoRepository = async (socioId) => {
    try {
        const query = `
            SELECT * FROM Parqueaderos
            WHERE socio_id = $1
        `;
        const { rows } = await pool.query(query, [socioId]);
        if (rows.length === 0) {

            const objeto={
                verdad:false,
                found:[]
            }
            return objeto
        }
        let parqueaderos=[];
        rows.forEach(element => {
            let parqueadero=new Parqueadero(element.nombre,element.capacidad,element.costo_hora,element.socio_id)
            parqueaderos.push(parqueadero)
        });
        const objeto={
            verdad:true,
            found:parqueaderos
        }
        return objeto
        
    } catch (error) {
        console.error('Error al listar parqueaderos:', error.message);
    }
};

export const detalleVehiculoRepository = async (parqueaderoId) => {
    try {
        const query = `
            SELECT  v.placa, iv.fecha_ingreso
            FROM Vehiculos v
            INNER JOIN IngresosVehiculos iv ON v.placa = iv.placa
            WHERE iv.parqueadero_id = $1 
            AND iv.fecha_salida IS NULL;
        `;
        const { rows } = await pool.query(query, [parqueaderoId]);   
        if (rows.length === 0) {
            const objeto ={
                verdad:false,
                found:rows
            }
            return objeto
        }
        const objeto ={
            verdad:true,
            found:rows
        }
       return objeto
    } catch (error) {
        console.error('Error al obtener detalles de vehículos:', error.message);
        return false;
    }
};