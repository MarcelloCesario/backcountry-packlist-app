import { PackList } from '../models/PackList.js';

export const packlistController = {
  async getAll(req, res, next) {
    try {
      const packlists = await PackList.findAllByUser(req.user.id);
      res.json({ packlists });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const packlist = await PackList.findByIdWithItems(req.params.id, req.user.id);
      if (!packlist) {
        return res.status(404).json({ error: 'Pack list not found' });
      }
      res.json({ packlist });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { name, activityType, date } = req.body;
      const packlist = await PackList.create({
        userId: req.user.id,
        name,
        activityType,
        date
      });
      res.status(201).json({ packlist });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { name, activityType, date } = req.body;
      const packlist = await PackList.update(req.params.id, req.user.id, {
        name,
        activityType,
        date
      });
      if (!packlist) {
        return res.status(404).json({ error: 'Pack list not found' });
      }
      res.json({ packlist });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const deleted = await PackList.delete(req.params.id, req.user.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Pack list not found' });
      }
      res.json({ message: 'Pack list deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  async addItem(req, res, next) {
    try {
      const { gearItemId } = req.body;
      const result = await PackList.addItem(req.params.id, gearItemId, req.user.id);
      if (!result) {
        return res.status(404).json({ error: 'Pack list not found' });
      }
      res.status(201).json({ message: 'Item added to pack list' });
    } catch (error) {
      next(error);
    }
  },

  async removeItem(req, res, next) {
    try {
      const removed = await PackList.removeItem(
        req.params.id,
        req.params.itemId,
        req.user.id
      );
      if (!removed) {
        return res.status(404).json({ error: 'Pack list or item not found' });
      }
      res.json({ message: 'Item removed from pack list' });
    } catch (error) {
      next(error);
    }
  },

  async getWeight(req, res, next) {
    try {
      const totalWeight = await PackList.getTotalWeight(req.params.id, req.user.id);
      if (totalWeight === null) {
        return res.status(404).json({ error: 'Pack list not found' });
      }
      res.json({ totalWeight });
    } catch (error) {
      next(error);
    }
  },

  async analyze(req, res, next) {
    try {
      const analysis = await PackList.analyzeKit(req.params.id, req.user.id);
      if (!analysis) {
        return res.status(404).json({ error: 'Pack list not found' });
      }
      res.json({ analysis });
    } catch (error) {
      next(error);
    }
  }
};
