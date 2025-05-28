import { sqliteTable, text, integer, primaryKey, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Countries table
export const countries = sqliteTable("countries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  code: text("code").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").notNull().default(String(new Date())),
  updatedAt: text("updated_at").default(String(new Date())),
});

// Cities table
export const cities = sqliteTable("cities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  countryId: integer("country_id").notNull().references(() => countries.id),
  description: text("description"),
  imageUrl: text("image_url"),
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").notNull().default(String(new Date())),
  updatedAt: text("updated_at").default(String(new Date())),
});

// Airports table
export const airports = sqliteTable("airports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  cityId: integer("city_id").notNull().references(() => cities.id),
  code: text("code"), // IATA code (optional)
  description: text("description"),
  imageUrl: text("image_url"),
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").notNull().default(String(new Date())),
  updatedAt: text("updated_at").default(String(new Date())),
});

// Define relations after all tables are defined to avoid circular dependencies
export const countriesRelations = relations(countries, ({ many }) => ({
  cities: many(cities),
}));

export const citiesRelations = relations(cities, ({ one, many }) => ({
  country: one(countries, {
    fields: [cities.countryId],
    references: [countries.id],
  }),
  airports: many(airports),
}));

export const airportsRelations = relations(airports, ({ one }) => ({
  city: one(cities, {
    fields: [airports.cityId],
    references: [cities.id],
  }),
}));

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phoneNumber: text("phone_number"),
  fullName: text("full_name"),
  role: text("role").default("user").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  status: text("status").default("active"),
  createdAt: text("created_at").notNull().default(String(new Date())),
  updatedAt: text("updated_at").default(String(new Date())),
});

export const destinations = sqliteTable("destinations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  country: text("country").notNull(),
  countryId: integer("country_id").references(() => countries.id),
  cityId: integer("city_id").references(() => cities.id),
  description: text("description"),
  imageUrl: text("image_url"),
  featured: integer("featured", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull().default(String(new Date())),
  updatedAt: text("updated_at").default(String(new Date())),
});

export const packages = sqliteTable("packages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  discountedPrice: integer("discounted_price"),
  imageUrl: text("image_url"),
  galleryUrls: text("gallery_urls"), // SQLite doesn't have native JSON, store as string
  duration: integer("duration").notNull(),
  rating: integer("rating"),
  reviewCount: integer("review_count").default(0),
  destinationId: integer("destination_id").references(() => destinations.id),
  countryId: integer("country_id").references(() => countries.id),
  cityId: integer("city_id").references(() => cities.id),
  featured: integer("featured", { mode: "boolean" }).default(false),
  type: text("type"),
  inclusions: text("inclusions"), // SQLite doesn't have native JSON, store as string
  slug: text("slug").unique(), // Friendly URL slug
});

export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  packageId: integer("package_id").references(() => packages.id),
  bookingDate: text("booking_date").notNull().default(String(new Date())),
  travelDate: text("travel_date").notNull(),
  numberOfTravelers: integer("number_of_travelers").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: text("status").default("pending").notNull(),
});

// User favorites
export const favorites = sqliteTable("favorites", {
  userId: integer("user_id").notNull().references(() => users.id),
  destinationId: integer("destination_id").notNull().references(() => destinations.id),
  createdAt: text("created_at").notNull().default(String(new Date())),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.destinationId] }),
  };
});

// Tours table
export const tours = sqliteTable("tours", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  galleryUrls: text("gallery_urls"), // SQLite doesn't have native JSON, store as string
  destinationId: integer("destination_id").references(() => destinations.id),
  tripType: text("trip_type"),
  duration: integer("duration").notNull(),
  date: text("date"),
  numPassengers: integer("num_passengers"),
  price: integer("price").notNull(),
  discountedPrice: integer("discounted_price"),
  included: text("included"), // SQLite doesn't have native JSON, store as string
  excluded: text("excluded"), // SQLite doesn't have native JSON, store as string
  itinerary: text("itinerary"),
  maxGroupSize: integer("max_group_size"),
  featured: integer("featured", { mode: "boolean" }).default(false),
  rating: real("rating"),
  reviewCount: integer("review_count").default(0),
  status: text("status").default("active"),
  createdAt: text("created_at").notNull().default(String(new Date())),
  updatedAt: text("updated_at").default(String(new Date())),
});

