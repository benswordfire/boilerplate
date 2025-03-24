import { Router } from 'express';
import { currentUser, forgot, login, logout, register, reset, update, verification } from '../controllers/auth.controller';

const router = Router();

router.post('/api/v1/register', register);
router.post('/api/v1/login', login)
router.post('/api/v1/email-verification', verification)
router.patch('/api/v1/update-settings', update)
router.post('/api/v1/forgot-password', forgot)
router.post('/api/v1/password-reset', reset)
router.get('/logout', logout);
router.get('/api/v1/current-user', currentUser)

export default router;