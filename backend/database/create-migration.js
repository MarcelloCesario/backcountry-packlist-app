import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, '../../database/migrations');

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Please provide a migration name');
  console.error('Usage: npm run migrate:create <migration_name>');
  process.exit(1);
}

const existingMigrations = fs.readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort();

const lastNumber = existingMigrations.length > 0
  ? parseInt(existingMigrations[existingMigrations.length - 1].split('_')[0])
  : 0;

const newNumber = String(lastNumber + 1).padStart(3, '0');
const filename = `${newNumber}_${migrationName}.sql`;
const filepath = path.join(migrationsDir, filename);

const template = `-- Migration: ${migrationName.replace(/_/g, ' ')}
-- Created at: ${new Date().toISOString().split('T')[0]}

-- Write your migration SQL here


-- Down migration
-- Write your rollback SQL here (commented out)
`;

fs.writeFileSync(filepath, template);
console.log(`Created migration: ${filename}`);
