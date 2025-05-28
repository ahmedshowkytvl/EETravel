import { storage } from "./storage";

/**
 * Script to seed the database with initial room categories
 */
export async function seedRoomCategories() {
  console.log('🛏️ Seeding room categories...');
  
  // Check if room categories already exist
  const existingCategories = await storage.listRoomCategories();
  
  if (existingCategories.length > 0) {
    console.log('✅ Room categories already seeded');
    return;
  }
  
  // Sample room categories
  const categories = [
    {
      name: 'Standard',
      description: 'Basic comfortable rooms with essential amenities for budget travelers.',
      active: true
    },
    {
      name: 'Deluxe',
      description: 'Premium rooms with enhanced amenities and more space for a luxurious stay.',
      active: true
    },
    {
      name: 'Suite',
      description: 'Spacious multi-room accommodations with separate living areas and premium amenities.',
      active: true
    },
    {
      name: 'Family',
      description: 'Larger rooms designed for families with additional beds and child-friendly amenities.',
      active: true
    }
  ];
  
  // Create room categories
  for (const category of categories) {
    await storage.createRoomCategory(category);
  }
  
  console.log('✅ Room categories seeding complete');
}