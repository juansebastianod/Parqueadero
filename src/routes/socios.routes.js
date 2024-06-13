import {Router} from 'express';
import { registrarIngresoVehiculo,registrarSalidaVehiculo } from '../controllers/socios.controller.js';

const router =Router();
router.post('/ingreso',registrarIngresoVehiculo);
router.post('/salida', registrarSalidaVehiculo)


export default router;