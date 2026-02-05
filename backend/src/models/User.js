import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';

export const User = {
  async create({ email, password }) {
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email, created_at`,
      [email, passwordHash]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
};
