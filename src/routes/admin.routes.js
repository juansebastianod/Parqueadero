import { Router } from 'express';
import {
    register,
    registerParqueadero,
    buscarParqueaderos,
    editarParqueadero,
    eliminarParqueadero,
    login,
    logout,
    registerAdmin,
    email
} from "../controllers/admin.controller.js";
import { authRequired } from '../middlewares/validateToken.js';
import {authorizeAdmin} from '../middlewares/authorization.js'
import {validateShema} from '../middlewares/validator.midleware.js'
import {
    RegistrarParqueaderoShema,
    registerUserSchema,
    nombreSchema
} from '../shemas/adminSchema.js'
const router = Router();

//los :id son el id del parqueadero
router.post('/login',validateShema(registerUserSchema),login);
router.post('/logout', logout);
router.post('/register_admin', registerAdmin);
router.post('/register',authRequired,authorizeAdmin,validateShema(registerUserSchema), register);//Terminado
router.post('/parqueadero',authRequired,authorizeAdmin,validateShema(RegistrarParqueaderoShema), registerParqueadero);//terminado
router.get('/parqueadero',authRequired,authorizeAdmin,validateShema(nombreSchema),buscarParqueaderos);
router.put('/parqueadero/:id',authRequired,authorizeAdmin,validateShema(RegistrarParqueaderoShema), editarParqueadero);
router.delete('/parqueadero/:id',authRequired,authorizeAdmin, eliminarParqueadero);
router.post('/enviar',authRequired,authorizeAdmin,email);
export default router;