import { Router } from 'express';

import { registerUser, loginUser } from '../controllers/auth.controller';
import { protect, adminOnly } from '../middleware/auth.middleware'

const router = Router();

router.post('/register', protect, adminOnly, registerUser);
router.post('/login', loginUser);

export default router;