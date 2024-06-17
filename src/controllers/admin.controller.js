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
    editarParqueaderoServices,
    eliminarParqueaderoServices
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

//Terminado
export const editarParqueadero = async (req, res) => {

    const { id } = req.params;
    const { nombre, capacidad, costo_hora, socio_id } = req.body; 
    const parqueadero=new Parqueadero( nombre, capacidad, costo_hora, socio_id );
    const response = await editarParqueaderoServices(parqueadero,id);
    res.json({
        message:response.message
    });
    
};

//Terminado
export const eliminarParqueadero = async (req, res) => {
    const { id } = req.params; 
    const response = await eliminarParqueaderoServices(id);
    res.json({
        message:response.message
    });
};