-- Seed data for categories
-- Run this after migrations to populate default categories

-- Climbing categories
INSERT INTO categories (name, activity_type) VALUES
  ('Climbing Hardware', 'climbing'),
  ('Rope & Cord', 'climbing'),
  ('Protection', 'climbing'),
  ('Climbing Clothing', 'climbing')
ON CONFLICT (name, activity_type) DO NOTHING;

-- Skiing categories
INSERT INTO categories (name, activity_type) VALUES
  ('Skis & Bindings', 'skiing'),
  ('Avalanche Safety', 'skiing'),
  ('Ski Clothing', 'skiing'),
  ('Ski Accessories', 'skiing')
ON CONFLICT (name, activity_type) DO NOTHING;

-- Trail Running categories
INSERT INTO categories (name, activity_type) VALUES
  ('Running Footwear', 'trail_running'),
  ('Hydration', 'trail_running'),
  ('Running Apparel', 'trail_running'),
  ('Nutrition', 'trail_running')
ON CONFLICT (name, activity_type) DO NOTHING;

-- General/Shared categories
INSERT INTO categories (name, activity_type) VALUES
  ('Shelter', 'general'),
  ('Sleep System', 'general'),
  ('Cooking', 'general'),
  ('Navigation', 'general'),
  ('First Aid', 'general'),
  ('Lighting', 'general'),
  ('Electronics', 'general'),
  ('Miscellaneous', 'general')
ON CONFLICT (name, activity_type) DO NOTHING;
