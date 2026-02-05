-- Migration: Create pack_lists table
-- Created at: 2024-01-01

CREATE TABLE IF NOT EXISTS pack_lists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    activity_type VARCHAR(50),
    date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pack_lists_user_id ON pack_lists(user_id);
CREATE INDEX idx_pack_lists_activity_type ON pack_lists(activity_type);
CREATE INDEX idx_pack_lists_date ON pack_lists(date);

-- Down migration
-- DROP TABLE IF EXISTS pack_lists;
