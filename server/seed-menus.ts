import { db } from './db';
import { menus, menuItems } from '@shared/schema';
import { storage } from './storage';
import { eq } from 'drizzle-orm';

/**
 * Script to seed the database with initial menu data
 * @param {boolean} reset - Whether to reset existing menus before seeding
 */
async function seedMenus(reset = false) {
  console.log('🌱 Seeding menus...');
  
  try {
    // Check if we already have menus
    const existingMenus = await db.select().from(menus);
    
    if (existingMenus.length > 0) {
      if (reset) {
        console.log('🔄 Resetting existing menus...');
        // Delete all menu items first (to avoid foreign key constraints)
        await db.delete(menuItems);
        // Then delete all menus
        await db.delete(menus);
        console.log('✅ Existing menus reset successfully');
      } else {
        console.log('✅ Menus already seeded');
        return;
      }
    }
    
    // Use Drizzle ORM for PostgreSQL compatibility
    const currentDate = new Date();
    
    // Create footer menu
    await db.insert(menus).values({
      name: 'Footer Menu',
      location: 'footer',
      description: 'Main footer menu links',
      active: true,
      createdAt: currentDate,
      updatedAt: currentDate
    });
    
    const [footerMenu] = await db.select().from(menus).where(eq(menus.name, 'Footer Menu'));
    
    if (!footerMenu) {
      throw new Error('Failed to create footer menu');
    }
    
    console.log(`Created menu: ${footerMenu.name}`);
    
    // Add menu items to footer
    const footerItems = [
      {
        title: 'Home',
        url: '/',
        order: 0,
        menuId: footerMenu.id,
        active: 1
      },
      {
        title: 'Destinations',
        url: '/destinations',
        order: 1,
        menuId: footerMenu.id,
        active: 1
      },
      {
        title: 'Packages',
        url: '/packages',
        order: 2,
        menuId: footerMenu.id,
        active: 1
      },
      {
        title: 'Visas',
        url: '/visas',
        order: 3,
        menuId: footerMenu.id,
        active: 1
      },
      {
        title: 'About Us',
        url: '/about',
        order: 4,
        menuId: footerMenu.id,
        active: 1
      },
      {
        title: 'Contact',
        url: '/contact',
        order: 5,
        menuId: footerMenu.id,
        active: 1
      }
    ];
    
    for (const item of footerItems) {
      await db.insert(menuItems).values({
        title: item.title,
        url: item.url,
        order: item.order,
        menuId: item.menuId,
        active: item.active === 1 ? true : false,
        createdAt: currentDate,
        updatedAt: currentDate
      });
    }
    
    // Create header menu
    await db.insert(menus).values({
      name: 'Header Menu',
      location: 'header',
      description: 'Main navigation menu',
      active: true,
      createdAt: currentDate,
      updatedAt: currentDate
    });
    
    const [headerMenu] = await db.select().from(menus).where(eq(menus.name, 'Header Menu'));
    
    if (!headerMenu) {
      throw new Error('Failed to create header menu');
    }
    
    console.log(`Created menu: ${headerMenu.name}`);
    
    // Add menu items to header
    const headerItems = [
      {
        title: 'Home',
        url: '/',
        order: 0,
        menuId: headerMenu.id,
        active: 1
      },
      {
        title: 'Destinations',
        url: '/destinations',
        order: 1,
        menuId: headerMenu.id,
        active: 1
      },
      {
        title: 'Tours',
        url: '/tours',
        order: 2,
        menuId: headerMenu.id,
        active: 1
      },
      {
        title: 'Hotels',
        url: '/hotels',
        order: 3,
        menuId: headerMenu.id,
        active: 1
      },
      {
        title: 'Packages',
        url: '/packages',
        order: 4,
        menuId: headerMenu.id,
        active: 1
      },
      {
        title: 'Transportation',
        url: '/transportation',
        order: 5,
        menuId: headerMenu.id,
        active: 1
      },
      {
        title: 'About',
        url: '/about',
        order: 6,
        menuId: headerMenu.id,
        active: 1
      },
      {
        title: 'Contact',
        url: '/contact',
        order: 7,
        menuId: headerMenu.id,
        active: 1
      }
    ];
    
    // Insert main menu items first
    const menuItemIds: Record<string, number> = {};
    for (const item of headerItems) {
      const [insertedItem] = await db.insert(menuItems).values({
        title: item.title,
        url: item.url,
        order: item.order,
        menuId: item.menuId,
        active: item.active === 1 ? true : false,
        createdAt: currentDate,
        updatedAt: currentDate
      }).returning();
      
      // Store the ID of each menu item for potential parent-child relationships
      if (insertedItem) {
        menuItemIds[item.title] = insertedItem.id;
      }
    }
    
    // Add vehicle types as submenu items under Transportation
    const vehicleTypes = [
      {
        title: 'Sedan',
        url: '/transportation/sedan',
        order: 0,
        parentId: menuItemIds['Transportation'],
        menuId: headerMenu.id,
        active: 1
      },
      {
        title: 'SUV',
        url: '/transportation/suv',
        order: 1,
        parentId: menuItemIds['Transportation'],
        menuId: headerMenu.id,
        active: 1
      },
      {
        title: 'Van',
        url: '/transportation/van',
        order: 2,
        parentId: menuItemIds['Transportation'],
        menuId: headerMenu.id,
        active: 1
      },
      {
        title: 'Luxury',
        url: '/transportation/luxury',
        order: 3,
        parentId: menuItemIds['Transportation'],
        menuId: headerMenu.id,
        active: 1
      }
    ];
    
    // Insert submenu items
    for (const subItem of vehicleTypes) {
      await db.insert(menuItems).values({
        title: subItem.title,
        url: subItem.url,
        order: subItem.order,
        parentId: subItem.parentId,
        menuId: subItem.menuId,
        active: subItem.active === 1 ? true : false,
        createdAt: currentDate,
        updatedAt: currentDate
      });
    }
    
    console.log('✅ Successfully seeded menus');
  } catch (error) {
    console.error('❌ Error seeding menus:', error);
  }
}

// Run the seed function if this is executed directly
// Using ESM syntax instead of CommonJS
if (import.meta.url === `file://${process.argv[1]}`) {
  seedMenus().then(() => {
    console.log('Seeding complete');
    process.exit(0);
  }).catch(error => {
    console.error('Error during seeding:', error);
    process.exit(1);
  });
}

export { seedMenus };