// Hotels table
export const hotels = sqliteTable("hotels", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  destinationId: integer("destination_id").references(() => destinations.id),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  postalCode: text("postal_code"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  imageUrl: text("image_url"),
  stars: integer("stars"),
  amenities: text("amenities"), // SQLite doesn't have native JSON, store as string
  checkInTime: text("check_in_time"),
  checkOutTime: text("check_out_time"),
  longitude: real("longitude"),
  latitude: real("latitude"),
  featured: integer("featured", { mode: "boolean" }).default(false),
  rating: real("rating"),
  reviewCount: integer("review_count").default(0),
  guestRating: real("guest_rating"), // Added guest rating
  parkingAvailable: integer("parking_available", { mode: "boolean" }).default(false),
  airportTransferAvailable: integer("airport_transfer_available", { mode: "boolean" }).default(false),
  carRentalAvailable: integer("car_rental_available", { mode: "boolean" }).default(false),
  shuttleAvailable: integer("shuttle_available", { mode: "boolean" }).default(false),
  status: text("status").default("active"),
  createdAt: text("created_at").notNull().default(String(new Date())),
  updatedAt: text("updated_at").default(String(new Date())),
});

// Rooms table
export const rooms = sqliteTable("rooms", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  hotelId: integer("hotel_id").references(() => hotels.id).notNull(),
  type: text("type").notNull(),
  maxOccupancy: integer("max_occupancy").notNull(),
  maxAdults: integer("max_adults").notNull(),
  maxChildren: integer("max_children").notNull().default(0),
  maxInfants: integer("max_infants").notNull().default(0),
  price: integer("price").notNull(),
  discountedPrice: integer("discounted_price"),
  imageUrl: text("image_url"),
  size: text("size"),
  bedType: text("bed_type"),
  amenities: text("amenities"), // SQLite doesn't have native JSON, store as string
  view: text("view"),
  available: integer("available", { mode: "boolean" }).default(true),
  status: text("status").default("active"),
  createdAt: text("created_at").notNull().default(String(new Date())),
  updatedAt: text("updated_at").default(String(new Date())),
});

// Room Combinations table
export const roomCombinations = sqliteTable("room_combinations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roomId: integer("room_id").references(() => rooms.id).notNull(),
  adultsCount: integer("adults_count").notNull(),
  childrenCount: integer("children_count").notNull().default(0),
  infantsCount: integer("infants_count").notNull().default(0),
  description: text("description"),
  isDefault: integer("is_default", { mode: "boolean" }).default(false),
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").notNull().default(String(new Date())),
  updatedAt: text("updated_at").default(String(new Date())),
});

// Menus table for storing navigation menus
export const menus = sqliteTable("menus", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  location: text("location").notNull(), // header, footer_quick_links, footer_destinations, etc.
  description: text("description"),
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").notNull().default(String(new Date())),
  updatedAt: text("updated_at").default(String(new Date())),
});

// Menu Items table for storing menu items
export const menuItems = sqliteTable("menu_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  menuId: integer("menu_id").references(() => menus.id).notNull(),
  parentId: integer("parent_id"),
  title: text("title").notNull(),
  url: text("url"), // URL is now optional
  icon: text("icon"), // FontAwesome icon name
  iconType: text("icon_type").default("fas"), // fas, fab, far, etc.
  itemType: text("item_type").default("link"), // "link" or "heading"
  order: integer("order").notNull(),
  target: text("target").default("_self"), // _self, _blank, etc.
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").notNull().default(String(new Date())),
  updatedAt: text("updated_at").default(String(new Date())),
});

// Define relations for rooms and room combinations
export const roomsRelations = relations(rooms, ({ many, one }) => ({
  combinations: many(roomCombinations),
  hotel: one(hotels, {
    fields: [rooms.hotelId],
    references: [hotels.id],
  }),
}));

export const roomCombinationsRelations = relations(roomCombinations, ({ one }) => ({
  room: one(rooms, {
    fields: [roomCombinations.roomId],
    references: [rooms.id],
  }),
}));

// Hotel categories
export const hotelCategories = sqliteTable("hotel_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").notNull().default(String(new Date())),
  updatedAt: text("updated_at").default(String(new Date())),
});

// Many-to-many relation between hotels and categories
export const hotelToCategory = sqliteTable("hotel_to_category", {
  hotelId: integer("hotel_id").notNull().references(() => hotels.id),
  categoryId: integer("category_id").notNull().references(() => hotelCategories.id),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.hotelId, table.categoryId] }),
  };
});

// Define relations for hotels and categories
export const hotelCategoriesRelations = relations(hotelCategories, ({ many }) => ({
  hotels: many(hotelToCategory),
}));

// Define minimal relation for hotels first - we'll extend this later
export const hotelsRelations = relations(hotels, ({ many, one }) => ({
  rooms: many(rooms),
  destination: one(destinations, {
    fields: [hotels.destinationId],
    references: [destinations.id],
  }),
  categories: many(hotelToCategory),
}));

