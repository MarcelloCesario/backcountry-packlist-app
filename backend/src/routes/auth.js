import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const registerSchema = {
  email: { required: true, type: 'email' },
  password: { required: true, minLength: 8 }
};

const loginSchema = {
  email: { required: true, type: 'email' },
  password: { required: true }
};

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.me);

export default router;
