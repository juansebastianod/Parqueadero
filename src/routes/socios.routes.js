import {Router} from 'express';
import { registrarIngresoVehiculo,registrarSalidaVehiculo } from '../controllers/socios.controller.js';
import {authorizeUser} from '../middlewares/authorization.js'
import { authRequired } from '../middlewares/validateToken.js';

const router =Router();
router.post('/ingreso',authRequired,authorizeUser,registrarIngresoVehiculo);
router.post('/salida',authRequired,authorizeUser, registrarSalidaVehiculo)


export default router;