// Translations schema
export const translations = sqliteTable("translations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(), // Ensure key is unique
  enText: text("en_text").notNull(),
  arText: text("ar_text"),
  context: text("context"),
  category: text("category"),
  createdAt: text("created_at").notNull().default(String(new Date())),
  updatedAt: text("updated_at").default(String(new Date())),
});

export const siteLanguageSettings = sqliteTable("site_language_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  defaultLanguage: text("default_language").default("en").notNull(),
  availableLanguages: text("available_languages").default(JSON.stringify(["en", "ar"])), // SQLite doesn't have native JSON
  rtlLanguages: text("rtl_languages").default(JSON.stringify(["ar"])), // SQLite doesn't have native JSON
  createdAt: text("created_at").notNull().default(String(new Date())),
  updatedAt: text("updated_at").default(String(new Date())),
});

// Define relations for menus and menu items
export const menusRelations = relations(menus, ({ many }) => ({
  items: many(menuItems),
}));

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  menu: one(menus, {
    fields: [menuItems.menuId],
    references: [menus.id],
  }),
  children: many(menuItems, { relationName: "parentChild" }),
  parent: one(menuItems, {
    fields: [menuItems.parentId],
    references: [menuItems.id],
    relationName: "parentChild",
  }),
}));

// Hotel features and facilities (new schemas)
export const hotelFacilities = sqliteTable("hotel_facilities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  iconType: text("icon_type").default("fas"),
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").notNull().default(String(new Date())),
  updatedAt: text("updated_at").default(String(new Date())),
});

export const hotelHighlights = sqliteTable("hotel_highlights", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  iconType: text("icon_type").default("fas"),
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").notNull().default(String(new Date())),
  updatedAt: text("updated_at").default(String(new Date())),
});

export const cleanlinessFeatures = sqliteTable("cleanliness_features", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  iconType: text("icon_type").default("fas"),
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").notNull().default(String(new Date())),
  updatedAt: text("updated_at").default(String(new Date())),
});

// Create insert schemas
export const insertCountrySchema = createInsertSchema(countries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCitySchema = createInsertSchema(cities).omit({
  id: true,
  createdAt: true, 
  updatedAt: true,
});

export const insertAirportSchema = createInsertSchema(airports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true, 
  createdAt: true,
  updatedAt: true,
});

export const insertMenuSchema = createInsertSchema(menus).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTranslationSchema = createInsertSchema(translations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHotelFacilitySchema = createInsertSchema(hotelFacilities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHotelHighlightSchema = createInsertSchema(hotelHighlights).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCleanlinessFeatureSchema = createInsertSchema(cleanlinessFeatures).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Country = typeof countries.$inferSelect;
export type InsertCountry = z.infer<typeof insertCountrySchema>;

export type City = typeof cities.$inferSelect;
export type InsertCity = z.infer<typeof insertCitySchema>;

export type Airport = typeof airports.$inferSelect;
export type InsertAirport = z.infer<typeof insertAirportSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Menu = typeof menus.$inferSelect;
export type InsertMenu = z.infer<typeof insertMenuSchema>;

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

export type Translation = typeof translations.$inferSelect;
export type InsertTranslation = z.infer<typeof insertTranslationSchema>;

export type HotelFacility = typeof hotelFacilities.$inferSelect;
export type InsertHotelFacility = z.infer<typeof insertHotelFacilitySchema>;

export type HotelHighlight = typeof hotelHighlights.$inferSelect;
export type InsertHotelHighlight = z.infer<typeof insertHotelHighlightSchema>;

export type CleanlinessFeature = typeof cleanlinessFeatures.$inferSelect;
export type InsertCleanlinessFeature = z.infer<typeof insertCleanlinessFeatureSchema>;

// Transport Types (vehicle types)
export const transportTypes = sqliteTable("transport_types", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  passengerCapacity: integer("passenger_capacity").notNull(),
  baggageCapacity: integer("baggage_capacity").notNull(),
  defaultFeatures: text("default_features"), // SQLite doesn't have native JSON, store as string
  status: text("status").default("active"),
  createdAt: text("created_at").notNull().default(String(new Date())),
  updatedAt: text("updated_at").default(String(new Date())),
});

// Create insertSchema for transportTypes
export const insertTransportTypeSchema = createInsertSchema(transportTypes)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type TransportType = typeof transportTypes.$inferSelect;
export type InsertTransportType = z.infer<typeof insertTransportTypeSchema>;