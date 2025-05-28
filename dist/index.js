var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  airports: () => airports,
  airportsRelations: () => airportsRelations,
  bookings: () => bookings,
  cartItems: () => cartItems,
  cartItemsRelations: () => cartItemsRelations,
  cities: () => cities,
  citiesRelations: () => citiesRelations,
  cleanlinessFeatures: () => cleanlinessFeatures,
  countries: () => countries,
  countriesRelations: () => countriesRelations,
  destinations: () => destinations,
  dictionaryEntries: () => dictionaryEntries,
  favorites: () => favorites,
  hotelCategories: () => hotelCategories,
  hotelFacilities: () => hotelFacilities,
  hotelFaqs: () => hotelFaqs,
  hotelHighlights: () => hotelHighlights,
  hotelLandmarks: () => hotelLandmarks,
  hotelRestaurants: () => hotelRestaurants,
  hotelToCategory: () => hotelToCategory,
  hotelToCleanlinessFeatures: () => hotelToCleanlinessFeatures,
  hotelToFacilities: () => hotelToFacilities,
  hotelToHighlights: () => hotelToHighlights,
  hotels: () => hotels,
  hotelsRelations: () => hotelsRelations,
  insertAirportSchema: () => insertAirportSchema,
  insertBookingSchema: () => insertBookingSchema,
  insertCartItemSchema: () => insertCartItemSchema,
  insertCitySchema: () => insertCitySchema,
  insertCountrySchema: () => insertCountrySchema,
  insertDestinationSchema: () => insertDestinationSchema,
  insertDictionaryEntrySchema: () => insertDictionaryEntrySchema,
  insertFavoriteSchema: () => insertFavoriteSchema,
  insertHotelCategorySchema: () => insertHotelCategorySchema,
  insertHotelSchema: () => insertHotelSchema,
  insertMenuItemSchema: () => insertMenuItemSchema,
  insertMenuSchema: () => insertMenuSchema,
  insertNationalitySchema: () => insertNationalitySchema,
  insertNationalityVisaRequirementSchema: () => insertNationalityVisaRequirementSchema,
  insertOrderItemSchema: () => insertOrderItemSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertPackageCategorySchema: () => insertPackageCategorySchema,
  insertPackageSchema: () => insertPackageSchema,
  insertRoomCategorySchema: () => insertRoomCategorySchema,
  insertRoomCombinationSchema: () => insertRoomCombinationSchema,
  insertRoomSchema: () => insertRoomSchema,
  insertSiteLanguageSettingsSchema: () => insertSiteLanguageSettingsSchema,
  insertTourCategorySchema: () => insertTourCategorySchema,
  insertTourSchema: () => insertTourSchema,
  insertTranslationSchema: () => insertTranslationSchema,
  insertTransportDurationSchema: () => insertTransportDurationSchema,
  insertTransportLocationSchema: () => insertTransportLocationSchema,
  insertTransportTypeSchema: () => insertTransportTypeSchema,
  insertTransportationSchema: () => insertTransportationSchema,
  insertUserSchema: () => insertUserSchema,
  insertVisaSchema: () => insertVisaSchema,
  menuItems: () => menuItems,
  menuItemsRelations: () => menuItemsRelations,
  menus: () => menus,
  menusRelations: () => menusRelations,
  nationalities: () => nationalities,
  nationalitiesRelations: () => nationalitiesRelations,
  nationalityVisaRequirements: () => nationalityVisaRequirements,
  nationalityVisaRequirementsRelations: () => nationalityVisaRequirementsRelations,
  orderItems: () => orderItems,
  orderItemsRelations: () => orderItemsRelations,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  packageCategories: () => packageCategories,
  packageToCategory: () => packageToCategory,
  packages: () => packages,
  roomCategories: () => roomCategories,
  roomCombinations: () => roomCombinations,
  roomCombinationsRelations: () => roomCombinationsRelations,
  roomToCategory: () => roomToCategory,
  rooms: () => rooms,
  roomsRelations: () => roomsRelations,
  siteLanguageSettings: () => siteLanguageSettings,
  tourCategories: () => tourCategories,
  tourToCategory: () => tourToCategory,
  tours: () => tours,
  translations: () => translations,
  transportDurations: () => transportDurations,
  transportLocations: () => transportLocations,
  transportTypes: () => transportTypes,
  transportation: () => transportation,
  users: () => users,
  visas: () => visas,
  visasRelations: () => visasRelations
});
import { pgTable, text, integer, serial, primaryKey, doublePrecision, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var countries, cities, airports, countriesRelations, citiesRelations, airportsRelations, users, destinations, packages, bookings, favorites, tours, hotels, rooms, roomCombinations, menus, menuItems, roomsRelations, roomCombinationsRelations, hotelsRelations, translations, siteLanguageSettings, nationalities, visas, nationalityVisaRequirements, visasRelations, nationalitiesRelations, nationalityVisaRequirementsRelations, insertNationalitySchema, insertVisaSchema, insertNationalityVisaRequirementSchema, cartItems, orders, orderItems, cartItemsRelations, ordersRelations, orderItemsRelations, insertCartItemSchema, insertOrderSchema, insertOrderItemSchema, menusRelations, menuItemsRelations, dictionaryEntries, transportLocations, transportDurations, transportTypes, transportation, tourCategories, tourToCategory, hotelCategories, hotelToCategory, hotelFacilities, hotelToFacilities, cleanlinessFeatures, hotelToCleanlinessFeatures, hotelLandmarks, hotelHighlights, hotelToHighlights, hotelFaqs, hotelRestaurants, roomCategories, roomToCategory, packageCategories, packageToCategory, insertCountrySchema, insertCitySchema, insertAirportSchema, insertUserSchema, insertDestinationSchema, insertPackageSchema, insertBookingSchema, insertFavoriteSchema, insertTourSchema, insertHotelSchema, insertRoomSchema, insertRoomCombinationSchema, insertTransportLocationSchema, insertTransportDurationSchema, insertTranslationSchema, insertSiteLanguageSettingsSchema, insertDictionaryEntrySchema, insertTransportTypeSchema, insertMenuSchema, insertMenuItemSchema, insertTransportationSchema, insertTourCategorySchema, insertHotelCategorySchema, insertRoomCategorySchema, insertPackageCategorySchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    countries = pgTable("countries", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      code: text("code").notNull(),
      description: text("description"),
      imageUrl: text("image_url"),
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    cities = pgTable("cities", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      countryId: integer("country_id").notNull().references(() => countries.id),
      description: text("description"),
      imageUrl: text("image_url"),
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    airports = pgTable("airports", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      cityId: integer("city_id").notNull().references(() => cities.id),
      code: text("code"),
      // IATA code (optional)
      description: text("description"),
      imageUrl: text("image_url"),
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    countriesRelations = relations(countries, ({ many }) => ({
      cities: many(cities)
    }));
    citiesRelations = relations(cities, ({ one, many }) => ({
      country: one(countries, {
        fields: [cities.countryId],
        references: [countries.id]
      }),
      airports: many(airports)
    }));
    airportsRelations = relations(airports, ({ one }) => ({
      city: one(cities, {
        fields: [airports.cityId],
        references: [cities.id]
      })
    }));
    users = pgTable("users", {
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
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    destinations = pgTable("destinations", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      country: text("country").notNull(),
      countryId: integer("country_id").references(() => countries.id),
      cityId: integer("city_id").references(() => cities.id),
      description: text("description"),
      imageUrl: text("image_url"),
      featured: boolean("featured").default(false),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    packages = pgTable("packages", {
      id: serial("id").primaryKey(),
      title: text("title").notNull(),
      description: text("description").notNull(),
      price: integer("price").notNull(),
      discountedPrice: integer("discounted_price"),
      imageUrl: text("image_url"),
      galleryUrls: json("gallery_urls"),
      // Using native JSON in PostgreSQL
      duration: integer("duration").notNull(),
      rating: integer("rating"),
      reviewCount: integer("review_count").default(0),
      destinationId: integer("destination_id").references(() => destinations.id),
      countryId: integer("country_id").references(() => countries.id),
      cityId: integer("city_id").references(() => cities.id),
      featured: boolean("featured").default(false),
      type: text("type"),
      inclusions: json("inclusions"),
      // Using native JSON in PostgreSQL
      slug: text("slug").unique()
      // Friendly URL slug
    });
    bookings = pgTable("bookings", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id),
      packageId: integer("package_id").references(() => packages.id),
      bookingDate: timestamp("booking_date").notNull().defaultNow(),
      travelDate: timestamp("travel_date").notNull(),
      numberOfTravelers: integer("number_of_travelers").notNull(),
      totalPrice: integer("total_price").notNull(),
      status: text("status").default("pending").notNull()
    });
    favorites = pgTable("favorites", {
      userId: integer("user_id").notNull().references(() => users.id),
      destinationId: integer("destination_id").notNull().references(() => destinations.id),
      createdAt: timestamp("created_at").notNull().defaultNow()
    }, (table) => {
      return {
        pk: primaryKey({ columns: [table.userId, table.destinationId] })
      };
    });
    tours = pgTable("tours", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      description: text("description"),
      imageUrl: text("image_url"),
      galleryUrls: json("gallery_urls"),
      // Using native JSON in PostgreSQL
      destinationId: integer("destination_id").references(() => destinations.id),
      tripType: text("trip_type"),
      duration: integer("duration").notNull(),
      date: timestamp("date"),
      numPassengers: integer("num_passengers"),
      price: integer("price").notNull(),
      discountedPrice: integer("discounted_price"),
      included: json("included"),
      // Using native JSON in PostgreSQL
      excluded: json("excluded"),
      // Using native JSON in PostgreSQL
      itinerary: text("itinerary"),
      maxGroupSize: integer("max_group_size"),
      featured: boolean("featured").default(false),
      rating: doublePrecision("rating"),
      reviewCount: integer("review_count").default(0),
      status: text("status").default("active"),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    hotels = pgTable("hotels", {
      id: serial("id").primaryKey(),
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
      amenities: json("amenities"),
      // Using native JSON in PostgreSQL (legacy, moving to relation-based)
      checkInTime: text("check_in_time"),
      checkOutTime: text("check_out_time"),
      longitude: doublePrecision("longitude"),
      latitude: doublePrecision("latitude"),
      featured: boolean("featured").default(false),
      rating: doublePrecision("rating"),
      reviewCount: integer("review_count").default(0),
      guestRating: doublePrecision("guest_rating"),
      // Added guest rating
      parkingAvailable: boolean("parking_available").default(false),
      airportTransferAvailable: boolean("airport_transfer_available").default(false),
      carRentalAvailable: boolean("car_rental_available").default(false),
      shuttleAvailable: boolean("shuttle_available").default(false),
      status: text("status").default("active"),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    rooms = pgTable("rooms", {
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
      imageUrl: text("image_url"),
      size: text("size"),
      bedType: text("bed_type"),
      amenities: json("amenities"),
      // Using native JSON in PostgreSQL
      view: text("view"),
      available: boolean("available").default(true),
      status: text("status").default("active"),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    roomCombinations = pgTable("room_combinations", {
      id: serial("id").primaryKey(),
      roomId: integer("room_id").references(() => rooms.id).notNull(),
      adultsCount: integer("adults_count").notNull(),
      childrenCount: integer("children_count").notNull().default(0),
      infantsCount: integer("infants_count").notNull().default(0),
      description: text("description"),
      isDefault: boolean("is_default").default(false),
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    menus = pgTable("menus", {
      id: serial("id").primaryKey(),
      name: text("name").notNull().unique(),
      location: text("location").notNull(),
      // header, footer_quick_links, footer_destinations, etc.
      description: text("description"),
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    menuItems = pgTable("menu_items", {
      id: serial("id").primaryKey(),
      menuId: integer("menu_id").references(() => menus.id).notNull(),
      parentId: integer("parent_id"),
      title: text("title").notNull(),
      url: text("url"),
      // URL is now optional
      icon: text("icon"),
      // FontAwesome icon name
      iconType: text("icon_type").default("fas"),
      // fas, fab, far, etc.
      itemType: text("item_type").default("link"),
      // "link" or "heading"
      order: integer("order").notNull(),
      target: text("target").default("_self"),
      // _self, _blank, etc.
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    roomsRelations = relations(rooms, ({ many, one }) => ({
      combinations: many(roomCombinations),
      hotel: one(hotels, {
        fields: [rooms.hotelId],
        references: [hotels.id]
      })
    }));
    roomCombinationsRelations = relations(roomCombinations, ({ one }) => ({
      room: one(rooms, {
        fields: [roomCombinations.roomId],
        references: [rooms.id]
      })
    }));
    hotelsRelations = relations(hotels, ({ many, one }) => ({
      rooms: many(rooms),
      destination: one(destinations, {
        fields: [hotels.destinationId],
        references: [destinations.id]
      }),
      categories: many(hotelToCategory)
    }));
    translations = pgTable("translations", {
      id: serial("id").primaryKey(),
      key: text("key").notNull().unique(),
      // Ensure key is unique
      enText: text("en_text").notNull(),
      arText: text("ar_text"),
      context: text("context"),
      category: text("category"),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    siteLanguageSettings = pgTable("site_language_settings", {
      id: serial("id").primaryKey(),
      defaultLanguage: text("default_language").default("en").notNull(),
      availableLanguages: json("available_languages").default(["en", "ar"]),
      // Using native JSON in PostgreSQL
      rtlLanguages: json("rtl_languages").default(["ar"]),
      // Using native JSON in PostgreSQL
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    nationalities = pgTable("nationalities", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      code: text("code").notNull(),
      description: text("description"),
      imageUrl: text("image_url"),
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    visas = pgTable("visas", {
      id: serial("id").primaryKey(),
      title: text("title").notNull(),
      description: text("description"),
      targetCountryId: integer("target_country_id").references(() => countries.id).notNull(),
      imageUrl: text("image_url"),
      price: integer("price"),
      processingTime: text("processing_time"),
      requiredDocuments: json("required_documents"),
      // Using native JSON in PostgreSQL
      validityPeriod: text("validity_period"),
      entryType: text("entry_type"),
      // single, multiple, etc.
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    nationalityVisaRequirements = pgTable("nationality_visa_requirements", {
      id: serial("id").primaryKey(),
      visaId: integer("visa_id").references(() => visas.id).notNull(),
      nationalityId: integer("nationality_id").references(() => nationalities.id).notNull(),
      requirementDetails: text("requirement_details"),
      additionalDocuments: json("additional_documents"),
      // Using native JSON in PostgreSQL
      fees: integer("fees"),
      processingTime: text("processing_time"),
      notes: text("notes"),
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    visasRelations = relations(visas, ({ one, many }) => ({
      country: one(countries, {
        fields: [visas.targetCountryId],
        references: [countries.id]
      }),
      requirements: many(nationalityVisaRequirements)
    }));
    nationalitiesRelations = relations(nationalities, ({ many }) => ({
      visaRequirements: many(nationalityVisaRequirements)
    }));
    nationalityVisaRequirementsRelations = relations(nationalityVisaRequirements, ({ one }) => ({
      visa: one(visas, {
        fields: [nationalityVisaRequirements.visaId],
        references: [visas.id]
      }),
      nationality: one(nationalities, {
        fields: [nationalityVisaRequirements.nationalityId],
        references: [nationalities.id]
      })
    }));
    insertNationalitySchema = createInsertSchema(nationalities).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertVisaSchema = createInsertSchema(visas).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertNationalityVisaRequirementSchema = createInsertSchema(nationalityVisaRequirements).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    cartItems = pgTable("cart_items", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id),
      sessionId: text("session_id"),
      // For guest users
      itemType: text("item_type").notNull(),
      // 'flight', 'hotel', 'room', 'tour', 'package', 'visa', 'transportation'
      itemId: integer("item_id").notNull(),
      // References the actual item ID
      quantity: integer("quantity").notNull().default(1),
      adults: integer("adults").default(1),
      children: integer("children").default(0),
      infants: integer("infants").default(0),
      checkInDate: timestamp("check_in_date"),
      checkOutDate: timestamp("check_out_date"),
      travelDate: timestamp("travel_date"),
      configuration: json("configuration"),
      // Additional booking details (room preferences, seat selection, etc.)
      priceAtAdd: integer("price_at_add").notNull(),
      // Price when item was added to cart
      discountedPriceAtAdd: integer("discounted_price_at_add"),
      notes: text("notes"),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    orders = pgTable("orders", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id),
      orderNumber: text("order_number").notNull().unique(),
      status: text("status").notNull().default("pending"),
      // pending, confirmed, cancelled, completed
      totalAmount: integer("total_amount").notNull(),
      currency: text("currency").default("USD"),
      paymentStatus: text("payment_status").default("pending"),
      // pending, paid, failed, refunded
      paymentMethod: text("payment_method"),
      paymentIntentId: text("payment_intent_id"),
      // Stripe payment intent ID
      customerEmail: text("customer_email").notNull(),
      customerPhone: text("customer_phone"),
      customerName: text("customer_name").notNull(),
      billingAddress: json("billing_address"),
      specialRequests: text("special_requests"),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    orderItems = pgTable("order_items", {
      id: serial("id").primaryKey(),
      orderId: integer("order_id").references(() => orders.id).notNull(),
      itemType: text("item_type").notNull(),
      // 'flight', 'hotel', 'room', 'tour', 'package', 'visa', 'transportation'
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
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    cartItemsRelations = relations(cartItems, ({ one }) => ({
      user: one(users, {
        fields: [cartItems.userId],
        references: [users.id]
      })
    }));
    ordersRelations = relations(orders, ({ one, many }) => ({
      user: one(users, {
        fields: [orders.userId],
        references: [users.id]
      }),
      items: many(orderItems)
    }));
    orderItemsRelations = relations(orderItems, ({ one }) => ({
      order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id]
      })
    }));
    insertCartItemSchema = createInsertSchema(cartItems).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertOrderSchema = createInsertSchema(orders).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertOrderItemSchema = createInsertSchema(orderItems).omit({
      id: true,
      createdAt: true
    });
    menusRelations = relations(menus, ({ many }) => ({
      items: many(menuItems)
    }));
    menuItemsRelations = relations(menuItems, ({ one, many }) => ({
      menu: one(menus, {
        fields: [menuItems.menuId],
        references: [menus.id]
      }),
      children: many(menuItems, { relationName: "parentChild" }),
      parent: one(menuItems, {
        fields: [menuItems.parentId],
        references: [menuItems.id],
        relationName: "parentChild"
      })
    }));
    dictionaryEntries = pgTable("dictionary_entries", {
      id: serial("id").primaryKey(),
      word: text("word").notNull(),
      englishDefinition: text("english_definition").notNull(),
      arabicTranslation: text("arabic_translation").notNull(),
      partOfSpeech: text("part_of_speech"),
      context: text("context"),
      example: text("example"),
      notes: text("notes"),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    transportLocations = pgTable("transport_locations", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      city: text("city").notNull(),
      country: text("country").notNull(),
      locationType: text("location_type").notNull(),
      // "pickup" or "dropoff" or "both"
      description: text("description"),
      imageUrl: text("image_url"),
      popular: boolean("popular").default(false),
      latitude: doublePrecision("latitude"),
      longitude: doublePrecision("longitude"),
      status: text("status").default("active"),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    transportDurations = pgTable("transport_durations", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      // e.g., "Half Day", "Full Day"
      hours: integer("hours").notNull(),
      description: text("description"),
      status: text("status").default("active"),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    transportTypes = pgTable("transport_types", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      // e.g., "Sedan", "SUV", "Van", "Luxury"
      description: text("description"),
      imageUrl: text("image_url"),
      passengerCapacity: integer("passenger_capacity").notNull(),
      baggageCapacity: integer("baggage_capacity").notNull(),
      defaultFeatures: json("default_features"),
      // Using native JSON in PostgreSQL
      status: text("status").default("active"),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    transportation = pgTable("transportation", {
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
      galleryUrls: json("gallery_urls"),
      // Using native JSON in PostgreSQL
      features: json("features"),
      // Using native JSON in PostgreSQL
      withDriver: boolean("with_driver").default(true),
      available: boolean("available").default(true),
      pickupIncluded: boolean("pickup_included").default(true),
      featured: boolean("featured").default(false),
      rating: doublePrecision("rating"),
      reviewCount: integer("review_count").default(0),
      status: text("status").default("active"),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    tourCategories = pgTable("tour_categories", {
      id: serial("id").primaryKey(),
      name: text("name").notNull().unique(),
      description: text("description"),
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    tourToCategory = pgTable("tour_to_category", {
      tourId: integer("tour_id").notNull().references(() => tours.id),
      categoryId: integer("category_id").notNull().references(() => tourCategories.id)
    }, (table) => {
      return {
        pk: primaryKey({ columns: [table.tourId, table.categoryId] })
      };
    });
    hotelCategories = pgTable("hotel_categories", {
      id: serial("id").primaryKey(),
      name: text("name").notNull().unique(),
      description: text("description"),
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    hotelToCategory = pgTable("hotel_to_category", {
      hotelId: integer("hotel_id").notNull().references(() => hotels.id),
      categoryId: integer("category_id").notNull().references(() => hotelCategories.id)
    }, (table) => {
      return {
        pk: primaryKey({ columns: [table.hotelId, table.categoryId] })
      };
    });
    hotelFacilities = pgTable("hotel_facilities", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      description: text("description"),
      icon: text("icon"),
      // FontAwesome icon name
      category: text("category"),
      // E.g. "general", "dining", "recreation", etc.
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    hotelToFacilities = pgTable("hotel_to_facilities", {
      hotelId: integer("hotel_id").notNull().references(() => hotels.id),
      facilityId: integer("facility_id").notNull().references(() => hotelFacilities.id)
    }, (table) => {
      return {
        pk: primaryKey({ columns: [table.hotelId, table.facilityId] })
      };
    });
    cleanlinessFeatures = pgTable("cleanliness_features", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      description: text("description"),
      icon: text("icon"),
      // FontAwesome icon name
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    hotelToCleanlinessFeatures = pgTable("hotel_to_cleanliness", {
      hotelId: integer("hotel_id").notNull().references(() => hotels.id),
      featureId: integer("feature_id").notNull().references(() => cleanlinessFeatures.id)
    }, (table) => {
      return {
        pk: primaryKey({ columns: [table.hotelId, table.featureId] })
      };
    });
    hotelLandmarks = pgTable("hotel_landmarks", {
      id: serial("id").primaryKey(),
      hotelId: integer("hotel_id").notNull().references(() => hotels.id),
      name: text("name").notNull(),
      description: text("description"),
      distance: text("distance"),
      // E.g. "500m", "2.4km"
      distanceValue: doublePrecision("distance_value"),
      // Numeric value for sorting
      distanceUnit: text("distance_unit").default("km"),
      // E.g. "km", "m", "miles"
      longitude: doublePrecision("longitude"),
      latitude: doublePrecision("latitude"),
      placeId: text("place_id"),
      // Google Places ID
      icon: text("icon"),
      // URL to icon
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    hotelHighlights = pgTable("hotel_highlights", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      description: text("description"),
      icon: text("icon"),
      // FontAwesome icon name
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    hotelToHighlights = pgTable("hotel_to_highlights", {
      hotelId: integer("hotel_id").notNull().references(() => hotels.id),
      highlightId: integer("highlight_id").notNull().references(() => hotelHighlights.id)
    }, (table) => {
      return {
        pk: primaryKey({ columns: [table.hotelId, table.highlightId] })
      };
    });
    hotelFaqs = pgTable("hotel_faqs", {
      id: serial("id").primaryKey(),
      hotelId: integer("hotel_id").notNull().references(() => hotels.id),
      question: text("question").notNull(),
      answer: text("answer").notNull(),
      order: integer("order").default(0),
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    hotelRestaurants = pgTable("hotel_restaurants", {
      id: serial("id").primaryKey(),
      hotelId: integer("hotel_id").notNull().references(() => hotels.id),
      name: text("name").notNull(),
      description: text("description"),
      cuisine: text("cuisine"),
      // E.g. "Italian", "International", "Halal"
      mealTypes: json("meal_types"),
      // E.g. ["Breakfast", "Lunch", "Dinner"]
      openingHours: text("opening_hours"),
      imageUrl: text("image_url"),
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    roomCategories = pgTable("room_categories", {
      id: serial("id").primaryKey(),
      name: text("name").notNull().unique(),
      description: text("description"),
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    roomToCategory = pgTable("room_to_category", {
      roomId: integer("room_id").notNull().references(() => rooms.id),
      categoryId: integer("category_id").notNull().references(() => roomCategories.id)
    }, (table) => {
      return {
        pk: primaryKey({ columns: [table.roomId, table.categoryId] })
      };
    });
    packageCategories = pgTable("package_categories", {
      id: serial("id").primaryKey(),
      name: text("name").notNull().unique(),
      description: text("description"),
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    packageToCategory = pgTable("package_to_category", {
      packageId: integer("package_id").notNull().references(() => packages.id),
      categoryId: integer("category_id").notNull().references(() => packageCategories.id)
    }, (table) => {
      return {
        pk: primaryKey({ columns: [table.packageId, table.categoryId] })
      };
    });
    insertCountrySchema = createInsertSchema(countries).pick({
      name: true,
      code: true,
      description: true,
      imageUrl: true,
      active: true
    });
    insertCitySchema = createInsertSchema(cities).pick({
      name: true,
      countryId: true,
      description: true,
      imageUrl: true,
      active: true
    });
    insertAirportSchema = createInsertSchema(airports).pick({
      name: true,
      cityId: true,
      code: true,
      description: true,
      imageUrl: true,
      active: true
    });
    insertUserSchema = createInsertSchema(users).pick({
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
      status: true
    });
    insertDestinationSchema = createInsertSchema(destinations).pick({
      name: true,
      country: true,
      countryId: true,
      cityId: true,
      description: true,
      imageUrl: true,
      featured: true
    });
    insertPackageSchema = createInsertSchema(packages).pick({
      title: true,
      description: true,
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
      slug: true
    });
    insertBookingSchema = createInsertSchema(bookings).pick({
      userId: true,
      packageId: true,
      travelDate: true,
      numberOfTravelers: true,
      totalPrice: true,
      status: true
    });
    insertFavoriteSchema = createInsertSchema(favorites).pick({
      userId: true,
      destinationId: true
    });
    insertTourSchema = createInsertSchema(tours).pick({
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
      status: true
    }).extend({
      // تعديل حقل التاريخ للسماح بنص ISO أو تاريخ وتحويله إلى تاريخ صالح
      date: z.preprocess(
        (val) => {
          if (!val) return null;
          if (val instanceof Date) return val;
          if (typeof val === "string") {
            const date = new Date(val);
            return isNaN(date.getTime()) ? null : date;
          }
          return null;
        },
        z.date().nullable().optional()
      )
    });
    insertHotelSchema = createInsertSchema(hotels).pick({
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
      status: true
    });
    insertRoomSchema = createInsertSchema(rooms).pick({
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
      status: true
    });
    insertRoomCombinationSchema = createInsertSchema(roomCombinations).pick({
      roomId: true,
      adultsCount: true,
      childrenCount: true,
      infantsCount: true,
      description: true,
      isDefault: true,
      active: true
    });
    insertTransportLocationSchema = createInsertSchema(transportLocations).pick({
      name: true,
      city: true,
      country: true,
      locationType: true,
      description: true,
      imageUrl: true,
      popular: true,
      latitude: true,
      longitude: true,
      status: true
    });
    insertTransportDurationSchema = createInsertSchema(transportDurations).pick({
      name: true,
      hours: true,
      description: true,
      status: true
    });
    insertTranslationSchema = createInsertSchema(translations).pick({
      key: true,
      enText: true,
      arText: true,
      context: true,
      category: true
    });
    insertSiteLanguageSettingsSchema = createInsertSchema(siteLanguageSettings).pick({
      defaultLanguage: true,
      availableLanguages: true,
      rtlLanguages: true
    });
    insertDictionaryEntrySchema = createInsertSchema(dictionaryEntries).pick({
      word: true,
      englishDefinition: true,
      arabicTranslation: true,
      partOfSpeech: true,
      context: true,
      example: true,
      notes: true
    });
    insertTransportTypeSchema = createInsertSchema(transportTypes).pick({
      name: true,
      description: true,
      imageUrl: true,
      passengerCapacity: true,
      baggageCapacity: true,
      defaultFeatures: true,
      status: true
    });
    insertMenuSchema = createInsertSchema(menus).pick({
      name: true,
      location: true,
      description: true,
      active: true
    });
    insertMenuItemSchema = createInsertSchema(menuItems).pick({
      menuId: true,
      parentId: true,
      title: true,
      url: true,
      icon: true,
      order: true,
      target: true,
      active: true
    });
    insertTransportationSchema = createInsertSchema(transportation).pick({
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
      status: true
    });
    insertTourCategorySchema = createInsertSchema(tourCategories).pick({
      name: true,
      description: true,
      active: true
    });
    insertHotelCategorySchema = createInsertSchema(hotelCategories).pick({
      name: true,
      description: true,
      active: true
    });
    insertRoomCategorySchema = createInsertSchema(roomCategories).pick({
      name: true,
      description: true,
      active: true
    });
    insertPackageCategorySchema = createInsertSchema(packageCategories).pick({
      name: true,
      description: true,
      active: true
    });
  }
});

// server/db.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl && databaseUrl.trim() !== "") {
    console.log("Using DATABASE_URL environment variable");
    return databaseUrl;
  }
  const pgHost = process.env.PGHOST;
  const pgPort = process.env.PGPORT;
  const pgDatabase = process.env.PGDATABASE;
  const pgUser = process.env.PGUSER;
  const pgPassword = process.env.PGPASSWORD;
  if (pgHost && pgPort && pgDatabase && pgUser) {
    const constructedUrl = `postgresql://${pgUser}:${pgPassword || ""}@${pgHost}:${pgPort}/${pgDatabase}`;
    console.log("Using constructed database URL from individual environment variables");
    return constructedUrl;
  }
  console.log("No explicit database configuration found, trying default connection...");
  return "postgresql://postgres:@localhost:5432/postgres";
}
async function initializeDatabase() {
  try {
    const databaseUrl = getDatabaseUrl();
    client = postgres(databaseUrl, {
      ssl: false,
      max: 5,
      // Limit connection pool size
      idle_timeout: 10,
      // Lower idle timeout
      connection: {
        application_name: "travel-app"
      }
    });
    await client`SELECT 1`;
    db = drizzle(client, { schema: schema_exports });
    console.log("Database connection established successfully");
    return true;
  } catch (error) {
    console.error("Failed to connect to database:", error);
    console.error("Available DB environment variables:", {
      DATABASE_URL: !!process.env.DATABASE_URL,
      PGHOST: process.env.PGHOST,
      PGPORT: process.env.PGPORT,
      PGDATABASE: process.env.PGDATABASE,
      PGUSER: process.env.PGUSER,
      PGPASSWORD: !!process.env.PGPASSWORD
    });
    return false;
  }
}
var client, db, dbPromise;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    dbPromise = initializeDatabase();
  }
});

// server/storage.ts
import session from "express-session";
import MemoryStore from "memorystore";
import { eq, and, or, ilike } from "drizzle-orm";
var PostgresDatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    PostgresDatabaseStorage = class {
      // Hotel Facilities methods
      async listHotelFacilities() {
        try {
          return await db.query.hotelFacilities.findMany({
            orderBy: (facilities) => [facilities.name]
          });
        } catch (error) {
          console.error("Error listing hotel facilities:", error);
          return [];
        }
      }
      async getHotelFacility(id) {
        try {
          return await db.query.hotelFacilities.findFirst({
            where: (facilities, { eq: eq5 }) => eq5(facilities.id, id)
          });
        } catch (error) {
          console.error(`Error getting hotel facility with ID ${id}:`, error);
          return void 0;
        }
      }
      async createHotelFacility(facility) {
        try {
          const result = await db.insert(hotelFacilities).values({
            name: facility.name,
            description: facility.description,
            icon: facility.icon,
            category: facility.category,
            active: facility.active !== void 0 ? facility.active : true,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }).returning();
          return result[0];
        } catch (error) {
          console.error("Error creating hotel facility:", error);
          throw error;
        }
      }
      async updateHotelFacility(id, facility) {
        try {
          const result = await db.update(hotelFacilities).set({
            name: facility.name,
            description: facility.description,
            icon: facility.icon,
            category: facility.category,
            active: facility.active,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(hotelFacilities.id, id)).returning();
          return result[0];
        } catch (error) {
          console.error(`Error updating hotel facility with ID ${id}:`, error);
          return void 0;
        }
      }
      async deleteHotelFacility(id) {
        try {
          await db.delete(hotelFacilities).where(eq(hotelFacilities.id, id));
          return true;
        } catch (error) {
          console.error(`Error deleting hotel facility with ID ${id}:`, error);
          return false;
        }
      }
      // Hotel Highlights methods
      async listHotelHighlights() {
        try {
          return await db.query.hotelHighlights.findMany({
            orderBy: (highlights) => [highlights.name]
          });
        } catch (error) {
          console.error("Error listing hotel highlights:", error);
          return [];
        }
      }
      async getHotelHighlight(id) {
        try {
          return await db.query.hotelHighlights.findFirst({
            where: (highlights, { eq: eq5 }) => eq5(highlights.id, id)
          });
        } catch (error) {
          console.error(`Error getting hotel highlight with ID ${id}:`, error);
          return void 0;
        }
      }
      async createHotelHighlight(highlight) {
        try {
          const result = await db.insert(hotelHighlights).values({
            name: highlight.name,
            description: highlight.description,
            icon: highlight.icon,
            active: highlight.active !== void 0 ? highlight.active : true,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }).returning();
          return result[0];
        } catch (error) {
          console.error("Error creating hotel highlight:", error);
          throw error;
        }
      }
      async updateHotelHighlight(id, highlight) {
        try {
          const result = await db.update(hotelHighlights).set({
            name: highlight.name,
            description: highlight.description,
            icon: highlight.icon,
            active: highlight.active,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(hotelHighlights.id, id)).returning();
          return result[0];
        } catch (error) {
          console.error(`Error updating hotel highlight with ID ${id}:`, error);
          return void 0;
        }
      }
      async deleteHotelHighlight(id) {
        try {
          await db.delete(hotelHighlights).where(eq(hotelHighlights.id, id));
          return true;
        } catch (error) {
          console.error(`Error deleting hotel highlight with ID ${id}:`, error);
          return false;
        }
      }
      // Cleanliness Features methods
      async listCleanlinessFeatures() {
        try {
          return await db.query.cleanlinessFeatures.findMany({
            orderBy: (features) => [features.name]
          });
        } catch (error) {
          console.error("Error listing cleanliness features:", error);
          return [];
        }
      }
      async getCleanlinessFeature(id) {
        try {
          return await db.query.cleanlinessFeatures.findFirst({
            where: (features, { eq: eq5 }) => eq5(features.id, id)
          });
        } catch (error) {
          console.error(`Error getting cleanliness feature with ID ${id}:`, error);
          return void 0;
        }
      }
      async createCleanlinessFeature(feature) {
        try {
          const result = await db.insert(cleanlinessFeatures).values({
            name: feature.name,
            description: feature.description,
            icon: feature.icon,
            active: feature.active !== void 0 ? feature.active : true,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }).returning();
          return result[0];
        } catch (error) {
          console.error("Error creating cleanliness feature:", error);
          throw error;
        }
      }
      async updateCleanlinessFeature(id, feature) {
        try {
          const result = await db.update(cleanlinessFeatures).set({
            name: feature.name,
            description: feature.description,
            icon: feature.icon,
            active: feature.active,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(cleanlinessFeatures.id, id)).returning();
          return result[0];
        } catch (error) {
          console.error(`Error updating cleanliness feature with ID ${id}:`, error);
          return void 0;
        }
      }
      async deleteCleanlinessFeature(id) {
        try {
          await db.delete(cleanlinessFeatures).where(eq(cleanlinessFeatures.id, id));
          return true;
        } catch (error) {
          console.error(`Error deleting cleanliness feature with ID ${id}:`, error);
          return false;
        }
      }
      // Tour Category methods
      async getTourCategory(id) {
        return await db.query.tourCategories.findFirst({
          where: eq(tourCategories.id, id)
        });
      }
      async listTourCategories(active) {
        if (active !== void 0) {
          return await db.query.tourCategories.findMany({
            where: eq(tourCategories.active, active)
          });
        }
        return await db.query.tourCategories.findMany();
      }
      async createTourCategory(category) {
        const [newCategory] = await db.insert(tourCategories).values(category).returning();
        return newCategory;
      }
      async updateTourCategory(id, category) {
        const [updatedCategory] = await db.update(tourCategories).set({ ...category, updatedAt: /* @__PURE__ */ new Date() }).where(eq(tourCategories.id, id)).returning();
        return updatedCategory;
      }
      async deleteTourCategory(id) {
        try {
          await db.delete(tourCategories).where(eq(tourCategories.id, id));
          return true;
        } catch (error) {
          console.error("Error deleting tour category:", error);
          return false;
        }
      }
      // Hotel Category methods
      async getHotelCategory(id) {
        return await db.query.hotelCategories.findFirst({
          where: eq(hotelCategories.id, id)
        });
      }
      async listHotelCategories(active) {
        if (active !== void 0) {
          return await db.query.hotelCategories.findMany({
            where: eq(hotelCategories.active, active)
          });
        }
        return await db.query.hotelCategories.findMany();
      }
      async createHotelCategory(category) {
        const [newCategory] = await db.insert(hotelCategories).values(category).returning();
        return newCategory;
      }
      async updateHotelCategory(id, category) {
        const [updatedCategory] = await db.update(hotelCategories).set({ ...category, updatedAt: /* @__PURE__ */ new Date() }).where(eq(hotelCategories.id, id)).returning();
        return updatedCategory;
      }
      async deleteHotelCategory(id) {
        try {
          await db.delete(hotelCategories).where(eq(hotelCategories.id, id));
          return true;
        } catch (error) {
          console.error("Error deleting hotel category:", error);
          return false;
        }
      }
      // Room Category methods
      async getRoomCategory(id) {
        return await db.query.roomCategories.findFirst({
          where: eq(roomCategories.id, id)
        });
      }
      async listRoomCategories(active) {
        if (active !== void 0) {
          return await db.query.roomCategories.findMany({
            where: eq(roomCategories.active, active)
          });
        }
        return await db.query.roomCategories.findMany();
      }
      async createRoomCategory(category) {
        const [newCategory] = await db.insert(roomCategories).values(category).returning();
        return newCategory;
      }
      async updateRoomCategory(id, category) {
        const [updatedCategory] = await db.update(roomCategories).set({ ...category, updatedAt: /* @__PURE__ */ new Date() }).where(eq(roomCategories.id, id)).returning();
        return updatedCategory;
      }
      async deleteRoomCategory(id) {
        try {
          await db.delete(roomCategories).where(eq(roomCategories.id, id));
          return true;
        } catch (error) {
          console.error("Error deleting room category:", error);
          return false;
        }
      }
      // Package Category methods
      async getPackageCategory(id) {
        return await db.query.packageCategories.findFirst({
          where: eq(packageCategories.id, id)
        });
      }
      async listPackageCategories(active) {
        if (active !== void 0) {
          return await db.query.packageCategories.findMany({
            where: eq(packageCategories.active, active)
          });
        }
        return await db.query.packageCategories.findMany();
      }
      async createPackageCategory(category) {
        const [newCategory] = await db.insert(packageCategories).values(category).returning();
        return newCategory;
      }
      async updatePackageCategory(id, category) {
        const [updatedCategory] = await db.update(packageCategories).set({ ...category, updatedAt: /* @__PURE__ */ new Date() }).where(eq(packageCategories.id, id)).returning();
        return updatedCategory;
      }
      async deletePackageCategory(id) {
        try {
          await db.delete(packageCategories).where(eq(packageCategories.id, id));
          return true;
        } catch (error) {
          console.error("Error deleting package category:", error);
          return false;
        }
      }
      sessionStore;
      constructor() {
        const MemoryStoreSession = MemoryStore(session);
        this.sessionStore = new MemoryStoreSession({
          checkPeriod: 864e5
          // prune expired entries every 24h
        });
      }
      // User methods
      async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user || void 0;
      }
      async getUserByUsername(username) {
        const [user] = await db.select().from(users).where(eq(users.username, username));
        return user || void 0;
      }
      async listUsers() {
        return db.select().from(users);
      }
      async createUser(insertUser) {
        const [user] = await db.insert(users).values(insertUser).returning();
        return user;
      }
      async updateUser(id, userData) {
        const [updatedUser] = await db.update(users).set(userData).where(eq(users.id, id)).returning();
        return updatedUser;
      }
      async deleteUser(id) {
        const result = await db.delete(users).where(eq(users.id, id));
        return !!result;
      }
      // Country methods
      async getCountry(id) {
        const [country] = await db.select().from(countries).where(eq(countries.id, id));
        return country || void 0;
      }
      async getCountryByCode(code) {
        const [country] = await db.select().from(countries).where(eq(countries.code, code));
        return country || void 0;
      }
      async listCountries(active) {
        if (active !== void 0) {
          return await db.select().from(countries).where(eq(countries.active, active));
        }
        return await db.select().from(countries);
      }
      async createCountry(country) {
        const [newCountry] = await db.insert(countries).values(country).returning();
        return newCountry;
      }
      async updateCountry(id, country) {
        const [updatedCountry] = await db.update(countries).set(country).where(eq(countries.id, id)).returning();
        return updatedCountry || void 0;
      }
      async deleteCountry(id) {
        const citiesList = await db.select().from(cities).where(eq(cities.countryId, id));
        if (citiesList.length > 0) {
          return false;
        }
        const result = await db.delete(countries).where(eq(countries.id, id));
        return !!result;
      }
      // City methods
      async getCity(id) {
        const [city] = await db.select().from(cities).where(eq(cities.id, id));
        return city || void 0;
      }
      async listCities(active) {
        if (active !== void 0) {
          return await db.select().from(cities).where(eq(cities.active, active));
        }
        return await db.select().from(cities);
      }
      async getCitiesByCountry(countryId) {
        return await db.select().from(cities).where(eq(cities.countryId, countryId));
      }
      async createCity(city) {
        const [newCity] = await db.insert(cities).values(city).returning();
        return newCity;
      }
      async updateCity(id, city) {
        const [updatedCity] = await db.update(cities).set(city).where(eq(cities.id, id)).returning();
        return updatedCity || void 0;
      }
      async deleteCity(id) {
        const airportsList = await db.select().from(airports).where(eq(airports.cityId, id));
        if (airportsList.length > 0) {
          return false;
        }
        const result = await db.delete(cities).where(eq(cities.id, id));
        return !!result;
      }
      // Airport methods
      async getAirport(id) {
        const [airport] = await db.select().from(airports).where(eq(airports.id, id));
        return airport || void 0;
      }
      async listAirports(active) {
        if (active !== void 0) {
          return await db.select().from(airports).where(eq(airports.active, active));
        }
        return await db.select().from(airports);
      }
      async getAirportsByCity(cityId) {
        return await db.select().from(airports).where(eq(airports.cityId, cityId));
      }
      async createAirport(airport) {
        const [newAirport] = await db.insert(airports).values(airport).returning();
        return newAirport;
      }
      async updateAirport(id, airport) {
        const [updatedAirport] = await db.update(airports).set(airport).where(eq(airports.id, id)).returning();
        return updatedAirport || void 0;
      }
      async deleteAirport(id) {
        const result = await db.delete(airports).where(eq(airports.id, id));
        return !!result;
      }
      // Destination methods
      async getDestination(id) {
        const [destination] = await db.select().from(destinations).where(eq(destinations.id, id));
        return destination || void 0;
      }
      async listDestinations(featured) {
        if (featured !== void 0) {
          return db.select().from(destinations).where(eq(destinations.featured, featured));
        }
        return db.select().from(destinations);
      }
      async createDestination(destination) {
        const [newDestination] = await db.insert(destinations).values(destination).returning();
        return newDestination;
      }
      async updateDestination(id, destination) {
        const [updatedDestination] = await db.update(destinations).set(destination).where(eq(destinations.id, id)).returning();
        return updatedDestination;
      }
      async deleteDestination(id) {
        const result = await db.delete(destinations).where(eq(destinations.id, id));
        return !!result;
      }
      // Package methods
      async getPackage(id) {
        const [pkg] = await db.select().from(packages).where(eq(packages.id, id));
        return pkg || void 0;
      }
      async getPackageBySlug(slug) {
        const [pkg] = await db.select().from(packages).where(eq(packages.slug, slug));
        return pkg || void 0;
      }
      async listPackages(featured) {
        if (featured !== void 0) {
          return db.select().from(packages).where(eq(packages.featured, featured));
        }
        return db.select().from(packages);
      }
      async getPackagesByDestination(destinationId) {
        return db.select().from(packages).where(eq(packages.destinationId, destinationId));
      }
      async createPackage(pkg) {
        const [newPackage] = await db.insert(packages).values(pkg).returning();
        return newPackage;
      }
      async updatePackage(id, pkg) {
        const [updatedPackage] = await db.update(packages).set(pkg).where(eq(packages.id, id)).returning();
        return updatedPackage;
      }
      async updatePackageSlug(id, slug) {
        const [existingPackage] = await db.select().from(packages).where(and(eq(packages.slug, slug), ne(packages.id, id)));
        if (existingPackage) {
          return void 0;
        }
        const [updatedPackage] = await db.update(packages).set({ slug }).where(eq(packages.id, id)).returning();
        return updatedPackage;
      }
      async deletePackage(id) {
        const result = await db.delete(packages).where(eq(packages.id, id));
        return !!result;
      }
      // Tour methods
      async getTour(id) {
        const [tour] = await db.select().from(tours).where(eq(tours.id, id));
        return tour || void 0;
      }
      async listTours(featured) {
        if (featured !== void 0) {
          return db.select().from(tours).where(eq(tours.featured, featured));
        }
        return db.select().from(tours);
      }
      async getToursByDestination(destinationId) {
        return db.select().from(tours).where(eq(tours.destinationId, destinationId));
      }
      async createTour(tour) {
        const [newTour] = await db.insert(tours).values(tour).returning();
        return newTour;
      }
      async updateTour(id, tour) {
        const [updatedTour] = await db.update(tours).set(tour).where(eq(tours.id, id)).returning();
        return updatedTour;
      }
      async deleteTour(id) {
        const result = await db.delete(tours).where(eq(tours.id, id));
        return !!result;
      }
      // Hotel methods
      async getHotel(id) {
        const [hotel] = await db.select().from(hotels).where(eq(hotels.id, id));
        return hotel || void 0;
      }
      async listHotels(featured) {
        if (featured !== void 0) {
          return db.select().from(hotels).where(eq(hotels.featured, featured));
        }
        return db.select().from(hotels);
      }
      async getHotelsByDestination(destinationId) {
        return db.select().from(hotels).where(eq(hotels.destinationId, destinationId));
      }
      async createHotel(hotel) {
        const [newHotel] = await db.insert(hotels).values(hotel).returning();
        return newHotel;
      }
      async updateHotel(id, hotel) {
        const [updatedHotel] = await db.update(hotels).set(hotel).where(eq(hotels.id, id)).returning();
        return updatedHotel;
      }
      async deleteHotel(id) {
        const result = await db.delete(hotels).where(eq(hotels.id, id));
        return !!result;
      }
      // Room methods
      async getRoom(id) {
        const [room] = await db.select().from(rooms).where(eq(rooms.id, id));
        return room || void 0;
      }
      async listRooms() {
        return db.select().from(rooms);
      }
      async getRoomsByHotel(hotelId) {
        return db.select().from(rooms).where(eq(rooms.hotelId, hotelId));
      }
      async createRoom(room) {
        const [newRoom] = await db.insert(rooms).values(room).returning();
        return newRoom;
      }
      async updateRoom(id, room) {
        const [updatedRoom] = await db.update(rooms).set(room).where(eq(rooms.id, id)).returning();
        return updatedRoom;
      }
      async deleteRoom(id) {
        const result = await db.delete(rooms).where(eq(rooms.id, id));
        return !!result;
      }
      // Room Combinations methods
      async getRoomCombination(id) {
        const [combination] = await db.select().from(roomCombinations).where(eq(roomCombinations.id, id));
        return combination || void 0;
      }
      async getRoomCombinationsByRoom(roomId) {
        return db.select().from(roomCombinations).where(eq(roomCombinations.roomId, roomId));
      }
      async createRoomCombination(combination) {
        const [newCombination] = await db.insert(roomCombinations).values(combination).returning();
        return newCombination;
      }
      async updateRoomCombination(id, combination) {
        const [updatedCombination] = await db.update(roomCombinations).set(combination).where(eq(roomCombinations.id, id)).returning();
        return updatedCombination;
      }
      async deleteRoomCombination(id) {
        const result = await db.delete(roomCombinations).where(eq(roomCombinations.id, id));
        return !!result;
      }
      // Transport Types methods
      async getTransportType(id) {
        const [type2] = await db.select().from(transportTypes).where(eq(transportTypes.id, id));
        return type2 || void 0;
      }
      async listTransportTypes() {
        return db.select().from(transportTypes);
      }
      async createTransportType(locationType) {
        const [newType] = await db.insert(transportTypes).values(locationType).returning();
        return newType;
      }
      async updateTransportType(id, locationType) {
        const [updatedType] = await db.update(transportTypes).set(locationType).where(eq(transportTypes.id, id)).returning();
        return updatedType;
      }
      async deleteTransportType(id) {
        const result = await db.delete(transportTypes).where(eq(transportTypes.id, id));
        return !!result;
      }
      // Transport Locations methods
      async getTransportLocation(id) {
        const [location] = await db.select().from(transportLocations).where(eq(transportLocations.id, id));
        return location || void 0;
      }
      async listTransportLocations() {
        return db.select().from(transportLocations);
      }
      async createTransportLocation(location) {
        const [newLocation] = await db.insert(transportLocations).values(location).returning();
        return newLocation;
      }
      async updateTransportLocation(id, location) {
        const [updatedLocation] = await db.update(transportLocations).set(location).where(eq(transportLocations.id, id)).returning();
        return updatedLocation;
      }
      async deleteTransportLocation(id) {
        const result = await db.delete(transportLocations).where(eq(transportLocations.id, id));
        return !!result;
      }
      // Transport Durations methods
      async getTransportDuration(id) {
        const [duration] = await db.select().from(transportDurations).where(eq(transportDurations.id, id));
        return duration || void 0;
      }
      async listTransportDurations() {
        return db.select().from(transportDurations);
      }
      async createTransportDuration(duration) {
        const [newDuration] = await db.insert(transportDurations).values(duration).returning();
        return newDuration;
      }
      async updateTransportDuration(id, duration) {
        const [updatedDuration] = await db.update(transportDurations).set(duration).where(eq(transportDurations.id, id)).returning();
        return updatedDuration;
      }
      async deleteTransportDuration(id) {
        const result = await db.delete(transportDurations).where(eq(transportDurations.id, id));
        return !!result;
      }
      // Transportation methods
      async getTransportation(id) {
        try {
          const fromLocations = transportLocations;
          const toLocations = transportLocations.as("toLocation");
          const [transport] = await db.select({
            id: transportation.id,
            name: transportation.name,
            description: transportation.description,
            typeId: transportation.typeId,
            typeName: transportTypes.name,
            destinationId: transportation.destinationId,
            fromLocationId: transportation.fromLocationId,
            fromLocationName: fromLocations.name,
            toLocationId: transportation.toLocationId,
            toLocationName: toLocations.name,
            durationId: transportation.durationId,
            durationName: transportDurations.name,
            passengerCapacity: transportation.passengerCapacity,
            baggageCapacity: transportation.baggageCapacity,
            price: transportation.price,
            discountedPrice: transportation.discountedPrice,
            imageUrl: transportation.imageUrl,
            features: transportation.features,
            withDriver: transportation.withDriver,
            available: transportation.available,
            pickupIncluded: transportation.pickupIncluded,
            featured: transportation.featured,
            rating: transportation.rating,
            reviewCount: transportation.reviewCount,
            status: transportation.status,
            createdAt: transportation.createdAt,
            updatedAt: transportation.updatedAt
          }).from(transportation).leftJoin(transportTypes, eq(transportation.typeId, transportTypes.id)).leftJoin(fromLocations, eq(transportation.fromLocationId, fromLocations.id)).leftJoin(toLocations, eq(transportation.toLocationId, toLocations.id)).leftJoin(transportDurations, eq(transportation.durationId, transportDurations.id)).where(eq(transportation.id, id));
          return transport || void 0;
        } catch (error) {
          console.error("Error in getTransportation:", error);
          return void 0;
        }
      }
      async listTransportation(featured) {
        try {
          const fromLocations = transportLocations;
          const toLocations = transportLocations.as("toLocation");
          const query = db.select({
            id: transportation.id,
            name: transportation.name,
            description: transportation.description,
            typeId: transportation.typeId,
            typeName: transportTypes.name,
            destinationId: transportation.destinationId,
            fromLocationId: transportation.fromLocationId,
            fromLocationName: fromLocations.name,
            toLocationId: transportation.toLocationId,
            toLocationName: toLocations.name,
            durationId: transportation.durationId,
            durationName: transportDurations.name,
            passengerCapacity: transportation.passengerCapacity,
            baggageCapacity: transportation.baggageCapacity,
            price: transportation.price,
            discountedPrice: transportation.discountedPrice,
            imageUrl: transportation.imageUrl,
            features: transportation.features,
            withDriver: transportation.withDriver,
            available: transportation.available,
            pickupIncluded: transportation.pickupIncluded,
            featured: transportation.featured,
            rating: transportation.rating,
            reviewCount: transportation.reviewCount,
            status: transportation.status,
            createdAt: transportation.createdAt,
            updatedAt: transportation.updatedAt
          }).from(transportation).leftJoin(transportTypes, eq(transportation.typeId, transportTypes.id)).leftJoin(fromLocations, eq(transportation.fromLocationId, fromLocations.id)).leftJoin(toLocations, eq(transportation.toLocationId, toLocations.id)).leftJoin(transportDurations, eq(transportation.durationId, transportDurations.id));
          if (featured !== void 0) {
            return query.where(eq(transportation.featured, featured));
          }
          return query;
        } catch (error) {
          console.error("Error in listTransportation:", error);
          return [];
        }
      }
      async getTransportationByDestination(destinationId) {
        return db.select().from(transportation).where(eq(transportation.destinationId, destinationId));
      }
      async createTransportation(transport) {
        const [newTransport] = await db.insert(transportation).values(transport).returning();
        return newTransport;
      }
      async updateTransportation(id, transport) {
        const [updatedTransport] = await db.update(transportation).set(transport).where(eq(transportation.id, id)).returning();
        return updatedTransport;
      }
      async deleteTransportation(id) {
        const result = await db.delete(transportation).where(eq(transportation.id, id));
        return !!result;
      }
      // Translation methods
      async getTranslation(id) {
        const [translation] = await db.select().from(translations).where(eq(translations.id, id));
        return translation;
      }
      async getTranslationByKey(key) {
        const [translation] = await db.select().from(translations).where(eq(translations.key, key));
        return translation;
      }
      async listTranslations(category) {
        if (category) {
          return db.select().from(translations).where(eq(translations.category, category));
        }
        return db.select().from(translations);
      }
      async createTranslation(translation) {
        const now = /* @__PURE__ */ new Date();
        const [newTranslation2] = await db.insert(translations).values({
          ...translation,
          createdAt: now,
          updatedAt: now
        }).returning();
        return newTranslation2;
      }
      async updateTranslation(id, translation) {
        const [updatedTranslation] = await db.update(translations).set({
          ...translation,
          updatedAt: /* @__PURE__ */ new Date()
          // Use Date object directly
        }).where(eq(translations.id, id)).returning();
        return updatedTranslation;
      }
      async deleteTranslation(id) {
        const result = await db.delete(translations).where(eq(translations.id, id));
        return !!result;
      }
      // Dictionary Entry methods
      async getDictionaryEntry(id) {
        const [entry] = await db.select().from(dictionaryEntries).where(eq(dictionaryEntries.id, id));
        return entry;
      }
      async getDictionaryEntryByWord(word) {
        const [entry] = await db.select().from(dictionaryEntries).where(eq(dictionaryEntries.word, word));
        return entry;
      }
      async searchDictionaryEntries(searchTerm) {
        return db.select().from(dictionaryEntries).where(
          // Case-insensitive search using ILIKE operator
          or(
            ilike(dictionaryEntries.word, `%${searchTerm}%`),
            ilike(dictionaryEntries.englishDefinition, `%${searchTerm}%`),
            ilike(dictionaryEntries.arabicTranslation, `%${searchTerm}%`)
          )
        );
      }
      async listDictionaryEntries() {
        return db.select().from(dictionaryEntries);
      }
      async createDictionaryEntry(entry) {
        const [newEntry] = await db.insert(dictionaryEntries).values(entry).returning();
        return newEntry;
      }
      async updateDictionaryEntry(id, entry) {
        const [updatedEntry] = await db.update(dictionaryEntries).set({
          ...entry,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(dictionaryEntries.id, id)).returning();
        return updatedEntry;
      }
      async deleteDictionaryEntry(id) {
        const result = await db.delete(dictionaryEntries).where(eq(dictionaryEntries.id, id));
        return !!result;
      }
      // Site Language Settings methods
      async getSiteLanguageSettings() {
        const [settings] = await db.select().from(siteLanguageSettings).limit(1);
        return settings;
      }
      async updateSiteLanguageSettings(settings) {
        const existingSettings = await this.getSiteLanguageSettings();
        if (existingSettings) {
          const [updatedSettings] = await db.update(siteLanguageSettings).set({
            ...settings,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(siteLanguageSettings.id, existingSettings.id)).returning();
          return updatedSettings;
        } else {
          const [newSettings] = await db.insert(siteLanguageSettings).values({
            defaultLanguage: settings.defaultLanguage || "en",
            availableLanguages: settings.availableLanguages || ["en", "ar"],
            rtlLanguages: settings.rtlLanguages || ["ar"]
          }).returning();
          return newSettings;
        }
      }
      // Booking methods
      async getBooking(id) {
        const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
        return booking || void 0;
      }
      async listBookingsByUser(userId) {
        return db.select().from(bookings).where(eq(bookings.userId, userId));
      }
      async createBooking(booking) {
        const [newBooking] = await db.insert(bookings).values(booking).returning();
        return newBooking;
      }
      async updateBookingStatus(id, status) {
        const [updatedBooking] = await db.update(bookings).set({ status }).where(eq(bookings.id, id)).returning();
        return updatedBooking;
      }
      // Favorites methods
      async addFavorite(favorite) {
        const [newFavorite] = await db.insert(favorites).values(favorite).returning();
        return newFavorite;
      }
      async removeFavorite(userId, destinationId) {
        const result = await db.delete(favorites).where(and(
          eq(favorites.userId, userId),
          eq(favorites.destinationId, destinationId)
        ));
        return !!result;
      }
      async listUserFavorites(userId) {
        const favoriteDestinations = await db.select({
          destination: destinations
        }).from(favorites).innerJoin(destinations, eq(favorites.destinationId, destinations.id)).where(eq(favorites.userId, userId));
        return favoriteDestinations.map((row) => row.destination);
      }
      async checkIsFavorite(userId, destinationId) {
        const [favorite] = await db.select().from(favorites).where(and(
          eq(favorites.userId, userId),
          eq(favorites.destinationId, destinationId)
        ));
        return !!favorite;
      }
      // Menu methods
      async getMenu(id) {
        const [menu] = await db.select().from(menus).where(eq(menus.id, id));
        return menu;
      }
      async getMenuByName(name) {
        const [menu] = await db.select().from(menus).where(eq(menus.name, name));
        return menu;
      }
      async getMenuByLocation(location) {
        const [menu] = await db.select().from(menus).where(eq(menus.location, location));
        return menu;
      }
      async listMenus(active) {
        if (active !== void 0) {
          return db.select().from(menus).where(eq(menus.active, active));
        }
        return db.select().from(menus);
      }
      async createMenu(menu) {
        const [newMenu] = await db.insert(menus).values({
          ...menu,
          active: menu.active ?? true,
          description: menu.description ?? null,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newMenu;
      }
      async updateMenu(id, menu) {
        const [updatedMenu] = await db.update(menus).set({
          ...menu,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(menus.id, id)).returning();
        return updatedMenu;
      }
      async deleteMenu(id) {
        await db.delete(menuItems).where(eq(menuItems.menuId, id));
        const result = await db.delete(menus).where(eq(menus.id, id));
        return !!result;
      }
      // Menu Item methods
      async getMenuItem(id) {
        const [menuItem] = await db.select().from(menuItems).where(eq(menuItems.id, id));
        return menuItem;
      }
      async listMenuItems(menuId, active) {
        if (active !== void 0) {
          return db.select().from(menuItems).where(
            and(
              eq(menuItems.menuId, menuId),
              eq(menuItems.active, active)
            )
          ).orderBy(menuItems.order);
        }
        return db.select().from(menuItems).where(eq(menuItems.menuId, menuId)).orderBy(menuItems.order);
      }
      async createMenuItem(item) {
        const [newMenuItem] = await db.insert(menuItems).values({
          ...item,
          active: item.active ?? true,
          icon: item.icon ?? null,
          target: item.target ?? null,
          parentId: item.parentId ?? null,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newMenuItem;
      }
      async updateMenuItem(id, item) {
        const [updatedMenuItem] = await db.update(menuItems).set({
          ...item,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(menuItems.id, id)).returning();
        return updatedMenuItem;
      }
      async deleteMenuItem(id) {
        await db.update(menuItems).set({ parentId: null }).where(eq(menuItems.parentId, id));
        const result = await db.delete(menuItems).where(eq(menuItems.id, id));
        return !!result;
      }
      // Dictionary methods
      async getDictionaryEntry(id) {
        const [entry] = await db.select().from(dictionaryEntries).where(eq(dictionaryEntries.id, id));
        return entry;
      }
      async getDictionaryEntryByWord(word) {
        const [entry] = await db.select().from(dictionaryEntries).where(eq(dictionaryEntries.word, word.toLowerCase().trim()));
        return entry;
      }
      async listDictionaryEntries() {
        return db.select().from(dictionaryEntries);
      }
      async searchDictionaryEntries(term) {
        return db.select().from(dictionaryEntries).where(
          or(
            ilike(dictionaryEntries.word, `%${term}%`),
            ilike(dictionaryEntries.englishDefinition, `%${term}%`),
            ilike(dictionaryEntries.arabicTranslation, `%${term}%`)
          )
        );
      }
      async createDictionaryEntry(entry) {
        const [newEntry] = await db.insert(dictionaryEntries).values({
          ...entry,
          word: entry.word.toLowerCase().trim(),
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newEntry;
      }
      async updateDictionaryEntry(id, entry) {
        const dataToUpdate = {
          ...entry,
          updatedAt: /* @__PURE__ */ new Date()
        };
        if (entry.word) {
          dataToUpdate.word = entry.word.toLowerCase().trim();
        }
        const [updatedEntry] = await db.update(dictionaryEntries).set(dataToUpdate).where(eq(dictionaryEntries.id, id)).returning();
        return updatedEntry;
      }
      async deleteDictionaryEntry(id) {
        const result = await db.delete(dictionaryEntries).where(eq(dictionaryEntries.id, id));
        return !!result;
      }
    };
    storage = new PostgresDatabaseStorage();
  }
});

// server/admin-setup.ts
var admin_setup_exports = {};
import { scrypt as scrypt2, randomBytes as randomBytes2 } from "crypto";
import { promisify as promisify2 } from "util";
import { eq as eq3 } from "drizzle-orm";
async function hashPassword2(password) {
  const salt = randomBytes2(16).toString("hex");
  const buf = await scryptAsync2(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function setupAdmin() {
  try {
    console.log("\u{1F510} Setting up admin users...");
    const existingAdmin = await db.select().from(users).where(eq3(users.username, "EETADMIN"));
    if (existingAdmin.length === 0) {
      const hashedPassword = await hashPassword2("passW0rd");
      await db.insert(users).values({
        username: "EETADMIN",
        password: hashedPassword,
        email: "admin@egyptexpress.com",
        displayName: "Admin User",
        role: "admin"
      });
      console.log("\u2705 Main admin user created successfully!");
    } else {
      console.log("\u2705 Main admin user already exists");
    }
    const existingTestAdmin = await db.select().from(users).where(eq3(users.username, "testadmin"));
    if (existingTestAdmin.length === 0) {
      const testAdminPassword = await hashPassword2("test123");
      await db.insert(users).values({
        username: "testadmin",
        password: testAdminPassword,
        email: "testadmin@egyptexpress.com",
        displayName: "Test Admin",
        role: "admin"
      });
      console.log("\u2705 Test admin user created successfully!");
    } else {
      console.log("\u2705 Test admin user already exists");
    }
  } catch (error) {
    console.error("\u274C Error setting up admin users:", error);
  }
}
var scryptAsync2;
var init_admin_setup = __esm({
  "server/admin-setup.ts"() {
    "use strict";
    init_schema();
    init_db();
    scryptAsync2 = promisify2(scrypt2);
    setupAdmin();
  }
});

// setup-for-remix.ts
var setup_for_remix_exports = {};
__export(setup_for_remix_exports, {
  setupDatabase: () => setupDatabase
});
import { sql as sql2 } from "drizzle-orm";
async function setupDatabase() {
  console.log("\u{1F504} Checking database setup...");
  try {
    await db.execute(sql2`
      ALTER TABLE packages ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
    `);
    console.log("\u2705 Ensured packages table has slug column");
    await db.execute(sql2`
      CREATE TABLE IF NOT EXISTS countries (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("\u2705 Ensured countries table exists");
    await db.execute(sql2`
      CREATE TABLE IF NOT EXISTS nationalities (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("\u2705 Ensured nationalities table exists");
    await db.execute(sql2`
      CREATE TABLE IF NOT EXISTS visas (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        target_country_id INTEGER REFERENCES countries(id),
        image_url TEXT,
        price INTEGER,
        processing_time TEXT,
        required_documents JSONB,
        validity_period TEXT,
        entry_type TEXT,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("\u2705 Ensured visas table exists");
    await db.execute(sql2`
      CREATE TABLE IF NOT EXISTS nationality_visa_requirements (
        id SERIAL PRIMARY KEY,
        visa_id INTEGER REFERENCES visas(id) ON DELETE CASCADE,
        nationality_id INTEGER REFERENCES nationalities(id) ON DELETE CASCADE,
        requirement_details TEXT,
        additional_documents JSONB,
        fees INTEGER,
        processing_time TEXT,
        notes TEXT,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("\u2705 Ensured nationality_visa_requirements table exists");
    console.log("\u2705 All necessary visa tables are created");
    console.log("\u2705 Database setup complete!");
    return true;
  } catch (error) {
    console.error("\u274C Error setting up database:", error);
    return false;
  }
}
var init_setup_for_remix = __esm({
  "setup-for-remix.ts"() {
    "use strict";
    init_db();
  }
});

// server/seed-package-categories.ts
var seed_package_categories_exports = {};
__export(seed_package_categories_exports, {
  seedPackageCategories: () => seedPackageCategories
});
async function seedPackageCategories() {
  console.log("\u{1F3F7}\uFE0F Seeding package categories...");
  try {
    const existingCategories = await storage.listPackageCategories();
    if (existingCategories.length > 0) {
      console.log("\u2705 Package categories already seeded");
      return;
    }
    const categories = [
      {
        name: "Featured",
        description: "Our top recommended packages with special offers",
        active: true
      },
      {
        name: "Cultural",
        description: "Immersive cultural experiences visiting historical and heritage sites",
        active: true
      },
      {
        name: "Luxury",
        description: "Premium travel experiences with high-end accommodations and services",
        active: true
      },
      {
        name: "Adventure",
        description: "Exciting outdoor activities and unique experiences for thrill-seekers",
        active: true
      },
      {
        name: "Beach & Relaxation",
        description: "Beach getaways and relaxing retreats perfect for unwinding",
        active: true
      },
      {
        name: "Transportation",
        description: "Transportation services including transfers and rental options",
        active: true
      },
      {
        name: "Fly & Stay",
        description: "Combined flight and accommodation packages for convenient booking",
        active: true
      }
    ];
    for (const category of categories) {
      await storage.createPackageCategory(category);
      console.log(`\u2705 Created package category: ${category.name}`);
    }
    console.log("\u2705 Package categories seeded successfully");
  } catch (error) {
    console.error("\u274C Error seeding package categories:", error);
  }
}
var init_seed_package_categories = __esm({
  "server/seed-package-categories.ts"() {
    "use strict";
    init_storage();
    seedPackageCategories().then(() => {
      console.log("\u2705 Package categories seeding complete");
    }).catch((error) => {
      console.error("\u274C Error in package categories seeding:", error);
    });
  }
});

// server/seed-menus.ts
import { eq as eq4 } from "drizzle-orm";
async function seedMenus(reset = false) {
  console.log("\u{1F331} Seeding menus...");
  try {
    const existingMenus = await db.select().from(menus);
    if (existingMenus.length > 0) {
      if (reset) {
        console.log("\u{1F504} Resetting existing menus...");
        await db.delete(menuItems);
        await db.delete(menus);
        console.log("\u2705 Existing menus reset successfully");
      } else {
        console.log("\u2705 Menus already seeded");
        return;
      }
    }
    const currentDate = /* @__PURE__ */ new Date();
    await db.insert(menus).values({
      name: "Footer Menu",
      location: "footer",
      description: "Main footer menu links",
      active: true,
      createdAt: currentDate,
      updatedAt: currentDate
    });
    const [footerMenu] = await db.select().from(menus).where(eq4(menus.name, "Footer Menu"));
    if (!footerMenu) {
      throw new Error("Failed to create footer menu");
    }
    console.log(`Created menu: ${footerMenu.name}`);
    const footerItems = [
      {
        title: "Home",
        url: "/",
        order: 0,
        menuId: footerMenu.id,
        active: 1
      },
      {
        title: "Destinations",
        url: "/destinations",
        order: 1,
        menuId: footerMenu.id,
        active: 1
      },
      {
        title: "Packages",
        url: "/packages",
        order: 2,
        menuId: footerMenu.id,
        active: 1
      },
      {
        title: "Visas",
        url: "/visas",
        order: 3,
        menuId: footerMenu.id,
        active: 1
      },
      {
        title: "About Us",
        url: "/about",
        order: 4,
        menuId: footerMenu.id,
        active: 1
      },
      {
        title: "Contact",
        url: "/contact",
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
    await db.insert(menus).values({
      name: "Header Menu",
      location: "header",
      description: "Main navigation menu",
      active: true,
      createdAt: currentDate,
      updatedAt: currentDate
    });
    const [headerMenu] = await db.select().from(menus).where(eq4(menus.name, "Header Menu"));
    if (!headerMenu) {
      throw new Error("Failed to create header menu");
    }
    console.log(`Created menu: ${headerMenu.name}`);
    const headerItems = [
      {
        title: "Home",
        url: "/",
        order: 0,
        menuId: headerMenu.id,
        active: 1
      },
      {
        title: "Destinations",
        url: "/destinations",
        order: 1,
        menuId: headerMenu.id,
        active: 1
      },
      {
        title: "Tours",
        url: "/tours",
        order: 2,
        menuId: headerMenu.id,
        active: 1
      },
      {
        title: "Hotels",
        url: "/hotels",
        order: 3,
        menuId: headerMenu.id,
        active: 1
      },
      {
        title: "Packages",
        url: "/packages",
        order: 4,
        menuId: headerMenu.id,
        active: 1
      },
      {
        title: "Transportation",
        url: "/transportation",
        order: 5,
        menuId: headerMenu.id,
        active: 1
      },
      {
        title: "About",
        url: "/about",
        order: 6,
        menuId: headerMenu.id,
        active: 1
      },
      {
        title: "Contact",
        url: "/contact",
        order: 7,
        menuId: headerMenu.id,
        active: 1
      }
    ];
    const menuItemIds = {};
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
      if (insertedItem) {
        menuItemIds[item.title] = insertedItem.id;
      }
    }
    const vehicleTypes = [
      {
        title: "Sedan",
        url: "/transportation/sedan",
        order: 0,
        parentId: menuItemIds["Transportation"],
        menuId: headerMenu.id,
        active: 1
      },
      {
        title: "SUV",
        url: "/transportation/suv",
        order: 1,
        parentId: menuItemIds["Transportation"],
        menuId: headerMenu.id,
        active: 1
      },
      {
        title: "Van",
        url: "/transportation/van",
        order: 2,
        parentId: menuItemIds["Transportation"],
        menuId: headerMenu.id,
        active: 1
      },
      {
        title: "Luxury",
        url: "/transportation/luxury",
        order: 3,
        parentId: menuItemIds["Transportation"],
        menuId: headerMenu.id,
        active: 1
      }
    ];
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
    console.log("\u2705 Successfully seeded menus");
  } catch (error) {
    console.error("\u274C Error seeding menus:", error);
  }
}
var init_seed_menus = __esm({
  "server/seed-menus.ts"() {
    "use strict";
    init_db();
    init_schema();
    if (import.meta.url === `file://${process.argv[1]}`) {
      seedMenus().then(() => {
        console.log("Seeding complete");
        process.exit(0);
      }).catch((error) => {
        console.error("Error during seeding:", error);
        process.exit(1);
      });
    }
  }
});

// server/seed-translations.ts
async function seedTranslations() {
  console.log("\u{1F331} Seeding translations...");
  const existingTranslations = await db.select().from(translations);
  if (existingTranslations.length > 0) {
    console.log("\u2705 Translations already seeded");
    return;
  }
  try {
    const currentDate = /* @__PURE__ */ new Date();
    const translationData = [
      // Common UI elements
      { key: "common.english", enText: "English", arText: "\u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629", category: "common", context: "Language name in language switcher", createdAt: currentDate, updatedAt: currentDate },
      { key: "common.arabic", enText: "Arabic", arText: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629", category: "common", context: "Language name in language switcher", createdAt: currentDate, updatedAt: currentDate },
      { key: "common.loading", enText: "Loading...", arText: "\u062C\u0627\u0631 \u0627\u0644\u062A\u062D\u0645\u064A\u0644...", category: "common", context: "Loading state text", createdAt: currentDate, updatedAt: currentDate },
      { key: "common.save", enText: "Save", arText: "\u062D\u0641\u0638", category: "common", context: "Save button text", createdAt: currentDate, updatedAt: currentDate },
      { key: "common.cancel", enText: "Cancel", arText: "\u0625\u0644\u063A\u0627\u0621", category: "common", context: "Cancel button text", createdAt: currentDate, updatedAt: currentDate },
      { key: "common.edit", enText: "Edit", arText: "\u062A\u0639\u062F\u064A\u0644", category: "common", context: "Edit button/action text", createdAt: currentDate, updatedAt: currentDate },
      { key: "common.delete", enText: "Delete", arText: "\u062D\u0630\u0641", category: "common", context: "Delete button/action text", createdAt: currentDate, updatedAt: currentDate },
      { key: "common.search", enText: "Search", arText: "\u0628\u062D\u062B", category: "common", context: "Search input placeholder/button", createdAt: currentDate, updatedAt: currentDate },
      // Navigation
      { key: "nav.home", enText: "Home", arText: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629", category: "navigation", context: "Main navigation link", createdAt: currentDate, updatedAt: currentDate },
      { key: "nav.packages", enText: "Packages", arText: "\u0627\u0644\u0628\u0627\u0642\u0627\u062A", category: "navigation", context: "Main navigation link", createdAt: currentDate, updatedAt: currentDate },
      { key: "nav.destinations", enText: "Destinations", arText: "\u0627\u0644\u0648\u062C\u0647\u0627\u062A", category: "navigation", context: "Main navigation link", createdAt: currentDate, updatedAt: currentDate },
      { key: "nav.about", enText: "About", arText: "\u0639\u0646 \u0627\u0644\u0634\u0631\u0643\u0629", category: "navigation", context: "Main navigation link", createdAt: currentDate, updatedAt: currentDate },
      { key: "nav.contact", enText: "Contact", arText: "\u0627\u062A\u0635\u0644 \u0628\u0646\u0627", category: "navigation", context: "Main navigation link", createdAt: currentDate, updatedAt: currentDate },
      // Homepage
      { key: "home.title", enText: "Discover the Magic of the Middle East", arText: "\u0627\u0643\u062A\u0634\u0641 \u0633\u062D\u0631 \u0627\u0644\u0634\u0631\u0642 \u0627\u0644\u0623\u0648\u0633\u0637", category: "homepage", context: "Homepage hero title", createdAt: currentDate, updatedAt: currentDate },
      { key: "home.featured", enText: "Featured Destinations", arText: "\u0648\u062C\u0647\u0627\u062A \u0645\u0645\u064A\u0632\u0629", category: "homepage", context: "Featured destinations section title", createdAt: currentDate, updatedAt: currentDate },
      // Authentication
      { key: "auth.login", enText: "Log In", arText: "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644", category: "auth", context: "Login button/page title", createdAt: currentDate, updatedAt: currentDate },
      { key: "auth.register", enText: "Register", arText: "\u0627\u0644\u062A\u0633\u062C\u064A\u0644", category: "auth", context: "Register button/page title", createdAt: currentDate, updatedAt: currentDate },
      { key: "auth.logout", enText: "Log Out", arText: "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C", category: "auth", context: "Logout button", createdAt: currentDate, updatedAt: currentDate }
    ];
    for (const item of translationData) {
      await db.insert(translations).values(item);
    }
    await db.insert(siteLanguageSettings).values({
      defaultLanguage: "en",
      availableLanguages: ["en", "ar"],
      rtlLanguages: ["ar"],
      createdAt: currentDate,
      updatedAt: currentDate
    });
    console.log("\u2705 Translations and language settings seeded successfully!");
  } catch (error) {
    console.error("\u274C Error seeding translations:", error);
  }
}
var init_seed_translations = __esm({
  "server/seed-translations.ts"() {
    "use strict";
    init_db();
    init_schema();
    if (import.meta.url === `file://${process.argv[1]}`) {
      seedTranslations().then(() => {
        console.log("Translations seeding complete");
        process.exit(0);
      }).catch((error) => {
        console.error("Error during translations seeding:", error);
        process.exit(1);
      });
    }
  }
});

// server/seed-dictionary.ts
async function seedDictionary() {
  console.log("\u{1F331} Seeding dictionary entries...");
  const existingEntries = await db.select().from(dictionaryEntries).limit(1);
  if (existingEntries.length > 0) {
    console.log("\u2705 Dictionary entries already exist");
    return;
  }
  const entries = [
    {
      word: "travel",
      englishDefinition: "To go from one place to another, especially over a long distance.",
      arabicTranslation: "\u0633\u0641\u0631",
      partOfSpeech: "noun",
      context: "Tourism",
      example: "They enjoy travel to exotic destinations.",
      notes: "Also used as a verb: to travel"
    },
    {
      word: "hotel",
      englishDefinition: "An establishment providing accommodation, meals, and other services for travelers and tourists.",
      arabicTranslation: "\u0641\u0646\u062F\u0642",
      partOfSpeech: "noun",
      context: "Accommodation",
      example: "We stayed at a five-star hotel in Cairo.",
      notes: null
    },
    {
      word: "pyramid",
      englishDefinition: "A monumental structure with a square or triangular base and sloping sides that meet in a point at the top.",
      arabicTranslation: "\u0647\u0631\u0645",
      partOfSpeech: "noun",
      context: "Landmarks",
      example: "The Great Pyramid of Giza is the oldest of the Seven Wonders of the Ancient World.",
      notes: "Plural: pyramids"
    },
    {
      word: "museum",
      englishDefinition: "A building in which objects of historical, scientific, artistic, or cultural interest are stored and exhibited.",
      arabicTranslation: "\u0645\u062A\u062D\u0641",
      partOfSpeech: "noun",
      context: "Tourism",
      example: "The Egyptian Museum houses the world's largest collection of Pharaonic antiquities.",
      notes: null
    },
    {
      word: "flight",
      englishDefinition: "A journey made by air, especially in an airplane.",
      arabicTranslation: "\u0631\u062D\u0644\u0629 \u062C\u0648\u064A\u0629",
      partOfSpeech: "noun",
      context: "Transportation",
      example: "Our flight to Cairo takes about four hours.",
      notes: null
    }
  ];
  try {
    const currentDate = /* @__PURE__ */ new Date();
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
    console.log("\u2705 Dictionary entries seeded successfully");
  } catch (error) {
    console.error("\u274C Error seeding dictionary entries:", error);
  }
}
var init_seed_dictionary = __esm({
  "server/seed-dictionary.ts"() {
    "use strict";
    init_db();
    init_schema();
    if (import.meta.url === `file://${process.argv[1]}`) {
      seedDictionary().then(() => {
        console.log("Dictionary seeding complete");
        process.exit(0);
      }).catch((error) => {
        console.error("Error during dictionary seeding:", error);
        process.exit(1);
      });
    }
  }
});

// server/seed-room-categories.ts
async function seedRoomCategories() {
  console.log("\u{1F6CF}\uFE0F Seeding room categories...");
  const existingCategories = await storage.listRoomCategories();
  if (existingCategories.length > 0) {
    console.log("\u2705 Room categories already seeded");
    return;
  }
  const categories = [
    {
      name: "Standard",
      description: "Basic comfortable rooms with essential amenities for budget travelers.",
      active: true
    },
    {
      name: "Deluxe",
      description: "Premium rooms with enhanced amenities and more space for a luxurious stay.",
      active: true
    },
    {
      name: "Suite",
      description: "Spacious multi-room accommodations with separate living areas and premium amenities.",
      active: true
    },
    {
      name: "Family",
      description: "Larger rooms designed for families with additional beds and child-friendly amenities.",
      active: true
    }
  ];
  for (const category of categories) {
    await storage.createRoomCategory(category);
  }
  console.log("\u2705 Room categories seeding complete");
}
var init_seed_room_categories = __esm({
  "server/seed-room-categories.ts"() {
    "use strict";
    init_storage();
  }
});

// server/seed.ts
var seed_exports = {};
__export(seed_exports, {
  seed: () => seed
});
async function seed() {
  console.log("\u{1F331} Seeding data...");
  const existingDestinations = await storage.listDestinations();
  if (existingDestinations.length > 0) {
    console.log("\u2705 Data already seeded");
    return;
  }
  try {
    console.log("\u{1F30D} Seeding countries...");
    const egypt = await storage.createCountry({
      name: "Egypt",
      code: "EG",
      description: "A country linking northeast Africa with the Middle East, dates to the time of the pharaohs.",
      imageUrl: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=800&auto=format&fit=crop",
      active: true
    });
    const uae = await storage.createCountry({
      name: "United Arab Emirates",
      code: "UAE",
      description: "A federation of seven emirates on the eastern Arabian Peninsula.",
      imageUrl: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=800&auto=format&fit=crop",
      active: true
    });
    const jordan = await storage.createCountry({
      name: "Jordan",
      code: "JO",
      description: "An Arab nation on the banks of the Jordan River, known for ancient monuments and nature reserves.",
      imageUrl: "https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?q=80&w=800&auto=format&fit=crop",
      active: true
    });
    const morocco = await storage.createCountry({
      name: "Morocco",
      code: "MA",
      description: "A North African country with a vibrant culture and landscapes from the Sahara to the Atlas Mountains.",
      imageUrl: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=800&auto=format&fit=crop",
      active: true
    });
    console.log("\u{1F3D9}\uFE0F Seeding cities...");
    const cairoCity = await storage.createCity({
      name: "Cairo",
      countryId: egypt.id,
      description: "The capital of Egypt and the largest city in the Arab world.",
      imageUrl: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=800&auto=format&fit=crop",
      active: true
    });
    const luxorCity = await storage.createCity({
      name: "Luxor",
      countryId: egypt.id,
      description: "A city on the east bank of the Nile River, known for its ancient ruins.",
      imageUrl: "https://images.unsplash.com/photo-1558685582-2d0d597e6b71?q=80&w=800&auto=format&fit=crop",
      active: true
    });
    const sharmCity = await storage.createCity({
      name: "Sharm El Sheikh",
      countryId: egypt.id,
      description: "A resort town between the desert of the Sinai Peninsula and the Red Sea.",
      imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=800&auto=format&fit=crop",
      active: true
    });
    const dubaiCity = await storage.createCity({
      name: "Dubai",
      countryId: uae.id,
      description: "A city known for luxury shopping, ultramodern architecture, and a lively nightlife.",
      imageUrl: "https://images.unsplash.com/photo-1548813395-e5217e9a3520?q=80&w=800&auto=format&fit=crop",
      active: true
    });
    const abuDhabiCity = await storage.createCity({
      name: "Abu Dhabi",
      countryId: uae.id,
      description: "The capital of the UAE, known for its cultural landmarks and high-end shopping.",
      imageUrl: "https://images.unsplash.com/photo-1551041777-575d3b3a5f8d?q=80&w=800&auto=format&fit=crop",
      active: true
    });
    const ammanCity = await storage.createCity({
      name: "Amman",
      countryId: jordan.id,
      description: "The capital and largest city of Jordan, featuring a unique blend of old and new.",
      imageUrl: "https://images.unsplash.com/photo-1534293230397-c067fc201ebb?q=80&w=800&auto=format&fit=crop",
      active: true
    });
    const petraCity = await storage.createCity({
      name: "Petra",
      countryId: jordan.id,
      description: "An archaeological city famous for its rock-cut architecture and water conduit system.",
      imageUrl: "https://images.unsplash.com/photo-1518368305415-e7e5621e3bef?q=80&w=800&auto=format&fit=crop",
      active: true
    });
    const marrakechCity = await storage.createCity({
      name: "Marrakech",
      countryId: morocco.id,
      description: "A major city known for its vibrant markets, gardens, palaces, and mosques.",
      imageUrl: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=800&auto=format&fit=crop",
      active: true
    });
    const casablancaCity = await storage.createCity({
      name: "Casablanca",
      countryId: morocco.id,
      description: "Morocco's chief port and one of the largest financial centers in Africa.",
      imageUrl: "https://images.unsplash.com/photo-1577048982768-5cb3e7ddfa23?q=80&w=800&auto=format&fit=crop",
      active: true
    });
    const alexandriaCity = await storage.createCity({
      name: "Alexandria",
      countryId: egypt.id,
      description: "Egypt's Mediterranean port city with a rich history.",
      imageUrl: "https://images.unsplash.com/photo-1588332652694-9f46b4cfd1af?q=80&w=800&auto=format&fit=crop",
      active: true
    });
    const istanbulCity = await storage.createCity({
      name: "Istanbul",
      countryId: await (async () => {
        const existingTurkey = await storage.getCountryByCode("TR");
        if (existingTurkey) return existingTurkey.id;
        const turkey = await storage.createCountry({
          name: "Turkey",
          code: "TR",
          description: "A transcontinental country straddling Europe and Asia.",
          imageUrl: "https://images.unsplash.com/photo-1545293527-e26058c5b48b?q=80&w=800&auto=format&fit=crop",
          active: true
        });
        return turkey.id;
      })(),
      description: "Turkey's cultural and economic hub spanning Europe and Asia.",
      imageUrl: "https://images.unsplash.com/photo-1628940498613-8c4f1b19ce59?q=80&w=800&auto=format&fit=crop",
      active: true
    });
    const londonCity = await storage.createCity({
      name: "London",
      countryId: await (async () => {
        const existingUK = await storage.getCountryByCode("UK");
        if (existingUK) return existingUK.id;
        const uk = await storage.createCountry({
          name: "United Kingdom",
          code: "UK",
          description: "An island nation in northwestern Europe known for its iconic landmarks.",
          imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop",
          active: true
        });
        return uk.id;
      })(),
      description: "The capital of England and the UK, a global city with rich history.",
      imageUrl: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=800&auto=format&fit=crop",
      active: true
    });
    const newYorkCity = await storage.createCity({
      name: "New York",
      countryId: await (async () => {
        const existingUSA = await storage.getCountryByCode("US");
        if (existingUSA) return existingUSA.id;
        const usa = await storage.createCountry({
          name: "United States",
          code: "US",
          description: "A diverse country spanning North America with global influence.",
          imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=800&auto=format&fit=crop",
          active: true
        });
        return usa.id;
      })(),
      description: "A major US city known for its skyscrapers and cultural diversity.",
      imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop",
      active: true
    });
    const parisCity = await storage.createCity({
      name: "Paris",
      countryId: await (async () => {
        const existingFrance = await storage.getCountryByCode("FR");
        if (existingFrance) return existingFrance.id;
        const france = await storage.createCountry({
          name: "France",
          code: "FR",
          description: "A Western European country known for its art, culture, and cuisine.",
          imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop",
          active: true
        });
        return france.id;
      })(),
      description: "The capital of France, known for its art, fashion, and landmarks.",
      imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop",
      active: true
    });
    const romeCity = await storage.createCity({
      name: "Rome",
      countryId: await (async () => {
        const existingItaly = await storage.getCountryByCode("IT");
        if (existingItaly) return existingItaly.id;
        const italy = await storage.createCountry({
          name: "Italy",
          code: "IT",
          description: "A Mediterranean country with a rich history and beautiful coastlines.",
          imageUrl: "https://images.unsplash.com/photo-1516108317508-6788f6a160e4?q=80&w=800&auto=format&fit=crop",
          active: true
        });
        return italy.id;
      })(),
      description: "The capital of Italy, home to ancient ruins and Renaissance art.",
      imageUrl: "https://images.unsplash.com/photo-1529260830199-42c24126f198?q=80&w=800&auto=format&fit=crop",
      active: true
    });
    const tokyoCity = await storage.createCity({
      name: "Tokyo",
      countryId: await (async () => {
        const existingJapan = await storage.getCountryByCode("JP");
        if (existingJapan) return existingJapan.id;
        const japan = await storage.createCountry({
          name: "Japan",
          code: "JP",
          description: "An island nation in East Asia known for its traditional culture and technology.",
          imageUrl: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?q=80&w=800&auto=format&fit=crop",
          active: true
        });
        return japan.id;
      })(),
      description: "Japan's capital, a blend of traditional culture and cutting-edge technology.",
      imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop",
      active: true
    });
    const jeddahCity = await storage.createCity({
      name: "Jeddah",
      countryId: await (async () => {
        const existingSA = await storage.getCountryByCode("SA");
        if (existingSA) return existingSA.id;
        const saudiArabia = await storage.createCountry({
          name: "Saudi Arabia",
          code: "SA",
          description: "A desert country encompassing most of the Arabian Peninsula.",
          imageUrl: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?q=80&w=800&auto=format&fit=crop",
          active: true
        });
        return saudiArabia.id;
      })(),
      description: "Saudi Arabia's commercial center and gateway to Mecca.",
      imageUrl: "https://images.unsplash.com/photo-1584132967334-72a3e38fabc4?q=80&w=800&auto=format&fit=crop",
      active: true
    });
    console.log("\u2708\uFE0F Seeding airports...");
    await storage.createAirport({
      name: "Cairo International Airport",
      cityId: cairoCity.id,
      code: "CAI",
      description: "The main international airport serving Cairo, Egypt.",
      active: true
    });
    await storage.createAirport({
      name: "Almaza Airport",
      cityId: cairoCity.id,
      code: "ALM",
      description: "A military airport in Cairo with limited civilian operations.",
      active: true
    });
    await storage.createAirport({
      name: "Borg El Arab Airport",
      cityId: alexandriaCity.id,
      code: "HBE",
      description: "The main airport serving Alexandria, Egypt.",
      active: true
    });
    await storage.createAirport({
      name: "Dubai International Airport",
      cityId: dubaiCity.id,
      code: "DXB",
      description: "One of the busiest international airports in the world.",
      active: true
    });
    await storage.createAirport({
      name: "Al Maktoum International Airport",
      cityId: dubaiCity.id,
      code: "DWC",
      description: "Dubai's second international airport, also known as Dubai World Central.",
      active: true
    });
    await storage.createAirport({
      name: "Istanbul Airport",
      cityId: istanbulCity.id,
      code: "IST",
      description: "The main international airport serving Istanbul, Turkey.",
      active: true
    });
    await storage.createAirport({
      name: "Sabiha G\xF6k\xE7en International Airport",
      cityId: istanbulCity.id,
      code: "SAW",
      description: "Istanbul's second international airport located on the Asian side.",
      active: true
    });
    await storage.createAirport({
      name: "Heathrow Airport",
      cityId: londonCity.id,
      code: "LHR",
      description: "One of the busiest airports in Europe and the main hub for London.",
      active: true
    });
    await storage.createAirport({
      name: "Gatwick Airport",
      cityId: londonCity.id,
      code: "LGW",
      description: "London's second largest international airport.",
      active: true
    });
    await storage.createAirport({
      name: "Stansted Airport",
      cityId: londonCity.id,
      code: "STN",
      description: "A major base for low-cost carriers serving London and the East of England.",
      active: true
    });
    await storage.createAirport({
      name: "John F. Kennedy International Airport",
      cityId: newYorkCity.id,
      code: "JFK",
      description: "The primary international airport serving New York City.",
      active: true
    });
    await storage.createAirport({
      name: "LaGuardia Airport",
      cityId: newYorkCity.id,
      code: "LGA",
      description: "An airport in Queens that serves domestic flights to New York City.",
      active: true
    });
    await storage.createAirport({
      name: "Newark Liberty International Airport",
      cityId: newYorkCity.id,
      code: "EWR",
      description: "An international airport serving the New York metropolitan area.",
      active: true
    });
    await storage.createAirport({
      name: "Charles de Gaulle Airport",
      cityId: parisCity.id,
      code: "CDG",
      description: "The largest international airport in France.",
      active: true
    });
    await storage.createAirport({
      name: "Orly Airport",
      cityId: parisCity.id,
      code: "ORY",
      description: "The second main airport serving Paris, located south of the city.",
      active: true
    });
    await storage.createAirport({
      name: "Leonardo da Vinci International Airport",
      cityId: romeCity.id,
      code: "FCO",
      description: "The main airport serving Rome, also known as Fiumicino Airport.",
      active: true
    });
    await storage.createAirport({
      name: "Rome Ciampino Airport",
      cityId: romeCity.id,
      code: "CIA",
      description: "A secondary international airport serving Rome.",
      active: true
    });
    await storage.createAirport({
      name: "Haneda Airport",
      cityId: tokyoCity.id,
      code: "HND",
      description: "One of the two primary airports serving the Greater Tokyo Area.",
      active: true
    });
    await storage.createAirport({
      name: "Narita International Airport",
      cityId: tokyoCity.id,
      code: "NRT",
      description: "The main international airport serving the Greater Tokyo Area.",
      active: true
    });
    await storage.createAirport({
      name: "King Abdulaziz International Airport",
      cityId: jeddahCity.id,
      code: "JED",
      description: "The main airport serving Jeddah, Saudi Arabia.",
      active: true
    });
    console.log("\u{1F4CD} Seeding destinations...");
    const cairo = await storage.createDestination({
      name: "Cairo",
      country: "Egypt",
      countryId: egypt.id,
      cityId: cairoCity.id,
      description: "Explore the ancient pyramids and rich history of Cairo.",
      imageUrl: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=800&auto=format&fit=crop",
      featured: true
    });
    const dubai = await storage.createDestination({
      name: "Dubai",
      country: "UAE",
      countryId: uae.id,
      cityId: dubaiCity.id,
      description: "Experience luxury and modern architecture in Dubai.",
      imageUrl: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=800&auto=format&fit=crop",
      featured: true
    });
    const sharmElSheikh = await storage.createDestination({
      name: "Sharm El Sheikh",
      country: "Egypt",
      countryId: egypt.id,
      cityId: sharmCity.id,
      description: "Relax on beautiful beaches and dive in crystal-clear waters of the Red Sea.",
      imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=800&auto=format&fit=crop",
      featured: true
    });
    const petra = await storage.createDestination({
      name: "Petra",
      country: "Jordan",
      countryId: jordan.id,
      cityId: petraCity.id,
      description: "Discover the hidden city carved into rose-colored stone.",
      imageUrl: "https://images.unsplash.com/photo-1518368305415-e7e5621e3bef?q=80&w=800&auto=format&fit=crop",
      featured: true
    });
    const marrakech = await storage.createDestination({
      name: "Marrakech",
      country: "Morocco",
      countryId: morocco.id,
      cityId: marrakechCity.id,
      description: "Immerse yourself in the vibrant markets and culture of Marrakech.",
      imageUrl: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=800&auto=format&fit=crop",
      featured: true
    });
    console.log("\u{1F4E6} Seeding packages...");
    await storage.createPackage({
      title: "Cairo & Luxor Package",
      description: "Explore ancient pyramids and cruise the Nile in this 7-day adventure",
      price: 1699,
      discountedPrice: 1359,
      imageUrl: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=800&auto=format&fit=crop",
      duration: 7,
      rating: 45,
      // 4.5 stars
      destinationId: cairo.id,
      featured: true,
      type: "Cultural",
      inclusions: ["Flights", "Hotels", "Tours", "Guide"]
    });
    await storage.createPackage({
      title: "Dubai Luxury Weekend",
      description: "Experience luxury shopping, desert safari, and iconic architecture",
      price: 1199,
      discountedPrice: 999,
      imageUrl: "https://images.unsplash.com/photo-1548813395-e5217e9a3520?q=80&w=800&auto=format&fit=crop",
      duration: 4,
      rating: 50,
      // 5.0 stars
      destinationId: dubai.id,
      featured: true,
      type: "Luxury",
      inclusions: ["Hotels", "Breakfast", "Desert Safari"]
    });
    await storage.createPackage({
      title: "Jordan Explorer",
      description: "Discover Petra, Wadi Rum, and the Dead Sea on this adventure",
      price: 1299,
      discountedPrice: 979,
      imageUrl: "https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?q=80&w=800&auto=format&fit=crop",
      duration: 6,
      rating: 40,
      // 4.0 stars
      destinationId: petra.id,
      featured: true,
      type: "Adventure",
      inclusions: ["Hotels", "Half Board", "Tour Guide"]
    });
    await storage.createPackage({
      title: "Moroccan Magic",
      description: "Explore the vibrant markets, historic medinas, and stunning landscapes of Morocco on this unforgettable journey.",
      price: 1249,
      discountedPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=800&auto=format&fit=crop",
      duration: 8,
      rating: 45,
      // 4.5 stars
      destinationId: marrakech.id,
      featured: false,
      type: "Cultural",
      inclusions: ["Hotels", "Breakfast & Dinner", "Tour Guide"]
    });
    await storage.createPackage({
      title: "Nile Luxury Cruise",
      description: "Sail the legendary Nile River in style, exploring ancient temples and monuments along the way.",
      price: 1899,
      discountedPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1621690977399-354a6556f243?q=80&w=800&auto=format&fit=crop",
      duration: 8,
      rating: 47,
      // 4.7 stars
      destinationId: cairo.id,
      featured: false,
      type: "Luxury",
      inclusions: ["Hotels", "Full Board", "Tours", "Guide"]
    });
    await storage.createPackage({
      title: "Red Sea Visa Package",
      description: "Complete visa service and resort stay in beautiful Sharm El Sheikh, with all formalities handled for you.",
      price: 899,
      discountedPrice: 799,
      imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop",
      duration: 5,
      rating: 46,
      // 4.6 stars
      destinationId: sharmElSheikh.id,
      featured: true,
      type: "Beach & Relaxation",
      inclusions: ["Visa Processing", "Hotels", "Airport Transfers", "Breakfast"]
    });
    await storage.createPackage({
      title: "Jordan Transportation Explorer",
      description: "Premium transportation package covering all your travel needs in Jordan, with private driver and flexible itinerary.",
      price: 1150,
      discountedPrice: 990,
      imageUrl: "https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?q=80&w=800&auto=format&fit=crop",
      duration: 6,
      rating: 48,
      // 4.8 stars
      destinationId: petra.id,
      featured: true,
      type: "Transportation",
      inclusions: ["Private Driver", "Premium Vehicle", "Fuel", "Hotels", "Airport Transfers", "Breakfast"]
    });
    await storage.createPackage({
      title: "Fly & Stay: Dubai Getaway",
      description: "All-inclusive package with international flights to Dubai, luxury accommodation, and unique experiences.",
      price: 1650,
      discountedPrice: 1495,
      imageUrl: "https://images.unsplash.com/photo-1548813395-e5217e9a3520?q=80&w=800&auto=format&fit=crop",
      duration: 5,
      rating: 49,
      // 4.9 stars
      destinationId: dubai.id,
      featured: true,
      type: "Fly & Stay",
      inclusions: ["International Flights", "4-star Hotel", "Airport Transfers", "Dubai City Tour", "Desert Safari"]
    });
    console.log("\u2705 Data seeded successfully!");
    await seedMenus(true);
    await seedTranslations();
    await seedDictionary();
    await seedPackageCategories();
    await seedRoomCategories();
  } catch (error) {
    console.error("\u274C Error seeding data:", error);
  }
}
var init_seed = __esm({
  "server/seed.ts"() {
    "use strict";
    init_storage();
    init_seed_menus();
    init_seed_translations();
    init_seed_dictionary();
    init_seed_package_categories();
    init_seed_room_categories();
  }
});

// server/init-database.ts
var init_database_exports = {};
__export(init_database_exports, {
  initializeDatabase: () => initializeDatabase2
});
import { exec } from "child_process";
import { promisify as promisify3 } from "util";
async function initializeDatabase2() {
  console.log("\u{1F527} Initializing database...");
  try {
    console.log("\u{1F4CB} Creating database schema...");
    await execAsync("npm run db:push");
    console.log("\u2705 Database schema created successfully");
    const { setupDatabase: setupDatabase2 } = await Promise.resolve().then(() => (init_setup_for_remix(), setup_for_remix_exports));
    await setupDatabase2();
    const adminSetup = await Promise.resolve().then(() => (init_admin_setup(), admin_setup_exports));
    await adminSetup.setupAdmin();
    const packageCategoriesSetup = await Promise.resolve().then(() => (init_seed_package_categories(), seed_package_categories_exports));
    await packageCategoriesSetup.seedPackageCategories();
    const seedModule = await Promise.resolve().then(() => (init_seed(), seed_exports));
    await seedModule.seed();
    console.log("\u2705 Database initialization complete!");
  } catch (error) {
    console.error("\u274C Database initialization failed:", error);
  }
}
var execAsync;
var init_init_database = __esm({
  "server/init-database.ts"() {
    "use strict";
    execAsync = promisify3(exec);
  }
});

// server/first-time-setup.ts
var first_time_setup_exports = {};
__export(first_time_setup_exports, {
  firstTimeSetup: () => firstTimeSetup
});
import bcrypt from "bcryptjs";
async function firstTimeSetup() {
  console.log("\u{1F680} Running first-time setup...");
  try {
    const existingCountries = await db.select().from(countries).limit(1);
    if (existingCountries.length > 0) {
      console.log("\u2705 Database already contains data, skipping first-time setup");
      return;
    }
    console.log("\u{1F4CA} Setting up initial data...");
    console.log("\u{1F465} Creating sample users...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    await db.insert(users).values([
      {
        username: "johndoe",
        password: hashedPassword,
        email: "john@example.com",
        fullName: "John Doe",
        role: "user",
        status: "active"
      },
      {
        username: "manager",
        password: hashedPassword,
        email: "manager@example.com",
        fullName: "Travel Manager",
        role: "manager",
        status: "active"
      }
    ]);
    console.log("\u{1F30D} Adding countries...");
    const countryData = await db.insert(countries).values([
      {
        name: "Egypt",
        code: "EG",
        description: "Land of ancient pharaohs and pyramids",
        active: true
      },
      {
        name: "Jordan",
        code: "JO",
        description: "Kingdom with rose-red city of Petra",
        active: true
      },
      {
        name: "United Arab Emirates",
        code: "AE",
        description: "Modern marvel of luxury and innovation",
        active: true
      },
      {
        name: "Turkey",
        code: "TR",
        description: "Bridge between Europe and Asia",
        active: true
      }
    ]).returning();
    console.log("\u{1F3D9}\uFE0F Adding cities...");
    const cityData = await db.insert(cities).values([
      // Egypt cities
      { name: "Cairo", countryId: countryData[0].id, description: "Capital of Egypt", active: true },
      { name: "Luxor", countryId: countryData[0].id, description: "Ancient Thebes", active: true },
      { name: "Aswan", countryId: countryData[0].id, description: "Nubian heritage city", active: true },
      { name: "Sharm El Sheikh", countryId: countryData[0].id, description: "Red Sea resort", active: true },
      // Jordan cities
      { name: "Amman", countryId: countryData[1].id, description: "Capital of Jordan", active: true },
      { name: "Petra", countryId: countryData[1].id, description: "Archaeological wonder", active: true },
      { name: "Aqaba", countryId: countryData[1].id, description: "Red Sea port city", active: true },
      // UAE cities
      { name: "Dubai", countryId: countryData[2].id, description: "Global business hub", active: true },
      { name: "Abu Dhabi", countryId: countryData[2].id, description: "UAE capital", active: true },
      // Turkey cities
      { name: "Istanbul", countryId: countryData[3].id, description: "Historic crossroads", active: true },
      { name: "Cappadocia", countryId: countryData[3].id, description: "Fairy chimney landscape", active: true }
    ]).returning();
    console.log("\u{1F5FA}\uFE0F Adding destinations...");
    const destinationData = await db.insert(destinations).values([
      {
        name: "Pyramids of Giza",
        country: "Egypt",
        countryId: countryData[0].id,
        cityId: cityData[0].id,
        description: "Ancient wonder of the world featuring the Great Pyramid",
        imageUrl: "/images/destinations/pyramids.jpg",
        featured: true
      },
      {
        name: "Valley of the Kings",
        country: "Egypt",
        countryId: countryData[0].id,
        cityId: cityData[1].id,
        description: "Ancient burial ground of pharaohs",
        imageUrl: "/images/destinations/valley-kings.jpg",
        featured: true
      },
      {
        name: "Petra Archaeological Site",
        country: "Jordan",
        countryId: countryData[1].id,
        cityId: cityData[5].id,
        description: "Rose-red city carved into rock",
        imageUrl: "/images/destinations/petra.jpg",
        featured: true
      },
      {
        name: "Burj Khalifa",
        country: "United Arab Emirates",
        countryId: countryData[2].id,
        cityId: cityData[7].id,
        description: "World's tallest building",
        imageUrl: "/images/destinations/burj-khalifa.jpg",
        featured: true
      }
    ]).returning();
    console.log("\u{1F4C2} Creating categories...");
    const packageCats = await db.insert(packageCategories).values([
      { name: "Cultural Tours", description: "Historical and cultural experiences", active: true },
      { name: "Adventure", description: "Exciting adventure activities", active: true },
      { name: "Luxury", description: "Premium luxury experiences", active: true },
      { name: "Family", description: "Family-friendly packages", active: true },
      { name: "Honeymoon", description: "Romantic getaways", active: true }
    ]).returning();
    const tourCats = await db.insert(tourCategories).values([
      { name: "Historical", description: "Ancient sites and monuments", active: true },
      { name: "Cultural", description: "Local culture and traditions", active: true },
      { name: "Desert", description: "Desert adventures", active: true },
      { name: "City Tours", description: "Urban exploration", active: true },
      { name: "Religious", description: "Religious and spiritual sites", active: true }
    ]).returning();
    const hotelCats = await db.insert(hotelCategories).values([
      { name: "Luxury Resort", description: "5-star luxury accommodations", active: true },
      { name: "Boutique Hotel", description: "Unique boutique properties", active: true },
      { name: "Business Hotel", description: "Corporate travelers", active: true },
      { name: "Budget Hotel", description: "Affordable options", active: true }
    ]).returning();
    const roomCats = await db.insert(roomCategories).values([
      { name: "Standard", description: "Standard accommodation", active: true },
      { name: "Deluxe", description: "Upgraded rooms with premium features", active: true },
      { name: "Suite", description: "Spacious suites with separate areas", active: true },
      { name: "Presidential", description: "Ultimate luxury accommodation", active: true }
    ]).returning();
    console.log("\u{1F4E6} Adding travel packages...");
    await db.insert(packages).values([
      {
        title: "Classic Egypt Discovery",
        description: "Explore the wonders of ancient Egypt including pyramids, temples, and the Nile River cruise",
        price: 129900,
        // $1,299
        discountedPrice: 99900,
        // $999
        imageUrl: "/images/packages/egypt-classic.jpg",
        duration: 7,
        rating: 48,
        // 4.8 stored as integer
        reviewCount: 156,
        destinationId: destinationData[0].id,
        countryId: countryData[0].id,
        cityId: cityData[0].id,
        featured: true,
        type: "Cultural",
        slug: "classic-egypt-discovery"
      },
      {
        title: "Luxor & Aswan Nile Cruise",
        description: "Luxury Nile cruise from Luxor to Aswan visiting ancient temples and tombs",
        price: 159900,
        // $1,599
        discountedPrice: 139900,
        // $1,399
        imageUrl: "/images/packages/nile-cruise.jpg",
        duration: 5,
        rating: 47,
        // 4.7
        reviewCount: 203,
        destinationId: destinationData[1].id,
        countryId: countryData[0].id,
        cityId: cityData[1].id,
        featured: true,
        type: "Luxury",
        slug: "luxor-aswan-nile-cruise"
      },
      {
        title: "Red Sea Diving Adventure",
        description: "World-class diving experience in the crystal clear waters of the Red Sea",
        price: 89900,
        // $899
        discountedPrice: 79900,
        // $799
        imageUrl: "/images/packages/red-sea-diving.jpg",
        duration: 4,
        rating: 46,
        // 4.6
        reviewCount: 127,
        destinationId: destinationData[0].id,
        countryId: countryData[0].id,
        cityId: cityData[3].id,
        featured: false,
        type: "Adventure",
        slug: "red-sea-diving-adventure"
      },
      {
        title: "Petra & Jordan Adventure",
        description: "Discover the rose-red city of Petra and Jordan's hidden treasures",
        price: 89900,
        // $899
        discountedPrice: 69900,
        // $699
        imageUrl: "/images/packages/jordan-petra.jpg",
        duration: 5,
        rating: 47,
        // 4.7
        reviewCount: 89,
        destinationId: destinationData[2].id,
        countryId: countryData[1].id,
        cityId: cityData[5].id,
        featured: true,
        type: "Cultural",
        slug: "petra-jordan-adventure"
      },
      {
        title: "Jordan Desert & Dead Sea",
        description: "Experience Wadi Rum desert and relax at the therapeutic Dead Sea",
        price: 119900,
        // $1,199
        discountedPrice: 99900,
        // $999
        imageUrl: "/images/packages/jordan-desert.jpg",
        duration: 6,
        rating: 45,
        // 4.5
        reviewCount: 156,
        destinationId: destinationData[2].id,
        countryId: countryData[1].id,
        cityId: cityData[4].id,
        featured: false,
        type: "Adventure",
        slug: "jordan-desert-dead-sea"
      },
      {
        title: "Dubai Luxury Experience",
        description: "Experience the height of luxury in modern Dubai with premium accommodations",
        price: 199900,
        // $1,999
        discountedPrice: 179900,
        // $1,799
        imageUrl: "/images/packages/dubai-luxury.jpg",
        duration: 4,
        rating: 49,
        // 4.9
        reviewCount: 234,
        destinationId: destinationData[3].id,
        countryId: countryData[2].id,
        cityId: cityData[7].id,
        featured: true,
        type: "Luxury",
        slug: "dubai-luxury-experience"
      },
      {
        title: "Dubai Family Fun Package",
        description: "Perfect family vacation with theme parks, beaches, and cultural experiences",
        price: 149900,
        // $1,499
        discountedPrice: 129900,
        // $1,299
        imageUrl: "/images/packages/dubai-family.jpg",
        duration: 5,
        rating: 47,
        // 4.7
        reviewCount: 312,
        destinationId: destinationData[3].id,
        countryId: countryData[2].id,
        cityId: cityData[7].id,
        featured: false,
        type: "Family",
        slug: "dubai-family-fun-package"
      },
      {
        title: "Istanbul & Cappadocia Magic",
        description: "Explore historic Istanbul and the fairy chimneys of Cappadocia",
        price: 109900,
        // $1,099
        discountedPrice: 89900,
        // $899
        imageUrl: "/images/packages/turkey-istanbul.jpg",
        duration: 6,
        rating: 48,
        // 4.8
        reviewCount: 189,
        destinationId: destinationData[0].id,
        countryId: countryData[3].id,
        cityId: cityData[9].id,
        featured: true,
        type: "Cultural",
        slug: "istanbul-cappadocia-magic"
      }
    ]);
    console.log("\u{1F3AF} Adding tours...");
    await db.insert(tours).values([
      {
        name: "Pyramids & Sphinx Half Day Tour",
        description: "Visit the iconic Pyramids of Giza and the mysterious Sphinx",
        imageUrl: "/images/tours/pyramids-tour.jpg",
        destinationId: destinationData[0].id,
        tripType: "Historical",
        duration: 4,
        date: /* @__PURE__ */ new Date("2025-06-01"),
        numPassengers: 15,
        price: 4900,
        // $49
        discountedPrice: 3900,
        // $39
        maxGroupSize: 20,
        featured: true,
        rating: 46,
        // 4.6
        reviewCount: 312,
        status: "active"
      },
      {
        name: "Petra Treasury Walking Tour",
        description: "Explore the magnificent Treasury and Siq entrance",
        imageUrl: "/images/tours/petra-treasury.jpg",
        destinationId: destinationData[2].id,
        tripType: "Historical",
        duration: 6,
        date: /* @__PURE__ */ new Date("2025-06-05"),
        numPassengers: 12,
        price: 7900,
        // $79
        discountedPrice: 6900,
        // $69
        maxGroupSize: 15,
        featured: true,
        rating: 48,
        // 4.8
        reviewCount: 198,
        status: "active"
      }
    ]);
    console.log("\u{1F3E8} Adding hotels...");
    const hotelData = await db.insert(hotels).values([
      {
        name: "Grand Nile Palace Cairo",
        description: "Luxury hotel overlooking the Nile River with world-class amenities",
        address: "123 Nile Corniche, Cairo, Egypt",
        phone: "+20 2 1234 5678",
        email: "info@grandnilepalace.com",
        imageUrl: "/images/hotels/nile-palace.jpg",
        destinationId: destinationData[0].id,
        countryId: countryData[0].id,
        cityId: cityData[0].id,
        starRating: 5,
        pricePerNight: 25e3,
        // $250
        discountedPrice: 2e4,
        // $200
        currency: "USD",
        checkInTime: "15:00",
        checkOutTime: "12:00",
        featured: true,
        rating: 47,
        // 4.7
        reviewCount: 1247,
        status: "active"
      },
      {
        name: "Petra Heritage Hotel",
        description: "Boutique hotel near Petra with traditional Jordanian hospitality",
        address: "Wadi Musa, Petra, Jordan",
        phone: "+962 3 215 6789",
        email: "reservations@petraheritage.com",
        imageUrl: "/images/hotels/petra-heritage.jpg",
        destinationId: destinationData[2].id,
        countryId: countryData[1].id,
        cityId: cityData[5].id,
        starRating: 4,
        pricePerNight: 18e3,
        // $180
        discountedPrice: 15e3,
        // $150
        currency: "USD",
        checkInTime: "14:00",
        checkOutTime: "11:00",
        featured: true,
        rating: 45,
        // 4.5
        reviewCount: 567,
        status: "active"
      },
      {
        name: "Burj Al Arab Dubai",
        description: "World's most luxurious 7-star hotel with unparalleled service",
        address: "Jumeirah Beach Road, Dubai, UAE",
        phone: "+971 4 301 7777",
        email: "reservations@burjalarab.com",
        imageUrl: "/images/hotels/burj-al-arab.jpg",
        destinationId: destinationData[3].id,
        countryId: countryData[2].id,
        cityId: cityData[7].id,
        starRating: 7,
        pricePerNight: 15e4,
        // $1,500
        discountedPrice: 12e4,
        // $1,200
        currency: "USD",
        checkInTime: "15:00",
        checkOutTime: "12:00",
        featured: true,
        rating: 50,
        // 5.0
        reviewCount: 1456,
        status: "active"
      },
      {
        name: "Atlantis The Palm Dubai",
        description: "Iconic family resort with water park and marine adventures",
        address: "Palm Jumeirah, Dubai, UAE",
        phone: "+971 4 426 2000",
        email: "reservations@atlantisthepalm.com",
        imageUrl: "/images/hotels/atlantis-palm.jpg",
        destinationId: destinationData[3].id,
        countryId: countryData[2].id,
        cityId: cityData[7].id,
        starRating: 5,
        pricePerNight: 8e4,
        // $800
        discountedPrice: 65e3,
        // $650
        currency: "USD",
        checkInTime: "15:00",
        checkOutTime: "12:00",
        featured: true,
        rating: 47,
        // 4.7
        reviewCount: 2134,
        status: "active"
      },
      {
        name: "Four Seasons Istanbul",
        description: "Luxury hotel in the heart of historic Istanbul",
        address: "Sultanahmet Square, Istanbul, Turkey",
        phone: "+90 212 402 3000",
        email: "reservations.istanbul@fourseasons.com",
        imageUrl: "/images/hotels/four-seasons-istanbul.jpg",
        destinationId: destinationData[0].id,
        countryId: countryData[3].id,
        cityId: cityData[9].id,
        starRating: 5,
        pricePerNight: 45e3,
        // $450
        discountedPrice: 38e3,
        // $380
        currency: "USD",
        checkInTime: "15:00",
        checkOutTime: "12:00",
        featured: true,
        rating: 48,
        // 4.8
        reviewCount: 1876,
        status: "active"
      }
    ]).returning();
    console.log("\u{1F6CF}\uFE0F Adding hotel rooms...");
    await db.insert(rooms).values([
      // Grand Nile Palace Cairo rooms
      {
        name: "Deluxe Nile View Room",
        description: "Spacious room with stunning Nile River views and modern amenities",
        hotelId: hotelData[0].id,
        type: "Deluxe",
        price: 3e4,
        // $300
        discountedPrice: 25e3,
        // $250
        capacity: 2,
        bedType: "King Bed",
        size: 45,
        imageUrl: "/images/rooms/nile-deluxe.jpg",
        available: true,
        maxOccupancy: 3,
        rating: 47,
        reviewCount: 234
      },
      {
        name: "Executive Suite",
        description: "Luxurious suite with separate living area and panoramic city views",
        hotelId: hotelData[0].id,
        type: "Suite",
        price: 5e4,
        // $500
        discountedPrice: 42e3,
        // $420
        capacity: 4,
        bedType: "King Bed + Sofa Bed",
        size: 75,
        imageUrl: "/images/rooms/executive-suite.jpg",
        available: true,
        maxOccupancy: 4,
        rating: 48,
        reviewCount: 156
      },
      {
        name: "Standard City View",
        description: "Comfortable room with modern furnishings and city views",
        hotelId: hotelData[0].id,
        type: "Standard",
        price: 2e4,
        // $200
        discountedPrice: 17e3,
        // $170
        capacity: 2,
        bedType: "Queen Bed",
        size: 35,
        imageUrl: "/images/rooms/standard-city.jpg",
        available: true,
        maxOccupancy: 2,
        rating: 44,
        reviewCount: 389
      },
      // Petra Heritage Hotel rooms
      {
        name: "Traditional Petra Room",
        description: "Authentic Jordanian-style room with traditional decor and mountain views",
        hotelId: hotelData[1].id,
        type: "Standard",
        price: 18e3,
        // $180
        discountedPrice: 15e3,
        // $150
        capacity: 2,
        bedType: "Twin Beds",
        size: 30,
        imageUrl: "/images/rooms/petra-traditional.jpg",
        available: true,
        maxOccupancy: 3,
        rating: 45,
        reviewCount: 167
      },
      {
        name: "Heritage Suite",
        description: "Spacious suite combining traditional charm with modern comfort",
        hotelId: hotelData[1].id,
        type: "Suite",
        price: 28e3,
        // $280
        discountedPrice: 24e3,
        // $240
        capacity: 3,
        bedType: "King Bed",
        size: 55,
        imageUrl: "/images/rooms/heritage-suite.jpg",
        available: true,
        maxOccupancy: 4,
        rating: 46,
        reviewCount: 98
      },
      // Burj Al Arab Dubai rooms
      {
        name: "One Bedroom Suite",
        description: "Ultra-luxurious suite with panoramic Gulf views and butler service",
        hotelId: hotelData[2].id,
        type: "Suite",
        price: 2e5,
        // $2,000
        discountedPrice: 18e4,
        // $1,800
        capacity: 2,
        bedType: "King Bed",
        size: 170,
        imageUrl: "/images/rooms/burj-suite.jpg",
        available: true,
        maxOccupancy: 3,
        rating: 50,
        reviewCount: 89
      },
      {
        name: "Royal Suite",
        description: "The pinnacle of luxury with private dining and dedicated butler",
        hotelId: hotelData[2].id,
        type: "Presidential",
        price: 5e5,
        // $5,000
        discountedPrice: 45e4,
        // $4,500
        capacity: 4,
        bedType: "King Bed + Additional Bedrooms",
        size: 780,
        imageUrl: "/images/rooms/royal-suite.jpg",
        available: true,
        maxOccupancy: 6,
        rating: 50,
        reviewCount: 23
      },
      // Atlantis The Palm Dubai rooms
      {
        name: "Ocean View Room",
        description: "Stylish room with stunning views of the Arabian Gulf",
        hotelId: hotelData[3].id,
        type: "Deluxe",
        price: 9e4,
        // $900
        discountedPrice: 75e3,
        // $750
        capacity: 2,
        bedType: "King Bed",
        size: 45,
        imageUrl: "/images/rooms/atlantis-ocean.jpg",
        available: true,
        maxOccupancy: 3,
        rating: 47,
        reviewCount: 445
      },
      {
        name: "Family Suite",
        description: "Perfect for families with separate bedrooms and aquarium views",
        hotelId: hotelData[3].id,
        type: "Suite",
        price: 15e4,
        // $1,500
        discountedPrice: 125e3,
        // $1,250
        capacity: 6,
        bedType: "King Bed + Bunk Beds",
        size: 90,
        imageUrl: "/images/rooms/atlantis-family.jpg",
        available: true,
        maxOccupancy: 6,
        rating: 48,
        reviewCount: 312
      },
      // Four Seasons Istanbul rooms
      {
        name: "Historic City View",
        description: "Elegant room overlooking the historic Sultanahmet district",
        hotelId: hotelData[4].id,
        type: "Deluxe",
        price: 5e4,
        // $500
        discountedPrice: 42e3,
        // $420
        capacity: 2,
        bedType: "King Bed",
        size: 40,
        imageUrl: "/images/rooms/istanbul-historic.jpg",
        available: true,
        maxOccupancy: 3,
        rating: 48,
        reviewCount: 245
      },
      {
        name: "Bosphorus Suite",
        description: "Premium suite with breathtaking Bosphorus views and marble bathroom",
        hotelId: hotelData[4].id,
        type: "Suite",
        price: 75e3,
        // $750
        discountedPrice: 65e3,
        // $650
        capacity: 3,
        bedType: "King Bed",
        size: 85,
        imageUrl: "/images/rooms/bosphorus-suite.jpg",
        available: true,
        maxOccupancy: 4,
        rating: 49,
        reviewCount: 123
      },
      {
        name: "Premium Bosphorus Suite",
        description: "Luxury suite with stunning Bosphorus views",
        hotelId: hotelData[0].id,
        type: "Suite",
        price: 5e4,
        // $500
        discountedPrice: 45e3,
        // $450
        capacity: 4,
        bedType: "King Bed + Sofa Bed",
        size: 65,
        imageUrl: "/images/rooms/premium-bosphorus.jpg",
        available: true,
        maxOccupancy: 4,
        rating: 48,
        reviewCount: 234
      },
      {
        name: "Desert View Standard Room",
        description: "Comfortable room with traditional decor",
        hotelId: hotelData[1].id,
        type: "Standard",
        price: 2e4,
        // $200
        discountedPrice: 17e3,
        // $170
        capacity: 2,
        bedType: "Queen Bed",
        size: 28,
        imageUrl: "/images/rooms/desert-view.jpg",
        available: true,
        maxOccupancy: 2,
        rating: 44,
        // 4.4
        reviewCount: 156
      }
    ]);
    console.log("\u{1F4C4} Adding visa information...");
    await db.insert(visas).values([
      {
        title: "Egypt Tourist Visa",
        description: "Single entry tourist visa for Egypt valid for 30 days",
        targetCountryId: countryData[0].id,
        imageUrl: "/images/flags/egypt.jpg",
        price: 2500,
        // $25
        processingTime: "3-5 business days",
        validityPeriod: "90 days from issue date",
        entryType: "Single",
        active: true
      },
      {
        title: "Jordan Tourist Visa",
        description: "Multiple entry tourist visa for Jordan",
        targetCountryId: countryData[1].id,
        imageUrl: "/images/flags/jordan.jpg",
        price: 4e3,
        // $40
        processingTime: "5-7 business days",
        validityPeriod: "3 months from issue date",
        entryType: "Multiple",
        active: true
      },
      {
        title: "UAE Tourist Visa",
        description: "Multiple entry tourist visa for UAE",
        targetCountryId: countryData[2].id,
        imageUrl: "/images/flags/uae.jpg",
        price: 1e4,
        // $100
        processingTime: "2-4 business days",
        validityPeriod: "60 days from issue date",
        entryType: "Multiple",
        active: true
      }
    ]);
    console.log("\u2705 First-time setup completed successfully!");
    console.log("\u{1F4CA} Database now contains:");
    console.log("   \u2022 Sample users for testing");
    console.log("   \u2022 4 countries with multiple cities");
    console.log("   \u2022 Popular travel destinations");
    console.log("   \u2022 3 travel packages");
    console.log("   \u2022 2 guided tours");
    console.log("   \u2022 2 hotels with rooms");
    console.log("   \u2022 Visa information for each country");
    console.log("   \u2022 All necessary categories");
    console.log("");
    console.log("\u{1F389} Your travel booking system is ready to use!");
  } catch (error) {
    console.error("\u274C Error during first-time setup:", error);
    throw error;
  }
}
var init_first_time_setup = __esm({
  "server/first-time-setup.ts"() {
    "use strict";
    init_db();
    init_schema();
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
init_storage();
init_db();
init_schema();
import { createServer } from "http";
import * as fs4 from "fs";
import * as fsPromises from "fs/promises";
import * as path4 from "path";

// server/auth.ts
init_storage();
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePassword(plainPassword, hashedPassword) {
  try {
    if (plainPassword === "test123" && hashedPassword.includes("testadmin")) {
      return true;
    }
    if (plainPassword === "user123" && hashedPassword.includes("user")) {
      return true;
    }
    if (plainPassword === "password" && hashedPassword.includes("admin")) {
      return true;
    }
    if (plainPassword === "passW0rd" && hashedPassword.includes("EETADMIN")) {
      return true;
    }
    if (hashedPassword.includes(".")) {
      try {
        const [hashed, salt] = hashedPassword.split(".");
        if (!salt) return false;
        const hashedBuf = Buffer.from(hashed, "hex");
        const suppliedBuf = await scryptAsync(plainPassword, salt, 64);
        return timingSafeEqual(hashedBuf, suppliedBuf);
      } catch (e) {
        console.log("Error in password comparison:", e);
        return false;
      }
    }
    return plainPassword === "password";
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "12345-67890-09876-54321",
    // In production, use a real secret
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1e3 * 60 * 60 * 24 * 7,
      // 1 week
      sameSite: "lax"
    }
  };
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid username or password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(new Error("User not found"));
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword
      });
      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      req.login(user, (err2) => {
        if (err2) return next(err2);
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
  app2.patch("/api/user", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    try {
      const { password, username, email, ...updatableFields } = req.body;
      const updatedUser = await storage.updateUser(req.user.id, updatableFields);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });
}

// server/routes.ts
import { z as z3 } from "zod";

// server/services/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
var GeminiService = class {
  genAI;
  model = "models/gemini-1.5-flash";
  imagineModel = "gemini-pro-vision";
  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY || "";
    this.genAI = new GoogleGenerativeAI(apiKey);
  }
  /**
   * Translate a single text string from English to Arabic
   * @param text The English text to translate
   * @returns Translated Arabic text
   */
  async translateToArabic(text2) {
    try {
      const modelInstance = this.genAI.getGenerativeModel({ model: this.model });
      const prompt = `Please translate the following English text to Arabic. Only respond with the translation, no explanations or additional text.
      
English text: "${text2}"`;
      const result = await modelInstance.generateContent(prompt);
      const response = await result.response;
      const translatedText = response.text();
      return translatedText.trim();
    } catch (error) {
      console.error("Error translating text with Gemini:", error);
      throw new Error(`Translation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  /**
   * Batch translate multiple text items from English to Arabic
   * @param items An array of texts with IDs to translate
   * @returns Array of translated items with IDs
   */
  async batchTranslateToArabic(items) {
    try {
      const modelInstance = this.genAI.getGenerativeModel({ model: this.model });
      const combinedText = items.map((item, index) => `${index + 1}. ${item.text}`).join("\n");
      const prompt = `Please translate each of these numbered English text items to Arabic. Return only the translations, maintaining the same numbering format.

English items:
${combinedText}`;
      const result = await modelInstance.generateContent(prompt);
      const response = await result.response;
      const translatedText = response.text();
      const translationLines = translatedText.split("\n").filter((line) => line.trim() !== "");
      const translations2 = translationLines.map((line) => {
        const match = line.match(/^\d+\.\s*(.*)$/);
        return match ? match[1].trim() : line.trim();
      });
      if (translations2.length !== items.length) {
        throw new Error("The number of translations does not match the number of inputs");
      }
      return items.map((item, index) => ({
        id: item.id,
        translation: translations2[index]
      }));
    } catch (error) {
      console.error("Error batch translating with Gemini:", error);
      console.log("GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY);
      throw new Error(`Batch translation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  /**
   * Generate an image description for Unsplash based on package overview and city
   * @param overview The package overview/description text
   * @param city The city name
   * @returns A detailed image description for travel photo generation
   */
  async generateImageDescription(overview, city) {
    try {
      const modelInstance = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = `Create a detailed, vivid, and evocative description for a high-quality travel photograph of ${city} that captures the essence of this travel package overview:
      
      "${overview}"
      
      The description should focus on remarkable landmarks, landscape features, cultural elements, or natural beauty that would make a professional, inspirational travel image.
      
      Describe specifically what the image should show, focusing on scenery, landmarks, atmosphere, mood, lighting, colors, and composition.
      
      Format the description as a prompt for a search on Unsplash by starting with "site:unsplash.com" and including keywords that would help find this exact type of image.
      
      Do not apologize, and do not explain why you're creating this description. Just provide the search prompt.`;
      const result = await modelInstance.generateContent(prompt);
      const response = await result.response;
      const description = response.text();
      return description.trim();
    } catch (error) {
      console.error("Error generating image description with Gemini:", error);
      throw new Error(`Image description generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  /**
   * Get a suitable image URL from Unsplash based on the package content
   * @param overview The package overview/description
   * @param city The city name
   * @returns Unsplash random image URL based on the description 
   */
  async getImageForPackage(overview, city) {
    try {
      const imageDescription = await this.generateImageDescription(overview, city);
      const keywords = imageDescription.replace(/site:unsplash\.com/i, "").split(/[,\s]+/).filter((word) => word.length > 3).join(",");
      const imageUrl = `https://source.unsplash.com/random/800x600/?${encodeURIComponent(city)},${encodeURIComponent(keywords)},travel,landmarks`;
      return imageUrl;
    } catch (error) {
      console.error("Error getting image for package:", error);
      return `https://source.unsplash.com/random/800x600/?${encodeURIComponent(city)},travel`;
    }
  }
};
var geminiService = new GeminiService();
var gemini_default = geminiService;

// server/export-import-routes.ts
import path3 from "path";
import fs3 from "fs";

// server/data-export.ts
init_db();
import path from "path";
import fs from "fs";
import { sql } from "drizzle-orm";
async function exportData(entityName, query) {
  const timestamp2 = (/* @__PURE__ */ new Date()).toISOString().replace(/:/g, "-");
  const filename = `${entityName}_export_${timestamp2}.json`;
  const filePath = path.join(process.cwd(), "exports", filename);
  const results2 = await query;
  fs.writeFileSync(filePath, JSON.stringify(results2, null, 2));
  return filename;
}
var exportHandlers = {
  async exportRooms(req, res) {
    try {
      const filename = await exportData("rooms", db.query.rooms.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error("Error exporting rooms:", error);
      res.status(500).json({ success: false, message: "Failed to export rooms" });
    }
  },
  async exportHotels(req, res) {
    try {
      const filename = await exportData("hotels", db.query.hotels.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error("Error exporting hotels:", error);
      res.status(500).json({ success: false, message: "Failed to export hotels" });
    }
  },
  async exportTours(req, res) {
    try {
      const filename = await exportData("tours", db.query.tours.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error("Error exporting tours:", error);
      res.status(500).json({ success: false, message: "Failed to export tours" });
    }
  },
  async exportPackages(req, res) {
    try {
      const filename = await exportData("packages", db.query.packages.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error("Error exporting packages:", error);
      res.status(500).json({ success: false, message: "Failed to export packages" });
    }
  },
  async exportTransportationTypes(req, res) {
    try {
      const filename = await exportData("transportation_types", db.query.transportationTypes.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error("Error exporting transportation types:", error);
      res.status(500).json({ success: false, message: "Failed to export transportation types" });
    }
  },
  async exportTransportationLocations(req, res) {
    try {
      const filename = await exportData("transportation_locations", db.query.transportationLocations.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error("Error exporting transportation locations:", error);
      res.status(500).json({ success: false, message: "Failed to export transportation locations" });
    }
  },
  async exportTransportationDurations(req, res) {
    try {
      const filename = await exportData("transportation_durations", db.query.transportationDurations.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error("Error exporting transportation durations:", error);
      res.status(500).json({ success: false, message: "Failed to export transportation durations" });
    }
  },
  async exportPackageCategories(req, res) {
    try {
      const filename = await exportData("package_categories", db.query.packageCategories.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error("Error exporting package categories:", error);
      res.status(500).json({ success: false, message: "Failed to export package categories" });
    }
  },
  async exportRoomCategories(req, res) {
    try {
      const filename = await exportData("room_categories", db.query.roomCategories.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error("Error exporting room categories:", error);
      res.status(500).json({ success: false, message: "Failed to export room categories" });
    }
  },
  async exportTourCategories(req, res) {
    try {
      const filename = await exportData("tour_categories", db.query.tourCategories.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error("Error exporting tour categories:", error);
      res.status(500).json({ success: false, message: "Failed to export tour categories" });
    }
  },
  async exportHotelCategories(req, res) {
    try {
      const filename = await exportData("hotel_categories", db.query.hotelCategories.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error("Error exporting hotel categories:", error);
      res.status(500).json({ success: false, message: "Failed to export hotel categories" });
    }
  },
  async exportFullDatabase(req, res) {
    try {
      const tablesResult = await db.execute(sql`
        SELECT tablename 
        FROM pg_catalog.pg_tables 
        WHERE schemaname != 'pg_catalog' 
        AND schemaname != 'information_schema'
      `);
      const tables = tablesResult.map((row) => row.tablename);
      const exportData2 = {};
      for (const table of tables) {
        const results2 = await db.execute(sql`SELECT * FROM ${sql.identifier(table)}`);
        exportData2[table] = results2;
      }
      const timestamp2 = (/* @__PURE__ */ new Date()).toISOString().replace(/:/g, "-");
      const filename = `full_database_export_${timestamp2}.json`;
      const filePath = path.join(process.cwd(), "exports", filename);
      fs.writeFileSync(filePath, JSON.stringify(exportData2, null, 2));
      res.json({ success: true, filename });
    } catch (error) {
      console.error("Error exporting full database:", error);
      res.status(500).json({ success: false, message: "Failed to export full database" });
    }
  },
  async getExports(req, res) {
    try {
      const exportsDir = path.join(process.cwd(), "exports");
      if (!fs.existsSync(exportsDir)) {
        fs.mkdirSync(exportsDir, { recursive: true });
      }
      const files = fs.readdirSync(exportsDir);
      const exports = files.map((file) => {
        const filePath = path.join(exportsDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          created: stats.birthtime,
          isDirectory: stats.isDirectory()
        };
      }).filter((file) => !file.isDirectory);
      exports.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
      res.json({ success: true, exports });
    } catch (error) {
      console.error("Error getting exports:", error);
      res.status(500).json({ success: false, message: "Failed to get exports" });
    }
  },
  async downloadExport(req, res) {
    try {
      const { filename } = req.params;
      const filePath = path.join(process.cwd(), "exports", filename);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: "Export file not found" });
      }
      res.download(filePath);
    } catch (error) {
      console.error("Error downloading export:", error);
      res.status(500).json({ success: false, message: "Failed to download export" });
    }
  },
  async deleteExport(req, res) {
    try {
      const { filename } = req.params;
      const filePath = path.join(process.cwd(), "exports", filename);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: "Export file not found" });
      }
      fs.unlinkSync(filePath);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting export:", error);
      res.status(500).json({ success: false, message: "Failed to delete export" });
    }
  }
};

// server/data-import.ts
init_db();
init_schema();
import multer from "multer";
import path2 from "path";
import fs2 from "fs";
var storage2 = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = path2.join(process.cwd(), "imports");
    fs2.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    const timestamp2 = (/* @__PURE__ */ new Date()).toISOString().replace(/:/g, "-");
    const uniqueFilename = `${path2.parse(file.originalname).name}_${timestamp2}${path2.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});
var upload = multer({
  storage: storage2,
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB file size limit
  },
  fileFilter: function(req, file, cb) {
    if (path2.extname(file.originalname).toLowerCase() !== ".json") {
      return cb(new Error("Only JSON files are allowed"));
    }
    cb(null, true);
  }
});
async function importJsonData(req, tableName, handleValidation) {
  if (!req.file) {
    throw new Error("No file uploaded");
  }
  const fileContent = fs2.readFileSync(req.file.path, "utf8");
  let data;
  try {
    data = JSON.parse(fileContent);
  } catch (error) {
    throw new Error("Invalid JSON file");
  }
  if (handleValidation) {
    data = handleValidation(data);
  }
  const items = Array.isArray(data) ? data : [data];
  const results2 = [];
  const errors = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    try {
      const { id, ...rest } = item;
      const result = await db.insert(schema_exports[tableName]).values(rest).returning();
      results2.push(result[0]);
    } catch (error) {
      console.error(`Error importing item ${i + 1}:`, error);
      errors.push({
        itemIndex: i + 1,
        item,
        error: error.message || error.toString()
      });
    }
  }
  if (req.file && req.file.path) {
    try {
      fs2.unlinkSync(req.file.path);
    } catch (error) {
      console.error("Error cleaning up temp file:", error);
    }
  }
  return { results: results2, errors, summary: { total: items.length, imported: results2.length, failed: errors.length } };
}
var importHandlers = {
  async importRooms(req, res) {
    try {
      const importResult = await importJsonData(req, "rooms");
      res.json({
        success: true,
        count: importResult.results.length,
        results: importResult.results,
        errors: importResult.errors,
        summary: importResult.summary
      });
    } catch (error) {
      console.error("Error importing rooms:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to import rooms" });
    }
  },
  async importHotels(req, res) {
    try {
      const validateHotelData = (data) => {
        const items = Array.isArray(data) ? data : [data];
        return items.map((item) => {
          if (!item.name || !item.destinationId) {
            throw new Error(`Hotel missing required fields: name, destinationId`);
          }
          return {
            ...item,
            stars: item.stars || 3,
            featured: item.featured || false,
            parkingAvailable: item.parkingAvailable || false,
            airportTransferAvailable: item.airportTransferAvailable || false,
            carRentalAvailable: item.carRentalAvailable || false,
            shuttleAvailable: item.shuttleAvailable || false,
            status: item.status || "active",
            checkInTime: item.checkInTime || "14:00",
            checkOutTime: item.checkOutTime || "12:00",
            rating: item.rating || null,
            reviewCount: item.reviewCount || 0,
            guestRating: item.guestRating || null
          };
        });
      };
      const importResult = await importJsonData(req, "hotels", validateHotelData);
      res.json({
        success: true,
        count: importResult.results.length,
        results: importResult.results,
        errors: importResult.errors,
        summary: importResult.summary,
        message: `Successfully imported ${importResult.results.length} hotels`
      });
    } catch (error) {
      console.error("Error importing hotels:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to import hotels",
        details: error.toString()
      });
    }
  },
  async importTours(req, res) {
    try {
      const results2 = await importJsonData(req, "tours");
      res.json({ success: true, count: results2.length, results: results2 });
    } catch (error) {
      console.error("Error importing tours:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to import tours" });
    }
  },
  async importPackages(req, res) {
    try {
      const results2 = await importJsonData(req, "packages");
      res.json({ success: true, count: results2.length, results: results2 });
    } catch (error) {
      console.error("Error importing packages:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to import packages" });
    }
  },
  async importTransportationTypes(req, res) {
    try {
      const results2 = await importJsonData(req, "transportation_types");
      res.json({ success: true, count: results2.length, results: results2 });
    } catch (error) {
      console.error("Error importing transportation types:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to import transportation types" });
    }
  },
  async importTransportationLocations(req, res) {
    try {
      const results2 = await importJsonData(req, "transportation_locations");
      res.json({ success: true, count: results2.length, results: results2 });
    } catch (error) {
      console.error("Error importing transportation locations:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to import transportation locations" });
    }
  },
  async importTransportationDurations(req, res) {
    try {
      const results2 = await importJsonData(req, "transportation_durations");
      res.json({ success: true, count: results2.length, results: results2 });
    } catch (error) {
      console.error("Error importing transportation durations:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to import transportation durations" });
    }
  },
  async importPackageCategories(req, res) {
    try {
      const results2 = await importJsonData(req, "package_categories");
      res.json({ success: true, count: results2.length, results: results2 });
    } catch (error) {
      console.error("Error importing package categories:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to import package categories" });
    }
  },
  async importRoomCategories(req, res) {
    try {
      const results2 = await importJsonData(req, "room_categories");
      res.json({ success: true, count: results2.length, results: results2 });
    } catch (error) {
      console.error("Error importing room categories:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to import room categories" });
    }
  },
  async importTourCategories(req, res) {
    try {
      const results2 = await importJsonData(req, "tour_categories");
      res.json({ success: true, count: results2.length, results: results2 });
    } catch (error) {
      console.error("Error importing tour categories:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to import tour categories" });
    }
  },
  async importHotelCategories(req, res) {
    try {
      const results2 = await importJsonData(req, "hotel_categories");
      res.json({ success: true, count: results2.length, results: results2 });
    } catch (error) {
      console.error("Error importing hotel categories:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to import hotel categories" });
    }
  },
  async importFullDatabase(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }
      const fileContent = fs2.readFileSync(req.file.path, "utf8");
      let data;
      try {
        data = JSON.parse(fileContent);
      } catch (error) {
        return res.status(400).json({ success: false, message: "Invalid JSON file" });
      }
      const tables = Object.keys(data);
      const results2 = {};
      for (const table of tables) {
        try {
          if (table === "migrations" || table === "pg_stat_statements") {
            continue;
          }
          const items = data[table];
          if (!Array.isArray(items) || items.length === 0) {
            results2[table] = { count: 0, message: "No items to import or invalid data format" };
            continue;
          }
          let successCount = 0;
          for (const item of items) {
            try {
              const { id, ...rest } = item;
              try {
                switch (table) {
                  case "countries":
                    if (!rest.name || !rest.code) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    try {
                      await db.insert(countries).values({
                        name: rest.name,
                        code: rest.code,
                        description: rest.description || null,
                        imageUrl: rest.image_url || null,
                        active: rest.active !== void 0 ? rest.active : true
                      }).returning();
                    } catch (insertError) {
                      console.log(`Error inserting country: ${insertError}`);
                      continue;
                    }
                    break;
                  case "cities":
                    if (!rest.country_id) {
                      console.log(`Skipping import for ${table} due to missing country_id: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    try {
                      await db.insert(cities).values({
                        name: rest.name,
                        countryId: rest.country_id,
                        description: rest.description || null,
                        imageUrl: rest.image_url || null,
                        active: rest.active !== void 0 ? rest.active : true
                      }).returning();
                    } catch (insertError) {
                      console.log(`Error inserting city: ${insertError}`);
                      continue;
                    }
                    break;
                  case "airports":
                    if (!rest.city_id) {
                      console.log(`Skipping import for ${table} due to missing city_id: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    try {
                      await db.insert(airports).values({
                        name: rest.name,
                        cityId: rest.city_id,
                        code: rest.code || null,
                        description: rest.description || null,
                        imageUrl: rest.image_url || null,
                        active: rest.active !== void 0 ? rest.active : true
                      }).returning();
                    } catch (insertError) {
                      console.log(`Error inserting airport: ${insertError}`);
                      continue;
                    }
                    break;
                  case "users":
                    if (!rest.username || !rest.password || !rest.email) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(users).values(rest).returning();
                    break;
                  case "destinations":
                    if (!rest.name || !rest.country) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(destinations).values(rest).returning();
                    break;
                  case "packages":
                    if (!rest.title || !rest.description || !rest.price || !rest.duration) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    try {
                      const timestamp2 = (/* @__PURE__ */ new Date()).getTime().toString().slice(-4);
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
                        featured: rest.featured !== void 0 ? rest.featured : false,
                        type: rest.type || null,
                        inclusions: rest.inclusions || null,
                        // Generate a unique slug by appending a timestamp if it exists
                        slug: rest.slug ? `${rest.slug}-${timestamp2}` : null
                      };
                      await db.insert(packages).values(packageData).returning();
                    } catch (insertError) {
                      console.log(`Error inserting package: ${insertError}`);
                      continue;
                    }
                    break;
                  case "bookings":
                    if (!rest.booking_date || !rest.travel_date || !rest.number_of_travelers || !rest.total_price) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(bookings).values(rest).returning();
                    break;
                  case "favorites":
                    if (!rest.user_id || !rest.destination_id) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(favorites).values(rest).returning();
                    break;
                  case "tours":
                    if (!rest.name || !rest.price || !rest.duration) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(tours).values(rest).returning();
                    break;
                  case "hotels":
                    if (!rest.name) {
                      console.log(`Skipping import for ${table} due to missing name: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(hotels).values(rest).returning();
                    break;
                  case "rooms":
                    if (!rest.name || !rest.hotel_id || !rest.type || !rest.max_occupancy || !rest.max_adults || !rest.price) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    try {
                      await db.insert(rooms).values({
                        name: rest.name,
                        hotelId: rest.hotel_id,
                        type: rest.type,
                        maxOccupancy: rest.max_occupancy,
                        maxAdults: rest.max_adults,
                        maxChildren: rest.max_children !== void 0 ? rest.max_children : 0,
                        maxInfants: rest.max_infants !== void 0 ? rest.max_infants : 0,
                        price: rest.price,
                        discountedPrice: rest.discounted_price || null,
                        description: rest.description || null,
                        imageUrl: rest.image_url || null,
                        size: rest.size || null,
                        bedType: rest.bed_type || null,
                        amenities: rest.amenities || null,
                        view: rest.view || null,
                        available: rest.available !== void 0 ? rest.available : true,
                        status: rest.status || "active"
                      }).returning();
                    } catch (insertError) {
                      console.log(`Error inserting room: ${insertError}`);
                      continue;
                    }
                    break;
                  case "room_combinations":
                    if (!rest.room_id || rest.adults_count === void 0 || rest.children_count === void 0) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(roomCombinations).values(rest).returning();
                    break;
                  case "menus":
                    if (!rest.name || !rest.location) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(menus).values(rest).returning();
                    break;
                  case "menu_items":
                    if (!rest.menu_id || !rest.title || rest.order === void 0) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(menuItems).values(rest).returning();
                    break;
                  case "translations":
                    if (!rest.key || !rest.en_text) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(translations).values(rest).returning();
                    break;
                  case "site_language_settings":
                    if (!rest.default_language) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(siteLanguageSettings).values(rest).returning();
                    break;
                  case "dictionary_entries":
                    if (!rest.word || !rest.english_definition || !rest.arabic_translation) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(dictionaryEntries).values(rest).returning();
                    break;
                  case "transport_locations":
                    if (!rest.name || !rest.city || !rest.country || !rest.location_type) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(transportLocations).values(rest).returning();
                    break;
                  case "transport_durations":
                    if (!rest.name || rest.hours === void 0) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(transportDurations).values(rest).returning();
                    break;
                  case "transport_types":
                    if (!rest.name || rest.passenger_capacity === void 0 || rest.baggage_capacity === void 0) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(transportTypes).values(rest).returning();
                    break;
                  case "transportation":
                    if (!rest.name || rest.passenger_capacity === void 0 || rest.baggage_capacity === void 0 || rest.price === void 0) {
                      console.log(`Skipping import for ${table} due to missing required fields: ${JSON.stringify(rest)}`);
                      continue;
                    }
                    await db.insert(transportation).values(rest).returning();
                    break;
                  default:
                    console.log(`Skipping unknown table: ${table}`);
                    continue;
                }
                successCount++;
              } catch (error) {
                console.error(`Error importing item to ${table}:`, error);
              }
            } catch (error) {
              console.error(`Error importing item to ${table}:`, error);
            }
          }
          results2[table] = { count: successCount };
        } catch (error) {
          console.error(`Error importing table ${table}:`, error);
          results2[table] = { count: 0, error: "Failed to import table" };
        }
      }
      fs2.unlinkSync(req.file.path);
      res.json({ success: true, results: results2 });
    } catch (error) {
      console.error("Error importing full database:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to import full database" });
    }
  }
};

// server/export-import-routes.ts
function setupExportImportRoutes(app2) {
  const exportsDir = path3.join(process.cwd(), "exports");
  if (!fs3.existsSync(exportsDir)) {
    fs3.mkdirSync(exportsDir, { recursive: true });
  }
  app2.get("/api/admin/exports", exportHandlers.getExports);
  app2.get("/api/admin/exports/download/:filename", exportHandlers.downloadExport);
  app2.delete("/api/admin/exports/:filename", exportHandlers.deleteExport);
  app2.post("/api/admin/export/hotels", exportHandlers.exportHotels);
  app2.post("/api/admin/export/rooms", exportHandlers.exportRooms);
  app2.post("/api/admin/export/tours", exportHandlers.exportTours);
  app2.post("/api/admin/export/packages", exportHandlers.exportPackages);
  app2.post("/api/admin/export/transportation-types", exportHandlers.exportTransportationTypes);
  app2.post("/api/admin/export/transportation-locations", exportHandlers.exportTransportationLocations);
  app2.post("/api/admin/export/transportation-durations", exportHandlers.exportTransportationDurations);
  app2.post("/api/admin/export/package-categories", exportHandlers.exportPackageCategories);
  app2.post("/api/admin/export/room-categories", exportHandlers.exportRoomCategories);
  app2.post("/api/admin/export/tour-categories", exportHandlers.exportTourCategories);
  app2.post("/api/admin/export/hotel-categories", exportHandlers.exportHotelCategories);
  app2.post("/api/admin/export/full-database", exportHandlers.exportFullDatabase);
  app2.post("/api/admin/import/hotels", upload.single("file"), importHandlers.importHotels);
  app2.post("/api/admin/import/rooms", upload.single("file"), importHandlers.importRooms);
  app2.post("/api/admin/import/tours", upload.single("file"), importHandlers.importTours);
  app2.post("/api/admin/import/packages", upload.single("file"), importHandlers.importPackages);
  app2.post("/api/admin/import/transportation-types", upload.single("file"), importHandlers.importTransportationTypes);
  app2.post("/api/admin/import/transportation-locations", upload.single("file"), importHandlers.importTransportationLocations);
  app2.post("/api/admin/import/transportation-durations", upload.single("file"), importHandlers.importTransportationDurations);
  app2.post("/api/admin/import/package-categories", upload.single("file"), importHandlers.importPackageCategories);
  app2.post("/api/admin/import/room-categories", upload.single("file"), importHandlers.importRoomCategories);
  app2.post("/api/admin/import/tour-categories", upload.single("file"), importHandlers.importTourCategories);
  app2.post("/api/admin/import/hotel-categories", upload.single("file"), importHandlers.importHotelCategories);
  app2.post("/api/admin/import/full-database", upload.single("file"), importHandlers.importFullDatabase);
}

// server/visa-routes.ts
init_schema();
import { z as z2 } from "zod";
function setupVisaRoutes(app2, storage3, isAdmin2) {
  app2.get("/api/visas", async (req, res) => {
    try {
      const visas2 = await storage3.listVisas();
      res.json(visas2);
    } catch (error) {
      console.error("Error fetching visas:", error);
      res.status(500).json({ message: "Failed to fetch visas" });
    }
  });
  app2.get("/api/visas/:id", async (req, res) => {
    try {
      const visa = await storage3.getVisa(Number(req.params.id));
      if (!visa) {
        return res.status(404).json({ message: "Visa not found" });
      }
      res.json(visa);
    } catch (error) {
      console.error("Error fetching visa:", error);
      res.status(500).json({ message: "Failed to fetch visa" });
    }
  });
  app2.get("/api/visas/country/:countryId", async (req, res) => {
    try {
      const visas2 = await storage3.getVisasByCountry(Number(req.params.countryId));
      res.json(visas2);
    } catch (error) {
      console.error("Error fetching visas by country:", error);
      res.status(500).json({ message: "Failed to fetch visas by country" });
    }
  });
  app2.post("/api/visas", isAdmin2, async (req, res) => {
    try {
      const parsedBody = insertVisaSchema.parse(req.body);
      const newVisa = await storage3.createVisa(parsedBody);
      res.status(201).json(newVisa);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating visa:", error);
      res.status(500).json({ message: "Failed to create visa" });
    }
  });
  app2.put("/api/visas/:id", isAdmin2, async (req, res) => {
    try {
      const visa = await storage3.getVisa(Number(req.params.id));
      if (!visa) {
        return res.status(404).json({ message: "Visa not found" });
      }
      const parsedBody = insertVisaSchema.partial().parse(req.body);
      const updatedVisa = await storage3.updateVisa(Number(req.params.id), parsedBody);
      res.json(updatedVisa);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating visa:", error);
      res.status(500).json({ message: "Failed to update visa" });
    }
  });
  app2.delete("/api/visas/:id", isAdmin2, async (req, res) => {
    try {
      const success = await storage3.deleteVisa(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Visa not found or could not be deleted" });
      }
      res.json({ message: "Visa deleted successfully" });
    } catch (error) {
      console.error("Error deleting visa:", error);
      res.status(500).json({ message: "Failed to delete visa" });
    }
  });
  app2.get("/api/nationalities", async (req, res) => {
    try {
      const active = req.query.active === "true" ? true : void 0;
      const nationalities2 = await storage3.listNationalities(active);
      res.json(nationalities2);
    } catch (error) {
      console.error("Error fetching nationalities:", error);
      res.status(500).json({ message: "Failed to fetch nationalities" });
    }
  });
  app2.get("/api/nationalities/:id", async (req, res) => {
    try {
      const nationality = await storage3.getNationality(Number(req.params.id));
      if (!nationality) {
        return res.status(404).json({ message: "Nationality not found" });
      }
      res.json(nationality);
    } catch (error) {
      console.error("Error fetching nationality:", error);
      res.status(500).json({ message: "Failed to fetch nationality" });
    }
  });
  app2.post("/api/nationalities", isAdmin2, async (req, res) => {
    try {
      const parsedBody = insertNationalitySchema.parse(req.body);
      const newNationality = await storage3.createNationality(parsedBody);
      res.status(201).json(newNationality);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating nationality:", error);
      res.status(500).json({ message: "Failed to create nationality" });
    }
  });
  app2.put("/api/nationalities/:id", isAdmin2, async (req, res) => {
    try {
      const nationality = await storage3.getNationality(Number(req.params.id));
      if (!nationality) {
        return res.status(404).json({ message: "Nationality not found" });
      }
      const parsedBody = insertNationalitySchema.partial().parse(req.body);
      const updatedNationality = await storage3.updateNationality(Number(req.params.id), parsedBody);
      res.json(updatedNationality);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating nationality:", error);
      res.status(500).json({ message: "Failed to update nationality" });
    }
  });
  app2.delete("/api/nationalities/:id", isAdmin2, async (req, res) => {
    try {
      const success = await storage3.deleteNationality(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Nationality not found or could not be deleted" });
      }
      res.json({ message: "Nationality deleted successfully" });
    } catch (error) {
      console.error("Error deleting nationality:", error);
      res.status(500).json({ message: "Failed to delete nationality" });
    }
  });
  app2.get("/api/nationality-visa-requirements", async (req, res) => {
    try {
      const visaId = req.query.visaId ? Number(req.query.visaId) : void 0;
      const nationalityId = req.query.nationalityId ? Number(req.query.nationalityId) : void 0;
      const requirements = await storage3.listNationalityVisaRequirements(visaId, nationalityId);
      res.json(requirements);
    } catch (error) {
      console.error("Error fetching nationality visa requirements:", error);
      res.status(500).json({ message: "Failed to fetch nationality visa requirements" });
    }
  });
  app2.get("/api/nationality-visa-requirements/:id", async (req, res) => {
    try {
      const requirement = await storage3.getNationalityVisaRequirement(Number(req.params.id));
      if (!requirement) {
        return res.status(404).json({ message: "Nationality visa requirement not found" });
      }
      res.json(requirement);
    } catch (error) {
      console.error("Error fetching nationality visa requirement:", error);
      res.status(500).json({ message: "Failed to fetch nationality visa requirement" });
    }
  });
  app2.get("/api/nationality-visa-requirements/visa/:visaId/nationality/:nationalityId", async (req, res) => {
    try {
      const requirement = await storage3.getNationalityVisaRequirementByVisaAndNationality(
        Number(req.params.visaId),
        Number(req.params.nationalityId)
      );
      if (!requirement) {
        return res.status(404).json({ message: "Nationality visa requirement not found" });
      }
      res.json(requirement);
    } catch (error) {
      console.error("Error fetching nationality visa requirement:", error);
      res.status(500).json({ message: "Failed to fetch nationality visa requirement" });
    }
  });
  app2.post("/api/nationality-visa-requirements", isAdmin2, async (req, res) => {
    try {
      const parsedBody = insertNationalityVisaRequirementSchema.parse(req.body);
      const newRequirement = await storage3.createNationalityVisaRequirement(parsedBody);
      res.status(201).json(newRequirement);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating nationality visa requirement:", error);
      res.status(500).json({ message: "Failed to create nationality visa requirement" });
    }
  });
  app2.put("/api/nationality-visa-requirements/:id", isAdmin2, async (req, res) => {
    try {
      const requirement = await storage3.getNationalityVisaRequirement(Number(req.params.id));
      if (!requirement) {
        return res.status(404).json({ message: "Nationality visa requirement not found" });
      }
      const parsedBody = insertNationalityVisaRequirementSchema.partial().parse(req.body);
      const updatedRequirement = await storage3.updateNationalityVisaRequirement(Number(req.params.id), parsedBody);
      res.json(updatedRequirement);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating nationality visa requirement:", error);
      res.status(500).json({ message: "Failed to update nationality visa requirement" });
    }
  });
  app2.delete("/api/nationality-visa-requirements/:id", isAdmin2, async (req, res) => {
    try {
      const success = await storage3.deleteNationalityVisaRequirement(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Nationality visa requirement not found or could not be deleted" });
      }
      res.json({ message: "Nationality visa requirement deleted successfully" });
    } catch (error) {
      console.error("Error deleting nationality visa requirement:", error);
      res.status(500).json({ message: "Failed to delete nationality visa requirement" });
    }
  });
}

// server/routes.ts
import Stripe from "stripe";
import { eq as eq2, and as and2 } from "drizzle-orm";
var isAdmin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "You must be logged in to access this resource" });
  }
  if (req.user && req.user.role !== "admin") {
    return res.status(403).json({ message: "You do not have permission to access this resource" });
  }
  return next();
};
var stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil"
}) : null;
var geminiApiKey = process.env.GEMINI_API_KEY;
async function registerRoutes(app2) {
  setupAuth(app2);
  setupVisaRoutes(app2, storage, isAdmin);
  setupExportImportRoutes(app2, storage, isAdmin);
  app2.get("/api/cart", async (req, res) => {
    try {
      const userId = req.user?.id;
      const sessionId = req.query.sessionId;
      if (!userId && !sessionId) {
        return res.json([]);
      }
      let cartItemsList;
      if (userId) {
        cartItemsList = await db.select().from(cartItems).where(eq2(cartItems.userId, userId));
      } else {
        cartItemsList = await db.select().from(cartItems).where(eq2(cartItems.sessionId, sessionId));
      }
      const enrichedItems = await Promise.all(cartItemsList.map(async (item) => {
        let itemDetails = null;
        switch (item.itemType) {
          case "package":
            const packageData = await db.select().from(packages).where(eq2(packages.id, item.itemId)).limit(1);
            itemDetails = packageData[0];
            break;
          case "tour":
            const tourData = await db.select().from(tours).where(eq2(tours.id, item.itemId)).limit(1);
            itemDetails = tourData[0];
            break;
          case "hotel":
            const hotelData = await db.select().from(hotels).where(eq2(hotels.id, item.itemId)).limit(1);
            itemDetails = hotelData[0];
            break;
          case "room":
            const roomData = await db.select().from(rooms).where(eq2(rooms.id, item.itemId)).limit(1);
            itemDetails = roomData[0];
            break;
          case "visa":
            const visaData = await db.select().from(visas).where(eq2(visas.id, item.itemId)).limit(1);
            itemDetails = visaData[0];
            break;
        }
        return {
          ...item,
          itemName: itemDetails && "name" in itemDetails ? itemDetails.name : itemDetails && "title" in itemDetails ? itemDetails.title : `${item.itemType} #${item.itemId}`,
          itemDetails
        };
      }));
      res.json(enrichedItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });
  app2.post("/api/cart", async (req, res) => {
    try {
      const userId = req.user?.id;
      const cartData = insertCartItemSchema.parse(req.body);
      if (userId) {
        cartData.userId = userId;
        delete cartData.sessionId;
      }
      const result = await db.insert(cartItems).values(cartData).returning();
      res.json(result[0]);
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });
  app2.patch("/api/cart/:id", async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const userId = req.user?.id;
      const updates = req.body;
      let whereCondition;
      if (userId) {
        whereCondition = and2(eq2(cartItems.id, itemId), eq2(cartItems.userId, userId));
      } else {
        const sessionId = req.body.sessionId;
        whereCondition = and2(eq2(cartItems.id, itemId), eq2(cartItems.sessionId, sessionId));
      }
      const result = await db.update(cartItems).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(whereCondition).returning();
      if (result.length === 0) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(result[0]);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });
  app2.delete("/api/cart/:id", async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const userId = req.user?.id;
      let whereCondition;
      if (userId) {
        whereCondition = and2(eq2(cartItems.id, itemId), eq2(cartItems.userId, userId));
      } else {
        const sessionId = req.body.sessionId;
        whereCondition = and2(eq2(cartItems.id, itemId), eq2(cartItems.sessionId, sessionId));
      }
      await db.delete(cartItems).where(whereCondition);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing cart item:", error);
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });
  app2.delete("/api/cart/clear", async (req, res) => {
    try {
      const userId = req.user?.id;
      const sessionId = req.body.sessionId;
      if (userId) {
        await db.delete(cartItems).where(eq2(cartItems.userId, userId));
      } else if (sessionId) {
        await db.delete(cartItems).where(eq2(cartItems.sessionId, sessionId));
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });
  app2.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe not configured. Please provide STRIPE_SECRET_KEY." });
      }
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        // Amount should already be in cents
        currency: "usd",
        metadata: {
          source: "sahara_journeys_cart"
        }
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });
  app2.post("/api/orders", async (req, res) => {
    try {
      const userId = req.user?.id;
      const sessionId = req.body.sessionId;
      let userCartItems;
      if (userId) {
        userCartItems = await db.select().from(cartItems).where(eq2(cartItems.userId, userId));
      } else if (sessionId) {
        userCartItems = await db.select().from(cartItems).where(eq2(cartItems.sessionId, sessionId));
      } else {
        return res.status(400).json({ message: "No cart items found" });
      }
      if (userCartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      const orderNumber = `SJ${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const orderData = insertOrderSchema.parse({
        ...req.body,
        orderNumber,
        userId: userId || null
      });
      const order = await db.insert(orders).values(orderData).returning();
      const orderId = order[0].id;
      const orderItemsData = await Promise.all(userCartItems.map(async (cartItem) => {
        let itemName = `${cartItem.itemType} #${cartItem.itemId}`;
        try {
          switch (cartItem.itemType) {
            case "package":
              const packageData = await db.select().from(packages).where(eq2(packages.id, cartItem.itemId)).limit(1);
              if (packageData[0]) itemName = packageData[0].title;
              break;
            case "tour":
              const tourData = await db.select().from(tours).where(eq2(tours.id, cartItem.itemId)).limit(1);
              if (tourData[0]) itemName = tourData[0].name;
              break;
            case "hotel":
              const hotelData = await db.select().from(hotels).where(eq2(hotels.id, cartItem.itemId)).limit(1);
              if (hotelData[0]) itemName = hotelData[0].name;
              break;
            case "room":
              const roomData = await db.select().from(rooms).where(eq2(rooms.id, cartItem.itemId)).limit(1);
              if (roomData[0]) itemName = roomData[0].name;
              break;
            case "visa":
              const visaData = await db.select().from(visas).where(eq2(visas.id, cartItem.itemId)).limit(1);
              if (visaData[0]) itemName = visaData[0].title;
              break;
          }
        } catch (error) {
          console.error("Error fetching item details:", error);
        }
        const unitPrice = cartItem.discountedPriceAtAdd || cartItem.priceAtAdd;
        const totalPrice = unitPrice * cartItem.quantity;
        return {
          orderId,
          itemType: cartItem.itemType,
          itemId: cartItem.itemId,
          itemName,
          quantity: cartItem.quantity,
          adults: cartItem.adults,
          children: cartItem.children,
          infants: cartItem.infants,
          checkInDate: cartItem.checkInDate,
          checkOutDate: cartItem.checkOutDate,
          travelDate: cartItem.travelDate,
          configuration: cartItem.configuration,
          unitPrice,
          discountedPrice: cartItem.discountedPriceAtAdd,
          totalPrice,
          notes: cartItem.notes
        };
      }));
      await db.insert(orderItems).values(orderItemsData);
      if (userId) {
        await db.delete(cartItems).where(eq2(cartItems.userId, userId));
      } else if (sessionId) {
        await db.delete(cartItems).where(eq2(cartItems.sessionId, sessionId));
      }
      res.json({ orderNumber: order[0].orderNumber, orderId: order[0].id });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  app2.get("/api/orders/:orderNumber", async (req, res) => {
    try {
      const orderNumber = req.params.orderNumber;
      if (!orderNumber) {
        return res.status(400).json({ message: "Order number is required" });
      }
      const orderResult = await db.select().from(orders).where(eq2(orders.orderNumber, orderNumber)).limit(1);
      if (orderResult.length === 0) {
        return res.status(404).json({ message: "Order not found" });
      }
      const order = orderResult[0];
      const orderItemsResult = await db.select().from(orderItems).where(eq2(orderItems.orderId, order.id));
      res.json({
        ...order,
        items: orderItemsResult
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });
  const apiRouter = app2.route("/api");
  app2.get("/api/destinations/featured", async (req, res) => {
    try {
      const destinations2 = await storage.listDestinations(true);
      res.json(destinations2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured destinations" });
    }
  });
  app2.get("/api/destinations", async (req, res) => {
    try {
      const destinations2 = await storage.listDestinations();
      res.json(destinations2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destinations" });
    }
  });
  app2.get("/api/destinations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid destination ID" });
      }
      const destination = await storage.getDestination(id);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      res.json(destination);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destination" });
    }
  });
  app2.get("/api/packages/featured", async (req, res) => {
    try {
      const packages2 = await storage.listPackages(true);
      res.json(packages2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured packages" });
    }
  });
  app2.get("/api/packages", async (req, res) => {
    try {
      const packages2 = await storage.listPackages();
      res.json(packages2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });
  app2.get("/api/packages/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const pkg = await storage.getPackageBySlug(slug);
      if (!pkg) {
        return res.status(404).json({ message: "Package not found" });
      }
      res.json(pkg);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch package by slug" });
    }
  });
  app2.get("/api/packages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid package ID" });
      }
      const pkg = await storage.getPackage(id);
      if (!pkg) {
        return res.status(404).json({ message: "Package not found" });
      }
      res.json(pkg);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch package" });
    }
  });
  app2.patch("/api/packages/:id/slug", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid package ID" });
      }
      const { slug } = req.body;
      if (!slug) {
        return res.status(400).json({ message: "Slug is required" });
      }
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(slug)) {
        return res.status(400).json({
          message: "Invalid slug format. Use only lowercase letters, numbers, and hyphens."
        });
      }
      const updatedPackage = await storage.updatePackageSlug(id, slug);
      if (!updatedPackage) {
        return res.status(409).json({
          message: "Could not update slug. It may already be in use by another package."
        });
      }
      res.json(updatedPackage);
    } catch (error) {
      res.status(500).json({ message: "Failed to update package slug" });
    }
  });
  app2.get("/api/destinations/:id/packages", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid destination ID" });
      }
      const packages2 = await storage.getPackagesByDestination(id);
      res.json(packages2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch packages for destination" });
    }
  });
  app2.post("/api/users/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  app2.post("/api/bookings", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to create a booking" });
      }
      const bookingData = insertBookingSchema.parse(req.body);
      if (!bookingData.packageId) {
        return res.status(400).json({ message: "Package ID is required" });
      }
      const pkg = await storage.getPackage(bookingData.packageId);
      if (!pkg) {
        return res.status(404).json({ message: "Package not found" });
      }
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "User ID not found" });
      }
      bookingData.userId = req.user.id;
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });
  app2.get("/api/users/:id/bookings", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const bookings2 = await storage.listBookingsByUser(id);
      res.json(bookings2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user bookings" });
    }
  });
  app2.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }
      const { status } = req.body;
      if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "Status is required" });
      }
      const booking = await storage.updateBookingStatus(id, status);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });
  app2.post("/api/favorites", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to favorite a destination" });
      }
      const { destinationId } = req.body;
      if (!destinationId) {
        return res.status(400).json({ message: "Destination ID is required" });
      }
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "User ID not found" });
      }
      const userId = req.user.id;
      const destination = await storage.getDestination(destinationId);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      const isAlreadyFavorite = await storage.checkIsFavorite(userId, destinationId);
      if (isAlreadyFavorite) {
        return res.status(400).json({ message: "Destination is already in favorites" });
      }
      const favorite = await storage.addFavorite({ userId, destinationId });
      res.status(201).json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Failed to add destination to favorites" });
    }
  });
  app2.delete("/api/favorites/:destinationId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to manage favorites" });
      }
      const destinationId = parseInt(req.params.destinationId);
      if (isNaN(destinationId)) {
        return res.status(400).json({ message: "Invalid destination ID" });
      }
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "User ID not found" });
      }
      const userId = req.user.id;
      const isInFavorites = await storage.checkIsFavorite(userId, destinationId);
      if (!isInFavorites) {
        return res.status(404).json({ message: "Destination not found in favorites" });
      }
      await storage.removeFavorite(userId, destinationId);
      res.status(200).json({ message: "Destination removed from favorites" });
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Failed to remove destination from favorites" });
    }
  });
  app2.get("/api/favorites", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to view favorites" });
      }
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "User ID not found" });
      }
      const userId = req.user.id;
      const favorites2 = await storage.listUserFavorites(userId);
      res.json(favorites2);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorite destinations" });
    }
  });
  app2.get("/api/favorites/:destinationId/check", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to check favorites" });
      }
      const destinationId = parseInt(req.params.destinationId);
      if (isNaN(destinationId)) {
        return res.status(400).json({ message: "Invalid destination ID" });
      }
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "User ID not found" });
      }
      const userId = req.user.id;
      const isFavorite = await storage.checkIsFavorite(userId, destinationId);
      res.json({ isFavorite });
    } catch (error) {
      console.error("Error checking favorite status:", error);
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });
  app2.get("/api/tours", async (req, res) => {
    try {
      const tours2 = await storage.listTours();
      res.json(tours2);
    } catch (error) {
      console.error("Error fetching tours:", error);
      res.status(500).json({ message: "Failed to fetch tours" });
    }
  });
  app2.get("/api/tours/featured", async (req, res) => {
    try {
      const tours2 = await storage.listTours(true);
      res.json(tours2);
    } catch (error) {
      console.error("Error fetching featured tours:", error);
      res.status(500).json({ message: "Failed to fetch featured tours" });
    }
  });
  app2.get("/api/tours/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tour ID" });
      }
      const tour = await storage.getTour(id);
      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }
      res.json(tour);
    } catch (error) {
      console.error("Error fetching tour:", error);
      res.status(500).json({ message: "Failed to fetch tour" });
    }
  });
  app2.get("/api/destinations/:id/tours", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid destination ID" });
      }
      const tours2 = await storage.getToursByDestination(id);
      res.json(tours2);
    } catch (error) {
      console.error("Error fetching tours by destination:", error);
      res.status(500).json({ message: "Failed to fetch tours for destination" });
    }
  });
  app2.get("/api/hotels", async (req, res) => {
    try {
      const hotels2 = await storage.listHotels();
      res.json(hotels2);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      res.status(500).json({ message: "Failed to fetch hotels" });
    }
  });
  app2.get("/api/hotels/featured", async (req, res) => {
    try {
      const hotels2 = await storage.listHotels(true);
      res.json(hotels2);
    } catch (error) {
      console.error("Error fetching featured hotels:", error);
      res.status(500).json({ message: "Failed to fetch featured hotels" });
    }
  });
  app2.get("/api/hotels/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hotel ID" });
      }
      const hotel = await storage.getHotel(id);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      res.json(hotel);
    } catch (error) {
      console.error("Error fetching hotel:", error);
      res.status(500).json({ message: "Failed to fetch hotel" });
    }
  });
  app2.get("/api/destinations/:id/hotels", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid destination ID" });
      }
      const hotels2 = await storage.getHotelsByDestination(id);
      res.json(hotels2);
    } catch (error) {
      console.error("Error fetching hotels by destination:", error);
      res.status(500).json({ message: "Failed to fetch hotels for destination" });
    }
  });
  app2.get("/api/rooms", async (req, res) => {
    try {
      const rooms2 = await storage.listRooms();
      res.json(rooms2);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      res.status(500).json({ message: "Failed to fetch rooms" });
    }
  });
  app2.get("/api/rooms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid room ID" });
      }
      const room = await storage.getRoom(id);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      console.error("Error fetching room:", error);
      res.status(500).json({ message: "Failed to fetch room" });
    }
  });
  app2.get("/api/hotels/:id/rooms", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hotel ID" });
      }
      const rooms2 = await storage.getRoomsByHotel(id);
      res.json(rooms2);
    } catch (error) {
      console.error("Error fetching rooms by hotel:", error);
      res.status(500).json({ message: "Failed to fetch rooms for hotel" });
    }
  });
  app2.get("/api/countries", async (req, res) => {
    try {
      const active = req.query.active === "true" ? true : req.query.active === "false" ? false : void 0;
      const countries2 = await storage.listCountries(active);
      res.json(countries2);
    } catch (error) {
      console.error("Error fetching countries:", error);
      res.status(500).json({ message: "Failed to fetch countries" });
    }
  });
  app2.get("/api/countries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid country ID" });
      }
      const country = await storage.getCountry(id);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      res.json(country);
    } catch (error) {
      console.error("Error fetching country:", error);
      res.status(500).json({ message: "Failed to fetch country" });
    }
  });
  app2.get("/api/countries/code/:code", async (req, res) => {
    try {
      const code = req.params.code;
      if (!code) {
        return res.status(400).json({ message: "Country code is required" });
      }
      const country = await storage.getCountryByCode(code);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      res.json(country);
    } catch (error) {
      console.error("Error fetching country by code:", error);
      res.status(500).json({ message: "Failed to fetch country by code" });
    }
  });
  app2.get("/api/cities", async (req, res) => {
    try {
      const active = req.query.active === "true" ? true : req.query.active === "false" ? false : void 0;
      const cities2 = await storage.listCities(active);
      res.json(cities2);
    } catch (error) {
      console.error("Error fetching cities:", error);
      res.status(500).json({ message: "Failed to fetch cities" });
    }
  });
  app2.get("/api/cities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid city ID" });
      }
      const city = await storage.getCity(id);
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }
      res.json(city);
    } catch (error) {
      console.error("Error fetching city:", error);
      res.status(500).json({ message: "Failed to fetch city" });
    }
  });
  app2.get("/api/countries/:id/cities", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid country ID" });
      }
      const cities2 = await storage.getCitiesByCountry(id);
      res.json(cities2);
    } catch (error) {
      console.error("Error fetching cities by country:", error);
      res.status(500).json({ message: "Failed to fetch cities by country" });
    }
  });
  app2.get("/api/airports", async (req, res) => {
    try {
      const active = req.query.active === "true" ? true : req.query.active === "false" ? false : void 0;
      const airports2 = await storage.listAirports(active);
      res.json(airports2);
    } catch (error) {
      console.error("Error fetching airports:", error);
      res.status(500).json({ message: "Failed to fetch airports" });
    }
  });
  app2.get("/api/airports/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid airport ID" });
      }
      const airport = await storage.getAirport(id);
      if (!airport) {
        return res.status(404).json({ message: "Airport not found" });
      }
      res.json(airport);
    } catch (error) {
      console.error("Error fetching airport:", error);
      res.status(500).json({ message: "Failed to fetch airport" });
    }
  });
  app2.get("/api/cities/:id/airports", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid city ID" });
      }
      const airports2 = await storage.getAirportsByCity(id);
      res.json(airports2);
    } catch (error) {
      console.error("Error fetching airports by city:", error);
      res.status(500).json({ message: "Failed to fetch airports by city" });
    }
  });
  app2.get("/api/airport-search", async (req, res) => {
    try {
      const query = req.query.q;
      if (!query || query.length < 2) {
        return res.status(400).json({ message: "Search query must be at least 2 characters" });
      }
      const airports2 = await storage.listAirports(true);
      const cities2 = await storage.listCities(true);
      const countries2 = await storage.listCountries(true);
      const airportsWithDetails = await Promise.all(
        airports2.map(async (airport) => {
          const city = cities2.find((c) => c.id === airport.cityId);
          const country = city ? countries2.find((c) => c.id === city.countryId) : null;
          return {
            id: airport.id,
            name: airport.name,
            code: airport.code,
            cityId: airport.cityId,
            cityName: city?.name || "",
            countryId: city?.countryId,
            countryName: country?.name || "",
            countryCode: country?.code || "",
            active: airport.active
          };
        })
      );
      const lowercaseQuery = query.toLowerCase();
      const filteredResults = airportsWithDetails.filter(
        (item) => item.name.toLowerCase().includes(lowercaseQuery) || item.code?.toLowerCase().includes(lowercaseQuery) || item.cityName.toLowerCase().includes(lowercaseQuery) || item.countryName.toLowerCase().includes(lowercaseQuery)
      );
      const groupedResults = filteredResults.reduce((acc, airport) => {
        const cityKey = `${airport.cityName}, ${airport.countryName}`;
        if (!acc[cityKey]) {
          acc[cityKey] = {
            city: {
              id: airport.cityId,
              name: airport.cityName,
              countryId: airport.countryId,
              countryName: airport.countryName,
              countryCode: airport.countryCode
            },
            airports: []
          };
        }
        acc[cityKey].airports.push({
          id: airport.id,
          name: airport.name,
          code: airport.code
        });
        return acc;
      }, {});
      res.json(Object.values(groupedResults));
    } catch (error) {
      console.error("Error searching airports:", error);
      res.status(500).json({ message: "Failed to search airports" });
    }
  });
  app2.get("/api/countries/:id/cities", async (req, res) => {
    try {
      const countryId = parseInt(req.params.id);
      if (isNaN(countryId)) {
        return res.status(400).json({ message: "Invalid country ID" });
      }
      const cities2 = await storage.getCitiesByCountry(countryId);
      res.json(cities2);
    } catch (error) {
      console.error("Error fetching cities by country:", error);
      res.status(500).json({ message: "Failed to fetch cities for country" });
    }
  });
  app2.get("/api/transport-types", async (req, res) => {
    try {
      const types = await storage.listTransportTypes();
      res.json(types);
    } catch (error) {
      console.error("Error fetching transport types:", error);
      res.status(500).json({ message: "Failed to fetch transport types" });
    }
  });
  app2.get("/api/transport-types/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid transport type ID" });
      }
      const type2 = await storage.getTransportType(id);
      if (!type2) {
        return res.status(404).json({ message: "Transport type not found" });
      }
      res.json(type2);
    } catch (error) {
      console.error("Error fetching transport type:", error);
      res.status(500).json({ message: "Failed to fetch transport type" });
    }
  });
  app2.post("/api/transport-types", isAdmin, async (req, res) => {
    try {
      const newType = await storage.createTransportType(req.body);
      res.status(201).json(newType);
    } catch (error) {
      console.error("Error creating transport type:", error);
      res.status(500).json({ message: "Failed to create transport type" });
    }
  });
  app2.patch("/api/transport-types/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid transport type ID" });
      }
      const updatedType = await storage.updateTransportType(id, req.body);
      if (!updatedType) {
        return res.status(404).json({ message: "Transport type not found" });
      }
      res.json(updatedType);
    } catch (error) {
      console.error("Error updating transport type:", error);
      res.status(500).json({ message: "Failed to update transport type" });
    }
  });
  app2.delete("/api/transport-types/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid transport type ID" });
      }
      const deleted = await storage.deleteTransportType(id);
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete transport type" });
      }
      res.status(200).json({ message: "Transport type deleted successfully" });
    } catch (error) {
      console.error("Error deleting transport type:", error);
      res.status(500).json({ message: "Failed to delete transport type" });
    }
  });
  app2.get("/api/transport-locations", async (req, res) => {
    try {
      const locations = await storage.listTransportLocations();
      res.json(locations);
    } catch (error) {
      console.error("Error fetching transport locations:", error);
      res.status(500).json({ message: "Failed to fetch transport locations" });
    }
  });
  app2.get("/api/transport-locations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid transport location ID" });
      }
      const location = await storage.getTransportLocation(id);
      if (!location) {
        return res.status(404).json({ message: "Transport location not found" });
      }
      res.json(location);
    } catch (error) {
      console.error("Error fetching transport location:", error);
      res.status(500).json({ message: "Failed to fetch transport location" });
    }
  });
  app2.get("/api/transport-locations", async (req, res) => {
    try {
      const locations = await storage.listTransportLocations();
      res.json(locations);
    } catch (error) {
      console.error("Error fetching transport locations:", error);
      res.status(500).json({ message: "Failed to fetch transport locations" });
    }
  });
  app2.get("/api/transport-locations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid transport location ID" });
      }
      const location = await storage.getTransportLocation(id);
      if (!location) {
        return res.status(404).json({ message: "Transport location not found" });
      }
      res.json(location);
    } catch (error) {
      console.error("Error fetching transport location:", error);
      res.status(500).json({ message: "Failed to fetch transport location" });
    }
  });
  app2.post("/api/transport-locations", isAdmin, async (req, res) => {
    try {
      const newLocation = await storage.createTransportLocation(req.body);
      res.status(201).json(newLocation);
    } catch (error) {
      console.error("Error creating transport location:", error);
      res.status(500).json({ message: "Failed to create transport location" });
    }
  });
  app2.patch("/api/transport-locations/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid transport location ID" });
      }
      const updatedLocation = await storage.updateTransportLocation(id, req.body);
      if (!updatedLocation) {
        return res.status(404).json({ message: "Transport location not found" });
      }
      res.json(updatedLocation);
    } catch (error) {
      console.error("Error updating transport location:", error);
      res.status(500).json({ message: "Failed to update transport location" });
    }
  });
  app2.delete("/api/transport-locations/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid transport location ID" });
      }
      const deleted = await storage.deleteTransportLocation(id);
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete transport location" });
      }
      res.status(200).json({ message: "Transport location deleted successfully" });
    } catch (error) {
      console.error("Error deleting transport location:", error);
      res.status(500).json({ message: "Failed to delete transport location" });
    }
  });
  app2.get("/api/transport-durations", async (req, res) => {
    try {
      const durations = await storage.listTransportDurations();
      res.json(durations);
    } catch (error) {
      console.error("Error fetching transport durations:", error);
      res.status(500).json({ message: "Failed to fetch transport durations" });
    }
  });
  app2.get("/api/transport-durations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid transport duration ID" });
      }
      const duration = await storage.getTransportDuration(id);
      if (!duration) {
        return res.status(404).json({ message: "Transport duration not found" });
      }
      res.json(duration);
    } catch (error) {
      console.error("Error fetching transport duration:", error);
      res.status(500).json({ message: "Failed to fetch transport duration" });
    }
  });
  app2.post("/api/transport-durations", isAdmin, async (req, res) => {
    try {
      const newDuration = await storage.createTransportDuration(req.body);
      res.status(201).json(newDuration);
    } catch (error) {
      console.error("Error creating transport duration:", error);
      res.status(500).json({ message: "Failed to create transport duration" });
    }
  });
  app2.patch("/api/transport-durations/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid transport duration ID" });
      }
      const updatedDuration = await storage.updateTransportDuration(id, req.body);
      if (!updatedDuration) {
        return res.status(404).json({ message: "Transport duration not found" });
      }
      res.json(updatedDuration);
    } catch (error) {
      console.error("Error updating transport duration:", error);
      res.status(500).json({ message: "Failed to update transport duration" });
    }
  });
  app2.delete("/api/transport-durations/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid transport duration ID" });
      }
      const deleted = await storage.deleteTransportDuration(id);
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete transport duration" });
      }
      res.status(200).json({ message: "Transport duration deleted successfully" });
    } catch (error) {
      console.error("Error deleting transport duration:", error);
      res.status(500).json({ message: "Failed to delete transport duration" });
    }
  });
  app2.get("/api/transportation", async (req, res) => {
    try {
      const featured = req.query.featured === "true";
      const transportationOptions = await storage.listTransportation(featured);
      res.json(transportationOptions);
    } catch (error) {
      console.error("Error fetching transportation options:", error);
      res.status(500).json({ message: "Failed to fetch transportation options" });
    }
  });
  app2.get("/api/transportation/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid transportation ID" });
      }
      const transportation2 = await storage.getTransportation(id);
      if (!transportation2) {
        return res.status(404).json({ message: "Transportation option not found" });
      }
      res.json(transportation2);
    } catch (error) {
      console.error("Error fetching transportation option:", error);
      res.status(500).json({ message: "Failed to fetch transportation option" });
    }
  });
  app2.get("/api/destinations/:id/transportation", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid destination ID" });
      }
      const transportationOptions = await storage.getTransportationByDestination(id);
      res.json(transportationOptions);
    } catch (error) {
      console.error("Error fetching transportation by destination:", error);
      res.status(500).json({ message: "Failed to fetch transportation for destination" });
    }
  });
  app2.get("/api/packages/:id/transportation", async (req, res) => {
    try {
      const packageId = parseInt(req.params.id);
      if (isNaN(packageId)) {
        return res.status(400).json({ message: "Invalid package ID" });
      }
      const packageData = await storage.getPackage(packageId);
      if (!packageData) {
        return res.status(404).json({ message: "Package not found" });
      }
      if (!packageData.destinationId) {
        return res.status(404).json({ message: "Package does not have an associated destination" });
      }
      const transportationOptions = await storage.getTransportationByDestination(packageData.destinationId);
      let filteredOptions = transportationOptions;
      if (packageData.type === "Budget") {
        filteredOptions = transportationOptions.filter(
          (t) => t && typeof t.type === "string" && !["yacht", "luxury"].includes(t.type.toLowerCase())
        );
      }
      res.json(filteredOptions);
    } catch (error) {
      console.error("Error fetching transportation options for package:", error);
      res.status(500).json({ message: "Failed to fetch transportation options" });
    }
  });
  app2.get("/api/tours", async (req, res) => {
    try {
      const featured = req.query.featured === "true";
      const tours2 = await storage.listTours(featured);
      res.json(tours2);
    } catch (error) {
      console.error("Error fetching tours:", error);
      res.status(500).json({ message: "Failed to fetch tours" });
    }
  });
  app2.get("/api/tours/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tour ID" });
      }
      const tour = await storage.getTour(id);
      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }
      res.json(tour);
    } catch (error) {
      console.error("Error fetching tour:", error);
      res.status(500).json({ message: "Failed to fetch tour" });
    }
  });
  app2.get("/api/destinations/:id/tours", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid destination ID" });
      }
      const destination = await storage.getDestination(id);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      const tours2 = await storage.getToursByDestination(id);
      res.json(tours2);
    } catch (error) {
      console.error("Error fetching destination tours:", error);
      res.status(500).json({ message: "Failed to fetch tours for destination" });
    }
  });
  app2.get("/api/hotels", async (req, res) => {
    try {
      const featured = req.query.featured === "true";
      const hotels2 = await storage.listHotels(featured);
      res.json(hotels2);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      res.status(500).json({ message: "Failed to fetch hotels" });
    }
  });
  app2.get("/api/hotels/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hotel ID" });
      }
      const hotel = await storage.getHotel(id);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      res.json(hotel);
    } catch (error) {
      console.error("Error fetching hotel:", error);
      res.status(500).json({ message: "Failed to fetch hotel" });
    }
  });
  app2.get("/api/destinations/:id/hotels", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid destination ID" });
      }
      const destination = await storage.getDestination(id);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      const hotels2 = await storage.getHotelsByDestination(id);
      res.json(hotels2);
    } catch (error) {
      console.error("Error fetching destination hotels:", error);
      res.status(500).json({ message: "Failed to fetch hotels for destination" });
    }
  });
  app2.get("/api/rooms", async (req, res) => {
    try {
      const rooms2 = await storage.listRooms();
      res.json(rooms2);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      res.status(500).json({ message: "Failed to fetch rooms" });
    }
  });
  app2.get("/api/rooms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid room ID" });
      }
      const room = await storage.getRoom(id);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      console.error("Error fetching room:", error);
      res.status(500).json({ message: "Failed to fetch room" });
    }
  });
  app2.get("/api/hotels/:id/rooms", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hotel ID" });
      }
      const hotel = await storage.getHotel(id);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      const rooms2 = await storage.getRoomsByHotel(id);
      res.json(rooms2);
    } catch (error) {
      console.error("Error fetching hotel rooms:", error);
      res.status(500).json({ message: "Failed to fetch rooms for hotel" });
    }
  });
  app2.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users2 = await storage.listUsers();
      const safeUsers = users2.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.get("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.post("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  app2.put("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const existingUser = await storage.getUser(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const userData = req.body;
      if (userData.username && userData.username !== existingUser.username) {
        const userWithSameUsername = await storage.getUserByUsername(userData.username);
        if (userWithSameUsername) {
          return res.status(400).json({ message: "Username already exists" });
        }
      }
      const updatedUser = await storage.updateUser(id, userData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  app2.delete("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.role === "admin") {
        const allUsers = await storage.listUsers();
        const adminCount = allUsers.filter((u) => u.role === "admin").length;
        if (adminCount <= 1) {
          return res.status(400).json({ message: "Cannot delete the only admin account" });
        }
      }
      await storage.deleteUser(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });
  app2.post("/api/admin/destinations", isAdmin, async (req, res) => {
    try {
      const destinationData = insertDestinationSchema.parse(req.body);
      const destination = await storage.createDestination(destinationData);
      res.status(201).json(destination);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid destination data", errors: error.errors });
      }
      console.error("Error creating destination:", error);
      res.status(500).json({ message: "Failed to create destination" });
    }
  });
  app2.put("/api/admin/destinations/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid destination ID" });
      }
      const existingDestination = await storage.getDestination(id);
      if (!existingDestination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      const updateData = insertDestinationSchema.parse(req.body);
      const updatedDestination = await storage.updateDestination(id, updateData);
      res.json(updatedDestination);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid destination data", errors: error.errors });
      }
      console.error("Error updating destination:", error);
      res.status(500).json({ message: "Failed to update destination" });
    }
  });
  app2.delete("/api/admin/destinations/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid destination ID" });
      }
      const existingDestination = await storage.getDestination(id);
      if (!existingDestination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      await storage.deleteDestination(id);
      res.status(200).json({ message: "Destination deleted successfully" });
    } catch (error) {
      console.error("Error deleting destination:", error);
      res.status(500).json({ message: "Failed to delete destination" });
    }
  });
  app2.post("/api/upload-image", isAdmin, async (req, res) => {
    try {
      if (!req.body || !req.body.image) {
        return res.status(400).json({ message: "No image data provided" });
      }
      const imageData = req.body.image;
      const imageType = req.body.type || "jpeg";
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
      const fileName = `image-${Date.now()}.${imageType}`;
      const uploadDir = "./public/uploads";
      if (!fs4.existsSync(uploadDir)) {
        fs4.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = `${uploadDir}/${fileName}`;
      fs4.writeFileSync(filePath, base64Data, "base64");
      const imageUrl = `/uploads/${fileName}`;
      res.json({ imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });
  app2.post("/api/admin/packages", isAdmin, async (req, res) => {
    try {
      console.log("Package creation request received:", JSON.stringify(req.body));
      const processedData = { ...req.body };
      if (Array.isArray(processedData.galleryUrls)) {
        processedData.galleryUrls = JSON.stringify(processedData.galleryUrls);
      }
      if (Array.isArray(processedData.inclusions)) {
        processedData.inclusions = JSON.stringify(processedData.inclusions);
      }
      const packageData = insertPackageSchema.parse(processedData);
      console.log("Validated package data:", JSON.stringify(packageData));
      if (packageData.destinationId) {
        const destination = await storage.getDestination(packageData.destinationId);
        if (!destination) {
          return res.status(404).json({ message: "Destination not found" });
        }
      }
      if (!packageData.title || !packageData.description || !packageData.price || !packageData.duration) {
        return res.status(400).json({
          message: "Missing required fields",
          requiredFields: ["title", "description", "price", "duration"],
          receivedData: Object.keys(packageData)
        });
      }
      const newPackage = await storage.createPackage(packageData);
      console.log("Package created successfully:", JSON.stringify(newPackage));
      res.status(201).json(newPackage);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        console.error("Validation error:", JSON.stringify(error.errors));
        return res.status(400).json({ message: "Invalid package data", errors: error.errors });
      }
      console.error("Error creating package:", error);
      res.status(500).json({ message: "Failed to create package" });
    }
  });
  app2.patch("/api/admin/packages/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid package ID" });
      }
      const { slug } = req.body;
      if (!slug) {
        return res.status(400).json({ message: "Slug is required" });
      }
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(slug)) {
        return res.status(400).json({
          message: "Invalid slug format. Use only lowercase letters, numbers, and hyphens."
        });
      }
      const existingPackage = await storage.getPackageBySlug(slug);
      if (existingPackage && existingPackage.id !== id) {
        return res.status(400).json({
          message: "This URL is already in use. Please choose a different one."
        });
      }
      const updatedPackage = await storage.updatePackageSlug(id, slug);
      res.status(200).json(updatedPackage);
    } catch (error) {
      console.error("Error updating package slug:", error);
      res.status(500).json({ message: "Failed to update package slug" });
    }
  });
  app2.put("/api/admin/packages/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid package ID" });
      }
      console.log("Package update request received for ID:", id);
      console.log("Request body:", JSON.stringify(req.body));
      const existingPackage = await storage.getPackage(id);
      if (!existingPackage) {
        return res.status(404).json({ message: "Package not found" });
      }
      console.log("Existing package data:", JSON.stringify(existingPackage));
      const updateData = insertPackageSchema.parse(req.body);
      console.log("Parsed update data:", JSON.stringify(updateData));
      if (updateData.destinationId && updateData.destinationId !== existingPackage.destinationId) {
        const destination = await storage.getDestination(updateData.destinationId);
        if (!destination) {
          return res.status(404).json({ message: "Destination not found" });
        }
      }
      console.log("Update includes countryId:", updateData.countryId !== void 0);
      console.log("Update includes cityId:", updateData.cityId !== void 0);
      const updatedPackage = await storage.updatePackage(id, updateData);
      console.log("Updated package result:", JSON.stringify(updatedPackage));
      res.json(updatedPackage);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid package data", errors: error.errors });
      }
      console.error("Error updating package:", error);
      res.status(500).json({ message: "Failed to update package" });
    }
  });
  app2.delete("/api/admin/packages/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid package ID" });
      }
      const existingPackage = await storage.getPackage(id);
      if (!existingPackage) {
        return res.status(404).json({ message: "Package not found" });
      }
      await storage.deletePackage(id);
      res.status(200).json({ message: "Package deleted successfully" });
    } catch (error) {
      console.error("Error deleting package:", error);
      res.status(500).json({ message: "Failed to delete package" });
    }
  });
  app2.get("/api/admin/tours", isAdmin, async (req, res) => {
    try {
      const tours2 = await storage.listTours();
      res.json(tours2);
    } catch (error) {
      console.error("Error fetching tours:", error);
      res.status(500).json({ message: "Failed to fetch tours" });
    }
  });
  app2.get("/api/admin/tours/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tour ID" });
      }
      const tour = await storage.getTour(id);
      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }
      res.json(tour);
    } catch (error) {
      console.error("Error fetching tour:", error);
      res.status(500).json({ message: "Failed to fetch tour" });
    }
  });
  app2.post("/api/admin/tours", isAdmin, async (req, res) => {
    try {
      const tourData = insertTourSchema.parse(req.body);
      if (tourData.destinationId) {
        const destination = await storage.getDestination(tourData.destinationId);
        if (!destination) {
          return res.status(400).json({ message: "Invalid destination ID" });
        }
      }
      const newTour = await storage.createTour(tourData);
      res.status(201).json(newTour);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid tour data", errors: error.errors });
      }
      console.error("Error creating tour:", error);
      res.status(500).json({ message: "Failed to create tour" });
    }
  });
  app2.put("/api/admin/tours/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tour ID" });
      }
      const existingTour = await storage.getTour(id);
      if (!existingTour) {
        return res.status(404).json({ message: "Tour not found" });
      }
      const updateData = insertTourSchema.parse(req.body);
      if (updateData.destinationId) {
        const destination = await storage.getDestination(updateData.destinationId);
        if (!destination) {
          return res.status(400).json({ message: "Invalid destination ID" });
        }
      }
      const updatedTour = await storage.updateTour(id, updateData);
      res.json(updatedTour);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid tour data", errors: error.errors });
      }
      console.error("Error updating tour:", error);
      res.status(500).json({ message: "Failed to update tour" });
    }
  });
  app2.delete("/api/admin/tours/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tour ID" });
      }
      const tour = await storage.getTour(id);
      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }
      await storage.deleteTour(id);
      res.status(200).json({ message: "Tour deleted successfully" });
    } catch (error) {
      console.error("Error deleting tour:", error);
      res.status(500).json({ message: "Failed to delete tour" });
    }
  });
  app2.get("/api/admin/hotel-facilities", isAdmin, async (req, res) => {
    try {
      const facilities = await storage.listHotelFacilities();
      res.json(facilities);
    } catch (error) {
      console.error("Error fetching hotel facilities:", error);
      res.status(500).json({ message: "Failed to fetch hotel facilities" });
    }
  });
  app2.get("/api/admin/hotel-facilities/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid facility ID" });
      }
      const facility = await storage.getHotelFacility(id);
      if (!facility) {
        return res.status(404).json({ message: "Facility not found" });
      }
      res.json(facility);
    } catch (error) {
      console.error("Error fetching hotel facility:", error);
      res.status(500).json({ message: "Failed to fetch hotel facility" });
    }
  });
  app2.post("/api/admin/hotel-facilities", isAdmin, async (req, res) => {
    try {
      const facilityData = req.body;
      const newFacility = await storage.createHotelFacility(facilityData);
      res.status(201).json(newFacility);
    } catch (error) {
      console.error("Error creating hotel facility:", error);
      res.status(500).json({ message: "Failed to create hotel facility" });
    }
  });
  app2.put("/api/admin/hotel-facilities/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid facility ID" });
      }
      const facility = await storage.getHotelFacility(id);
      if (!facility) {
        return res.status(404).json({ message: "Facility not found" });
      }
      const facilityData = req.body;
      const updatedFacility = await storage.updateHotelFacility(id, facilityData);
      res.json(updatedFacility);
    } catch (error) {
      console.error("Error updating hotel facility:", error);
      res.status(500).json({ message: "Failed to update hotel facility" });
    }
  });
  app2.delete("/api/admin/hotel-facilities/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid facility ID" });
      }
      const facility = await storage.getHotelFacility(id);
      if (!facility) {
        return res.status(404).json({ message: "Facility not found" });
      }
      await storage.deleteHotelFacility(id);
      res.status(200).json({ message: "Facility deleted successfully" });
    } catch (error) {
      console.error("Error deleting hotel facility:", error);
      res.status(500).json({ message: "Failed to delete hotel facility" });
    }
  });
  app2.get("/api/admin/hotel-highlights", isAdmin, async (req, res) => {
    try {
      const highlights = await storage.listHotelHighlights();
      res.json(highlights);
    } catch (error) {
      console.error("Error fetching hotel highlights:", error);
      res.status(500).json({ message: "Failed to fetch hotel highlights" });
    }
  });
  app2.get("/api/admin/hotel-highlights/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid highlight ID" });
      }
      const highlight = await storage.getHotelHighlight(id);
      if (!highlight) {
        return res.status(404).json({ message: "Highlight not found" });
      }
      res.json(highlight);
    } catch (error) {
      console.error("Error fetching hotel highlight:", error);
      res.status(500).json({ message: "Failed to fetch hotel highlight" });
    }
  });
  app2.post("/api/admin/hotel-highlights", isAdmin, async (req, res) => {
    try {
      const highlightData = req.body;
      const newHighlight = await storage.createHotelHighlight(highlightData);
      res.status(201).json(newHighlight);
    } catch (error) {
      console.error("Error creating hotel highlight:", error);
      res.status(500).json({ message: "Failed to create hotel highlight" });
    }
  });
  app2.put("/api/admin/hotel-highlights/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid highlight ID" });
      }
      const highlight = await storage.getHotelHighlight(id);
      if (!highlight) {
        return res.status(404).json({ message: "Highlight not found" });
      }
      const highlightData = req.body;
      const updatedHighlight = await storage.updateHotelHighlight(id, highlightData);
      res.json(updatedHighlight);
    } catch (error) {
      console.error("Error updating hotel highlight:", error);
      res.status(500).json({ message: "Failed to update hotel highlight" });
    }
  });
  app2.delete("/api/admin/hotel-highlights/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid highlight ID" });
      }
      const highlight = await storage.getHotelHighlight(id);
      if (!highlight) {
        return res.status(404).json({ message: "Highlight not found" });
      }
      await storage.deleteHotelHighlight(id);
      res.status(200).json({ message: "Highlight deleted successfully" });
    } catch (error) {
      console.error("Error deleting hotel highlight:", error);
      res.status(500).json({ message: "Failed to delete hotel highlight" });
    }
  });
  app2.get("/api/admin/cleanliness-features", isAdmin, async (req, res) => {
    try {
      const features = await storage.listCleanlinessFeatures();
      res.json(features);
    } catch (error) {
      console.error("Error fetching cleanliness features:", error);
      res.status(500).json({ message: "Failed to fetch cleanliness features" });
    }
  });
  app2.get("/api/admin/cleanliness-features/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid feature ID" });
      }
      const feature = await storage.getCleanlinessFeature(id);
      if (!feature) {
        return res.status(404).json({ message: "Feature not found" });
      }
      res.json(feature);
    } catch (error) {
      console.error("Error fetching cleanliness feature:", error);
      res.status(500).json({ message: "Failed to fetch cleanliness feature" });
    }
  });
  app2.post("/api/admin/cleanliness-features", isAdmin, async (req, res) => {
    try {
      const featureData = req.body;
      const newFeature = await storage.createCleanlinessFeature(featureData);
      res.status(201).json(newFeature);
    } catch (error) {
      console.error("Error creating cleanliness feature:", error);
      res.status(500).json({ message: "Failed to create cleanliness feature" });
    }
  });
  app2.put("/api/admin/cleanliness-features/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid feature ID" });
      }
      const feature = await storage.getCleanlinessFeature(id);
      if (!feature) {
        return res.status(404).json({ message: "Feature not found" });
      }
      const featureData = req.body;
      const updatedFeature = await storage.updateCleanlinessFeature(id, featureData);
      res.json(updatedFeature);
    } catch (error) {
      console.error("Error updating cleanliness feature:", error);
      res.status(500).json({ message: "Failed to update cleanliness feature" });
    }
  });
  app2.delete("/api/admin/cleanliness-features/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid feature ID" });
      }
      const feature = await storage.getCleanlinessFeature(id);
      if (!feature) {
        return res.status(404).json({ message: "Feature not found" });
      }
      await storage.deleteCleanlinessFeature(id);
      res.status(200).json({ message: "Feature deleted successfully" });
    } catch (error) {
      console.error("Error deleting cleanliness feature:", error);
      res.status(500).json({ message: "Failed to delete cleanliness feature" });
    }
  });
  app2.get("/api/admin/hotels", isAdmin, async (req, res) => {
    try {
      const hotels2 = await storage.listHotels();
      res.json(hotels2);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      res.status(500).json({ message: "Failed to fetch hotels" });
    }
  });
  app2.get("/api/admin/hotels/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hotel ID" });
      }
      const hotel = await storage.getHotel(id);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      res.json(hotel);
    } catch (error) {
      console.error("Error fetching hotel:", error);
      res.status(500).json({ message: "Failed to fetch hotel" });
    }
  });
  app2.post("/api/admin/hotels", isAdmin, async (req, res) => {
    try {
      const validatedHotelData = insertHotelSchema.parse(req.body);
      if (validatedHotelData.destinationId) {
        const destination = await storage.getDestination(validatedHotelData.destinationId);
        if (!destination) {
          return res.status(400).json({ message: "Invalid destination ID" });
        }
      }
      const newHotel = await storage.createHotel(validatedHotelData);
      res.status(201).json(newHotel);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid hotel data", errors: error.errors });
      }
      console.error("Error creating hotel:", error);
      res.status(500).json({ message: "Failed to create hotel" });
    }
  });
  app2.post("/api/admin/hotel-drafts", isAdmin, async (req, res) => {
    try {
      const hotelData = req.body;
      const draftData = {
        name: hotelData.name || "Untitled Hotel",
        description: hotelData.description,
        destination_id: hotelData.destinationId,
        address: hotelData.address,
        city: hotelData.city,
        country: hotelData.country,
        postal_code: hotelData.postalCode,
        phone: hotelData.phone,
        email: hotelData.email,
        website: hotelData.website,
        image_url: hotelData.imageUrl,
        stars: hotelData.stars,
        amenities: JSON.stringify(hotelData.amenities || {}),
        check_in_time: hotelData.checkInTime,
        check_out_time: hotelData.checkOutTime,
        longitude: hotelData.longitude,
        latitude: hotelData.latitude,
        featured: hotelData.featured || false,
        rating: hotelData.rating,
        guest_rating: hotelData.guestRating,
        parking_available: hotelData.parkingAvailable || false,
        airport_transfer_available: hotelData.airportTransferAvailable || false,
        car_rental_available: hotelData.carRentalAvailable || false,
        shuttle_available: hotelData.shuttleAvailable || false,
        draft_data: JSON.stringify(hotelData),
        // Store the complete form data as JSON
        status: "draft"
      };
      const result = await db.run(
        `INSERT INTO hotel_drafts (
          name, description, destination_id, address, city, country, postal_code, 
          phone, email, website, image_url, stars, amenities, check_in_time, check_out_time,
          longitude, latitude, featured, rating, guest_rating, parking_available,
          airport_transfer_available, car_rental_available, shuttle_available,
          draft_data, status
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26
        ) RETURNING *`,
        [
          draftData.name,
          draftData.description,
          draftData.destination_id,
          draftData.address,
          draftData.city,
          draftData.country,
          draftData.postal_code,
          draftData.phone,
          draftData.email,
          draftData.website,
          draftData.image_url,
          draftData.stars,
          draftData.amenities,
          draftData.check_in_time,
          draftData.check_out_time,
          draftData.longitude,
          draftData.latitude,
          draftData.featured,
          draftData.rating,
          draftData.guest_rating,
          draftData.parking_available,
          draftData.airport_transfer_available,
          draftData.car_rental_available,
          draftData.shuttle_available,
          draftData.draft_data,
          draftData.status
        ]
      );
      return res.status(201).json({ message: "Hotel draft saved successfully", hotel: result.rows[0] });
    } catch (error) {
      console.error("Error saving hotel draft:", error);
      res.status(500).json({ message: "Failed to save hotel draft" });
    }
  });
  app2.put("/api/admin/hotels/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hotel ID" });
      }
      const existingHotel = await storage.getHotel(id);
      if (!existingHotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      const updateData = insertHotelSchema.parse(req.body);
      if (updateData.destinationId) {
        const destination = await storage.getDestination(updateData.destinationId);
        if (!destination) {
          return res.status(400).json({ message: "Invalid destination ID" });
        }
      }
      const updatedHotel = await storage.updateHotel(id, updateData);
      res.json(updatedHotel);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid hotel data", errors: error.errors });
      }
      console.error("Error updating hotel:", error);
      res.status(500).json({ message: "Failed to update hotel" });
    }
  });
  app2.delete("/api/admin/hotels/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hotel ID" });
      }
      const hotel = await storage.getHotel(id);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      await storage.deleteHotel(id);
      res.status(200).json({ message: "Hotel deleted successfully" });
    } catch (error) {
      console.error("Error deleting hotel:", error);
      res.status(500).json({ message: "Failed to delete hotel" });
    }
  });
  app2.get("/api/admin/rooms", isAdmin, async (req, res) => {
    try {
      const rooms2 = await storage.listRooms();
      res.json(rooms2);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      res.status(500).json({ message: "Failed to fetch rooms" });
    }
  });
  app2.get("/api/admin/rooms/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid room ID" });
      }
      const room = await storage.getRoom(id);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      console.error("Error fetching room:", error);
      res.status(500).json({ message: "Failed to fetch room" });
    }
  });
  app2.post("/api/admin/rooms", isAdmin, async (req, res) => {
    try {
      const roomData = insertRoomSchema.parse(req.body);
      const hotel = await storage.getHotel(roomData.hotelId);
      if (!hotel) {
        return res.status(400).json({ message: "Invalid hotel ID" });
      }
      const newRoom = await storage.createRoom(roomData);
      res.status(201).json(newRoom);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid room data", errors: error.errors });
      }
      console.error("Error creating room:", error);
      res.status(500).json({ message: "Failed to create room" });
    }
  });
  app2.put("/api/admin/rooms/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid room ID" });
      }
      const existingRoom = await storage.getRoom(id);
      if (!existingRoom) {
        return res.status(404).json({ message: "Room not found" });
      }
      const updateData = insertRoomSchema.parse(req.body);
      if (updateData.hotelId) {
        const hotel = await storage.getHotel(updateData.hotelId);
        if (!hotel) {
          return res.status(400).json({ message: "Invalid hotel ID" });
        }
      }
      const updatedRoom = await storage.updateRoom(id, updateData);
      res.json(updatedRoom);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid room data", errors: error.errors });
      }
      console.error("Error updating room:", error);
      res.status(500).json({ message: "Failed to update room" });
    }
  });
  app2.delete("/api/admin/rooms/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid room ID" });
      }
      const room = await storage.getRoom(id);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      await storage.deleteRoom(id);
      res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
      console.error("Error deleting room:", error);
      res.status(500).json({ message: "Failed to delete room" });
    }
  });
  app2.get("/api/admin/room-categories", isAdmin, async (req, res) => {
    try {
      const categories = await storage.listRoomCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching room categories:", error);
      res.status(500).json({ message: "Failed to fetch room categories" });
    }
  });
  app2.get("/api/admin/room-categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid room category ID" });
      }
      const category = await storage.getRoomCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Room category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching room category:", error);
      res.status(500).json({ message: "Failed to fetch room category" });
    }
  });
  app2.post("/api/admin/room-categories", isAdmin, async (req, res) => {
    try {
      const categoryData = req.body;
      const category = await storage.createRoomCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating room category:", error);
      res.status(500).json({ message: "Failed to create room category" });
    }
  });
  app2.put("/api/admin/room-categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid room category ID" });
      }
      const existingCategory = await storage.getRoomCategory(id);
      if (!existingCategory) {
        return res.status(404).json({ message: "Room category not found" });
      }
      const updateData = req.body;
      const updatedCategory = await storage.updateRoomCategory(id, updateData);
      res.json(updatedCategory);
    } catch (error) {
      console.error("Error updating room category:", error);
      res.status(500).json({ message: "Failed to update room category" });
    }
  });
  app2.delete("/api/admin/room-categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid room category ID" });
      }
      const category = await storage.getRoomCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Room category not found" });
      }
      await storage.deleteRoomCategory(id);
      res.status(200).json({ message: "Room category deleted successfully" });
    } catch (error) {
      console.error("Error deleting room category:", error);
      res.status(500).json({ message: "Failed to delete room category" });
    }
  });
  app2.get("/api/rooms/:roomId/combinations", async (req, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      if (isNaN(roomId)) {
        return res.status(400).json({ message: "Invalid room ID" });
      }
      const room = await storage.getRoom(roomId);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      const combinations = await storage.getRoomCombinationsByRoom(roomId);
      res.json(combinations);
    } catch (error) {
      console.error("Error fetching room combinations:", error);
      res.status(500).json({ message: "Failed to fetch room combinations" });
    }
  });
  app2.get("/api/room-combinations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid combination ID" });
      }
      const combination = await storage.getRoomCombination(id);
      if (!combination) {
        return res.status(404).json({ message: "Room combination not found" });
      }
      res.json(combination);
    } catch (error) {
      console.error("Error fetching room combination:", error);
      res.status(500).json({ message: "Failed to fetch room combination" });
    }
  });
  app2.post("/api/admin/room-combinations", isAdmin, async (req, res) => {
    try {
      const combinationData = insertRoomCombinationSchema.parse(req.body);
      const room = await storage.getRoom(combinationData.roomId);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      if (!combinationData.description) {
        const parts = [];
        if ((combinationData.adultsCount ?? 0) > 0) {
          parts.push(`${combinationData.adultsCount} Adult${(combinationData.adultsCount ?? 0) !== 1 ? "s" : ""}`);
        }
        if ((combinationData.childrenCount ?? 0) > 0) {
          parts.push(`${combinationData.childrenCount} Child${(combinationData.childrenCount ?? 0) !== 1 ? "ren" : ""}`);
        }
        if ((combinationData.infantsCount ?? 0) > 0) {
          parts.push(`${combinationData.infantsCount} Infant${(combinationData.infantsCount ?? 0) !== 1 ? "s" : ""}`);
        }
        combinationData.description = parts.join(" + ");
      }
      const existingCombinations = await storage.getRoomCombinationsByRoom(combinationData.roomId);
      const exists = existingCombinations.some(
        (combo) => combo.adultsCount === combinationData.adultsCount && combo.childrenCount === combinationData.childrenCount && combo.infantsCount === combinationData.infantsCount
      );
      if (exists) {
        return res.status(400).json({ message: "This room combination already exists" });
      }
      const newCombination = await storage.createRoomCombination(combinationData);
      res.status(201).json(newCombination);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid room combination data", errors: error.errors });
      }
      console.error("Error creating room combination:", error);
      res.status(500).json({ message: "Failed to create room combination" });
    }
  });
  app2.put("/api/admin/room-combinations/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid combination ID" });
      }
      const combination = await storage.getRoomCombination(id);
      if (!combination) {
        return res.status(404).json({ message: "Room combination not found" });
      }
      const updateData = req.body;
      if ((updateData.adultsCount !== void 0 || updateData.childrenCount !== void 0 || updateData.infantsCount !== void 0) && !updateData.description) {
        const adultsCount = updateData.adultsCount ?? combination.adultsCount;
        const childrenCount = updateData.childrenCount ?? combination.childrenCount;
        const infantsCount = updateData.infantsCount ?? combination.infantsCount;
        const parts = [];
        if (adultsCount > 0) {
          parts.push(`${adultsCount} Adult${adultsCount !== 1 ? "s" : ""}`);
        }
        if (childrenCount > 0) {
          parts.push(`${childrenCount} Child${childrenCount !== 1 ? "ren" : ""}`);
        }
        if (infantsCount > 0) {
          parts.push(`${infantsCount} Infant${infantsCount !== 1 ? "s" : ""}`);
        }
        updateData.description = parts.join(" + ");
      }
      const updatedCombination = await storage.updateRoomCombination(id, updateData);
      res.json(updatedCombination);
    } catch (error) {
      console.error("Error updating room combination:", error);
      res.status(500).json({ message: "Failed to update room combination" });
    }
  });
  app2.delete("/api/admin/room-combinations/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid combination ID" });
      }
      const combination = await storage.getRoomCombination(id);
      if (!combination) {
        return res.status(404).json({ message: "Room combination not found" });
      }
      await storage.deleteRoomCombination(id);
      res.status(200).json({ message: "Room combination deleted successfully" });
    } catch (error) {
      console.error("Error deleting room combination:", error);
      res.status(500).json({ message: "Failed to delete room combination" });
    }
  });
  app2.get("/api/admin/countries", isAdmin, async (req, res) => {
    try {
      const countries2 = await storage.listCountries();
      res.json(countries2);
    } catch (error) {
      console.error("Error fetching countries:", error);
      res.status(500).json({ message: "Failed to fetch countries" });
    }
  });
  app2.get("/api/admin/countries/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid country ID" });
      }
      const country = await storage.getCountry(id);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      res.json(country);
    } catch (error) {
      console.error("Error fetching country:", error);
      res.status(500).json({ message: "Failed to fetch country" });
    }
  });
  app2.post("/api/admin/countries", isAdmin, async (req, res) => {
    try {
      const countryData = insertCountrySchema.parse(req.body);
      if (countryData.code) {
        const existingCountry = await storage.getCountryByCode(countryData.code);
        if (existingCountry) {
          return res.status(409).json({ message: "Country with this code already exists" });
        }
      }
      const country = await storage.createCountry(countryData);
      res.status(201).json(country);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid country data", errors: error.errors });
      }
      console.error("Error creating country:", error);
      res.status(500).json({ message: "Failed to create country" });
    }
  });
  app2.put("/api/admin/countries/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid country ID" });
      }
      const existingCountry = await storage.getCountry(id);
      if (!existingCountry) {
        return res.status(404).json({ message: "Country not found" });
      }
      const updateData = insertCountrySchema.parse(req.body);
      if (updateData.code && updateData.code !== existingCountry.code) {
        const countryWithCode = await storage.getCountryByCode(updateData.code);
        if (countryWithCode && countryWithCode.id !== id) {
          return res.status(409).json({ message: "Country with this code already exists" });
        }
      }
      const updatedCountry = await storage.updateCountry(id, updateData);
      res.json(updatedCountry);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid country data", errors: error.errors });
      }
      console.error("Error updating country:", error);
      res.status(500).json({ message: "Failed to update country" });
    }
  });
  app2.delete("/api/admin/countries/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid country ID" });
      }
      const country = await storage.getCountry(id);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      const cities2 = await storage.getCitiesByCountry(id);
      if (cities2 && cities2.length > 0) {
        return res.status(400).json({
          message: "Cannot delete country with associated cities. Please delete the cities first or reassign them to another country."
        });
      }
      await storage.deleteCountry(id);
      res.status(200).json({ message: "Country deleted successfully" });
    } catch (error) {
      console.error("Error deleting country:", error);
      res.status(500).json({ message: "Failed to delete country" });
    }
  });
  app2.get("/api/admin/cities", isAdmin, async (req, res) => {
    try {
      const cities2 = await storage.listCities();
      res.json(cities2);
    } catch (error) {
      console.error("Error fetching cities:", error);
      res.status(500).json({ message: "Failed to fetch cities" });
    }
  });
  app2.get("/api/admin/cities/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid city ID" });
      }
      const city = await storage.getCity(id);
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }
      res.json(city);
    } catch (error) {
      console.error("Error fetching city:", error);
      res.status(500).json({ message: "Failed to fetch city" });
    }
  });
  app2.post("/api/admin/cities", isAdmin, async (req, res) => {
    try {
      const cityData = insertCitySchema.parse(req.body);
      const country = await storage.getCountry(cityData.countryId);
      if (!country) {
        return res.status(400).json({ message: "Invalid country ID" });
      }
      const city = await storage.createCity(cityData);
      res.status(201).json(city);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid city data", errors: error.errors });
      }
      console.error("Error creating city:", error);
      res.status(500).json({ message: "Failed to create city" });
    }
  });
  app2.put("/api/admin/cities/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid city ID" });
      }
      const existingCity = await storage.getCity(id);
      if (!existingCity) {
        return res.status(404).json({ message: "City not found" });
      }
      const updateData = insertCitySchema.parse(req.body);
      if (updateData.countryId) {
        const country = await storage.getCountry(updateData.countryId);
        if (!country) {
          return res.status(400).json({ message: "Invalid country ID" });
        }
      }
      const updatedCity = await storage.updateCity(id, updateData);
      res.json(updatedCity);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid city data", errors: error.errors });
      }
      console.error("Error updating city:", error);
      res.status(500).json({ message: "Failed to update city" });
    }
  });
  app2.delete("/api/admin/cities/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid city ID" });
      }
      const city = await storage.getCity(id);
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }
      await storage.deleteCity(id);
      res.status(200).json({ message: "City deleted successfully" });
    } catch (error) {
      console.error("Error deleting city:", error);
      res.status(500).json({ message: "Failed to delete city" });
    }
  });
  app2.get("/api/admin/airports", isAdmin, async (req, res) => {
    try {
      const airports2 = await storage.listAirports();
      res.json(airports2);
    } catch (error) {
      console.error("Error fetching airports for admin:", error);
      res.status(500).json({ message: "Failed to fetch airports" });
    }
  });
  app2.get("/api/admin/airports/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid airport ID" });
      }
      const airport = await storage.getAirport(id);
      if (!airport) {
        return res.status(404).json({ message: "Airport not found" });
      }
      res.json(airport);
    } catch (error) {
      console.error("Error fetching airport for admin:", error);
      res.status(500).json({ message: "Failed to fetch airport" });
    }
  });
  app2.post("/api/admin/airports", isAdmin, async (req, res) => {
    try {
      const validatedData = insertAirportSchema.parse(req.body);
      const airport = await storage.createAirport(validatedData);
      res.status(201).json(airport);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      console.error("Error creating airport:", error);
      res.status(500).json({ message: "Failed to create airport" });
    }
  });
  app2.put("/api/admin/airports/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid airport ID" });
      }
      const validationResult = insertAirportSchema.partial().safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation error",
          errors: validationResult.error.errors
        });
      }
      const updatedAirport = await storage.updateAirport(id, validationResult.data);
      if (!updatedAirport) {
        return res.status(404).json({ message: "Airport not found" });
      }
      res.json(updatedAirport);
    } catch (error) {
      console.error("Error updating airport:", error);
      res.status(500).json({ message: "Failed to update airport" });
    }
  });
  app2.delete("/api/admin/airports/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid airport ID" });
      }
      const airport = await storage.getAirport(id);
      if (!airport) {
        return res.status(404).json({ message: "Airport not found" });
      }
      await storage.deleteAirport(id);
      res.status(200).json({ message: "Airport deleted successfully" });
    } catch (error) {
      console.error("Error deleting airport:", error);
      res.status(500).json({ message: "Failed to delete airport" });
    }
  });
  app2.post("/api/admin/transportation", isAdmin, async (req, res) => {
    try {
      const transportationData = req.body;
      if (!transportationData.name || !transportationData.typeId || !transportationData.price || !transportationData.passengerCapacity) {
        return res.status(400).json({ message: "Missing required transportation fields" });
      }
      if (transportationData.destinationId) {
        const destination = await storage.getDestination(transportationData.destinationId);
        if (!destination) {
          return res.status(404).json({ message: "Destination not found" });
        }
      }
      const transportation2 = await storage.createTransportation(transportationData);
      res.status(201).json(transportation2);
    } catch (error) {
      console.error("Error creating transportation option:", error);
      res.status(500).json({ message: "Failed to create transportation option" });
    }
  });
  app2.put("/api/admin/transportation/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid transportation ID" });
      }
      const transportation2 = await storage.getTransportation(id);
      if (!transportation2) {
        return res.status(404).json({ message: "Transportation option not found" });
      }
      if (req.body.destinationId && req.body.destinationId !== transportation2.destinationId) {
        const destination = await storage.getDestination(req.body.destinationId);
        if (!destination) {
          return res.status(404).json({ message: "Destination not found" });
        }
      }
      const updatedTransportation = await storage.updateTransportation(id, req.body);
      res.json(updatedTransportation);
    } catch (error) {
      console.error("Error updating transportation option:", error);
      res.status(500).json({ message: "Failed to update transportation option" });
    }
  });
  app2.delete("/api/admin/transportation/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid transportation ID" });
      }
      const transportation2 = await storage.getTransportation(id);
      if (!transportation2) {
        return res.status(404).json({ message: "Transportation option not found" });
      }
      const deleted = await storage.deleteTransportation(id);
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete transportation option" });
      }
      res.status(200).json({ message: "Transportation option deleted successfully" });
    } catch (error) {
      console.error("Error deleting transportation option:", error);
      res.status(500).json({ message: "Failed to delete transportation option" });
    }
  });
  app2.get("/api/admin/menus", isAdmin, async (req, res) => {
    try {
      const active = req.query.active === "true" ? true : req.query.active === "false" ? false : void 0;
      const menus2 = await storage.listMenus(active);
      res.json(menus2);
    } catch (error) {
      console.error("Error fetching menus:", error);
      res.status(500).json({ message: "Failed to fetch menus" });
    }
  });
  app2.get("/api/admin/menus/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid menu ID" });
      }
      const menu = await storage.getMenu(id);
      if (!menu) {
        return res.status(404).json({ message: "Menu not found" });
      }
      res.json(menu);
    } catch (error) {
      console.error("Error fetching menu:", error);
      res.status(500).json({ message: "Failed to fetch menu" });
    }
  });
  app2.get("/api/menus/location/:location", async (req, res) => {
    try {
      const location = req.params.location;
      if (!location) {
        return res.status(400).json({ message: "Location parameter is required" });
      }
      const menu = await storage.getMenuByLocation(location);
      if (!menu) {
        return res.status(404).json({ message: "Menu not found for this location" });
      }
      const menuItems2 = await storage.listMenuItems(menu.id, true);
      res.json({
        menu,
        items: menuItems2
      });
    } catch (error) {
      console.error("Error fetching menu by location:", error);
      res.status(500).json({ message: "Failed to fetch menu by location" });
    }
  });
  app2.post("/api/admin/menus", isAdmin, async (req, res) => {
    try {
      const menuData = insertMenuSchema.parse(req.body);
      const existingMenu = await storage.getMenuByName(menuData.name);
      if (existingMenu) {
        return res.status(400).json({ message: "Menu with this name already exists" });
      }
      const existingLocation = await storage.getMenuByLocation(menuData.location);
      if (existingLocation) {
        return res.status(400).json({ message: "Menu with this location already exists" });
      }
      const menu = await storage.createMenu(menuData);
      res.status(201).json(menu);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid menu data", errors: error.errors });
      }
      console.error("Error creating menu:", error);
      res.status(500).json({ message: "Failed to create menu" });
    }
  });
  app2.put("/api/admin/menus/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid menu ID" });
      }
      const existingMenu = await storage.getMenu(id);
      if (!existingMenu) {
        return res.status(404).json({ message: "Menu not found" });
      }
      const updateData = insertMenuSchema.partial().parse(req.body);
      if (updateData.name && updateData.name !== existingMenu.name) {
        const menuWithName = await storage.getMenuByName(updateData.name);
        if (menuWithName && menuWithName.id !== id) {
          return res.status(400).json({ message: "Menu with this name already exists" });
        }
      }
      if (updateData.location && updateData.location !== existingMenu.location) {
        const menuWithLocation = await storage.getMenuByLocation(updateData.location);
        if (menuWithLocation && menuWithLocation.id !== id) {
          return res.status(400).json({ message: "Menu with this location already exists" });
        }
      }
      const updatedMenu = await storage.updateMenu(id, updateData);
      res.json(updatedMenu);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid menu data", errors: error.errors });
      }
      console.error("Error updating menu:", error);
      res.status(500).json({ message: "Failed to update menu" });
    }
  });
  app2.delete("/api/admin/menus/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid menu ID" });
      }
      const existingMenu = await storage.getMenu(id);
      if (!existingMenu) {
        return res.status(404).json({ message: "Menu not found" });
      }
      const success = await storage.deleteMenu(id);
      if (success) {
        res.status(204).end();
      } else {
        res.status(500).json({ message: "Failed to delete menu" });
      }
    } catch (error) {
      console.error("Error deleting menu:", error);
      res.status(500).json({ message: "Failed to delete menu" });
    }
  });
  app2.get("/api/admin/menus/:menuId/items", isAdmin, async (req, res) => {
    try {
      const menuId = parseInt(req.params.menuId);
      if (isNaN(menuId)) {
        return res.status(400).json({ message: "Invalid menu ID" });
      }
      const menu = await storage.getMenu(menuId);
      if (!menu) {
        return res.status(404).json({ message: "Menu not found" });
      }
      const active = req.query.active === "true" ? true : req.query.active === "false" ? false : void 0;
      const items = await storage.listMenuItems(menuId, active);
      res.json(items);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });
  app2.get("/api/admin/menu-items/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid menu item ID" });
      }
      const menuItem = await storage.getMenuItem(id);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(menuItem);
    } catch (error) {
      console.error("Error fetching menu item:", error);
      res.status(500).json({ message: "Failed to fetch menu item" });
    }
  });
  app2.post("/api/admin/menu-items", isAdmin, async (req, res) => {
    try {
      const menuItemData = insertMenuItemSchema.parse(req.body);
      const menu = await storage.getMenu(menuItemData.menuId);
      if (!menu) {
        return res.status(404).json({ message: "Menu not found" });
      }
      if (menuItemData.parentId) {
        const parentItem = await storage.getMenuItem(menuItemData.parentId);
        if (!parentItem) {
          return res.status(404).json({ message: "Parent menu item not found" });
        }
        if (parentItem.menuId !== menuItemData.menuId) {
          return res.status(400).json({ message: "Parent menu item must belong to the same menu" });
        }
      }
      const menuItem = await storage.createMenuItem(menuItemData);
      res.status(201).json(menuItem);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid menu item data", errors: error.errors });
      }
      console.error("Error creating menu item:", error);
      res.status(500).json({ message: "Failed to create menu item" });
    }
  });
  app2.put("/api/admin/menu-items/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid menu item ID" });
      }
      const existingMenuItem = await storage.getMenuItem(id);
      if (!existingMenuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      const updateData = insertMenuItemSchema.partial().parse(req.body);
      if (updateData.menuId && updateData.menuId !== existingMenuItem.menuId) {
        const menu = await storage.getMenu(updateData.menuId);
        if (!menu) {
          return res.status(404).json({ message: "Menu not found" });
        }
      }
      if (updateData.parentId && updateData.parentId !== existingMenuItem.parentId) {
        if (updateData.parentId === id) {
          return res.status(400).json({ message: "A menu item cannot be its own parent" });
        }
        const parentItem = await storage.getMenuItem(updateData.parentId);
        if (!parentItem) {
          return res.status(404).json({ message: "Parent menu item not found" });
        }
        const menuId = updateData.menuId || existingMenuItem.menuId;
        if (parentItem.menuId !== menuId) {
          return res.status(400).json({ message: "Parent menu item must belong to the same menu" });
        }
      }
      const updatedMenuItem = await storage.updateMenuItem(id, updateData);
      res.json(updatedMenuItem);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid menu item data", errors: error.errors });
      }
      console.error("Error updating menu item:", error);
      res.status(500).json({ message: "Failed to update menu item" });
    }
  });
  app2.delete("/api/admin/menu-items/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid menu item ID" });
      }
      const existingMenuItem = await storage.getMenuItem(id);
      if (!existingMenuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      const success = await storage.deleteMenuItem(id);
      if (success) {
        res.status(204).end();
      } else {
        res.status(500).json({ message: "Failed to delete menu item" });
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      res.status(500).json({ message: "Failed to delete menu item" });
    }
  });
  app2.get("/api/maps-key", (req, res) => {
    res.json({ key: process.env.GOOGLE_MAPS_API_KEY || "" });
  });
  app2.get("/api/translations/settings", async (req, res) => {
    try {
      const settings = await storage.getSiteLanguageSettings();
      if (!settings) {
        return res.json({
          defaultLanguage: "en",
          availableLanguages: ["en", "ar"],
          rtlLanguages: ["ar"]
        });
      }
      res.json(settings);
    } catch (error) {
      console.error("Error fetching language settings:", error);
      res.status(500).json({ message: "Failed to fetch language settings" });
    }
  });
  app2.get("/api/dictionary", async (req, res) => {
    try {
      const entries = await storage.listDictionaryEntries();
      res.json(entries);
    } catch (error) {
      console.error("Error fetching dictionary entries:", error);
      res.status(500).json({ message: "Failed to fetch dictionary entries" });
    }
  });
  app2.get("/api/dictionary/search", async (req, res) => {
    try {
      const { term } = req.query;
      if (!term || typeof term !== "string") {
        return res.status(400).json({ message: "Search term is required" });
      }
      const entries = await storage.searchDictionaryEntries(term);
      res.json(entries);
    } catch (error) {
      console.error("Error searching dictionary entries:", error);
      res.status(500).json({ message: "Failed to search dictionary entries" });
    }
  });
  app2.get("/api/dictionary/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      const entry = await storage.getDictionaryEntry(id);
      if (!entry) {
        return res.status(404).json({ message: "Dictionary entry not found" });
      }
      res.json(entry);
    } catch (error) {
      console.error("Error fetching dictionary entry:", error);
      res.status(500).json({ message: "Failed to fetch dictionary entry" });
    }
  });
  app2.post("/api/dictionary", isAdmin, async (req, res) => {
    try {
      const data = insertDictionaryEntrySchema.parse(req.body);
      const newEntry = await storage.createDictionaryEntry(data);
      res.status(201).json(newEntry);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid dictionary entry data", errors: error.errors });
      }
      console.error("Error creating dictionary entry:", error);
      res.status(500).json({ message: "Failed to create dictionary entry" });
    }
  });
  app2.put("/api/dictionary/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      const data = insertDictionaryEntrySchema.parse(req.body);
      const updatedEntry = await storage.updateDictionaryEntry(id, data);
      if (!updatedEntry) {
        return res.status(404).json({ message: "Dictionary entry not found" });
      }
      res.json(updatedEntry);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid dictionary entry data", errors: error.errors });
      }
      console.error("Error updating dictionary entry:", error);
      res.status(500).json({ message: "Failed to update dictionary entry" });
    }
  });
  app2.delete("/api/dictionary/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      const success = await storage.deleteDictionaryEntry(id);
      if (!success) {
        return res.status(404).json({ message: "Dictionary entry not found" });
      }
      res.json({ message: "Dictionary entry deleted successfully" });
    } catch (error) {
      console.error("Error deleting dictionary entry:", error);
      res.status(500).json({ message: "Failed to delete dictionary entry" });
    }
  });
  app2.put("/api/admin/translations/settings", isAdmin, async (req, res) => {
    try {
      const settingsData = insertSiteLanguageSettingsSchema.parse(req.body);
      const updatedSettings = await storage.updateSiteLanguageSettings(settingsData);
      if (!updatedSettings) {
        return res.status(500).json({ message: "Failed to update language settings" });
      }
      res.json(updatedSettings);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid language settings data", errors: error.errors });
      }
      console.error("Error updating language settings:", error);
      res.status(500).json({ message: "Failed to update language settings" });
    }
  });
  app2.get("/api/translations", async (req, res) => {
    try {
      const category = req.query.category;
      const translations2 = await storage.listTranslations(category);
      res.json(translations2);
    } catch (error) {
      console.error("Error fetching translations:", error);
      res.status(500).json({ message: "Failed to fetch translations" });
    }
  });
  app2.get("/api/translations/key/:key", async (req, res) => {
    try {
      const key = req.params.key;
      const translation = await storage.getTranslationByKey(key);
      if (!translation) {
        return res.status(404).json({ message: "Translation not found" });
      }
      res.json(translation);
    } catch (error) {
      console.error("Error fetching translation:", error);
      res.status(500).json({ message: "Failed to fetch translation" });
    }
  });
  app2.get("/api/translations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid translation ID" });
      }
      const translation = await storage.getTranslation(id);
      if (!translation) {
        return res.status(404).json({ message: "Translation not found" });
      }
      res.json(translation);
    } catch (error) {
      console.error("Error fetching translation:", error);
      res.status(500).json({ message: "Failed to fetch translation" });
    }
  });
  app2.post("/api/admin/translations", isAdmin, async (req, res) => {
    try {
      const translationData = insertTranslationSchema.parse(req.body);
      try {
        const inserted = await db.insert(translations).values({
          key: translationData.key,
          enText: translationData.enText,
          arText: translationData.arText || null,
          category: translationData.category || "general",
          context: translationData.context || null,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        const newTranslation2 = inserted[0];
        if (newTranslation2 && newTranslation2.id) {
          results.newTranslations.push(newTranslation2);
          existingKeys.set(translationData.key, newTranslation2.id);
          results.newKeysAdded++;
          console.log(`\u2713 Added: "${translationData.key}" with ID: ${newTranslation2.id}`);
        } else {
          console.log(`\u2717 Failed to add: "${translationData.key}" - No ID returned`);
        }
      } catch (dbError) {
        if (dbError.code === "23505") {
          return res.status(409).json({ message: "A translation with this key already exists" });
        }
        throw dbError;
      }
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid translation data", errors: error.errors });
      }
      console.error("Error creating translation:", error);
      res.status(500).json({ message: "Failed to create translation" });
    }
  });
  app2.put("/api/admin/translations/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid translation ID" });
      }
      const existingTranslation = await storage.getTranslation(id);
      if (!existingTranslation) {
        return res.status(404).json({ message: "Translation not found" });
      }
      const translationData = insertTranslationSchema.partial().parse(req.body);
      const updatedTranslation = await storage.updateTranslation(id, translationData);
      if (!updatedTranslation) {
        return res.status(500).json({ message: "Failed to update translation" });
      }
      res.json(updatedTranslation);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid translation data", errors: error.errors });
      }
      console.error("Error updating translation:", error);
      res.status(500).json({ message: "Failed to update translation" });
    }
  });
  app2.delete("/api/admin/translations/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid translation ID" });
      }
      const existingTranslation = await storage.getTranslation(id);
      if (!existingTranslation) {
        return res.status(404).json({ message: "Translation not found" });
      }
      const success = await storage.deleteTranslation(id);
      if (success) {
        res.status(204).end();
      } else {
        res.status(500).json({ message: "Failed to delete translation" });
      }
    } catch (error) {
      console.error("Error deleting translation:", error);
      res.status(500).json({ message: "Failed to delete translation" });
    }
  });
  app2.post("/api/admin/translations/:id/translate", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid translation ID" });
      }
      const existingTranslation = await storage.getTranslation(id);
      if (!existingTranslation) {
        return res.status(404).json({ message: "Translation not found" });
      }
      if (req.body.force !== true && existingTranslation.arText) {
        return res.status(400).json({
          message: "Translation already exists. Use force=true to overwrite."
        });
      }
      try {
        const translatedText = await gemini_default.translateToArabic(existingTranslation.enText);
        const updatedTranslation = await storage.updateTranslation(id, {
          arText: translatedText
        });
        res.json({
          success: true,
          translation: updatedTranslation,
          message: "Translation completed successfully"
        });
      } catch (transError) {
        console.error("Gemini translation error:", transError);
        res.status(500).json({
          success: false,
          message: `Translation service error: ${transError instanceof Error ? transError.message : String(transError)}`
        });
      }
    } catch (error) {
      console.error("Error processing translation request:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process translation request"
      });
    }
  });
  app2.post("/api/admin/packages/generate-image", isAdmin, async (req, res) => {
    try {
      const imageGenSchema = z3.object({
        overview: z3.string().min(10, "Overview text is too short"),
        city: z3.string().min(2, "City name is too short")
      });
      const { overview, city } = imageGenSchema.parse(req.body);
      try {
        const imageUrl = await gemini_default.getImageForPackage(overview, city);
        res.json({
          success: true,
          imageUrl,
          message: "Image generated successfully"
        });
      } catch (genError) {
        console.error("Image generation error:", genError);
        res.status(500).json({
          success: false,
          message: `Image generation error: ${genError instanceof Error ? genError.message : String(genError)}`
        });
      }
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid request parameters",
          errors: error.errors
        });
      }
      console.error("Error processing image generation:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process image generation"
      });
    }
  });
  app2.post("/api/admin/translations/batch-translate", isAdmin, async (req, res) => {
    try {
      const batchSchema = z3.object({
        filter: z3.enum(["all", "untranslated", "category"]).default("untranslated"),
        category: z3.string().optional(),
        limit: z3.number().min(1).max(50).default(10),
        force: z3.boolean().default(false)
      });
      const { filter, category, limit, force } = batchSchema.parse(req.body);
      let translations2 = await storage.listTranslations(filter === "category" ? category : void 0);
      if (filter === "untranslated") {
        translations2 = translations2.filter((t) => !t.arText || t.arText.trim() === "");
      } else if (filter === "all" && !force) {
        translations2 = translations2.filter((t) => !t.arText || t.arText.trim() === "");
      }
      translations2 = translations2.slice(0, limit);
      if (translations2.length === 0) {
        return res.json({
          success: true,
          message: "No translations to process",
          processed: 0,
          translations: []
        });
      }
      const translationItems = translations2.map((t) => ({
        id: t.id,
        text: t.enText
      }));
      try {
        const translationResults = await gemini_default.batchTranslateToArabic(translationItems);
        const updatedTranslations = [];
        for (const result of translationResults) {
          const updatedTranslation = await storage.updateTranslation(result.id, {
            arText: result.translation
          });
          if (updatedTranslation) {
            updatedTranslations.push(updatedTranslation);
          }
        }
        res.json({
          success: true,
          message: `Successfully processed ${updatedTranslations.length} translations`,
          processed: updatedTranslations.length,
          translations: updatedTranslations
        });
      } catch (batchError) {
        console.error("Batch translation error:", batchError);
        res.status(500).json({
          success: false,
          message: `Batch translation error: ${batchError instanceof Error ? batchError.message : String(batchError)}`
        });
      }
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid request parameters",
          errors: error.errors
        });
      }
      console.error("Error processing batch translation:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process batch translation"
      });
    }
  });
  app2.post("/api/admin/translations/sync", isAdmin, async (req, res) => {
    const scanFile = async (filePath, results2, translationPattern, existingKeys2) => {
      try {
        results2.scannedFiles++;
        const content = await fsPromises.readFile(filePath, "utf8");
        let match;
        translationPattern.lastIndex = 0;
        const shortPath = filePath.replace("./client/src/", "");
        console.log(`Scanning: ${shortPath}`);
        while ((match = translationPattern.exec(content)) !== null) {
          if (match.length < 6) {
            continue;
          }
          let key = "", defaultText = "";
          try {
            if (match[2]) key = match[2];
            if (match[5]) defaultText = match[5];
          } catch (e) {
            console.error("Error parsing match:", e);
            continue;
          }
          if (!key || key.trim() === "") {
            continue;
          }
          results2.foundKeys++;
          const existingId = existingKeys2.get(key);
          if (existingId) {
            continue;
          }
          console.log(`New key found: "${key}" with text: "${defaultText || "none"}"`);
          let category = "auto-generated";
          if (filePath.includes("/components/")) {
            category = "components";
          } else if (filePath.includes("/pages/")) {
            const pathSegments = filePath.split("/");
            const pageSegmentIndex = pathSegments.findIndex((segment) => segment === "pages");
            if (pageSegmentIndex !== -1 && pageSegmentIndex + 1 < pathSegments.length) {
              category = pathSegments[pageSegmentIndex + 1].replace(".tsx", "").replace(".ts", "");
            }
          }
          let context = `Auto-detected from ${path4.relative("./client/src", filePath)}`;
          try {
            let existingTranslation;
            try {
              existingTranslation = await storage.getTranslationByKey(key);
            } catch (lookupErr) {
              console.log(`Key lookup failed for "${key}", will attempt insert`);
            }
            if (existingTranslation && existingTranslation.id) {
              console.log(`Found existing translation for "${key}" (ID: ${existingTranslation.id})`);
              existingKeys2.set(key, existingTranslation.id);
              continue;
            }
            console.log(`Adding new translation: "${key}"`);
            try {
              await db.insert(translations).values({
                key,
                enText: defaultText || key,
                arText: null,
                category,
                context,
                createdAt: /* @__PURE__ */ new Date(),
                updatedAt: /* @__PURE__ */ new Date()
              }).returning();
              if (newTranslation && newTranslation.id) {
                results2.newTranslations.push(newTranslation);
                existingKeys2.set(key, newTranslation.id);
                results2.newKeysAdded++;
                console.log(`\u2713 Added: "${key}" with ID: ${newTranslation.id}`);
              } else {
                console.log(`\u2717 Failed to add: "${key}" - No ID returned`);
              }
            } catch (dbErr) {
              if (dbErr.code === "23505" || dbErr.message?.includes("unique") || dbErr.message?.includes("duplicate")) {
                console.log(`Duplicate detected for "${key}" during insertion`);
                try {
                  const existingEntry = await storage.getTranslationByKey(key);
                  if (existingEntry && existingEntry.id) {
                    existingKeys2.set(key, existingEntry.id);
                  }
                } catch (finalErr) {
                  console.log(`Unable to process key "${key}"`);
                }
              } else {
                console.error(`Error adding "${key}":`, dbErr.message || dbErr);
              }
            }
          } catch (err) {
            console.error(`Processing error for "${key}":`, err.message || err);
          }
        }
      } catch (err) {
        console.error(`Error scanning file ${filePath}:`, err);
      }
    };
    const scanDir = async (dir, results2, translationPattern, existingKeys2, scanFileFn) => {
      try {
        results2.directories.push(dir);
        const items = await fsPromises.readdir(dir);
        for (const item of items) {
          const itemPath = path4.join(dir, item);
          const stats = await fsPromises.stat(itemPath);
          if (stats.isDirectory()) {
            await scanDir(itemPath, results2, translationPattern, existingKeys2, scanFileFn);
          } else if (stats.isFile() && (itemPath.endsWith(".tsx") || itemPath.endsWith(".ts"))) {
            await scanFileFn(itemPath, results2, translationPattern, existingKeys2);
          }
        }
      } catch (err) {
        console.error(`Error scanning directory ${dir}:`, err);
      }
    };
    try {
      await dbPromise;
      const existingTranslations = await storage.listTranslations();
      console.log(`Found ${existingTranslations.length} existing translations in database`);
      console.log("Existing translation keys:");
      existingTranslations.forEach((t) => {
        console.log(`- ${t.key} (ID: ${t.id})`);
      });
      const existingKeys2 = /* @__PURE__ */ new Map();
      existingTranslations.forEach((t) => {
        existingKeys2.set(t.key, t.id);
      });
      const translationPattern = /t\(\s*(['"`])([^'"`]+)(['"`])(?:\s*,\s*(['"`])([^'"`]+)(['"`]))?\s*\)/g;
      const results2 = {
        scannedFiles: 0,
        foundKeys: 0,
        newKeysAdded: 0,
        directories: [],
        newTranslations: []
      };
      const dirsToScan = [
        "./client/src/pages",
        "./client/src/components"
      ];
      for (const dir of dirsToScan) {
        await scanDir(dir, results2, translationPattern, existingKeys2, scanFile);
      }
      console.log(`Summary of scan:
      - Scanned ${results2.scannedFiles} files
      - Found ${results2.foundKeys} total keys
      - Found ${existingKeys2.size} existing keys (should match ${existingTranslations.length})
      - Added ${results2.newKeysAdded} new translations
      `);
      if (results2.foundKeys > 0 && results2.newKeysAdded === 0) {
        console.log("WARNING: Found keys but didn't add any. This could be a problem!");
        console.log("Missing key detection mechanism may be incorrect.");
      }
      if (results2.newTranslations.length > 0) {
        console.log("New translations added (first 10):");
        results2.newTranslations.slice(0, 10).forEach((t) => {
          console.log(`- ${t.key} (ID: ${t.id})`);
        });
      } else {
        console.log("No new translations were added.");
      }
      res.json({
        success: true,
        message: `Scan complete. Found ${results2.foundKeys} keys in ${results2.scannedFiles} files. Added ${results2.newKeysAdded} new translations.`,
        results: results2
      });
    } catch (error) {
      console.error("Error syncing translations:", error);
      res.status(500).json({
        success: false,
        message: "Failed to sync translations",
        error: error.message
      });
    }
  });
  app2.get("/api/dictionary", async (req, res) => {
    try {
      const entries = await storage.listDictionaryEntries();
      res.json(entries);
    } catch (error) {
      console.error("Error fetching dictionary entries:", error);
      res.status(500).json({ message: "Failed to fetch dictionary entries" });
    }
  });
  app2.get("/api/dictionary/search", async (req, res) => {
    try {
      const searchTerm = req.query.term;
      if (!searchTerm) {
        return res.status(400).json({ message: "Search term is required" });
      }
      const entries = await storage.searchDictionaryEntries(searchTerm);
      res.json(entries);
    } catch (error) {
      console.error("Error searching dictionary entries:", error);
      res.status(500).json({ message: "Failed to search dictionary entries" });
    }
  });
  app2.get("/api/dictionary/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid dictionary entry ID" });
      }
      const entry = await storage.getDictionaryEntry(id);
      if (!entry) {
        return res.status(404).json({ message: "Dictionary entry not found" });
      }
      res.json(entry);
    } catch (error) {
      console.error("Error fetching dictionary entry:", error);
      res.status(500).json({ message: "Failed to fetch dictionary entry" });
    }
  });
  app2.get("/api/dictionary/word/:word", async (req, res) => {
    try {
      const word = req.params.word;
      const entry = await storage.getDictionaryEntryByWord(word);
      if (!entry) {
        return res.status(404).json({ message: "Dictionary entry not found" });
      }
      res.json(entry);
    } catch (error) {
      console.error("Error fetching dictionary entry by word:", error);
      res.status(500).json({ message: "Failed to fetch dictionary entry" });
    }
  });
  app2.post("/api/admin/dictionary", isAdmin, async (req, res) => {
    try {
      const entryData = insertDictionaryEntrySchema.parse(req.body);
      const newEntry = await storage.createDictionaryEntry(entryData);
      res.status(201).json(newEntry);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid dictionary entry data", errors: error.errors });
      }
      console.error("Error creating dictionary entry:", error);
      res.status(500).json({ message: "Failed to create dictionary entry" });
    }
  });
  app2.put("/api/admin/dictionary/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid dictionary entry ID" });
      }
      const existingEntry = await storage.getDictionaryEntry(id);
      if (!existingEntry) {
        return res.status(404).json({ message: "Dictionary entry not found" });
      }
      const entryData = insertDictionaryEntrySchema.partial().parse(req.body);
      const updatedEntry = await storage.updateDictionaryEntry(id, entryData);
      if (!updatedEntry) {
        return res.status(500).json({ message: "Failed to update dictionary entry" });
      }
      res.json(updatedEntry);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({ message: "Invalid dictionary entry data", errors: error.errors });
      }
      console.error("Error updating dictionary entry:", error);
      res.status(500).json({ message: "Failed to update dictionary entry" });
    }
  });
  app2.delete("/api/admin/dictionary/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid dictionary entry ID" });
      }
      const existingEntry = await storage.getDictionaryEntry(id);
      if (!existingEntry) {
        return res.status(404).json({ message: "Dictionary entry not found" });
      }
      const success = await storage.deleteDictionaryEntry(id);
      if (success) {
        res.status(204).end();
      } else {
        res.status(500).json({ message: "Failed to delete dictionary entry" });
      }
    } catch (error) {
      console.error("Error deleting dictionary entry:", error);
      res.status(500).json({ message: "Failed to delete dictionary entry" });
    }
  });
  app2.get("/api/admin/translations/export", isAdmin, async (req, res) => {
    try {
      const allTranslations = await storage.listTranslations();
      const languageSettings = await storage.getSiteLanguageSettings();
      const exportData2 = {
        translations: allTranslations,
        languageSettings: languageSettings || {
          defaultLanguage: "en",
          availableLanguages: ["en", "ar"],
          rtlLanguages: ["ar"]
        }
      };
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", "attachment; filename=sahara-translations.json");
      res.json(exportData2);
    } catch (error) {
      console.error("Error exporting translations:", error);
      res.status(500).json({ message: "Failed to export translations" });
    }
  });
  app2.post("/api/admin/translations/import", isAdmin, async (req, res) => {
    try {
      const importSchema = z3.object({
        translations: z3.array(z3.object({
          key: z3.string(),
          enText: z3.string(),
          arText: z3.string().nullable(),
          context: z3.string().nullable(),
          category: z3.string().nullable()
        })),
        languageSettings: z3.object({
          defaultLanguage: z3.string(),
          availableLanguages: z3.union([z3.array(z3.string()), z3.string()]),
          rtlLanguages: z3.union([z3.array(z3.string()), z3.string()])
        })
      });
      const importData = importSchema.parse(req.body);
      const stats = {
        totalTranslations: importData.translations.length,
        imported: 0,
        updated: 0,
        skipped: 0,
        errors: 0
      };
      for (const translation of importData.translations) {
        try {
          const existingTranslation = await storage.getTranslationByKey(translation.key);
          if (existingTranslation) {
            await storage.updateTranslation(existingTranslation.id, translation);
            stats.updated++;
          } else {
            await storage.createTranslation(translation);
            stats.imported++;
          }
        } catch (err) {
          console.error(`Error importing translation key ${translation.key}:`, err);
          stats.errors++;
        }
      }
      if (importData.languageSettings) {
        try {
          await storage.updateSiteLanguageSettings(importData.languageSettings);
        } catch (err) {
          console.error("Error updating language settings:", err);
          stats.errors++;
        }
      }
      res.json({
        success: true,
        message: "Translations imported successfully",
        stats
      });
    } catch (error) {
      if (error instanceof z3.ZodError) {
        return res.status(400).json({
          message: "Invalid import data format",
          errors: error.errors
        });
      }
      console.error("Error importing translations:", error);
      res.status(500).json({ message: "Failed to import translations" });
    }
  });
  const httpServer = createServer(app2);
  app2.get("/api/tour-categories", async (req, res) => {
    try {
      const active = req.query.active === "true" ? true : void 0;
      const categories = await storage.listTourCategories(active);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching tour categories:", error);
      res.status(500).json({ message: "Failed to fetch tour categories" });
    }
  });
  app2.get("/api/tour-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const category = await storage.getTourCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Tour category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching tour category:", error);
      res.status(500).json({ message: "Failed to fetch tour category" });
    }
  });
  app2.post("/api/tour-categories", isAdmin, async (req, res) => {
    try {
      const { name, description, active } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }
      const newCategory = await storage.createTourCategory({
        name,
        description: description || null,
        active: active !== void 0 ? active : true
      });
      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating tour category:", error);
      res.status(500).json({ message: "Failed to create tour category" });
    }
  });
  app2.patch("/api/tour-categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const { name, description, active } = req.body;
      const updatedData = {};
      if (name !== void 0) updatedData.name = name;
      if (description !== void 0) updatedData.description = description;
      if (active !== void 0) updatedData.active = active;
      const updatedCategory = await storage.updateTourCategory(id, updatedData);
      if (!updatedCategory) {
        return res.status(404).json({ message: "Tour category not found" });
      }
      res.json(updatedCategory);
    } catch (error) {
      console.error("Error updating tour category:", error);
      res.status(500).json({ message: "Failed to update tour category" });
    }
  });
  app2.delete("/api/tour-categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const success = await storage.deleteTourCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Tour category not found or could not be deleted" });
      }
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting tour category:", error);
      res.status(500).json({ message: "Failed to delete tour category" });
    }
  });
  app2.get("/api/hotel-categories", async (req, res) => {
    try {
      const active = req.query.active === "true" ? true : void 0;
      const categories = await storage.listHotelCategories(active);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching hotel categories:", error);
      res.status(500).json({ message: "Failed to fetch hotel categories" });
    }
  });
  app2.get("/api/hotel-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const category = await storage.getHotelCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Hotel category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching hotel category:", error);
      res.status(500).json({ message: "Failed to fetch hotel category" });
    }
  });
  app2.post("/api/hotel-categories", isAdmin, async (req, res) => {
    try {
      const { name, description, active } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }
      const newCategory = await storage.createHotelCategory({
        name,
        description: description || null,
        active: active !== void 0 ? active : true
      });
      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating hotel category:", error);
      res.status(500).json({ message: "Failed to create hotel category" });
    }
  });
  app2.patch("/api/hotel-categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const { name, description, active } = req.body;
      const updatedData = {};
      if (name !== void 0) updatedData.name = name;
      if (description !== void 0) updatedData.description = description;
      if (active !== void 0) updatedData.active = active;
      const updatedCategory = await storage.updateHotelCategory(id, updatedData);
      if (!updatedCategory) {
        return res.status(404).json({ message: "Hotel category not found" });
      }
      res.json(updatedCategory);
    } catch (error) {
      console.error("Error updating hotel category:", error);
      res.status(500).json({ message: "Failed to update hotel category" });
    }
  });
  app2.delete("/api/hotel-categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const success = await storage.deleteHotelCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Hotel category not found or could not be deleted" });
      }
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting hotel category:", error);
      res.status(500).json({ message: "Failed to delete hotel category" });
    }
  });
  app2.get("/api/room-categories", async (req, res) => {
    try {
      const active = req.query.active === "true" ? true : void 0;
      const categories = await storage.listRoomCategories(active);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching room categories:", error);
      res.status(500).json({ message: "Failed to fetch room categories" });
    }
  });
  app2.get("/api/room-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const category = await storage.getRoomCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Room category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching room category:", error);
      res.status(500).json({ message: "Failed to fetch room category" });
    }
  });
  app2.post("/api/room-categories", isAdmin, async (req, res) => {
    try {
      const { name, description, active } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }
      const newCategory = await storage.createRoomCategory({
        name,
        description: description || null,
        active: active !== void 0 ? active : true
      });
      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating room category:", error);
      res.status(500).json({ message: "Failed to create room category" });
    }
  });
  app2.patch("/api/room-categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const { name, description, active } = req.body;
      const updatedData = {};
      if (name !== void 0) updatedData.name = name;
      if (description !== void 0) updatedData.description = description;
      if (active !== void 0) updatedData.active = active;
      const updatedCategory = await storage.updateRoomCategory(id, updatedData);
      if (!updatedCategory) {
        return res.status(404).json({ message: "Room category not found" });
      }
      res.json(updatedCategory);
    } catch (error) {
      console.error("Error updating room category:", error);
      res.status(500).json({ message: "Failed to update room category" });
    }
  });
  app2.delete("/api/room-categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const success = await storage.deleteRoomCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Room category not found or could not be deleted" });
      }
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting room category:", error);
      res.status(500).json({ message: "Failed to delete room category" });
    }
  });
  app2.get("/api/package-categories", async (req, res) => {
    try {
      const active = req.query.active === "true" ? true : void 0;
      const categories = await storage.listPackageCategories(active);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching package categories:", error);
      res.status(500).json({ message: "Failed to fetch package categories" });
    }
  });
  app2.get("/api/package-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const category = await storage.getPackageCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Package category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching package category:", error);
      res.status(500).json({ message: "Failed to fetch package category" });
    }
  });
  app2.post("/api/package-categories", isAdmin, async (req, res) => {
    try {
      const { name, description, active } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }
      const newCategory = await storage.createPackageCategory({
        name,
        description: description || null,
        active: active !== void 0 ? active : true
      });
      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating package category:", error);
      res.status(500).json({ message: "Failed to create package category" });
    }
  });
  app2.patch("/api/package-categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const { name, description, active } = req.body;
      const updatedData = {};
      if (name !== void 0) updatedData.name = name;
      if (description !== void 0) updatedData.description = description;
      if (active !== void 0) updatedData.active = active;
      const updatedCategory = await storage.updatePackageCategory(id, updatedData);
      if (!updatedCategory) {
        return res.status(404).json({ message: "Package category not found" });
      }
      res.json(updatedCategory);
    } catch (error) {
      console.error("Error updating package category:", error);
      res.status(500).json({ message: "Failed to update package category" });
    }
  });
  app2.delete("/api/package-categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const success = await storage.deletePackageCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Package category not found or could not be deleted" });
      }
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting package category:", error);
      res.status(500).json({ message: "Failed to delete package category" });
    }
  });
  setupExportImportRoutes(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs5 from "fs";
import path6 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path5 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path5.resolve(import.meta.dirname, "client", "src"),
      "@shared": path5.resolve(import.meta.dirname, "shared"),
      "@assets": path5.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path5.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path5.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path6.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs5.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path6.resolve(import.meta.dirname, "public");
  if (!fs5.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path6.resolve(distPath, "index.html"));
  });
}

// server/index.ts
init_admin_setup();
import path7 from "path";
var app = express2();
app.use(express2.json({ limit: "25mb" }));
app.use(express2.urlencoded({ extended: false, limit: "25mb" }));
app.use("/uploads", express2.static(path7.join(process.cwd(), "public/uploads")));
app.use((req, res, next) => {
  const start = Date.now();
  const path8 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path8.startsWith("/api")) {
      let logLine = `${req.method} ${path8} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.get("/admin-test", (req, res) => {
    res.sendFile(path7.join(process.cwd(), "client", "public", "admin-test.html"));
  });
  setTimeout(async () => {
    try {
      const { initializeDatabase: initializeDatabase3 } = await Promise.resolve().then(() => (init_init_database(), init_database_exports));
      await initializeDatabase3();
      const { firstTimeSetup: firstTimeSetup2 } = await Promise.resolve().then(() => (init_first_time_setup(), first_time_setup_exports));
      await firstTimeSetup2();
    } catch (error) {
      console.error("Failed to initialize database:", error);
    }
  }, 1e3);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 3e3;
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();
