import { GearItem } from '../models/GearItem.js';

export const gearController = {
  async getAll(req, res, next) {
    try {
      const items = await GearItem.findAllByUser(req.user.id);
      res.json({ items });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const item = await GearItem.findById(req.params.id, req.user.id);
      if (!item) {
        return res.status(404).json({ error: 'Gear item not found' });
      }
      res.json({ item });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { name, weight, categoryId, notes, inWishlist } = req.body;
      const item = await GearItem.create({
        userId: req.user.id,
        name,
        weight,
        categoryId,
        notes,
        inWishlist
      });
      res.status(201).json({ item });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { name, weight, categoryId, notes, inWishlist } = req.body;
      const item = await GearItem.update(req.params.id, req.user.id, {
        name,
        weight,
        categoryId,
        notes,
        inWishlist
      });
      if (!item) {
        return res.status(404).json({ error: 'Gear item not found' });
      }
      res.json({ item });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const deleted = await GearItem.delete(req.params.id, req.user.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Gear item not found' });
      }
      res.json({ message: 'Gear item deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  async toggleWishlist(req, res, next) {
    try {
      const item = await GearItem.toggleWishlist(req.params.id, req.user.id);
      if (!item) {
        return res.status(404).json({ error: 'Gear item not found' });
      }
      res.json({ item });
    } catch (error) {
      next(error);
    }
  }
};
