import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, '../../database/migrations');

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getExecutedMigrations() {
  const result = await pool.query('SELECT filename FROM schema_migrations ORDER BY filename');
  return result.rows.map(row => row.filename);
}

async function runMigrations() {
  console.log('Running migrations...');

  await ensureMigrationsTable();
  const executedMigrations = await getExecutedMigrations();

  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql') && !f.includes('006_create_migrations'))
    .sort();

  for (const file of migrationFiles) {
    if (!executedMigrations.includes(file)) {
      console.log(`Running migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      // Extract only the up migration (everything before "-- Down migration")
      const upMigration = sql.split('-- Down migration')[0];

      try {
        await pool.query(upMigration);
        await pool.query(
          'INSERT INTO schema_migrations (filename) VALUES ($1)',
          [file]
        );
        console.log(`Completed: ${file}`);
      } catch (error) {
        console.error(`Failed: ${file}`, error.message);
        process.exit(1);
      }
    } else {
      console.log(`Skipping: ${file} (already executed)`);
    }
  }

  console.log('All migrations completed!');
}

async function rollbackMigration() {
  console.log('Rolling back last migration...');

  const result = await pool.query(
    'SELECT filename FROM schema_migrations ORDER BY executed_at DESC LIMIT 1'
  );

  if (result.rows.length === 0) {
    console.log('No migrations to rollback');
    return;
  }

  const lastMigration = result.rows[0].filename;
  console.log(`Rolling back: ${lastMigration}`);

  const sql = fs.readFileSync(path.join(migrationsDir, lastMigration), 'utf8');
  const downMigration = sql.split('-- Down migration')[1];

  if (!downMigration) {
    console.log('No down migration found');
    return;
  }

  try {
    await pool.query(downMigration);
    await pool.query('DELETE FROM schema_migrations WHERE filename = $1', [lastMigration]);
    console.log(`Rolled back: ${lastMigration}`);
  } catch (error) {
    console.error(`Rollback failed: ${lastMigration}`, error.message);
    process.exit(1);
  }
}

const command = process.argv[2];

if (command === 'rollback') {
  rollbackMigration()
    .then(() => pool.end())
    .catch(err => {
      console.error(err);
      pool.end();
      process.exit(1);
    });
} else {
  runMigrations()
    .then(() => pool.end())
    .catch(err => {
      console.error(err);
      pool.end();
      process.exit(1);
    });
}
