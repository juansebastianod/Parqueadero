import { Router } from 'express';
import {
    register,
    registerParqueadero,
    buscarParqueaderos,
    editarParqueadero,
    eliminarParqueadero,
    login,
    logout,
    registerAdmin
} from "../controllers/admin.controller.js";
import { authRequired } from '../middlewares/validateToken.js';
import {authorizeAdmin} from '../middlewares/authorization.js'
import {validateShema} from '../middlewares/validator.midleware.js'
import {RegistrarParqueaderoShema,registerUserSchema} from '../shemas/adminSchema.js'
const router = Router();


router.post('/login',validateShema(registerUserSchema),login)
router.post('/logout', logout)
router.post('/register_admin', registerAdmin);
router.post('/register',authRequired,authorizeAdmin,validateShema(registerUserSchema), register);//Terminado
router.post('/parqueadero',authRequired,authorizeAdmin,validateShema(RegistrarParqueaderoShema), registerParqueadero);//terminado
router.get('/parqueadero',buscarParqueaderos)
router.put('/parqueadero/:id',authRequired,authorizeAdmin, editarParqueadero)
router.delete('/parqueadero/:id',authRequired,authorizeAdmin, eliminarParqueadero)
router.post('/logout',)
export default router;