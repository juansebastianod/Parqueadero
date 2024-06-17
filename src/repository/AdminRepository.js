import { pool } from "../db.js";
import { tokenAcceso } from '../lib/jwt.js';
import bcrypt from 'bcryptjs';

export const resgisterUser = async(userEntity)=> {
    const query = `
        INSERT INTO Usuarios (email, password, role_id)
        VALUES ($1, $2, $3)
        RETURNING id, email, role_id
    `;
    const values = [userEntity.email, userEntity.password, userEntity.role_id];
    const { rows } = await pool.query(query, values);
    if (rows.length > 0) {
       return true;
    } else {
      return false
    }

}

export const consultarUsuario = async(email)=> {
    const query = `
        SELECT id FROM usuarios WHERE email = $1
    `;
    const values = [email];
    const { rows } = await pool.query(query, values);
    if (rows.length > 0) {
       return true;
    } else {
      return false
    }

}


export const loginRepository = async (email) => {
  try {
      const userFound = await verificaUser(email)
      const payload = {
          id: userFound.found.id,
          role: userFound.found.role_id 
      };
      const token = await tokenAcceso(payload);
      const objeto ={
        token:token,
        message: "Inicio de sesion",
        status:201,
      }
      return objeto
  } catch (error) {
      console.error('Error en login:', error.message);
  }
};

export const verificaUser=async (email) => {
    const query = `
    SELECT id, email, password, role_id
    FROM Usuarios
    WHERE email = $1
    `;
    const { rows } = await pool.query(query, [email]);
    if (rows.length === 0) {
        const objeto ={
            verdad:true,
            found:[]
        }
        return objeto;
    }else{

        const objeto={
            verdad:false,
            found:rows[0]
        }
        return objeto;
    }

}

export const verificaPassword=async (password,email) => {
   
    const userFound = await verificaUser(email);
    const isMatch = await bcrypt.compare(password, userFound.found.password);
    if (!isMatch) {
       return false
    }else{
        return true
    }

}



