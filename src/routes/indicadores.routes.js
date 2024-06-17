import {Router} from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import {authorizeUser} from '../middlewares/authorization.js'
import { 
    ganancias,
    buscarVehiculoPorCoincidencia,
    obtenerTopVehiculosRegistrados,
    obtenerVehiculosMasRegistrados,
    primeraVezParqueadero
} from '../controllers/indicadores.controller.js';
import {validateShema} from '../middlewares/validator.midleware.js'
import {
    timeSchema
} from '../shemas/adminSchema.js'

const router =Router();
//los :id son el id del parqueadero
router.get('/ganancias/:id',authRequired,authorizeUser,validateShema(timeSchema),ganancias);
router.get('/buscar_vehiculo/:id',authRequired,buscarVehiculoPorCoincidencia);
router.get('/top_vehiculos',authRequired,obtenerTopVehiculosRegistrados);
router.get('/mas_vehiculos/:id',authRequired,obtenerVehiculosMasRegistrados);
router.get('/primera_entrada/:id',authRequired,primeraVezParqueadero);


export default router;