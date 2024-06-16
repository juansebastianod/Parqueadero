import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import { pool } from '../db.js'; // Asegúrate de importar tu pool de conexión

export const authRequired = async (req, res, next) => {
    try {
        const {token}= req.cookies;
        if (!token) {
            return res.status(401).json({ message: 'No estás autorizado, token no encontrado' });
        }

        jwt.verify(token, TOKEN_SECRET, async (error, decoded) => {
            if (error) {
                return res.status(401).json({ message: 'Token no es válido' });
            }

            // Verificar si el usuario existe en la base de datos
            const { id, role } = decoded;
            const query = `
                SELECT * FROM Usuarios
                WHERE id = $1
            `;
            const { rows } = await pool.query(query, [id]);

            if (rows.length === 0) {
                return res.status(401).json({ message: 'Usuario no autorizado' });
            }

            // Añadir el usuario y su rol a la solicitud para su uso posterior
            req.user = { id, role };
            next();
        });
    } catch (error) {
        console.error('Error en authRequired:', error.message);
        return res.status(500).json({ message: 'Error interno en autenticación' });
    }
};