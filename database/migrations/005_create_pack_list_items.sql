-- Migration: Create pack_list_items junction table
-- Created at: 2024-01-01

CREATE TABLE IF NOT EXISTS pack_list_items (
    pack_list_id INTEGER NOT NULL REFERENCES pack_lists(id) ON DELETE CASCADE,
    gear_item_id INTEGER NOT NULL REFERENCES gear_items(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (pack_list_id, gear_item_id)
);

CREATE INDEX idx_pack_list_items_gear ON pack_list_items(gear_item_id);

-- Down migration
-- DROP TABLE IF EXISTS pack_list_items;
