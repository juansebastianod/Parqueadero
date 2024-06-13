import { pool } from "../db.js";
import bcrypt from 'bcryptjs'

export const register = async(req,res)=> {
    const {password,email}=req.body
    const roleId = 2;
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