import { Router } from 'express';
import { login, logout, register, update, verification } from '../controllers/auth.controller';

const router = Router();

router.post('/api/v1/register', register);
router.post('/api/v1/login', login)
router.post('/api/v1/email-verification', verification)
router.patch('/api/v1/update-settings', update)
router.get('/logout', logout);

export default router;