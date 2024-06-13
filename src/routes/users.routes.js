import {Router} from 'express';
import {register,registerParqueadero,buscarParqueaderos,editarParqueadero,eliminarParqueadero} from "../controllers/users.controller.js";
const router =Router();

router.post('/register',register);
router.post('/parqueadero',registerParqueadero);
router.get('/parqueadero/:nombre',buscarParqueaderos)
router.put('/parqueadero/:id',editarParqueadero)
router.delete('/parqueadero/:id',eliminarParqueadero)
router.post('/logout',)
export default router;