import { Router } from 'express';
import { gearController } from '../controllers/gearController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const createGearSchema = {
  name: { required: true, maxLength: 255 },
  weight: { type: 'number', min: 0 }
};

const updateGearSchema = {
  name: { maxLength: 255 },
  weight: { type: 'number', min: 0 }
};

router.use(authenticate);

router.get('/', gearController.getAll);
router.get('/:id', gearController.getById);
router.post('/', validate(createGearSchema), gearController.create);
router.put('/:id', validate(updateGearSchema), gearController.update);
router.delete('/:id', gearController.delete);
router.post('/:id/wishlist', gearController.toggleWishlist);

export default router;
