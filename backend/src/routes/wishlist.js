import { Router } from 'express';
import { wishlistController } from '../controllers/wishlistController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', wishlistController.getAll);

export default router;
