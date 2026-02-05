import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  console.log('Seeding database...');

  try {
    // Create demo user
    const passwordHash = await bcrypt.hash('demo1234', 12);
    const userResult = await pool.query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
       RETURNING id`,
      ['demo@example.com', passwordHash]
    );
    const userId = userResult.rows[0].id;
    console.log('Created demo user: demo@example.com / demo1234');

    // Seed categories
    const categories = [
      // Climbing
      { name: 'Climbing Hardware', activity_type: 'climbing' },
      { name: 'Rope & Cord', activity_type: 'climbing' },
      { name: 'Protection', activity_type: 'climbing' },
      { name: 'Climbing Clothing', activity_type: 'climbing' },

      // Skiing
      { name: 'Skis & Bindings', activity_type: 'skiing' },
      { name: 'Avalanche Safety', activity_type: 'skiing' },
      { name: 'Ski Clothing', activity_type: 'skiing' },
      { name: 'Ski Accessories', activity_type: 'skiing' },

      // Trail Running
      { name: 'Running Footwear', activity_type: 'trail_running' },
      { name: 'Hydration', activity_type: 'trail_running' },
      { name: 'Running Apparel', activity_type: 'trail_running' },
      { name: 'Nutrition', activity_type: 'trail_running' },

      // General/Shared
      { name: 'Shelter', activity_type: 'general' },
      { name: 'Sleep System', activity_type: 'general' },
      { name: 'Cooking', activity_type: 'general' },
      { name: 'Navigation', activity_type: 'general' },
      { name: 'First Aid', activity_type: 'general' },
      { name: 'Lighting', activity_type: 'general' },
      { name: 'Electronics', activity_type: 'general' },
      { name: 'Miscellaneous', activity_type: 'general' }
    ];

    const categoryIds = {};
    for (const cat of categories) {
      const result = await pool.query(
        `INSERT INTO categories (name, activity_type)
         VALUES ($1, $2)
         ON CONFLICT (name, activity_type) DO UPDATE SET name = EXCLUDED.name
         RETURNING id, name`,
        [cat.name, cat.activity_type]
      );
      categoryIds[cat.name] = result.rows[0].id;
    }
    console.log('Seeded categories');

    // Seed some gear items for demo user
    const gearItems = [
      { name: 'Black Diamond Camalot C4 #0.5', weight: 82, category: 'Protection', notes: 'Great for finger cracks' },
      { name: 'Black Diamond Camalot C4 #1', weight: 109, category: 'Protection', notes: '' },
      { name: 'Black Diamond Camalot C4 #2', weight: 136, category: 'Protection', notes: '' },
      { name: 'Petzl Spirit Express Quickdraw', weight: 104, category: 'Climbing Hardware', notes: 'Set of 6' },
      { name: 'Sterling Rope 9.8mm x 70m', weight: 4200, category: 'Rope & Cord', notes: 'Dry treated' },
      { name: 'Petzl Sirocco Helmet', weight: 165, category: 'Climbing Hardware', notes: '' },

      { name: 'Black Diamond Recon BT Beacon', weight: 220, category: 'Avalanche Safety', notes: '', inWishlist: true },
      { name: 'BCA B-1 EXT Shovel', weight: 680, category: 'Avalanche Safety', notes: '' },
      { name: 'BCA Stealth 270 Probe', weight: 255, category: 'Avalanche Safety', notes: '' },

      { name: 'Salomon S/Lab Ultra 3', weight: 520, category: 'Running Footwear', notes: 'Size 10' },
      { name: 'Salomon Soft Flask 500ml', weight: 32, category: 'Hydration', notes: 'Set of 2' },

      { name: 'MSR Hubba Hubba NX', weight: 1540, category: 'Shelter', notes: '2-person tent' },
      { name: 'Therm-a-Rest NeoAir XLite', weight: 340, category: 'Sleep System', notes: 'Regular size' },
      { name: 'Western Mountaineering UltraLite', weight: 850, category: 'Sleep System', notes: '20°F rating', inWishlist: true },
      { name: 'MSR PocketRocket 2', weight: 73, category: 'Cooking', notes: '' },
      { name: 'Garmin inReach Mini 2', weight: 100, category: 'Electronics', notes: '' },
      { name: 'Petzl Actik Core', weight: 88, category: 'Lighting', notes: 'With rechargeable battery' },
      { name: 'Adventure Medical Kit Ultralight', weight: 196, category: 'First Aid', notes: '.5 size' }
    ];

    const gearIds = [];
    for (const item of gearItems) {
      const result = await pool.query(
        `INSERT INTO gear_items (user_id, name, weight, category_id, notes, in_wishlist)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [userId, item.name, item.weight, categoryIds[item.category], item.notes, item.inWishlist || false]
      );
      gearIds.push({ id: result.rows[0].id, name: item.name, category: item.category });
    }
    console.log('Seeded gear items');

    // Create a sample pack list
    const packListResult = await pool.query(
      `INSERT INTO pack_lists (user_id, name, activity_type, date)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [userId, 'Red Rocks Weekend Trip', 'climbing', '2024-03-15']
    );
    const packListId = packListResult.rows[0].id;

    // Add some items to the pack list
    const packListGear = gearIds.filter(g =>
      ['Protection', 'Climbing Hardware', 'Rope & Cord', 'Shelter', 'Sleep System', 'Cooking', 'Lighting', 'First Aid'].includes(g.category)
    );

    for (const gear of packListGear) {
      await pool.query(
        `INSERT INTO pack_list_items (pack_list_id, gear_item_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [packListId, gear.id]
      );
    }
    console.log('Created sample pack list');

    console.log('\nSeeding complete!');
    console.log('Demo account: demo@example.com / demo1234');

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
