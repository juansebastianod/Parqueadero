import { pool } from "../db.js";
import {Parqueadero} from '../services/Entity/parqueaderoEntity.js'

export const buscarParqueaderosRespository = async (nombre) => {
    let query = `
    SELECT *
    FROM Parqueaderos
    `;
    let params = [];
    if (nombre) {
        query += ` WHERE nombre ILIKE $1`;
        params.push(`%${nombre}%`);
    }
    const { rows } = await pool.query(query, params);
    let parqueaderos=[]

    rows.forEach(element => {
        let parqueadero=new Parqueadero(element.nombre,element.capacidad,element.costo_hora,element.socio_id)
        parqueaderos.push(parqueadero)
    });
     return parqueaderos

}

export const registerParqueaderoRepository = async(parqueaderoEntity)=> {
    try {
        const query = `
            INSERT INTO Parqueaderos (nombre, capacidad, costo_hora, socio_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `;
        const values = [parqueaderoEntity.nombre, parqueaderoEntity.capacidad, parqueaderoEntity.costo_hora, parqueaderoEntity.socio_id];

        const { rows } = await pool.query(query, values);
        if (rows.length > 0) {
            return true;
         } else {
           return false
         }
    } catch (error) {
        console.error("Error al registrar parqueadero:", error.message);
        return  "Error interno al registrar el parqueadero" ;
    }
}

export const NombreParqueaderoRepository = async(nombre)=> {
    const query = `
        SELECT * FROM parqueaderos WHERE nombre = $1
    `;
    const values = [nombre];
    const { rows } = await pool.query(query, values);
    if (rows.length > 0) {
       return true;
    } else {
      return false
    }

}

export const socioParqueaderoRepository = async(socio_id)=> {
   
    const query = `
        SELECT * FROM usuarios WHERE id = $1
    `;
    const values = [socio_id];
    const { rows } = await pool.query(query, values);
    if (rows.length > 0) {
       return true;
    } else {
      return false
    }
}


export const editarParqueaderoRepository = async (parqueaderoEntity,id) => {

    try {
        const updateQuery = `
            UPDATE Parqueaderos
            SET nombre = $1, capacidad = $2, costo_hora = $3, socio_id = $4
            WHERE id = $5
            RETURNING *
        `;
        const updateValues = [parqueaderoEntity.nombre, parqueaderoEntity.capacidad, parqueaderoEntity.costo_hora, parqueaderoEntity.socio_id, id];

        const { rows: parqueaderoActualizado } = await pool.query(updateQuery, updateValues);

        // Enviar respuesta con el parqueadero actualizado

        if(parqueaderoActualizado.length===0){
            return true
        }else{
            return false
        }
       
    } catch (error) {
        console.error("Error al editar parqueadero:", error.message);
    }
};

export const ExistParqueaderoRepository= async(id)=>{

    const verificarQuery = `
    SELECT * FROM Parqueaderos WHERE id = $1
    `;
    const verificarValues = [id];
    const { rows } = await pool.query(verificarQuery, verificarValues);
  
    if (rows.length === 0) {
        return false;
    }else{
        return true
    }
}


export const eliminarParqueaderoRerpository = async (id) => {
    
    console.log(id)
        try{
        const deleteQuery = `
            DELETE FROM Parqueaderos
            WHERE id = $1
        `;
        const deleteValues = [id];

        await pool.query(deleteQuery, deleteValues);
        return true
    } catch (error) {
        return false
    }
};



