import { Router } from 'express';
import { categoryController } from '../controllers/categoryController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const createCategorySchema = {
  name: { required: true, maxLength: 100 },
  activityType: { required: true, maxLength: 50 }
};

const updateCategorySchema = {
  name: { maxLength: 100 },
  activityType: { maxLength: 50 }
};

router.use(authenticate);

router.get('/', categoryController.getAll);
router.get('/activity-types', categoryController.getActivityTypes);
router.get('/:id', categoryController.getById);
router.post('/', validate(createCategorySchema), categoryController.create);
router.put('/:id', validate(updateCategorySchema), categoryController.update);
router.delete('/:id', categoryController.delete);

export default router;
