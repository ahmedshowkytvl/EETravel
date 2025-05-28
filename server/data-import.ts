import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from './db';
import * as schema from '@shared/schema';

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create the imports directory if it doesn't exist
    const dir = path.join(process.cwd(), 'imports');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename with timestamp
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const uniqueFilename = `${path.parse(file.originalname).name}_${timestamp}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
  fileFilter: function (req, file, cb) {
    // Only allow JSON files
    if (path.extname(file.originalname).toLowerCase() !== '.json') {
      return cb(new Error('Only JSON files are allowed'));
    }
    cb(null, true);
  }
});

// Helper function to handle JSON imports
async function importJsonData(req: Request, tableName: string, handleValidation?: (data: any) => any) {
  if (!req.file) {
    throw new Error('No file uploaded');
  }

  // Read the file
  const fileContent = fs.readFileSync(req.file.path, 'utf8');
  let data;
  
  try {
    data = JSON.parse(fileContent);
  } catch (error) {
    throw new Error('Invalid JSON file');
  }

  // Apply validation if provided
  if (handleValidation) {
    data = handleValidation(data);
  }

  // Process the data - handle array or single object
  const items = Array.isArray(data) ? data : [data];
  
  // Clear the table before import if specified
  // We don't do this by default for safety
  // if (clearBeforeImport) {
  //   await db.execute(`TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE`);
  // }

  // Insert each item
  const results = [];
  const errors = [];
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    try {
      // Remove id if present to let the database assign a new one
      // This way we avoid primary key conflicts
      const { id, ...rest } = item;
      
      const result = await db.insert((schema as any)[tableName]).values(rest).returning();
      results.push(result[0]);
    } catch (error) {
      console.error(`Error importing item ${i + 1}:`, error);
      errors.push({
        itemIndex: i + 1,
        item: item,
        error: error.message || error.toString()
      });
      // Continue with next item instead of failing the whole import
    }
  }

  // Clean up the temporary file
  if (req.file && req.file.path) {
    try {
      fs.unlinkSync(req.file.path);
    } catch (error) {
      console.error('Error cleaning up temp file:', error);
    }
  }

  return { results, errors, summary: { total: items.length, imported: results.length, failed: errors.length } };
}

export const importHandlers = {
  async importRooms(req: Request, res: Response) {
    try {
      const importResult = await importJsonData(req, 'rooms');
      res.json({ 
        success: true, 
        count: importResult.results.length, 
        results: importResult.results,
        errors: importResult.errors,
        summary: importResult.summary
      });
    } catch (error: any) {
      console.error('Error importing rooms:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to import rooms' });
    }
  },

  async importHotels(req: Request, res: Response) {
    try {
      // Enhanced validation for hotel imports
      const validateHotelData = (data: any) => {
        const items = Array.isArray(data) ? data : [data];
        return items.map(item => {
          // Ensure required fields exist - only name and destinationId are truly required
          if (!item.name || !item.destinationId) {
            throw new Error(`Hotel missing required fields: name, destinationId`);
          }
          
          // Set defaults for optional fields
          return {
            ...item,
            stars: item.stars || 3,
            featured: item.featured || false,
            parkingAvailable: item.parkingAvailable || false,
            airportTransferAvailable: item.airportTransferAvailable || false,
            carRentalAvailable: item.carRentalAvailable || false,
            shuttleAvailable: item.shuttleAvailable || false,
            status: item.status || 'active',
            checkInTime: item.checkInTime || '14:00',
            checkOutTime: item.checkOutTime || '12:00',
            rating: item.rating || null,
            reviewCount: item.reviewCount || 0,
            guestRating: item.guestRating || null
          };
        });
      };

      const importResult = await importJsonData(req, 'hotels', validateHotelData);
      res.json({ 
        success: true, 
        count: importResult.results.length, 
        results: importResult.results,
        errors: importResult.errors,
        summary: importResult.summary,
        message: `Successfully imported ${importResult.results.length} hotels` 
      });
    } catch (error: any) {
      console.error('Error importing hotels:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Failed to import hotels',
        details: error.toString()
      });
    }
  },

  async importTours(req: Request, res: Response) {
    try {
      const results = await importJsonData(req, 'tours');
      res.json({ success: true, count: results.length, results });
    } catch (error: any) {
      console.error('Error importing tours:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to import tours' });
    }
  },

  async importPackages(req: Request, res: Response) {
    try {
      const results = await importJsonData(req, 'packages');
      res.json({ success: true, count: results.length, results });
    } catch (error: any) {
      console.error('Error importing packages:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to import packages' });
    }
  },

  async importTransportationTypes(req: Request, res: Response) {
    try {
      const results = await importJsonData(req, 'transportation_types');
      res.json({ success: true, count: results.length, results });
    } catch (error: any) {
      console.error('Error importing transportation types:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to import transportation types' });
    }
  },

  async importTransportationLocations(req: Request, res: Response) {
    try {
      const results = await importJsonData(req, 'transportation_locations');
      res.json({ success: true, count: results.length, results });
    } catch (error: any) {
      console.error('Error importing transportation locations:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to import transportation locations' });
    }
  },

  async importTransportationDurations(req: Request, res: Response) {
    try {
      const results = await importJsonData(req, 'transportation_durations');
      res.json({ success: true, count: results.length, results });
    } catch (error: any) {
      console.error('Error importing transportation durations:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to import transportation durations' });
    }
  },

  async importPackageCategories(req: Request, res: Response) {
    try {
      const results = await importJsonData(req, 'package_categories');
      res.json({ success: true, count: results.length, results });
    } catch (error: any) {
      console.error('Error importing package categories:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to import package categories' });
    }
  },

  async importRoomCategories(req: Request, res: Response) {
    try {
      const results = await importJsonData(req, 'room_categories');
      res.json({ success: true, count: results.length, results });
    } catch (error: any) {
      console.error('Error importing room categories:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to import room categories' });
    }
  },

  async importTourCategories(req: Request, res: Response) {
    try {
      const results = await importJsonData(req, 'tour_categories');
      res.json({ success: true, count: results.length, results });
    } catch (error: any) {
      console.error('Error importing tour categories:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to import tour categories' });
    }
  },

  async importHotelCategories(req: Request, res: Response) {
    try {
      const results = await importJsonData(req, 'hotel_categories');
      res.json({ success: true, count: results.length, results });
    } catch (error: any) {
      console.error('Error importing hotel categories:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to import hotel categories' });
    }
  },

  async importFullDatabase(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      // Read the file
      const fileContent = fs.readFileSync(req.file.path, 'utf8');
      let data;
      
      try {
        data = JSON.parse(fileContent);
      } catch (error) {
        return res.status(400).json({ success: false, message: 'Invalid JSON file' });
      }

      // Get list of tables in the export
      const tables = Object.keys(data);
      
      // Import each table
      const results: Record<string, any> = {};
      
      for (const table of tables) {
        try {
          // Skip system tables or tables we don't want to import
          if (table === 'migrations' || table === 'pg_stat_statements') {
            continue;
          }

          // Get the items for this table
          const items = data[table];
          
          if (!Array.isArray(items) || items.length === 0) {
            results[table] = { count: 0, message: 'No items to import or invalid data format' };
            continue;
          }
          
          // Insert items one by one to handle errors gracefully
          let successCount = 0;
          
          for (const item of items) {
            try {
              // Remove id if present to let the database assign a new one
              const { id, ...rest } = item;
              
              // Check if required fields are missing and handle appropriately
              try {
                // Use the schema tables directly instead of db.table()
                switch(table) {
                  case 'countries':
                    // Check if required fields are present
                    if (!rest.name || !rest.code) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    
                    try {
                      await db.insert(schema.countries).values({
                        name: rest.name,
                        code: rest.code,
                        description: rest.description || null,
                        imageUrl: rest.image_url || null,
                        active: rest.active !== undefined ? rest.active : true,
                      }).returning();
                    } catch (insertError) {
                      console.log(`Error inserting country: ${insertError}`);
                      continue;
                    }
                    break;
                    
                  case 'cities':
                    // Skip if country_id is missing (required foreign key)
                    if (!rest.country_id) {
                      console.log(`Skipping import for ${table} due to missing country_id: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    
                    try {
                      await db.insert(schema.cities).values({
                        name: rest.name,
                        countryId: rest.country_id,
                        description: rest.description || null,
                        imageUrl: rest.image_url || null,
                        active: rest.active !== undefined ? rest.active : true,
                      }).returning();
                    } catch (insertError) {
                      console.log(`Error inserting city: ${insertError}`);
                      continue;
                    }
                    break;
                    
                  case 'airports':
                    // Skip if city_id is missing (required foreign key)
                    if (!rest.city_id) {
                      console.log(`Skipping import for ${table} due to missing city_id: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    
                    try {
                      await db.insert(schema.airports).values({
                        name: rest.name,
                        cityId: rest.city_id,
                        code: rest.code || null,
                        description: rest.description || null,
                        imageUrl: rest.image_url || null,
                        active: rest.active !== undefined ? rest.active : true,
                      }).returning();
                    } catch (insertError) {
                      console.log(`Error inserting airport: ${insertError}`);
                      continue;
                    }
                    break;
                    
                  case 'users':
                    // Skip if username, password, or email is missing
                    if (!rest.username || !rest.password || !rest.email) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(schema.users).values(rest).returning();
                    break;
                    
                  case 'destinations':
                    // Skip if name or country is missing
                    if (!rest.name || !rest.country) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(schema.destinations).values(rest).returning();
                    break;
                    
                  case 'packages':
                    // Skip if title, description, price, or duration is missing
                    if (!rest.title || !rest.description || !rest.price || !rest.duration) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    
                    try {
                      // Create a modified slug to avoid unique constraint violations
                      const timestamp = new Date().getTime().toString().slice(-4);
                      const packageData = {
                        title: rest.title,
                        description: rest.description,
                        price: rest.price,
                        discountedPrice: rest.discounted_price || null,
                        imageUrl: rest.image_url || null,
                        galleryUrls: rest.gallery_urls || null,
                        duration: rest.duration,
                        rating: rest.rating || null,
                        reviewCount: rest.review_count || 0,
                        destinationId: rest.destination_id || null,
                        countryId: rest.country_id || null,
                        cityId: rest.city_id || null,
                        featured: rest.featured !== undefined ? rest.featured : false,
                        type: rest.type || null,
                        inclusions: rest.inclusions || null,
                        // Generate a unique slug by appending a timestamp if it exists
                        slug: rest.slug ? `${rest.slug}-${timestamp}` : null
                      };
                      
                      await db.insert(schema.packages).values(packageData).returning();
                    } catch (insertError) {
                      console.log(`Error inserting package: ${insertError}`);
                      continue;
                    }
                    break;
                    
                  case 'bookings':
                    // Skip if missing required fields
                    if (!rest.booking_date || !rest.travel_date || !rest.number_of_travelers || !rest.total_price) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(schema.bookings).values(rest).returning();
                    break;
                    
                  case 'favorites':
                    // Skip if user_id or destination_id is missing
                    if (!rest.user_id || !rest.destination_id) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(schema.favorites).values(rest).returning();
                    break;
                    
                  case 'tours':
                    // Skip if name, price, or duration is missing
                    if (!rest.name || !rest.price || !rest.duration) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(schema.tours).values(rest).returning();
                    break;
                    
                  case 'hotels':
                    // Skip if name is missing
                    if (!rest.name) {
                      console.log(`Skipping import for ${table} due to missing name: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(schema.hotels).values(rest).returning();
                    break;
                    
                  case 'rooms':
                    // Skip if name, hotel_id, type, max_occupancy, max_adults, or price is missing
                    if (!rest.name || !rest.hotel_id || !rest.type || !rest.max_occupancy || !rest.max_adults || !rest.price) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    
                    try {
                      await db.insert(schema.rooms).values({
                        name: rest.name,
                        hotelId: rest.hotel_id, 
                        type: rest.type,
                        maxOccupancy: rest.max_occupancy,
                        maxAdults: rest.max_adults,
                        maxChildren: rest.max_children !== undefined ? rest.max_children : 0,
                        maxInfants: rest.max_infants !== undefined ? rest.max_infants : 0,
                        price: rest.price,
                        discountedPrice: rest.discounted_price || null,
                        description: rest.description || null,
                        imageUrl: rest.image_url || null,
                        size: rest.size || null,
                        bedType: rest.bed_type || null,
                        amenities: rest.amenities || null,
                        view: rest.view || null,
                        available: rest.available !== undefined ? rest.available : true,
                        status: rest.status || 'active',
                      }).returning();
                    } catch (insertError) {
                      console.log(`Error inserting room: ${insertError}`);
                      continue;
                    }
                    break;
                    
                  case 'room_combinations':
                    // Skip if room_id, adults_count, or children_count is missing
                    if (!rest.room_id || rest.adults_count === undefined || rest.children_count === undefined) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(schema.roomCombinations).values(rest).returning();
                    break;
                    
                  case 'menus':
                    // Skip if name or location is missing
                    if (!rest.name || !rest.location) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(schema.menus).values(rest).returning();
                    break;
                    
                  case 'menu_items':
                    // Skip if menu_id, title, or order is missing
                    if (!rest.menu_id || !rest.title || rest.order === undefined) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(schema.menuItems).values(rest).returning();
                    break;
                    
                  case 'translations':
                    // Skip if key or en_text is missing
                    if (!rest.key || !rest.en_text) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(schema.translations).values(rest).returning();
                    break;
                    
                  case 'site_language_settings':
                    // Skip if defaultLanguage is missing
                    if (!rest.default_language) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(schema.siteLanguageSettings).values(rest).returning();
                    break;
                    
                  case 'dictionary_entries':
                    // Skip if word, english_definition, or arabic_translation is missing
                    if (!rest.word || !rest.english_definition || !rest.arabic_translation) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(schema.dictionaryEntries).values(rest).returning();
                    break;
                    
                  case 'transport_locations':
                    // Skip if name, city, country, or location_type is missing
                    if (!rest.name || !rest.city || !rest.country || !rest.location_type) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(schema.transportLocations).values(rest).returning();
                    break;
                    
                  case 'transport_durations':
                    // Skip if name or hours is missing
                    if (!rest.name || rest.hours === undefined) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(schema.transportDurations).values(rest).returning();
                    break;
                    
                  case 'transport_types':
                    // Skip if name, passenger_capacity, or baggage_capacity is missing
                    if (!rest.name || rest.passenger_capacity === undefined || rest.baggage_capacity === undefined) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(schema.transportTypes).values(rest).returning();
                    break;
                    
                  case 'transportation':
                    // Skip if name, passenger_capacity, baggage_capacity, or price is missing
                    if (!rest.name || rest.passenger_capacity === undefined || rest.baggage_capacity === undefined || rest.price === undefined) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(schema.transportation).values(rest).returning();
                    break;
                    
                  default:
                    console.log(`Skipping unknown table: ${table}`);
                    continue;
                }
                successCount++;
              } catch (error) {
                console.error(`Error importing item to ${table}:`, error);
                // Just continue with next item
              }
            } catch (error) {
              console.error(`Error importing item to ${table}:`, error);
              // Continue with next item
            }
          }
          
          results[table] = { count: successCount };
        } catch (error) {
          console.error(`Error importing table ${table}:`, error);
          results[table] = { count: 0, error: 'Failed to import table' };
        }
      }
      
      // Clean up the temporary file
      fs.unlinkSync(req.file.path);
      
      res.json({ success: true, results });
    } catch (error: any) {
      console.error('Error importing full database:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to import full database' });
    }
  }
};