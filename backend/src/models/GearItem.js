import { query } from '../config/database.js';

export const GearItem = {
  async findAllByUser(userId) {
    const result = await query(
      `SELECT gi.*, c.name as category_name, c.activity_type
       FROM gear_items gi
       LEFT JOIN categories c ON gi.category_id = c.id
       WHERE gi.user_id = $1
       ORDER BY gi.created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  async findById(id, userId) {
    const result = await query(
      `SELECT gi.*, c.name as category_name, c.activity_type
       FROM gear_items gi
       LEFT JOIN categories c ON gi.category_id = c.id
       WHERE gi.id = $1 AND gi.user_id = $2`,
      [id, userId]
    );
    return result.rows[0];
  },

  async create({ userId, name, weight, categoryId, notes, inWishlist = false }) {
    const result = await query(
      `INSERT INTO gear_items (user_id, name, weight, category_id, notes, in_wishlist)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, name, weight, categoryId, notes, inWishlist]
    );
    return result.rows[0];
  },

  async update(id, userId, { name, weight, categoryId, notes, inWishlist }) {
    const result = await query(
      `UPDATE gear_items
       SET name = COALESCE($3, name),
           weight = COALESCE($4, weight),
           category_id = COALESCE($5, category_id),
           notes = COALESCE($6, notes),
           in_wishlist = COALESCE($7, in_wishlist),
           updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId, name, weight, categoryId, notes, inWishlist]
    );
    return result.rows[0];
  },

  async delete(id, userId) {
    const result = await query(
      'DELETE FROM gear_items WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.rowCount > 0;
  },

  async toggleWishlist(id, userId) {
    const result = await query(
      `UPDATE gear_items
       SET in_wishlist = NOT in_wishlist, updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    );
    return result.rows[0];
  },

  async findWishlist(userId) {
    const result = await query(
      `SELECT gi.*, c.name as category_name, c.activity_type
       FROM gear_items gi
       LEFT JOIN categories c ON gi.category_id = c.id
       WHERE gi.user_id = $1 AND gi.in_wishlist = true
       ORDER BY gi.created_at DESC`,
      [userId]
    );
    return result.rows;
  }
};
