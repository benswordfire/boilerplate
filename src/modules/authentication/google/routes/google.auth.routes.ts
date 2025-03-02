import { Router } from 'express';
import { googleAuthCallback, googleAuthRedirect } from '../controllers/google.auth.controller';

const router = Router();

router.get("/google", googleAuthRedirect);
router.get("/google/callback", googleAuthCallback);

export default router;