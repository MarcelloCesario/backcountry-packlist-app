import { Category } from '../models/Category.js';

export const categoryController = {
  async getAll(req, res, next) {
    try {
      const { activityType } = req.query;
      let categories;

      if (activityType) {
        categories = await Category.findByActivityType(activityType);
      } else {
        categories = await Category.findAll();
      }

      res.json({ categories });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json({ category });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { name, activityType } = req.body;
      const category = await Category.create({ name, activityType });
      res.status(201).json({ category });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { name, activityType } = req.body;
      const category = await Category.update(req.params.id, { name, activityType });
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json({ category });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const deleted = await Category.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  async getActivityTypes(req, res, next) {
    try {
      const activityTypes = await Category.getActivityTypes();
      res.json({ activityTypes });
    } catch (error) {
      next(error);
    }
  }
};
