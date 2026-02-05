import { GearItem } from '../models/GearItem.js';

export const wishlistController = {
  async getAll(req, res, next) {
    try {
      const items = await GearItem.findWishlist(req.user.id);
      res.json({ items });
    } catch (error) {
      next(error);
    }
  }
};
