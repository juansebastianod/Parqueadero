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

export const registerParqueadero = async(req,res)=> {
    const {nombre,capacidad,costo_hora,socio_id}=req.body
    try {
        const query = `
            INSERT INTO Parqueaderos (nombre, capacidad, costo_hora, socio_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `;
        const values = [nombre, capacidad, costo_hora, socio_id];

        const { rows } = await pool.query(query, values);
        if (rows.length > 0) {
            res.status(201).json({ message: "Parqueadero registrado exitosamente", parqueaderoId: rows[0].id });
        } else {
            throw new Error("No se pudo registrar el parqueadero");
        }
    } catch (error) {
        console.error("Error al registrar parqueadero:", error.message);
        return res.status(500).json({ message: "Error interno al registrar el parqueadero" });
    }
}

export const buscarParqueaderos = async (req, res) => {
    try {
        
        const { nombre } = req.params;

        console.log(nombre)
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
        res.json(rows);
    } catch (error) {
        console.error("Error al buscar parqueaderos:", error.message);
        return res.status(500).json({ message: "Error interno al buscar parqueaderos" });
    }
};

export const editarParqueadero = async (req, res) => {

    console.log("entro")
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