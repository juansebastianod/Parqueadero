import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export async function tokenAcceso(payload) {
    try {
        const token = await new Promise((resolve, reject) => {
            jwt.sign(
                payload,
                TOKEN_SECRET,
                {
                    expiresIn: '6h',
                },
                (error, token) => {
                    if (error) reject(error);
                    resolve(token);
                }
            );
        });
        return token;
    } catch (error) {
        throw new Error('Error al generar el token de acceso');
    }
}