-- Migration: Create categories table
-- Created at: 2024-01-01

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_activity_type ON categories(activity_type);
CREATE UNIQUE INDEX idx_categories_name_activity ON categories(name, activity_type);

-- Down migration
-- DROP TABLE IF EXISTS categories;
