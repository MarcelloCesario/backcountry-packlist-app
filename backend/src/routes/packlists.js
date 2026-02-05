import { Router } from 'express';
import { packlistController } from '../controllers/packlistController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const createPacklistSchema = {
  name: { required: true, maxLength: 255 },
  activityType: { maxLength: 50 }
};

const updatePacklistSchema = {
  name: { maxLength: 255 },
  activityType: { maxLength: 50 }
};

const addItemSchema = {
  gearItemId: { required: true }
};

router.use(authenticate);

router.get('/', packlistController.getAll);
router.get('/:id', packlistController.getById);
router.post('/', validate(createPacklistSchema), packlistController.create);
router.put('/:id', validate(updatePacklistSchema), packlistController.update);
router.delete('/:id', packlistController.delete);

router.post('/:id/items', validate(addItemSchema), packlistController.addItem);
router.delete('/:id/items/:itemId', packlistController.removeItem);
router.get('/:id/weight', packlistController.getWeight);
router.get('/:id/analyze', packlistController.analyze);

export default router;
