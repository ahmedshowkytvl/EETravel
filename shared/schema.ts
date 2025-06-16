import { pgTable, text, integer, serial, primaryKey, doublePrecision, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Countries table
export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Cities table
export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  countryId: integer("country_id").notNull().references(() => countries.id),
  description: text("description"),
  imageUrl: text("image_url"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Airports table
export const airports = pgTable("airports", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cityId: integer("city_id").notNull().references(() => cities.id),
  code: text("code"), // IATA code (optional)
  description: text("description"),
  imageUrl: text("image_url"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
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

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
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
  // Travel preferences and profile data
  nationality: text("nationality"),
  dateOfBirth: timestamp("date_of_birth"),
  passportNumber: text("passport_number"),
  passportExpiry: timestamp("passport_expiry"),
  emergencyContact: text("emergency_contact"),
  emergencyPhone: text("emergency_phone"),
  dietaryRequirements: text("dietary_requirements"),
  medicalConditions: text("medical_conditions"),
  preferredLanguage: text("preferred_language").default("en"),
  // Marketing preferences
  emailNotifications: boolean("email_notifications").default(true),
  smsNotifications: boolean("sms_notifications").default(false),
  marketingEmails: boolean("marketing_emails").default(true),
  // Verification
  emailVerified: boolean("email_verified").default(false),
  phoneVerified: boolean("phone_verified").default(false),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Hero slides table for homepage slider management
export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  buttonText: text("button_text"),
  buttonLink: text("button_link"),
  secondaryButtonText: text("secondary_button_text"),
  secondaryButtonLink: text("secondary_button_link"),
  order: integer("order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  countryId: integer("country_id").references(() => countries.id),
  cityId: integer("city_id").references(() => cities.id),
  description: text("description"),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  price: integer("price").notNull(),
  discountedPrice: integer("discounted_price"),
  currency: text("currency").default("EGP").notNull(),
  imageUrl: text("image_url"),
  galleryUrls: json("gallery_urls"), // Using native JSON in PostgreSQL
  duration: integer("duration").notNull(),
  rating: integer("rating"),
  reviewCount: integer("review_count").default(0),
  destinationId: integer("destination_id").references(() => destinations.id),
  countryId: integer("country_id").references(() => countries.id),
  cityId: integer("city_id").references(() => cities.id),
  categoryId: integer("category_id"), // Package category reference
  featured: boolean("featured").default(false),
  type: text("type"),
  inclusions: json("inclusions"), // Using native JSON in PostgreSQL
  slug: text("slug").unique(), // Friendly URL slug
  
  // New complex fields for comprehensive package management
  route: text("route"), // Route/Location information
  idealFor: json("ideal_for"), // Array of ideal traveler types
  tourSelection: json("tour_selection"), // Selected tours
  includedFeatures: json("included_features"), // Array of included features
  optionalExcursions: json("optional_excursions"), // Array of optional add-ons
  excludedFeatures: json("excluded_features"), // Array of excluded items
  itinerary: json("itinerary"), // Day-by-day itinerary
  whatToPack: json("what_to_pack"), // Packing list items
  travelRoute: json("travel_route"), // Travel route items
  accommodationHighlights: json("accommodation_highlights"), // Hotel highlights
  transportationDetails: json("transportation_details"), // Transportation info
  pricingMode: text("pricing_mode").default("per_booking"), // Pricing structure
  
  // Date fields
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  
  // Traveler counts
  adultCount: integer("adult_count").default(2),
  childrenCount: integer("children_count").default(0),
  infantCount: integer("infant_count").default(0),
  
  // Additional metadata
  maxGroupSize: integer("max_group_size").default(15),
  language: text("language").default("english"),
  bestTimeToVisit: text("best_time_to_visit"),
  
  // Audit fields
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  bookingReference: text("booking_reference").notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  packageId: integer("package_id").references(() => packages.id),
  tourId: integer("tour_id").references(() => tours.id),
  hotelId: integer("hotel_id").references(() => hotels.id),
  bookingDate: timestamp("booking_date").notNull().defaultNow(),
  travelDate: timestamp("travel_date").notNull(),
  returnDate: timestamp("return_date"),
  numberOfTravelers: integer("number_of_travelers").notNull(),
  adultCount: integer("adult_count").notNull(),
  childCount: integer("child_count").default(0),
  infantCount: integer("infant_count").default(0),
  totalPrice: integer("total_price").notNull(),
  basePrice: integer("base_price").notNull(),
  taxAmount: integer("tax_amount").default(0),
  discountAmount: integer("discount_amount").default(0),
  currency: text("currency").default("EGP").notNull(),
  status: text("status").default("pending").notNull(),
  paymentStatus: text("payment_status").default("pending").notNull(),
  paymentMethod: text("payment_method"),
  paymentReference: text("payment_reference"),
  specialRequests: text("special_requests"),
  notes: text("notes"),
  confirmedAt: timestamp("confirmed_at"),
  cancelledAt: timestamp("cancelled_at"),
  cancellationReason: text("cancellation_reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// User favorites
export const favorites = pgTable("favorites", {
  userId: integer("user_id").notNull().references(() => users.id),
  destinationId: integer("destination_id").notNull().references(() => destinations.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.destinationId] }),
  };
});

// Tours table
export const tours = pgTable("tours", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  galleryUrls: json("gallery_urls"), // Using native JSON in PostgreSQL
  destinationId: integer("destination_id").references(() => destinations.id),
  tripType: text("trip_type"),
  duration: integer("duration").notNull(),
  date: timestamp("date"),
  numPassengers: integer("num_passengers"),
  price: integer("price").notNull(),
  discountedPrice: integer("discounted_price"),
  currency: text("currency").default("EGP").notNull(),
  included: json("included"), // Using native JSON in PostgreSQL
  excluded: json("excluded"), // Using native JSON in PostgreSQL
  itinerary: text("itinerary"),
  maxGroupSize: integer("max_group_size"),
  featured: boolean("featured").default(false),
  rating: doublePrecision("rating"),
  reviewCount: integer("review_count").default(0),
  status: text("status").default("active"),
  // Arabic version fields
  nameAr: text("name_ar"),
  descriptionAr: text("description_ar"),
  itineraryAr: text("itinerary_ar"),
  includedAr: json("included_ar"), // Arabic version of included items
  excludedAr: json("excluded_ar"), // Arabic version of excluded items
  hasArabicVersion: boolean("has_arabic_version").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
  categoryId: integer("category_id").references(() => tourCategories.id),
});

// Hotels table
export const hotels = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  shortDescription: text("short_description"),
  destinationId: integer("destination_id").references(() => destinations.id),
  countryId: integer("country_id").references(() => countries.id),
  cityId: integer("city_id").references(() => cities.id),
  categoryId: integer("category_id").references(() => hotelCategories.id),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  postalCode: text("postal_code"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  imageUrl: text("image_url"),
  galleryUrls: json("gallery_urls"),
  stars: integer("stars"),
  amenities: json("amenities"), // Using native JSON in PostgreSQL (legacy, moving to relation-based)
  checkInTime: text("check_in_time").default("15:00"),
  checkOutTime: text("check_out_time").default("11:00"),
  longitude: doublePrecision("longitude"),
  latitude: doublePrecision("latitude"),
  featured: boolean("featured").default(false),
  rating: doublePrecision("rating"),
  reviewCount: integer("review_count").default(0),
  guestRating: doublePrecision("guest_rating"),
  // Booking and availability
  minStay: integer("min_stay").default(1),
  maxStay: integer("max_stay"),
  bookingLeadTime: integer("booking_lead_time").default(0),
  cancellationPolicy: text("cancellation_policy"),
  // Services and facilities
  parkingAvailable: boolean("parking_available").default(false),
  airportTransferAvailable: boolean("airport_transfer_available").default(false),
  carRentalAvailable: boolean("car_rental_available").default(false),
  shuttleAvailable: boolean("shuttle_available").default(false),
  wifiAvailable: boolean("wifi_available").default(true),
  petFriendly: boolean("pet_friendly").default(false),
  accessibleFacilities: boolean("accessible_facilities").default(false),
  // Pricing
  basePrice: integer("base_price"),
  currency: text("currency").default("USD"),
  taxIncluded: boolean("tax_included").default(false),
  serviceChargeIncluded: boolean("service_charge_included").default(false),
  // Additional info
  languages: json("languages").default(["en"]),
  establishedYear: integer("established_year"),
  lastRenovatedYear: integer("last_renovated_year"),
  totalRooms: integer("total_rooms"),
  totalFloors: integer("total_floors"),
  status: text("status").default("active"),
  verificationStatus: text("verification_status").default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Rooms table
export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
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
  currency: text("currency").default("EGP").notNull(),
  imageUrl: text("image_url"),
  size: text("size"),
  bedType: text("bed_type"),
  amenities: json("amenities"), // Using native JSON in PostgreSQL
  view: text("view"),
  available: boolean("available").default(true),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Room Combinations table
export const roomCombinations = pgTable("room_combinations", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").references(() => rooms.id).notNull(),
  adultsCount: integer("adults_count").notNull(),
  childrenCount: integer("children_count").notNull().default(0),
  infantsCount: integer("infants_count").notNull().default(0),
  description: text("description"),
  isDefault: boolean("is_default").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Menus table for storing navigation menus
export const menus = pgTable("menus", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  location: text("location").notNull(), // header, footer_quick_links, footer_destinations, etc.
  description: text("description"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Menu Items table for storing menu items
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  menuId: integer("menu_id").references(() => menus.id).notNull(),
  parentId: integer("parent_id"),
  title: text("title").notNull(),
  url: text("url"), // URL is now optional
  icon: text("icon"), // FontAwesome icon name
  iconType: text("icon_type").default("fas"), // fas, fab, far, etc.
  itemType: text("item_type").default("link"), // "link" or "heading"
  order: integer("order").notNull(),
  target: text("target").default("_self"), // _self, _blank, etc.
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
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

// Define minimal relation for hotels first - we'll extend this later
export const hotelsRelations = relations(hotels, ({ many, one }) => ({
  rooms: many(rooms),
  destination: one(destinations, {
    fields: [hotels.destinationId],
    references: [destinations.id],
  }),
  categories: many(hotelToCategory),
}));

// Note: Additional relations for hotels will be defined after all related tables are declared below

// Translations schema
export const translations = pgTable("translations", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // Ensure key is unique
  enText: text("en_text").notNull(),
  arText: text("ar_text"),
  context: text("context"),
  category: text("category"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

export const siteLanguageSettings = pgTable("site_language_settings", {
  id: serial("id").primaryKey(),
  defaultLanguage: text("default_language").default("en").notNull(),
  availableLanguages: json("available_languages").default(["en", "ar"]), // Using native JSON in PostgreSQL
  rtlLanguages: json("rtl_languages").default(["ar"]), // Using native JSON in PostgreSQL
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Nationalities table
export const nationalities = pgTable("nationalities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Visas table
export const visas = pgTable("visas", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  targetCountryId: integer("target_country_id").references(() => countries.id).notNull(),
  imageUrl: text("image_url"),
  price: integer("price"),
  processingTime: text("processing_time"),
  requiredDocuments: json("required_documents"), // Using native JSON in PostgreSQL
  validityPeriod: text("validity_period"),
  entryType: text("entry_type"), // single, multiple, etc.
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Nationality-specific visa requirements
export const nationalityVisaRequirements = pgTable("nationality_visa_requirements", {
  id: serial("id").primaryKey(),
  visaId: integer("visa_id").references(() => visas.id).notNull(),
  nationalityId: integer("nationality_id").references(() => nationalities.id).notNull(),
  requirementDetails: text("requirement_details"),
  additionalDocuments: json("additional_documents"), // Using native JSON in PostgreSQL
  fees: integer("fees"),
  processingTime: text("processing_time"),
  notes: text("notes"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Define relations for visas and nationalities
export const visasRelations = relations(visas, ({ one, many }) => ({
  country: one(countries, {
    fields: [visas.targetCountryId],
    references: [countries.id],
  }),
  requirements: many(nationalityVisaRequirements),
}));

export const nationalitiesRelations = relations(nationalities, ({ many }) => ({
  visaRequirements: many(nationalityVisaRequirements),
}));

export const nationalityVisaRequirementsRelations = relations(nationalityVisaRequirements, ({ one }) => ({
  visa: one(visas, {
    fields: [nationalityVisaRequirements.visaId],
    references: [visas.id],
  }),
  nationality: one(nationalities, {
    fields: [nationalityVisaRequirements.nationalityId],
    references: [nationalities.id],
  }),
}));

// Create insert schemas
export const insertNationalitySchema = createInsertSchema(nationalities).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVisaSchema = createInsertSchema(visas).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNationalityVisaRequirementSchema = createInsertSchema(nationalityVisaRequirements).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Define types for tables
export type Nationality = typeof nationalities.$inferSelect;
export type Visa = typeof visas.$inferSelect;
export type NationalityVisaRequirement = typeof nationalityVisaRequirements.$inferSelect;

// Define types for inserts
export type InsertNationality = z.infer<typeof insertNationalitySchema>;
export type InsertVisa = z.infer<typeof insertVisaSchema>;
export type InsertNationalityVisaRequirement = z.infer<typeof insertNationalityVisaRequirementSchema>;

// Cart system tables
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id"), // For guest users
  itemType: text("item_type").notNull(), // 'flight', 'hotel', 'room', 'tour', 'package', 'visa', 'transportation'
  itemId: integer("item_id").notNull(), // References the actual item ID
  quantity: integer("quantity").notNull().default(1),
  adults: integer("adults").default(1),
  children: integer("children").default(0),
  infants: integer("infants").default(0),
  checkInDate: timestamp("check_in_date"),
  checkOutDate: timestamp("check_out_date"),
  travelDate: timestamp("travel_date"),
  configuration: json("configuration"), // Additional booking details (room preferences, seat selection, etc.)
  priceAtAdd: integer("price_at_add").notNull(), // Price when item was added to cart
  discountedPriceAtAdd: integer("discounted_price_at_add"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled, completed
  totalAmount: integer("total_amount").notNull(),
  currency: text("currency").default("USD"),
  paymentStatus: text("payment_status").default("pending"), // pending, paid, failed, refunded
  paymentMethod: text("payment_method"),
  paymentIntentId: text("payment_intent_id"), // Stripe payment intent ID
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  customerName: text("customer_name").notNull(),
  billingAddress: json("billing_address"),
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  itemType: text("item_type").notNull(), // 'flight', 'hotel', 'room', 'tour', 'package', 'visa', 'transportation'
  itemId: integer("item_id").notNull(),
  itemName: text("item_name").notNull(),
  quantity: integer("quantity").notNull().default(1),
  adults: integer("adults").default(1),
  children: integer("children").default(0),
  infants: integer("infants").default(0),
  checkInDate: timestamp("check_in_date"),
  checkOutDate: timestamp("check_out_date"),
  travelDate: timestamp("travel_date"),
  configuration: json("configuration"),
  unitPrice: integer("unit_price").notNull(),
  discountedPrice: integer("discounted_price"),
  totalPrice: integer("total_price").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Define relations for cart and orders
export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

// Cart and Order insert schemas
export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

// Cart and Order types
export type CartItem = typeof cartItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

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

// Dictionary entries schema for word translations
export const dictionaryEntries = pgTable("dictionary_entries", {
  id: serial("id").primaryKey(),
  word: text("word").notNull(),
  englishDefinition: text("english_definition").notNull(),
  arabicTranslation: text("arabic_translation").notNull(),
  partOfSpeech: text("part_of_speech"),
  context: text("context"),
  example: text("example"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Transportation Locations
export const transportLocations = pgTable("transport_locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  locationType: text("location_type").notNull(), // "pickup" or "dropoff" or "both"
  description: text("description"),
  imageUrl: text("image_url"),
  popular: boolean("popular").default(false),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Transportation Duration Options
export const transportDurations = pgTable("transport_durations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., "Half Day", "Full Day"
  hours: integer("hours").notNull(),
  description: text("description"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Car Types/Transportation Types
export const transportTypes = pgTable("transport_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., "Sedan", "SUV", "Van", "Luxury"
  description: text("description"),
  imageUrl: text("image_url"),
  passengerCapacity: integer("passenger_capacity").notNull(),
  baggageCapacity: integer("baggage_capacity").notNull(),
  defaultFeatures: json("default_features"), // Using native JSON in PostgreSQL
  status: text("status").default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Transportation table
export const transportation = pgTable("transportation", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  typeId: integer("type_id").references(() => transportTypes.id),
  destinationId: integer("destination_id").references(() => destinations.id),
  fromLocationId: integer("from_location_id").references(() => transportLocations.id),
  toLocationId: integer("to_location_id").references(() => transportLocations.id),
  durationId: integer("duration_id").references(() => transportDurations.id),
  passengerCapacity: integer("passenger_capacity").notNull(),
  baggageCapacity: integer("baggage_capacity").notNull(),
  price: integer("price").notNull(),
  discountedPrice: integer("discounted_price"),
  imageUrl: text("image_url"),
  galleryUrls: json("gallery_urls"), // Using native JSON in PostgreSQL
  features: json("features"), // Using native JSON in PostgreSQL
  withDriver: boolean("with_driver").default(true),
  available: boolean("available").default(true),
  pickupIncluded: boolean("pickup_included").default(true),
  featured: boolean("featured").default(false),
  rating: doublePrecision("rating"),
  reviewCount: integer("review_count").default(0),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Tour Categories
export const tourCategories = pgTable("tour_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Tour to Category Relationship
export const tourToCategory = pgTable("tour_to_category", {
  tourId: integer("tour_id").notNull().references(() => tours.id),
  categoryId: integer("category_id").notNull().references(() => tourCategories.id),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.tourId, table.categoryId] }),
  };
});

// Hotel Categories
export const hotelCategories = pgTable("hotel_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Hotel to Category Relationship
export const hotelToCategory = pgTable("hotel_to_category", {
  hotelId: integer("hotel_id").notNull().references(() => hotels.id),
  categoryId: integer("category_id").notNull().references(() => hotelCategories.id),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.hotelId, table.categoryId] }),
  };
});

// Hotel Facilities
export const hotelFacilities = pgTable("hotel_facilities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"), // FontAwesome icon name
  category: text("category"), // E.g. "general", "dining", "recreation", etc.
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Hotel to Facilities Relationship
export const hotelToFacilities = pgTable("hotel_to_facilities", {
  hotelId: integer("hotel_id").notNull().references(() => hotels.id),
  facilityId: integer("facility_id").notNull().references(() => hotelFacilities.id),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.hotelId, table.facilityId] }),
  };
});

// Hotel Cleanliness Features
export const cleanlinessFeatures = pgTable("cleanliness_features", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"), // FontAwesome icon name
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Hotel to Cleanliness Features Relationship
export const hotelToCleanlinessFeatures = pgTable("hotel_to_cleanliness", {
  hotelId: integer("hotel_id").notNull().references(() => hotels.id),
  featureId: integer("feature_id").notNull().references(() => cleanlinessFeatures.id),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.hotelId, table.featureId] }),
  };
});

// Hotel Landmarks
export const hotelLandmarks = pgTable("hotel_landmarks", {
  id: serial("id").primaryKey(),
  hotelId: integer("hotel_id").notNull().references(() => hotels.id),
  name: text("name").notNull(),
  description: text("description"),
  distance: text("distance"), // E.g. "500m", "2.4km"
  distanceValue: doublePrecision("distance_value"), // Numeric value for sorting
  distanceUnit: text("distance_unit").default("km"), // E.g. "km", "m", "miles"
  longitude: doublePrecision("longitude"),
  latitude: doublePrecision("latitude"),
  placeId: text("place_id"), // Google Places ID
  icon: text("icon"), // URL to icon
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Hotel General Highlights
export const hotelHighlights = pgTable("hotel_highlights", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"), // FontAwesome icon name
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Hotel to Highlights Relationship
export const hotelToHighlights = pgTable("hotel_to_highlights", {
  hotelId: integer("hotel_id").notNull().references(() => hotels.id),
  highlightId: integer("highlight_id").notNull().references(() => hotelHighlights.id),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.hotelId, table.highlightId] }),
  };
});

// Hotel FAQs
export const hotelFaqs = pgTable("hotel_faqs", {
  id: serial("id").primaryKey(),
  hotelId: integer("hotel_id").notNull().references(() => hotels.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  order: integer("order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Hotel Restaurants
export const hotelRestaurants = pgTable("hotel_restaurants", {
  id: serial("id").primaryKey(),
  hotelId: integer("hotel_id").notNull().references(() => hotels.id),
  name: text("name").notNull(),
  description: text("description"),
  cuisine: text("cuisine"), // E.g. "Italian", "International", "Halal"
  mealTypes: json("meal_types"), // E.g. ["Breakfast", "Lunch", "Dinner"]
  openingHours: text("opening_hours"),
  imageUrl: text("image_url"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Room Categories
export const roomCategories = pgTable("room_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Room to Category Relationship
export const roomToCategory = pgTable("room_to_category", {
  roomId: integer("room_id").notNull().references(() => rooms.id),
  categoryId: integer("category_id").notNull().references(() => roomCategories.id),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.roomId, table.categoryId] }),
  };
});

// Package Categories
export const packageCategories = pgTable("package_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Package to Category Relationship
export const packageToCategory = pgTable("package_to_category", {
  packageId: integer("package_id").notNull().references(() => packages.id),
  categoryId: integer("category_id").notNull().references(() => packageCategories.id),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.packageId, table.categoryId] }),
  };
});

// Insert schemas
export const insertCountrySchema = createInsertSchema(countries).pick({
  name: true,
  code: true,
  description: true,
  imageUrl: true,
  active: true,
});

export const insertCitySchema = createInsertSchema(cities).pick({
  name: true,
  countryId: true,
  description: true,
  imageUrl: true,
  active: true,
});

export const insertAirportSchema = createInsertSchema(airports).pick({
  name: true,
  cityId: true,
  code: true,
  description: true,
  imageUrl: true,
  active: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
  firstName: true,
  lastName: true,
  phoneNumber: true,
  fullName: true,
  role: true,
  bio: true,
  avatarUrl: true,
  status: true,
});

export const insertDestinationSchema = createInsertSchema(destinations).pick({
  name: true,
  country: true,
  countryId: true,
  cityId: true,
  description: true,
  imageUrl: true,
  featured: true,
  active: true,
});

export const insertPackageSchema = createInsertSchema(packages).pick({
  title: true,
  description: true,
  shortDescription: true,
  price: true,
  discountedPrice: true,
  imageUrl: true,
  galleryUrls: true,
  duration: true,
  rating: true,
  destinationId: true,
  countryId: true,
  cityId: true,
  featured: true,
  type: true,
  inclusions: true,
  slug: true,
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  userId: true,
  packageId: true,
  travelDate: true,
  numberOfTravelers: true,
  totalPrice: true,
  status: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  userId: true,
  destinationId: true,
});

export const insertTourSchema = createInsertSchema(tours)
  .pick({
    name: true,
    description: true,
    imageUrl: true,
    galleryUrls: true,
    destinationId: true,
    tripType: true,
    duration: true,
    date: true,
    numPassengers: true,
    price: true,
    discountedPrice: true,
    included: true,
    excluded: true,
    itinerary: true,
    maxGroupSize: true,
    featured: true,
    rating: true,
    status: true,
  })
  .extend({
    // تعديل حقل التاريخ للسماح بنص ISO أو تاريخ وتحويله إلى تاريخ صالح
    date: z.preprocess(
      (val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        
        // إذا كان النص بتنسيق ISO
        if (typeof val === 'string') {
          const date = new Date(val);
          return isNaN(date.getTime()) ? null : date;
        }
        
        return null;
      },
      z.date().nullable().optional()
    ),
  });

export const insertHotelSchema = createInsertSchema(hotels).pick({
  name: true,
  description: true,
  destinationId: true,
  address: true,
  city: true,
  country: true,
  postalCode: true,
  phone: true,
  email: true,
  website: true,
  imageUrl: true,
  stars: true,
  amenities: true,
  checkInTime: true,
  checkOutTime: true,
  featured: true,
  rating: true,
  status: true,
});

// Hero slide schema types
export const insertHeroSlideSchema = createInsertSchema(heroSlides).pick({
  title: true,
  subtitle: true,
  description: true,
  imageUrl: true,
  buttonText: true,
  buttonLink: true,
  secondaryButtonText: true,
  secondaryButtonLink: true,
  order: true,
  active: true,
});

export type HeroSlide = typeof heroSlides.$inferSelect;
export type InsertHeroSlide = z.infer<typeof insertHeroSlideSchema>;

export const insertRoomSchema = createInsertSchema(rooms).pick({
  name: true,
  description: true,
  hotelId: true,
  type: true,
  maxOccupancy: true,
  maxAdults: true,
  maxChildren: true,
  maxInfants: true,
  price: true,
  discountedPrice: true,
  imageUrl: true,
  size: true,
  bedType: true,
  amenities: true,
  view: true,
  available: true,
  status: true,
});

export const insertRoomCombinationSchema = createInsertSchema(roomCombinations).pick({
  roomId: true,
  adultsCount: true,
  childrenCount: true,
  infantsCount: true,
  description: true,
  isDefault: true,
  active: true,
});

export const insertTransportLocationSchema = createInsertSchema(transportLocations).pick({
  name: true,
  city: true,
  country: true,
  locationType: true,
  description: true,
  imageUrl: true,
  popular: true,
  latitude: true,
  longitude: true,
  status: true,
});

export const insertTransportDurationSchema = createInsertSchema(transportDurations).pick({
  name: true,
  hours: true,
  description: true,
  status: true,
});

export const insertTranslationSchema = createInsertSchema(translations).pick({
  key: true,
  enText: true,
  arText: true,
  context: true,
  category: true,
});

export const insertSiteLanguageSettingsSchema = createInsertSchema(siteLanguageSettings).pick({
  defaultLanguage: true,
  availableLanguages: true,
  rtlLanguages: true,
});

// Define dictionary entry insert schema
export const insertDictionaryEntrySchema = createInsertSchema(dictionaryEntries).pick({
  word: true,
  englishDefinition: true,
  arabicTranslation: true,
  partOfSpeech: true,
  context: true,
  example: true,
  notes: true,
});

// Define translation related types
export type Translation = typeof translations.$inferSelect;
export type InsertTranslation = z.infer<typeof insertTranslationSchema>;

export type SiteLanguageSetting = typeof siteLanguageSettings.$inferSelect;
export type InsertSiteLanguageSetting = z.infer<typeof insertSiteLanguageSettingsSchema>;

// Define dictionary entry types
export type DictionaryEntry = typeof dictionaryEntries.$inferSelect;
export type InsertDictionaryEntry = z.infer<typeof insertDictionaryEntrySchema>;

export const insertTransportTypeSchema = createInsertSchema(transportTypes).pick({
  name: true,
  description: true,
  imageUrl: true,
  passengerCapacity: true,
  baggageCapacity: true,
  defaultFeatures: true,
  status: true,
});

export const insertMenuSchema = createInsertSchema(menus).pick({
  name: true,
  location: true,
  description: true,
  active: true,
});

// Types for menus
export type Menu = typeof menus.$inferSelect;
export type InsertMenu = z.infer<typeof insertMenuSchema>;

export const insertMenuItemSchema = createInsertSchema(menuItems).pick({
  menuId: true,
  parentId: true,
  title: true,
  url: true,
  icon: true,
  order: true,
  target: true,
  active: true,
});

// Types for menu items
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

export const insertTransportationSchema = createInsertSchema(transportation).pick({
  name: true,
  description: true,
  typeId: true,
  destinationId: true,
  fromLocationId: true,
  toLocationId: true,
  durationId: true,
  passengerCapacity: true,
  baggageCapacity: true,
  price: true,
  discountedPrice: true,
  imageUrl: true,
  galleryUrls: true,
  features: true,
  withDriver: true,
  available: true,
  pickupIncluded: true,
  featured: true,
  rating: true,
  status: true,
});

// Types
export type InsertCountry = z.infer<typeof insertCountrySchema>;
export type Country = typeof countries.$inferSelect;

export type InsertCity = z.infer<typeof insertCitySchema>;
export type City = typeof cities.$inferSelect;

export type InsertAirport = z.infer<typeof insertAirportSchema>;
export type Airport = typeof airports.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;

export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packages.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// Reviews table for user feedback
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bookingId: integer("booking_id").references(() => bookings.id),
  packageId: integer("package_id").references(() => packages.id),
  tourId: integer("tour_id").references(() => tours.id),
  hotelId: integer("hotel_id").references(() => hotels.id),
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title"),
  comment: text("comment"),
  pros: json("pros"), // Array of positive points
  cons: json("cons"), // Array of negative points
  wouldRecommend: boolean("would_recommend").default(true),
  travelDate: timestamp("travel_date"),
  verified: boolean("verified").default(false),
  helpful: integer("helpful").default(0),
  notHelpful: integer("not_helpful").default(0),
  status: text("status").default("pending"), // pending, approved, rejected
  moderatorNotes: text("moderator_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Payments table for financial transactions
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  paymentReference: text("payment_reference").notNull().unique(),
  bookingId: integer("booking_id").references(() => bookings.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").default("EGP").notNull(),
  paymentMethod: text("payment_method").notNull(), // card, paypal, bank_transfer
  paymentProvider: text("payment_provider"), // stripe, paypal, etc.
  providerTransactionId: text("provider_transaction_id"),
  status: text("status").default("pending").notNull(), // pending, completed, failed, refunded
  failureReason: text("failure_reason"),
  refundAmount: integer("refund_amount").default(0),
  refundReason: text("refund_reason"),
  processingFee: integer("processing_fee").default(0),
  netAmount: integer("net_amount").notNull(),
  paidAt: timestamp("paid_at"),
  refundedAt: timestamp("refunded_at"),
  metadata: json("metadata"), // Additional payment data
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Notifications table for user communications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // booking_confirmation, payment_received, etc.
  title: text("title").notNull(),
  message: text("message").notNull(),
  relatedBookingId: integer("related_booking_id").references(() => bookings.id),
  relatedPaymentId: integer("related_payment_id").references(() => payments.id),
  read: boolean("read").default(false),
  actionUrl: text("action_url"),
  actionText: text("action_text"),
  priority: text("priority").default("normal"), // low, normal, high, urgent
  channel: text("channel").default("in_app"), // in_app, email, sms
  sentAt: timestamp("sent_at"),
  expiresAt: timestamp("expires_at"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Traveler details for bookings
export const travelers = pgTable("travelers", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id).notNull(),
  type: text("type").notNull(), // adult, child, infant
  title: text("title"), // Mr, Mrs, Ms, Dr
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  nationality: text("nationality"),
  passportNumber: text("passport_number"),
  passportExpiry: timestamp("passport_expiry"),
  passportIssueCountry: text("passport_issue_country"),
  dietaryRequirements: text("dietary_requirements"),
  medicalConditions: text("medical_conditions"),
  specialRequests: text("special_requests"),
  emergencyContact: text("emergency_contact"),
  emergencyPhone: text("emergency_phone"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Coupons and discounts
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // percentage, fixed_amount
  value: integer("value").notNull(), // percentage or amount in cents
  minOrderAmount: integer("min_order_amount").default(0),
  maxDiscountAmount: integer("max_discount_amount"),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0),
  userLimit: integer("user_limit").default(1), // per user usage limit
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  applicableToPackages: boolean("applicable_to_packages").default(true),
  applicableToTours: boolean("applicable_to_tours").default(true),
  applicableToHotels: boolean("applicable_to_hotels").default(true),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Coupon usage tracking
export const couponUsages = pgTable("coupon_usages", {
  id: serial("id").primaryKey(),
  couponId: integer("coupon_id").references(() => coupons.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bookingId: integer("booking_id").references(() => bookings.id).notNull(),
  discountAmount: integer("discount_amount").notNull(),
  usedAt: timestamp("used_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

export type InsertTour = z.infer<typeof insertTourSchema>;
export type Tour = typeof tours.$inferSelect;

export type InsertHotel = z.infer<typeof insertHotelSchema>;
export type Hotel = typeof hotels.$inferSelect;

export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof rooms.$inferSelect;

export type InsertRoomCombination = z.infer<typeof insertRoomCombinationSchema>;
export type RoomCombination = typeof roomCombinations.$inferSelect;

export type InsertTransportLocation = z.infer<typeof insertTransportLocationSchema>;
export type TransportLocation = typeof transportLocations.$inferSelect;

export type InsertTransportDuration = z.infer<typeof insertTransportDurationSchema>;
export type TransportDuration = typeof transportDurations.$inferSelect;

export type InsertTransportType = z.infer<typeof insertTransportTypeSchema>;
export type TransportType = typeof transportTypes.$inferSelect;

export type InsertTransportation = z.infer<typeof insertTransportationSchema>;
export type Transportation = typeof transportation.$inferSelect;

// Categories insert schemas
export const insertTourCategorySchema = createInsertSchema(tourCategories).pick({
  name: true,
  description: true,
  active: true,
});

export const insertHotelCategorySchema = createInsertSchema(hotelCategories).pick({
  name: true,
  description: true,
  active: true,
});

export const insertRoomCategorySchema = createInsertSchema(roomCategories).pick({
  name: true,
  description: true,
  active: true,
});

export const insertPackageCategorySchema = createInsertSchema(packageCategories).pick({
  name: true,
  description: true,
  active: true,
});

// Category types
export type InsertTourCategory = z.infer<typeof insertTourCategorySchema>;
export type TourCategory = typeof tourCategories.$inferSelect;

export type InsertHotelCategory = z.infer<typeof insertHotelCategorySchema>;
export type HotelCategory = typeof hotelCategories.$inferSelect;

export type InsertRoomCategory = z.infer<typeof insertRoomCategorySchema>;
export type RoomCategory = typeof roomCategories.$inferSelect;

export type InsertPackageCategory = z.infer<typeof insertPackageCategorySchema>;
export type PackageCategory = typeof packageCategories.$inferSelect;
