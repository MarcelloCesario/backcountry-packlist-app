import { query, getClient } from '../config/database.js';

export const PackList = {
  async findAllByUser(userId) {
    const result = await query(
      `SELECT pl.*,
              COUNT(pli.gear_item_id) as item_count,
              COALESCE(SUM(gi.weight), 0) as total_weight
       FROM pack_lists pl
       LEFT JOIN pack_list_items pli ON pl.id = pli.pack_list_id
       LEFT JOIN gear_items gi ON pli.gear_item_id = gi.id
       WHERE pl.user_id = $1
       GROUP BY pl.id
       ORDER BY pl.date DESC, pl.created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  async findById(id, userId) {
    const result = await query(
      'SELECT * FROM pack_lists WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0];
  },

  async findByIdWithItems(id, userId) {
    const packListResult = await query(
      'SELECT * FROM pack_lists WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (packListResult.rows.length === 0) {
      return null;
    }

    const itemsResult = await query(
      `SELECT gi.*, c.name as category_name, c.activity_type
       FROM pack_list_items pli
       JOIN gear_items gi ON pli.gear_item_id = gi.id
       LEFT JOIN categories c ON gi.category_id = c.id
       WHERE pli.pack_list_id = $1
       ORDER BY c.name, gi.name`,
      [id]
    );

    return {
      ...packListResult.rows[0],
      items: itemsResult.rows
    };
  },

  async create({ userId, name, activityType, date }) {
    const result = await query(
      `INSERT INTO pack_lists (user_id, name, activity_type, date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, name, activityType, date]
    );
    return result.rows[0];
  },

  async update(id, userId, { name, activityType, date }) {
    const result = await query(
      `UPDATE pack_lists
       SET name = COALESCE($3, name),
           activity_type = COALESCE($4, activity_type),
           date = COALESCE($5, date),
           updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId, name, activityType, date]
    );
    return result.rows[0];
  },

  async delete(id, userId) {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      await client.query(
        'DELETE FROM pack_list_items WHERE pack_list_id = $1',
        [id]
      );
      const result = await client.query(
        'DELETE FROM pack_lists WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
      );
      await client.query('COMMIT');
      return result.rowCount > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async addItem(packListId, gearItemId, userId) {
    const packList = await this.findById(packListId, userId);
    if (!packList) {
      return null;
    }

    const result = await query(
      `INSERT INTO pack_list_items (pack_list_id, gear_item_id)
       VALUES ($1, $2)
       ON CONFLICT (pack_list_id, gear_item_id) DO NOTHING
       RETURNING *`,
      [packListId, gearItemId]
    );
    return result.rows[0] || { pack_list_id: packListId, gear_item_id: gearItemId };
  },

  async removeItem(packListId, gearItemId, userId) {
    const packList = await this.findById(packListId, userId);
    if (!packList) {
      return false;
    }

    const result = await query(
      'DELETE FROM pack_list_items WHERE pack_list_id = $1 AND gear_item_id = $2 RETURNING *',
      [packListId, gearItemId]
    );
    return result.rowCount > 0;
  },

  async getTotalWeight(packListId, userId) {
    const packList = await this.findById(packListId, userId);
    if (!packList) {
      return null;
    }

    const result = await query(
      `SELECT COALESCE(SUM(gi.weight), 0) as total_weight
       FROM pack_list_items pli
       JOIN gear_items gi ON pli.gear_item_id = gi.id
       WHERE pli.pack_list_id = $1`,
      [packListId]
    );
    return parseFloat(result.rows[0].total_weight);
  },

  async analyzeKit(packListId, userId) {
    const packListWithItems = await this.findByIdWithItems(packListId, userId);
    if (!packListWithItems) {
      return null;
    }

    const categoryResult = await query(
      `SELECT c.name as category, c.activity_type,
              COUNT(gi.id) as item_count,
              COALESCE(SUM(gi.weight), 0) as category_weight
       FROM pack_list_items pli
       JOIN gear_items gi ON pli.gear_item_id = gi.id
       LEFT JOIN categories c ON gi.category_id = c.id
       WHERE pli.pack_list_id = $1
       GROUP BY c.id, c.name, c.activity_type
       ORDER BY category_weight DESC`,
      [packListId]
    );

    const totalWeight = await this.getTotalWeight(packListId, userId);

    return {
      packList: packListWithItems,
      totalWeight,
      categoryBreakdown: categoryResult.rows,
      itemCount: packListWithItems.items.length,
      heaviestItems: packListWithItems.items
        .sort((a, b) => (b.weight || 0) - (a.weight || 0))
        .slice(0, 5)
    };
  }
};
