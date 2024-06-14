import { Router } from 'express';
import {
    register,
    registerParqueadero,
    buscarParqueaderos,
    editarParqueadero,
    eliminarParqueadero,
    login,
    logout
} from "../controllers/users.controller.js";
import { authRequired } from '../middlewares/validateToken.js';
import {authorizeAdmin} from '../middlewares/authorization.js'
const router = Router();


router.post('/login', login)
router.post('/logout', logout)
router.post('/register',authRequired,authorizeAdmin, register);
router.post('/parqueadero',authRequired,authorizeAdmin, registerParqueadero);
router.put('/parqueadero/:id',authRequired,authorizeAdmin, editarParqueadero)
router.delete('/parqueadero/:id',authRequired,authorizeAdmin, eliminarParqueadero)
router.post('/logout',)
export default router;