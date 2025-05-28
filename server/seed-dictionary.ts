import { db } from './db';
import { dictionaryEntries } from '../shared/schema';

/**
 * Script to seed the database with initial dictionary entries
 */
export async function seedDictionary() {
  console.log('🌱 Seeding dictionary entries...');
  
  // Check if dictionary entries already exist
  const existingEntries = await db.select().from(dictionaryEntries).limit(1);
  if (existingEntries.length > 0) {
    console.log('✅ Dictionary entries already exist');
    return;
  }

  // Sample dictionary entries
  const entries = [
    {
      word: 'travel',
      englishDefinition: 'To go from one place to another, especially over a long distance.',
      arabicTranslation: 'سفر',
      partOfSpeech: 'noun',
      context: 'Tourism',
      example: 'They enjoy travel to exotic destinations.',
      notes: 'Also used as a verb: to travel'
    },
    {
      word: 'hotel',
      englishDefinition: 'An establishment providing accommodation, meals, and other services for travelers and tourists.',
      arabicTranslation: 'فندق',
      partOfSpeech: 'noun',
      context: 'Accommodation',
      example: 'We stayed at a five-star hotel in Cairo.',
      notes: null
    },
    {
      word: 'pyramid',
      englishDefinition: 'A monumental structure with a square or triangular base and sloping sides that meet in a point at the top.',
      arabicTranslation: 'هرم',
      partOfSpeech: 'noun',
      context: 'Landmarks',
      example: 'The Great Pyramid of Giza is the oldest of the Seven Wonders of the Ancient World.',
      notes: 'Plural: pyramids'
    },
    {
      word: 'museum',
      englishDefinition: 'A building in which objects of historical, scientific, artistic, or cultural interest are stored and exhibited.',
      arabicTranslation: 'متحف',
      partOfSpeech: 'noun',
      context: 'Tourism',
      example: 'The Egyptian Museum houses the world\'s largest collection of Pharaonic antiquities.',
      notes: null
    },
    {
      word: 'flight',
      englishDefinition: 'A journey made by air, especially in an airplane.',
      arabicTranslation: 'رحلة جوية',
      partOfSpeech: 'noun',
      context: 'Transportation',
      example: 'Our flight to Cairo takes about four hours.',
      notes: null
    }
  ];

  try {
    // Insert dictionary entries using Drizzle ORM
    const currentDate = new Date();
    
    for (const entry of entries) {
      await db.insert(dictionaryEntries).values({
        word: entry.word.toLowerCase().trim(),
        englishDefinition: entry.englishDefinition,
        arabicTranslation: entry.arabicTranslation,
        partOfSpeech: entry.partOfSpeech,
        context: entry.context,
        example: entry.example,
        notes: entry.notes,
        createdAt: currentDate,
        updatedAt: currentDate
      });
    }
    
    console.log('✅ Dictionary entries seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding dictionary entries:', error);
  }
}

// Run the seed function if this is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDictionary().then(() => {
    console.log('Dictionary seeding complete');
    process.exit(0);
  }).catch(error => {
    console.error('Error during dictionary seeding:', error);
    process.exit(1);
  });
}