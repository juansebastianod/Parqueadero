import {Router} from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import {authorizeUser} from '../middlewares/authorization.js'
import { ganancias ,buscarVehiculoPorCoincidencia,obtenerTopVehiculosRegistrados,obtenerVehiculosMasRegistrados} from '../controllers/indicadores.controller.js';

const router =Router();

router.get('/ganancias/:id/:time',authRequired,authorizeUser,ganancias);
router.get('/buscar_vehiculo/:id',authRequired,buscarVehiculoPorCoincidencia);
router.get('/top_vehiculos',authRequired,obtenerTopVehiculosRegistrados);
router.get('/mas_vehiculos/:id',authRequired,obtenerVehiculosMasRegistrados);


export default router;