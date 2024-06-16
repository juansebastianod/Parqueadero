import { pool } from "../db.js";
import bcrypt from 'bcryptjs';
import  jwt from 'jsonwebtoken'
import { tokenAcceso } from '../lib/jwt.js';
import {Usuario} from '../services/Entity/userEntity.js';
import { Parqueadero } from "../services/Entity/parqueaderoEntity.js";
import {
    registerServis,
    loginServices
} from '../services/adminServices.js'
import {
    buscarParqueaderosServices,
    registerParqueaderoServices,
} from '../services/parqueaderoServices.js'


// Terminado
export const register = async(req,res)=> {
    const {password,email}=req.body
    const passwordHast =await bcrypt.hash(password,10)
    const roleId = 2;

    let user =new Usuario(roleId,email,passwordHast)
    const response=await registerServis(user);
    
    res.status(response.status).json({
        message:response.message
    });
 
   
}

//Esto lo hice para registrar un admin rapidamente
export const registerAdmin = async(req,res)=> {
    const {password,email}=req.body
    const roleId = 1;
    try {
        const passwordHast =await bcrypt.hash(password,10)
        const query = `
        INSERT INTO Usuarios (email, password, role_id)
        VALUES ($1, $2, $3)
        RETURNING id, email, role_id
    `;
    const values = [email, passwordHast, roleId];
    const { rows } = await pool.query(query, values);
    if (rows.length > 0) {
        res.status(201).json({
            id: rows[0].id,
            email: rows[0].email,
            role_id: rows[0].role_id
        });
    } else {
        throw new Error('No se pudo registrar el usuario SOCIO');
    }
    } catch (error) {
        return res.status(500).json({message:error.message})
    } 
}
//Terminado
export const login = async (req, res) => {
    const { email, password } = req.body;
    const response=await loginServices(email,password);
    res.cookie('token', response.token);
    res.status(response.status).json({
        message:response.message,
    });
    
};

//Terminado
export const logout =(req,res)=>{
    try {
        res.cookie('token',"",{
            expires: new Date(0)
        })
        return res.sendStatus(200);
    } catch (error) {
        console.log(error)
    }
 }

 //Terminado 
export const registerParqueadero = async(req,res)=> {
    const {nombre,capacidad,costo_hora,socio_id}=req.body

    const parqueadero =new  Parqueadero(nombre,capacidad,costo_hora,socio_id);
    const response= await registerParqueaderoServices (parqueadero);
    
    res.status(response.status).json({
        message:response.message
    });
 
}


//Terminado
export const buscarParqueaderos = async (req, res) => {
    
    const { nombre } = req.body;
    const response=await buscarParqueaderosServices(nombre);
    res.status(response.status).json({
        message:response.message,
        data:response.data,
    });
}

export const editarParqueadero = async (req, res) => {

    const { id } = req.params;
    const { nombre, capacidad, costo_hora, socio_id } = req.body; 
    try {
        const verificarQuery = `
            SELECT * FROM Parqueaderos WHERE id = $1
        `;
        const verificarValues = [id];
        const { rows: parqueaderosEncontrados } = await pool.query(verificarQuery, verificarValues);

        if (parqueaderosEncontrados.length === 0) {
            return res.status(404).json({ message: "Parqueadero no encontrado" });
        }
        const updateQuery = `
            UPDATE Parqueaderos
            SET nombre = $1, capacidad = $2, costo_hora = $3, socio_id = $4
            WHERE id = $5
            RETURNING *
        `;
        const updateValues = [nombre, capacidad, costo_hora, socio_id, id];

        const { rows: parqueaderoActualizado } = await pool.query(updateQuery, updateValues);

        // Enviar respuesta con el parqueadero actualizado
        res.json({ message: "Parqueadero actualizado correctamente", parqueadero: parqueaderoActualizado[0] });
    } catch (error) {
        console.error("Error al editar parqueadero:", error.message);
        return res.status(500).json({ message: "Error interno al editar el parqueadero" });
    }
};

export const eliminarParqueadero = async (req, res) => {
    const { id } = req.params; 
    try {
        const verificarQuery = `
            SELECT * FROM Parqueaderos WHERE id = $1
        `;
        const verificarValues = [id];
        const { rows: parqueaderosEncontrados } = await pool.query(verificarQuery, verificarValues);

        if (parqueaderosEncontrados.length === 0) {
            return res.status(404).json({ message: "Parqueadero no encontrado" });
        }
        const deleteQuery = `
            DELETE FROM Parqueaderos
            WHERE id = $1
        `;
        const deleteValues = [id];

        await pool.query(deleteQuery, deleteValues);
        res.json({ message: "Parqueadero eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar parqueadero:", error.message);
        return res.status(500).json({ message: "Error interno al eliminar el parqueadero" });
    }
};