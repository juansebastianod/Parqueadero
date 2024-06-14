import {Router} from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import {authorizeUser} from '../middlewares/authorization.js'
import { ganancias } from '../controllers/indicadores.controller.js';

const router =Router();

router.get('/ganancias/:id/:time',authRequired,authorizeUser,ganancias);
export default router;