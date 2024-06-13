import { pool } from "../db.js";

export const register = async(req,res)=> {
    const {password,username,role}=req.body
    try {
        const {rows}=await pool.query('SELECT * FROM roles')
        res.json(rows)
    } catch (error) {
        return res.status(500).json({message:error.message})
    } 
}