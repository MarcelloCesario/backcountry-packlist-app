import { query } from '../config/database.js';

export const Category = {
  async findAll() {
    const result = await query(
      'SELECT * FROM categories ORDER BY activity_type, name'
    );
    return result.rows;
  },

  async findById(id) {
    const result = await query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async findByActivityType(activityType) {
    const result = await query(
      'SELECT * FROM categories WHERE activity_type = $1 ORDER BY name',
      [activityType]
    );
    return result.rows;
  },

  async create({ name, activityType }) {
    const result = await query(
      `INSERT INTO categories (name, activity_type)
       VALUES ($1, $2)
       RETURNING *`,
      [name, activityType]
    );
    return result.rows[0];
  },

  async update(id, { name, activityType }) {
    const result = await query(
      `UPDATE categories
       SET name = COALESCE($2, name),
           activity_type = COALESCE($3, activity_type)
       WHERE id = $1
       RETURNING *`,
      [id, name, activityType]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await query(
      'DELETE FROM categories WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount > 0;
  },

  async getActivityTypes() {
    const result = await query(
      'SELECT DISTINCT activity_type FROM categories ORDER BY activity_type'
    );
    return result.rows.map(row => row.activity_type);
  }
};
