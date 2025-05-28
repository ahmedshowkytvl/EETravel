import { faker } from "@faker-js/faker";
import { db } from "./server/db";
import { rooms, hotels } from "./shared/schema";
import { eq } from "drizzle-orm";

async function seedRooms() {
  console.log("🛏️ Seeding rooms...");
  
  // Get all hotels
  const hotelsList = await db.select().from(hotels);
  
  if (hotelsList.length === 0) {
    console.log("❌ No hotels found. Please seed hotels first.");
    return;
  }
  
  // Room types and categories
  const roomTypes = ["Standard", "Deluxe", "Suite", "Executive", "Family", "Penthouse"];
  const viewTypes = ["City View", "Garden View", "Pool View", "Ocean View", "Mountain View", "Landmark View"];
  const bedTypes = ["King", "Queen", "Twin", "Double", "Single", "King + Single"];
  
  // Common amenities for rooms
  const commonAmenities = [
    "Free Wi-Fi", 
    "Flat-screen TV", 
    "Air conditioning", 
    "Mini fridge", 
    "Coffee maker", 
    "Safe", 
    "Hairdryer", 
    "Iron and ironing board", 
    "Desk", 
    "Telephone",
    "Bathtub",
    "Shower",
    "Toiletries",
    "Bathrobes",
    "Slippers"
  ];
  
  // Premium amenities for higher-tier rooms
  const premiumAmenities = [
    "Private balcony", 
    "Jacuzzi", 
    "Rain shower", 
    "Espresso machine", 
    "Smart TV", 
    "Bluetooth speakers", 
    "Mini bar", 
    "Complimentary snacks", 
    "Turn-down service",
    "24-hour room service",
    "Pillow menu",
    "Premium linens",
    "Walk-in closet",
    "Separate living area",
    "Dining area"
  ];
  
  // Generate 100 rooms
  let roomsToInsert = [];
  let count = 0;
  
  for (let i = 0; i < 100; i++) {
    // Distribute rooms fairly among hotels
    const hotel = hotelsList[i % hotelsList.length];
    const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
    
    // Determine amenities based on room type
    let roomAmenities = [...commonAmenities];
    
    // Add premium amenities to higher-tier rooms
    if (roomType === "Deluxe" || roomType === "Suite" || roomType === "Executive" || roomType === "Penthouse") {
      // Add 3-7 premium amenities
      const numPremiumAmenities = Math.floor(Math.random() * 5) + 3;
      const selectedPremiumAmenities = faker.helpers.arrayElements(premiumAmenities, numPremiumAmenities);
      roomAmenities = [...roomAmenities, ...selectedPremiumAmenities];
    }
    
    // Set price based on room type
    let basePrice = 0;
    let maxAdults = 2;
    let maxChildren = 1;
    let maxInfants = 1;
    let roomSize = "";
    
    switch (roomType) {
      case "Standard":
        basePrice = faker.number.int({ min: 80, max: 150 });
        maxAdults = 2;
        roomSize = `${faker.number.int({ min: 25, max: 35 })} m²`;
        break;
      case "Deluxe":
        basePrice = faker.number.int({ min: 150, max: 250 });
        maxAdults = 2;
        maxChildren = 2;
        roomSize = `${faker.number.int({ min: 35, max: 45 })} m²`;
        break;
      case "Suite":
        basePrice = faker.number.int({ min: 250, max: 400 });
        maxAdults = 3;
        maxChildren = 2;
        maxInfants = 2;
        roomSize = `${faker.number.int({ min: 45, max: 60 })} m²`;
        break;
      case "Executive":
        basePrice = faker.number.int({ min: 300, max: 500 });
        maxAdults = 2;
        maxChildren = 2;
        roomSize = `${faker.number.int({ min: 40, max: 55 })} m²`;
        break;
      case "Family":
        basePrice = faker.number.int({ min: 200, max: 350 });
        maxAdults = 4;
        maxChildren = 3;
        maxInfants = 2;
        roomSize = `${faker.number.int({ min: 50, max: 70 })} m²`;
        break;
      case "Penthouse":
        basePrice = faker.number.int({ min: 500, max: 1000 });
        maxAdults = 4;
        maxChildren = 4;
        maxInfants = 2;
        roomSize = `${faker.number.int({ min: 80, max: 150 })} m²`;
        break;
    }
    
    // Maybe apply discount (30% chance)
    const hasDiscount = Math.random() < 0.3;
    const discountPercentage = hasDiscount ? faker.number.int({ min: 10, max: 25 }) : 0;
    const discountedPrice = hasDiscount ? Math.round(basePrice * (1 - discountPercentage / 100)) : basePrice;
    
    // Create a room name
    const roomName = roomType === "Penthouse" ? 
      `${roomType} Suite ${faker.number.int({ min: 1, max: 5 })}` : 
      `${roomType} ${roomTypes.indexOf(roomType) < 2 ? "Room" : "Suite"} ${faker.number.int({ min: 101, max: 999 })}`;
    
    // Select a view type
    const view = viewTypes[Math.floor(Math.random() * viewTypes.length)];
    
    // Select a bed type
    const bedType = bedTypes[Math.floor(Math.random() * bedTypes.length)];
    
    // Room image (using placeholder images for now)
    const imageIndex = faker.number.int({ min: 1, max: 10 });
    const imageUrl = `https://source.unsplash.com/random/800x600/?hotel,room,${roomType.toLowerCase()},${count % 10}`;

    const room = {
      name: roomName,
      description: `${roomType} room featuring ${bedType} bed(s), with ${view.toLowerCase()}. ${faker.lorem.sentences(2)}`,
      hotelId: hotel.id,
      type: roomType,
      maxOccupancy: maxAdults + maxChildren,
      maxAdults,
      maxChildren,
      maxInfants,
      price: basePrice,
      discountedPrice: discountedPrice,
      imageUrl,
      size: roomSize,
      bedType,
      amenities: JSON.stringify(roomAmenities),
      view,
      available: true,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    roomsToInsert.push(room);
    count++;
  }
  
  // Insert rooms in batches
  for (let i = 0; i < roomsToInsert.length; i++) {
    try {
      await db.insert(rooms).values(roomsToInsert[i]);
      console.log(`✅ Added room: ${roomsToInsert[i].name} for hotel ID ${roomsToInsert[i].hotelId}`);
    } catch (error) {
      console.error(`❌ Error adding room: ${roomsToInsert[i].name}`, error);
    }
  }
  
  console.log(`✅ Added ${count} rooms successfully`);
}

// Execute the seeding function
async function main() {
  await seedRooms();
  process.exit(0);
}

main().catch(err => {
  console.error("Error seeding rooms:", err);
  process.exit(1);
});