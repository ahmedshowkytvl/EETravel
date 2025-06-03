import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "./shared/schema";
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:a@localhost:5432/postgres';

async function fixFooterMenu() {
  console.log('Fixing footer menu...');
  
  try {
    const client = postgres(DATABASE_URL, {
      ssl: DATABASE_URL.includes('localhost') ? false : 'require',
    });
    
    const db = drizzle(client, { schema });
    
    // Check if menus table exists and create basic menu structure
    console.log('Creating footer menu...');
    
    // First try to create the footer menu
    const menuData = {
      name: 'Footer Menu',
      location: 'footer',
      description: 'Main footer menu links',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert or update footer menu
    const [footerMenu] = await db.insert(schema.menus)
      .values(menuData)
      .onConflictDoUpdate({
        target: schema.menus.location,
        set: {
          name: menuData.name,
          description: menuData.description,
          active: menuData.active,
          updatedAt: new Date()
        }
      })
      .returning();
    
    console.log('Footer menu created:', footerMenu.name);
    
    // Check if menu items exist
    const existingItems = await db.select()
      .from(schema.menuItems)
      .where(eq(schema.menuItems.menuId, footerMenu.id));
    
    if (existingItems.length === 0) {
      console.log('Creating menu items...');
      
      const footerItems = [
        { title: 'Home', url: '/', order: 0 },
        { title: 'Destinations', url: '/destinations', order: 1 },
        { title: 'Packages', url: '/packages', order: 2 },
        { title: 'About Us', url: '/about', order: 3 },
        { title: 'Contact', url: '/contact', order: 4 }
      ];
      
      for (const item of footerItems) {
        await db.insert(schema.menuItems).values({
          title: item.title,
          url: item.url,
          order: item.order,
          menuId: footerMenu.id,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      console.log('Menu items created successfully');
    } else {
      console.log('Menu items already exist');
    }
    
    await client.end();
    console.log('Footer menu setup complete');
    
  } catch (error) {
    console.error('Error fixing footer menu:', error);
  }
}

fixFooterMenu();