-- Migration: Create migrations tracking table
-- Created at: 2024-01-01

CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Down migration
-- DROP TABLE IF EXISTS schema_migrations;
