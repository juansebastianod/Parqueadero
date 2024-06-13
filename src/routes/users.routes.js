import {Router} from 'express';
import {register} from "../controllers/users.controller.js";
const router =Router();

router.post('/register',register);
router.post('/login',)
router.post('/logout',)


export default router;