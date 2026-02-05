-- Migration: Create gear_items table
-- Created at: 2024-01-01

CREATE TABLE IF NOT EXISTS gear_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    weight DECIMAL(10, 2),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    notes TEXT,
    in_wishlist BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gear_items_user_id ON gear_items(user_id);
CREATE INDEX idx_gear_items_category_id ON gear_items(category_id);
CREATE INDEX idx_gear_items_wishlist ON gear_items(user_id, in_wishlist);

-- Down migration
-- DROP TABLE IF EXISTS gear_items;
