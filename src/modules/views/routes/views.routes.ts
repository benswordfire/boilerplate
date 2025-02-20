import { Router } from 'express';
import { renderLoginPage } from '../controllers/views.controller';

const router = Router();

router.get('/login', renderLoginPage)

export default router;