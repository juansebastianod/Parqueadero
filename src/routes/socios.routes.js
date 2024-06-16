import {Router} from 'express';
import { 
    registrarIngresoVehiculo,
    registrarSalidaVehiculo,
    listParqueadero,
    detalleVehiculo 
} from '../controllers/socios.controller.js';
import {authorizeUser} from '../middlewares/authorization.js'
import { authRequired } from '../middlewares/validateToken.js';


const router =Router();
router.post('/ingreso',authRequired,authorizeUser,registrarIngresoVehiculo);
router.post('/salida',authRequired,authorizeUser, registrarSalidaVehiculo);
router.get('/lista_parqueadero',authRequired,authorizeUser,listParqueadero);
router.get('/detalle_vehiculo/:id',authRequired,detalleVehiculo);


export default router;