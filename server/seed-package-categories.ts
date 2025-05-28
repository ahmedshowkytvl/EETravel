import { storage } from './storage';

export async function seedPackageCategories() {
  console.log('🏷️ Seeding package categories...');

  try {
    // Check if categories already exist
    const existingCategories = await storage.listPackageCategories();
    
    if (existingCategories.length > 0) {
      console.log('✅ Package categories already seeded');
      return;
    }

    // Create the package categories requested by the user
    const categories = [
      {
        name: 'Featured',
        description: 'Our top recommended packages with special offers',
        active: true
      },
      {
        name: 'Cultural',
        description: 'Immersive cultural experiences visiting historical and heritage sites',
        active: true
      },
      {
        name: 'Luxury',
        description: 'Premium travel experiences with high-end accommodations and services',
        active: true
      },
      {
        name: 'Adventure',
        description: 'Exciting outdoor activities and unique experiences for thrill-seekers',
        active: true
      },
      {
        name: 'Beach & Relaxation',
        description: 'Beach getaways and relaxing retreats perfect for unwinding',
        active: true
      },
      {
        name: 'Transportation',
        description: 'Transportation services including transfers and rental options',
        active: true
      },
      {
        name: 'Fly & Stay',
        description: 'Combined flight and accommodation packages for convenient booking',
        active: true
      }
    ];

    // Insert all categories
    for (const category of categories) {
      await storage.createPackageCategory(category);
      console.log(`✅ Created package category: ${category.name}`);
    }

    console.log('✅ Package categories seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding package categories:', error);
  }
}

// Run the function when imported directly
seedPackageCategories()
  .then(() => {
    console.log('✅ Package categories seeding complete');
  })
  .catch(error => {
    console.error('❌ Error in package categories seeding:', error);
  });