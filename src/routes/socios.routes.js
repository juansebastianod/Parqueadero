import {Router} from 'express';
import { 
    registrarIngresoVehiculo,
    registrarSalidaVehiculo,
    listParqueadero,
    detalleVehiculo 
} from '../controllers/socios.controller.js';
import {authorizeUser} from '../middlewares/authorization.js'
import { authRequired } from '../middlewares/validateToken.js';
import {validateShema} from '../middlewares/validator.midleware.js'
import {
   vehiculoShema
} from '../shemas/adminSchema.js'


//los :id son el id del parqueadero
const router =Router();
router.post('/ingreso/:id',authRequired,authorizeUser,validateShema(vehiculoShema),registrarIngresoVehiculo);
router.post('/salida/:id',authRequired,authorizeUser, registrarSalidaVehiculo);
router.get('/lista_parqueadero',authRequired,authorizeUser,listParqueadero);
router.get('/detalle_vehiculo/:id',authRequired,detalleVehiculo);


export default router;