import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('Updating menu routes to be compatible with database structure...');
  
  try {
    // Check if the menu_items table exists
    const tables = await sql`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'
    `.execute(db);
    
    console.log('Existing tables:', tables.rows.map(r => r.tablename).join(', '));
    
    // Add the missing columns if they don't exist
    const columnsResult = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'menu_items'
    `.execute(db);
    
    const columns = columnsResult.rows.map(r => r.column_name);
    console.log('Existing columns in menu_items:', columns.join(', '));
    
    // Check if the icon_type column exists
    if (!columns.includes('icon_type')) {
      console.log('Adding icon_type column to menu_items table...');
      await sql`ALTER TABLE menu_items ADD COLUMN icon_type TEXT DEFAULT 'fas'`.execute(db);
      console.log('Added icon_type column');
    }
    
    // Check if the item_type column exists
    if (!columns.includes('item_type')) {
      console.log('Adding item_type column to menu_items table...');
      await sql`ALTER TABLE menu_items ADD COLUMN item_type TEXT DEFAULT 'link'`.execute(db);
      console.log('Added item_type column');
    }
    
    console.log('Menu routes update completed successfully!');
  } catch (error) {
    console.error('Error updating menu routes:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });