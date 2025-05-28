import { z } from "zod";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Dictionary entries schema
export const dictionaryEntries = pgTable("dictionary_entries", {
  id: serial("id").primaryKey(),
  word: text("word").notNull(),
  englishDefinition: text("english_definition").notNull(),
  arabicTranslation: text("arabic_translation").notNull(),
  partOfSpeech: text("part_of_speech"),
  context: text("context"),
  example: text("example"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define insert schema for dictionary entries
export const insertDictionaryEntrySchema = createInsertSchema(dictionaryEntries).pick({
  word: true,
  englishDefinition: true,
  arabicTranslation: true,
  partOfSpeech: true,
  context: true,
  example: true,
  notes: true,
});

// Define dictionary entry types
export type DictionaryEntry = typeof dictionaryEntries.$inferSelect;
export type InsertDictionaryEntry = z.infer<typeof insertDictionaryEntrySchema>;