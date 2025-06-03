import { 
  users, User, InsertUser,
  countries, Country, InsertCountry,
  cities, City, InsertCity,
  airports, Airport, InsertAirport,
  destinations, Destination, InsertDestination,
  packages, Package, InsertPackage,
  bookings, Booking, InsertBooking,
  favorites, Favorite, InsertFavorite,
  tours, Tour, InsertTour,
  hotels, Hotel, InsertHotel,
  rooms, Room, InsertRoom,
  roomCombinations, RoomCombination, InsertRoomCombination,
  transportation, Transportation, InsertTransportation,
  transportTypes, TransportType, InsertTransportType,
  transportLocations, TransportLocation, InsertTransportLocation,
  transportDurations, TransportDuration, InsertTransportDuration,
  menus, insertMenuSchema, Menu, InsertMenu,
  menuItems, insertMenuItemSchema, MenuItem, InsertMenuItem,
  translations, insertTranslationSchema, Translation, InsertTranslation,
  siteLanguageSettings, insertSiteLanguageSettingsSchema, SiteLanguageSetting, InsertSiteLanguageSetting,
  dictionaryEntries, insertDictionaryEntrySchema, DictionaryEntry, InsertDictionaryEntry,
  // Categories
  tourCategories, TourCategory, InsertTourCategory,
  hotelCategories, HotelCategory, InsertHotelCategory,
  roomCategories, RoomCategory, InsertRoomCategory,
  packageCategories, PackageCategory, InsertPackageCategory,
  // Hotel features
  hotelFacilities, hotelHighlights, cleanlinessFeatures,
  // Visa management
  nationalities, Nationality, InsertNationality,
  visas, Visa, InsertVisa,
  nationalityVisaRequirements, NationalityVisaRequirement, InsertNationalityVisaRequirement
} from "@shared/schema";
import session from "express-session";
import MemoryStore from "memorystore";
import { db } from "./db";
import { eq, and, or, ilike } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // Nationalities
  getNationality(id: number): Promise<Nationality | undefined>;
  listNationalities(active?: boolean): Promise<Nationality[]>;
  createNationality(nationality: InsertNationality): Promise<Nationality>;
  updateNationality(id: number, nationality: Partial<InsertNationality>): Promise<Nationality | undefined>;
  deleteNationality(id: number): Promise<boolean>;
  
  // Visas
  getVisa(id: number): Promise<Visa | undefined>;
  listVisas(active?: boolean): Promise<Visa[]>;
  getVisasByCountry(countryId: number): Promise<Visa[]>;
  createVisa(visa: InsertVisa): Promise<Visa>;
  updateVisa(id: number, visa: Partial<InsertVisa>): Promise<Visa | undefined>;
  deleteVisa(id: number): Promise<boolean>;
  
  // Nationality Visa Requirements
  getNationalityVisaRequirement(id: number): Promise<NationalityVisaRequirement | undefined>;
  getNationalityVisaRequirementByVisaAndNationality(visaId: number, nationalityId: number): Promise<NationalityVisaRequirement | undefined>;
  listNationalityVisaRequirements(visaId?: number, nationalityId?: number): Promise<NationalityVisaRequirement[]>;
  createNationalityVisaRequirement(requirement: InsertNationalityVisaRequirement): Promise<NationalityVisaRequirement>;
  updateNationalityVisaRequirement(id: number, requirement: Partial<InsertNationalityVisaRequirement>): Promise<NationalityVisaRequirement | undefined>;
  deleteNationalityVisaRequirement(id: number): Promise<boolean>;
  
  // Hotel Facilities
  listHotelFacilities(): Promise<any[]>;
  getHotelFacility(id: number): Promise<any | undefined>;
  createHotelFacility(facility: any): Promise<any>;
  updateHotelFacility(id: number, facility: any): Promise<any | undefined>;
  deleteHotelFacility(id: number): Promise<boolean>;
  
  // Hotel Highlights
  listHotelHighlights(): Promise<any[]>;
  getHotelHighlight(id: number): Promise<any | undefined>;
  createHotelHighlight(highlight: any): Promise<any>;
  updateHotelHighlight(id: number, highlight: any): Promise<any | undefined>;
  deleteHotelHighlight(id: number): Promise<boolean>;
  
  // Cleanliness Features
  listCleanlinessFeatures(): Promise<any[]>;
  getCleanlinessFeature(id: number): Promise<any | undefined>;
  createCleanlinessFeature(feature: any): Promise<any>;
  updateCleanlinessFeature(id: number, feature: any): Promise<any | undefined>;
  deleteCleanlinessFeature(id: number): Promise<boolean>;
  
  // Nationality methods
  getNationality(id: number): Promise<Nationality | undefined>;
  listNationalities(active?: boolean): Promise<Nationality[]>;
  createNationality(nationality: InsertNationality): Promise<Nationality>;
  updateNationality(id: number, nationality: Partial<InsertNationality>): Promise<Nationality | undefined>;
  deleteNationality(id: number): Promise<boolean>;
  
  // Visa methods
  getVisa(id: number): Promise<Visa | undefined>;
  listVisas(active?: boolean): Promise<Visa[]>;
  getVisasByCountry(countryId: number): Promise<Visa[]>;
  createVisa(visa: InsertVisa): Promise<Visa>;
  updateVisa(id: number, visa: Partial<InsertVisa>): Promise<Visa | undefined>;
  deleteVisa(id: number): Promise<boolean>;
  
  // Nationality visa requirements methods
  getNationalityVisaRequirement(id: number): Promise<NationalityVisaRequirement | undefined>;
  getNationalityVisaRequirementByVisaAndNationality(visaId: number, nationalityId: number): Promise<NationalityVisaRequirement | undefined>;
  listNationalityVisaRequirements(visaId?: number, nationalityId?: number): Promise<NationalityVisaRequirement[]>;
  createNationalityVisaRequirement(requirement: InsertNationalityVisaRequirement): Promise<NationalityVisaRequirement>;
  updateNationalityVisaRequirement(id: number, requirement: Partial<InsertNationalityVisaRequirement>): Promise<NationalityVisaRequirement | undefined>;
  deleteNationalityVisaRequirement(id: number): Promise<boolean>;
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  listUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Country methods
  getCountry(id: number): Promise<Country | undefined>;
  getCountryByCode(code: string): Promise<Country | undefined>;
  listCountries(active?: boolean): Promise<Country[]>;
  createCountry(country: InsertCountry): Promise<Country>;
  updateCountry(id: number, country: Partial<InsertCountry>): Promise<Country | undefined>;
  deleteCountry(id: number): Promise<boolean>;
  
  // City methods
  getCity(id: number): Promise<City | undefined>;
  listCities(active?: boolean): Promise<City[]>;
  getCitiesByCountry(countryId: number): Promise<City[]>;
  createCity(city: InsertCity): Promise<City>;
  updateCity(id: number, city: Partial<InsertCity>): Promise<City | undefined>;
  deleteCity(id: number): Promise<boolean>;
  
  // Airport methods
  getAirport(id: number): Promise<Airport | undefined>;
  listAirports(active?: boolean): Promise<Airport[]>;
  getAirportsByCity(cityId: number): Promise<Airport[]>;
  createAirport(airport: InsertAirport): Promise<Airport>;
  updateAirport(id: number, airport: Partial<InsertAirport>): Promise<Airport | undefined>;
  deleteAirport(id: number): Promise<boolean>;
  
  // Destination methods
  getDestination(id: number): Promise<Destination | undefined>;
  listDestinations(featured?: boolean): Promise<Destination[]>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  updateDestination(id: number, destination: Partial<InsertDestination>): Promise<Destination | undefined>;
  deleteDestination(id: number): Promise<boolean>;
  
  // Package methods
  getPackage(id: number): Promise<Package | undefined>;
  getPackageBySlug(slug: string): Promise<Package | undefined>;
  listPackages(featured?: boolean): Promise<Package[]>;
  getPackagesByDestination(destinationId: number): Promise<Package[]>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: number, pkg: Partial<InsertPackage>): Promise<Package | undefined>;
  updatePackageSlug(id: number, slug: string): Promise<Package | undefined>;
  deletePackage(id: number): Promise<boolean>;
  
  // Tour methods
  getTour(id: number): Promise<Tour | undefined>;
  listTours(featured?: boolean): Promise<Tour[]>;
  getToursByDestination(destinationId: number): Promise<Tour[]>;
  createTour(tour: InsertTour): Promise<Tour>;
  updateTour(id: number, tour: Partial<InsertTour>): Promise<Tour | undefined>;
  deleteTour(id: number): Promise<boolean>;
  
  // Hotel methods
  getHotel(id: number): Promise<Hotel | undefined>;
  listHotels(featured?: boolean): Promise<Hotel[]>;
  getHotelsByDestination(destinationId: number): Promise<Hotel[]>;
  createHotel(hotel: InsertHotel): Promise<Hotel>;
  updateHotel(id: number, hotel: Partial<InsertHotel>): Promise<Hotel | undefined>;
  deleteHotel(id: number): Promise<boolean>;
  
  // Room methods
  getRoom(id: number): Promise<Room | undefined>;
  listRooms(): Promise<Room[]>;
  getRoomsByHotel(hotelId: number): Promise<Room[]>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: number, room: Partial<InsertRoom>): Promise<Room | undefined>;
  deleteRoom(id: number): Promise<boolean>;
  
  // Room Combinations methods
  getRoomCombination(id: number): Promise<RoomCombination | undefined>;
  getRoomCombinationsByRoom(roomId: number): Promise<RoomCombination[]>;
  createRoomCombination(combination: InsertRoomCombination): Promise<RoomCombination>;
  updateRoomCombination(id: number, combination: Partial<InsertRoomCombination>): Promise<RoomCombination | undefined>;
  deleteRoomCombination(id: number): Promise<boolean>;
  
  // Transport Types methods
  getTransportType(id: number): Promise<TransportType | undefined>;
  listTransportTypes(): Promise<TransportType[]>;
  createTransportType(locationType: InsertTransportType): Promise<TransportType>;
  updateTransportType(id: number, locationType: Partial<InsertTransportType>): Promise<TransportType | undefined>;
  deleteTransportType(id: number): Promise<boolean>;
  
  // Menu methods
  getMenu(id: number): Promise<Menu | undefined>;
  getMenuByName(name: string): Promise<Menu | undefined>;
  getMenuByLocation(location: string): Promise<Menu | undefined>;
  listMenus(active?: boolean): Promise<Menu[]>;
  createMenu(menu: InsertMenu): Promise<Menu>;
  updateMenu(id: number, menu: Partial<InsertMenu>): Promise<Menu | undefined>;
  deleteMenu(id: number): Promise<boolean>;
  
  // Menu Item methods
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  listMenuItems(menuId: number, active?: boolean): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
  
  // Transport Locations methods
  getTransportLocation(id: number): Promise<TransportLocation | undefined>;
  listTransportLocations(): Promise<TransportLocation[]>;
  createTransportLocation(location: InsertTransportLocation): Promise<TransportLocation>;
  updateTransportLocation(id: number, location: Partial<InsertTransportLocation>): Promise<TransportLocation | undefined>;
  deleteTransportLocation(id: number): Promise<boolean>;
  
  // Transport Durations methods
  getTransportDuration(id: number): Promise<TransportDuration | undefined>;
  listTransportDurations(): Promise<TransportDuration[]>;
  createTransportDuration(duration: InsertTransportDuration): Promise<TransportDuration>;
  updateTransportDuration(id: number, duration: Partial<InsertTransportDuration>): Promise<TransportDuration | undefined>;
  deleteTransportDuration(id: number): Promise<boolean>;
  
  // Transportation methods
  getTransportation(id: number): Promise<Transportation | undefined>;
  listTransportation(featured?: boolean): Promise<Transportation[]>;
  getTransportationByDestination(destinationId: number): Promise<Transportation[]>;
  createTransportation(transport: InsertTransportation): Promise<Transportation>;
  updateTransportation(id: number, transport: Partial<InsertTransportation>): Promise<Transportation | undefined>;
  deleteTransportation(id: number): Promise<boolean>;
  
  // Booking methods
  getBooking(id: number): Promise<Booking | undefined>;
  listBookingsByUser(userId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  
  // Translation methods
  getTranslation(id: number): Promise<Translation | undefined>;
  getTranslationByKey(key: string): Promise<Translation | undefined>;
  listTranslations(category?: string): Promise<Translation[]>;
  createTranslation(translation: InsertTranslation): Promise<Translation>;
  updateTranslation(id: number, translation: Partial<InsertTranslation>): Promise<Translation | undefined>;
  deleteTranslation(id: number): Promise<boolean>;
  
  // Site Language Settings methods
  getSiteLanguageSettings(): Promise<SiteLanguageSetting | undefined>;
  updateSiteLanguageSettings(settings: Partial<InsertSiteLanguageSetting>): Promise<SiteLanguageSetting | undefined>;
  
  // Favorites methods
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, destinationId: number): Promise<boolean>;
  listUserFavorites(userId: number): Promise<Destination[]>;
  checkIsFavorite(userId: number, destinationId: number): Promise<boolean>;
  
  // Dictionary methods
  getDictionaryEntry(id: number): Promise<DictionaryEntry | undefined>;
  getDictionaryEntryByWord(word: string): Promise<DictionaryEntry | undefined>;
  listDictionaryEntries(): Promise<DictionaryEntry[]>;
  searchDictionaryEntries(term: string): Promise<DictionaryEntry[]>;
  createDictionaryEntry(entry: InsertDictionaryEntry): Promise<DictionaryEntry>;
  updateDictionaryEntry(id: number, entry: Partial<InsertDictionaryEntry>): Promise<DictionaryEntry | undefined>;
  deleteDictionaryEntry(id: number): Promise<boolean>;
  
  // Tour Category methods
  getTourCategory(id: number): Promise<TourCategory | undefined>;
  listTourCategories(active?: boolean): Promise<TourCategory[]>;
  createTourCategory(category: InsertTourCategory): Promise<TourCategory>;
  updateTourCategory(id: number, category: Partial<InsertTourCategory>): Promise<TourCategory | undefined>;
  deleteTourCategory(id: number): Promise<boolean>;
  
  // Hotel Category methods
  getHotelCategory(id: number): Promise<HotelCategory | undefined>;
  listHotelCategories(active?: boolean): Promise<HotelCategory[]>;
  createHotelCategory(category: InsertHotelCategory): Promise<HotelCategory>;
  updateHotelCategory(id: number, category: Partial<InsertHotelCategory>): Promise<HotelCategory | undefined>;
  deleteHotelCategory(id: number): Promise<boolean>;
  
  // Room Category methods
  getRoomCategory(id: number): Promise<RoomCategory | undefined>;
  listRoomCategories(active?: boolean): Promise<RoomCategory[]>;
  createRoomCategory(category: InsertRoomCategory): Promise<RoomCategory>;
  updateRoomCategory(id: number, category: Partial<InsertRoomCategory>): Promise<RoomCategory | undefined>;
  deleteRoomCategory(id: number): Promise<boolean>;
  
  // Package Category methods
  getPackageCategory(id: number): Promise<PackageCategory | undefined>;
  listPackageCategories(active?: boolean): Promise<PackageCategory[]>;
  createPackageCategory(category: InsertPackageCategory): Promise<PackageCategory>;
  updatePackageCategory(id: number, category: Partial<InsertPackageCategory>): Promise<PackageCategory | undefined>;
  deletePackageCategory(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.Store;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  
  // ===================== Nationality =====================
  async getNationality(id: number): Promise<Nationality | undefined> {
    const [nationality] = await db.select().from(nationalities).where(eq(nationalities.id, id));
    return nationality;
  }

  async listNationalities(active?: boolean): Promise<Nationality[]> {
    if (active !== undefined) {
      return db.select().from(nationalities).where(eq(nationalities.active, active));
    }
    return db.select().from(nationalities);
  }

  async createNationality(data: InsertNationality): Promise<Nationality> {
    const [newNationality] = await db.insert(nationalities).values(data).returning();
    return newNationality;
  }

  async updateNationality(id: number, data: Partial<InsertNationality>): Promise<Nationality | undefined> {
    const [updatedNationality] = await db.update(nationalities)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(nationalities.id, id))
      .returning();
    return updatedNationality;
  }

  async deleteNationality(id: number): Promise<boolean> {
    try {
      await db.delete(nationalities).where(eq(nationalities.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting nationality:', error);
      return false;
    }
  }
  
  // ===================== Visa =====================
  async getVisa(id: number): Promise<Visa | undefined> {
    const [visa] = await db.select().from(visas).where(eq(visas.id, id));
    return visa;
  }

  async listVisas(active?: boolean): Promise<Visa[]> {
    if (active !== undefined) {
      return db.select().from(visas).where(eq(visas.active, active));
    }
    return db.select().from(visas);
  }

  async getVisasByCountry(countryId: number): Promise<Visa[]> {
    return db.select().from(visas).where(eq(visas.targetCountryId, countryId));
  }

  async createVisa(data: InsertVisa): Promise<Visa> {
    const [newVisa] = await db.insert(visas).values(data).returning();
    return newVisa;
  }

  async updateVisa(id: number, data: Partial<InsertVisa>): Promise<Visa | undefined> {
    const [updatedVisa] = await db.update(visas)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(visas.id, id))
      .returning();
    return updatedVisa;
  }

  async deleteVisa(id: number): Promise<boolean> {
    try {
      await db.delete(visas).where(eq(visas.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting visa:', error);
      return false;
    }
  }
  
  // ===================== Nationality Visa Requirements =====================
  async getNationalityVisaRequirement(id: number): Promise<NationalityVisaRequirement | undefined> {
    const [requirement] = await db.select().from(nationalityVisaRequirements).where(eq(nationalityVisaRequirements.id, id));
    return requirement;
  }

  async getNationalityVisaRequirementByVisaAndNationality(visaId: number, nationalityId: number): Promise<NationalityVisaRequirement | undefined> {
    const [requirement] = await db.select().from(nationalityVisaRequirements)
      .where(and(
        eq(nationalityVisaRequirements.visaId, visaId),
        eq(nationalityVisaRequirements.nationalityId, nationalityId)
      ));
    return requirement;
  }

  async listNationalityVisaRequirements(visaId?: number, nationalityId?: number): Promise<NationalityVisaRequirement[]> {
    let query = db.select().from(nationalityVisaRequirements);
    
    if (visaId !== undefined && nationalityId !== undefined) {
      query = query.where(and(
        eq(nationalityVisaRequirements.visaId, visaId),
        eq(nationalityVisaRequirements.nationalityId, nationalityId)
      ));
    } else if (visaId !== undefined) {
      query = query.where(eq(nationalityVisaRequirements.visaId, visaId));
    } else if (nationalityId !== undefined) {
      query = query.where(eq(nationalityVisaRequirements.nationalityId, nationalityId));
    }
    
    return query;
  }

  async createNationalityVisaRequirement(data: InsertNationalityVisaRequirement): Promise<NationalityVisaRequirement> {
    const [newRequirement] = await db.insert(nationalityVisaRequirements).values(data).returning();
    return newRequirement;
  }

  async updateNationalityVisaRequirement(id: number, data: Partial<InsertNationalityVisaRequirement>): Promise<NationalityVisaRequirement | undefined> {
    const [updatedRequirement] = await db.update(nationalityVisaRequirements)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(nationalityVisaRequirements.id, id))
      .returning();
    return updatedRequirement;
  }

  async deleteNationalityVisaRequirement(id: number): Promise<boolean> {
    try {
      await db.delete(nationalityVisaRequirements).where(eq(nationalityVisaRequirements.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting nationality visa requirement:', error);
      return false;
    }
  }
  sessionStore = new (MemoryStore(session))({
    checkPeriod: 86400000 // prune expired entries every 24h
  });

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async listUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db.update(users)
      .set({...userData, updatedAt: new Date()})
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      await db.delete(users).where(eq(users.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }

  // Hotel Facilities methods
  async listHotelFacilities(): Promise<any[]> {
    return await db.query.hotelFacilities.findMany();
  }

  async getHotelFacility(id: number): Promise<any | undefined> {
    return await db.query.hotelFacilities.findFirst({
      where: eq(hotelFacilities.id, id)
    });
  }

  async createHotelFacility(facility: any): Promise<any> {
    const [newFacility] = await db.insert(hotelFacilities).values(facility).returning();
    return newFacility;
  }

  async updateHotelFacility(id: number, facility: any): Promise<any | undefined> {
    const [updatedFacility] = await db.update(hotelFacilities)
      .set({...facility, updatedAt: new Date()})
      .where(eq(hotelFacilities.id, id))
      .returning();
    return updatedFacility;
  }

  async deleteHotelFacility(id: number): Promise<boolean> {
    try {
      await db.delete(hotelFacilities).where(eq(hotelFacilities.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting hotel facility:", error);
      return false;
    }
  }

  // Hotel Highlights methods
  async listHotelHighlights(): Promise<any[]> {
    return await db.query.hotelHighlights.findMany();
  }

  async getHotelHighlight(id: number): Promise<any | undefined> {
    return await db.query.hotelHighlights.findFirst({
      where: eq(hotelHighlights.id, id)
    });
  }

  async createHotelHighlight(highlight: any): Promise<any> {
    const [newHighlight] = await db.insert(hotelHighlights).values(highlight).returning();
    return newHighlight;
  }

  async updateHotelHighlight(id: number, highlight: any): Promise<any | undefined> {
    const [updatedHighlight] = await db.update(hotelHighlights)
      .set({...highlight, updatedAt: new Date()})
      .where(eq(hotelHighlights.id, id))
      .returning();
    return updatedHighlight;
  }

  async deleteHotelHighlight(id: number): Promise<boolean> {
    try {
      await db.delete(hotelHighlights).where(eq(hotelHighlights.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting hotel highlight:", error);
      return false;
    }
  }

  // Cleanliness Features methods
  async listCleanlinessFeatures(): Promise<any[]> {
    return await db.query.cleanlinessFeatures.findMany();
  }

  async getCleanlinessFeature(id: number): Promise<any | undefined> {
    return await db.query.cleanlinessFeatures.findFirst({
      where: eq(cleanlinessFeatures.id, id)
    });
  }

  async createCleanlinessFeature(feature: any): Promise<any> {
    const [newFeature] = await db.insert(cleanlinessFeatures).values(feature).returning();
    return newFeature;
  }

  async updateCleanlinessFeature(id: number, feature: any): Promise<any | undefined> {
    const [updatedFeature] = await db.update(cleanlinessFeatures)
      .set({...feature, updatedAt: new Date()})
      .where(eq(cleanlinessFeatures.id, id))
      .returning();
    return updatedFeature;
  }

  async deleteCleanlinessFeature(id: number): Promise<boolean> {
    try {
      await db.delete(cleanlinessFeatures).where(eq(cleanlinessFeatures.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting cleanliness feature:", error);
      return false;
    }
  }
  // Tour Category methods
  async getTourCategory(id: number): Promise<TourCategory | undefined> {
    return await db.query.tourCategories.findFirst({
      where: eq(tourCategories.id, id)
    });
  }

  async listTourCategories(active?: boolean): Promise<TourCategory[]> {
    if (active !== undefined) {
      return await db.query.tourCategories.findMany({
        where: eq(tourCategories.active, active)
      });
    }
    return await db.query.tourCategories.findMany();
  }

  async createTourCategory(category: InsertTourCategory): Promise<TourCategory> {
    const [newCategory] = await db.insert(tourCategories).values(category).returning();
    return newCategory;
  }

  async updateTourCategory(id: number, category: Partial<InsertTourCategory>): Promise<TourCategory | undefined> {
    const [updatedCategory] = await db.update(tourCategories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(tourCategories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteTourCategory(id: number): Promise<boolean> {
    try {
      await db.delete(tourCategories).where(eq(tourCategories.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting tour category:', error);
      return false;
    }
  }

  // Hotel Category methods
  async getHotelCategory(id: number): Promise<HotelCategory | undefined> {
    return await db.query.hotelCategories.findFirst({
      where: eq(hotelCategories.id, id)
    });
  }

  async listHotelCategories(active?: boolean): Promise<HotelCategory[]> {
    if (active !== undefined) {
      return await db.query.hotelCategories.findMany({
        where: eq(hotelCategories.active, active)
      });
    }
    return await db.query.hotelCategories.findMany();
  }

  async createHotelCategory(category: InsertHotelCategory): Promise<HotelCategory> {
    const [newCategory] = await db.insert(hotelCategories).values(category).returning();
    return newCategory;
  }

  async updateHotelCategory(id: number, category: Partial<InsertHotelCategory>): Promise<HotelCategory | undefined> {
    const [updatedCategory] = await db.update(hotelCategories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(hotelCategories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteHotelCategory(id: number): Promise<boolean> {
    try {
      await db.delete(hotelCategories).where(eq(hotelCategories.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting hotel category:', error);
      return false;
    }
  }

  // Room Category methods
  async getRoomCategory(id: number): Promise<RoomCategory | undefined> {
    return await db.query.roomCategories.findFirst({
      where: eq(roomCategories.id, id)
    });
  }

  async listRoomCategories(active?: boolean): Promise<RoomCategory[]> {
    if (active !== undefined) {
      return await db.query.roomCategories.findMany({
        where: eq(roomCategories.active, active)
      });
    }
    return await db.query.roomCategories.findMany();
  }

  async createRoomCategory(category: InsertRoomCategory): Promise<RoomCategory> {
    const [newCategory] = await db.insert(roomCategories).values(category).returning();
    return newCategory;
  }

  async updateRoomCategory(id: number, category: Partial<InsertRoomCategory>): Promise<RoomCategory | undefined> {
    const [updatedCategory] = await db.update(roomCategories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(roomCategories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteRoomCategory(id: number): Promise<boolean> {
    try {
      await db.delete(roomCategories).where(eq(roomCategories.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting room category:', error);
      return false;
    }
  }

  // Package Category methods
  async getPackageCategory(id: number): Promise<PackageCategory | undefined> {
    return await db.query.packageCategories.findFirst({
      where: eq(packageCategories.id, id)
    });
  }

  async listPackageCategories(active?: boolean): Promise<PackageCategory[]> {
    if (active !== undefined) {
      return await db.query.packageCategories.findMany({
        where: eq(packageCategories.active, active)
      });
    }
    return await db.query.packageCategories.findMany();
  }

  async createPackageCategory(category: InsertPackageCategory): Promise<PackageCategory> {
    const [newCategory] = await db.insert(packageCategories).values(category).returning();
    return newCategory;
  }

  async updatePackageCategory(id: number, category: Partial<InsertPackageCategory>): Promise<PackageCategory | undefined> {
    const [updatedCategory] = await db.update(packageCategories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(packageCategories.id, id))
      .returning();
    return updatedCategory;
  }

  async deletePackageCategory(id: number): Promise<boolean> {
    try {
      await db.delete(packageCategories).where(eq(packageCategories.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting package category:', error);
      return false;
    }
  }
  private users: User[] = [];
  private countries: Country[] = [];
  private cities: City[] = [];
  private airports: Airport[] = [];
  private destinations: Destination[] = [];
  private packages: Package[] = [];
  private bookings: Booking[] = [];
  private favorites: Favorite[] = [];
  private tours: Tour[] = [];
  private hotels: Hotel[] = [];
  private rooms: Room[] = [];
  private roomCombinations: RoomCombination[] = [];
  private transportTypes: TransportType[] = [];
  private transportLocations: TransportLocation[] = [];
  private transportDurations: TransportDuration[] = [];
  private transportations: Transportation[] = [];
  private translations: Translation[] = [];
  private siteLanguageSettings: SiteLanguageSetting[] = [];
  // Categories
  private tourCategories: TourCategory[] = [];
  private hotelCategories: HotelCategory[] = [];
  private roomCategories: RoomCategory[] = [];
  private packageCategories: PackageCategory[] = [];
  sessionStore: session.Store;

  constructor() {
    const MemoryStoreClass = MemoryStore(session);
    this.sessionStore = new MemoryStoreClass({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize with sample data if needed
    this.initSampleData();
  }

  private initSampleData() {
    // Add sample transport types
    if (this.transportTypes.length === 0) {
      this.transportTypes.push({
        id: 1,
        name: 'Car',
        description: 'Standard private car for airport transfers and city tours',
        passengerCapacity: 4,
        baggageCapacity: 3,
        imageUrl: 'https://images.unsplash.com/photo-1597404294360-feeeda04612e',
        defaultFeatures: ["Air conditioning", "Comfortable seats", "Luggage space"],
        status: 'active',
        createdAt: new Date(),
        updatedAt: null
      });
      
      this.transportTypes.push({
        id: 2,
        name: 'Van',
        description: 'Spacious van perfect for families or small groups',
        passengerCapacity: 8,
        baggageCapacity: 8,
        imageUrl: 'https://images.unsplash.com/photo-1624515005205-41d38cf2ca8d',
        defaultFeatures: ["Large seating area", "Air conditioning", "Luggage space"],
        status: 'active',
        createdAt: new Date(),
        updatedAt: null
      });
      
      this.transportTypes.push({
        id: 3,
        name: 'Boat',
        description: 'Scenic river boats for cruising and sightseeing',
        passengerCapacity: 12,
        baggageCapacity: 10,
        imageUrl: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16',
        defaultFeatures: ["Life jackets", "Open deck", "Cabin"],
        status: 'active',
        createdAt: new Date(),
        updatedAt: null
      });
      
      this.transportTypes.push({
        id: 4,
        name: 'Jeep',
        description: 'Rugged 4x4 vehicles for desert and mountain adventures',
        passengerCapacity: 5,
        baggageCapacity: 3,
        imageUrl: 'https://images.unsplash.com/photo-1630150275481-d54a9557aff9',
        defaultFeatures: ["4x4 drive", "Off-road tires", "Air conditioning"],
        status: 'active',
        createdAt: new Date(),
        updatedAt: null
      });
      
      this.transportTypes.push({
        id: 5,
        name: 'Yacht',
        description: 'Luxury yachts for coastal excursions and sea adventures',
        passengerCapacity: 10,
        baggageCapacity: 15,
        imageUrl: 'https://images.unsplash.com/photo-1588913290805-98799acdf363',
        defaultFeatures: ["Sun deck", "Cabin", "Bathroom", "Kitchen"],
        status: 'active',
        createdAt: new Date(),
        updatedAt: null
      });
    }
    
    // Add sample transport locations
    if (this.transportLocations.length === 0) {
      this.transportLocations.push({
        id: 1,
        name: 'Cairo International Airport',
        city: 'Cairo',
        country: 'Egypt',
        locationType: 'Airport',
        description: 'Main international airport serving Cairo',
        imageUrl: 'https://images.unsplash.com/photo-1547146613-29646c7f785e',
        popular: true,
        latitude: 30.1111,
        longitude: 31.4139,
        status: 'active',
        createdAt: new Date(),
        updatedAt: null
      });
      
      this.transportLocations.push({
        id: 2,
        name: 'Cairo City Center',
        city: 'Cairo',
        country: 'Egypt',
        locationType: 'Urban',
        description: 'Downtown Cairo, the heart of the city',
        imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a',
        popular: true,
        latitude: 30.0444,
        longitude: 31.2357,
        status: 'active',
        createdAt: new Date(),
        updatedAt: null
      });
      
      this.transportLocations.push({
        id: 3,
        name: 'Giza Pyramids',
        city: 'Giza',
        country: 'Egypt',
        locationType: 'Attraction',
        description: 'Home to the Great Pyramids and Sphinx',
        imageUrl: 'https://images.unsplash.com/photo-1601043263565-00e458e73a1c',
        popular: true,
        latitude: 29.9792,
        longitude: 31.1342,
        status: 'active',
        createdAt: new Date(),
        updatedAt: null
      });
      
      this.transportLocations.push({
        id: 4,
        name: 'Sharm El Sheikh Airport',
        city: 'Sharm El Sheikh',
        country: 'Egypt',
        locationType: 'Airport',
        description: 'International airport serving the Red Sea resorts',
        imageUrl: 'https://images.unsplash.com/photo-1611368364106-06c1c328a132',
        popular: true,
        latitude: 27.9772,
        longitude: 34.3844,
        status: 'active',
        createdAt: new Date(),
        updatedAt: null
      });
      
      this.transportLocations.push({
        id: 5,
        name: 'Sharm El Sheikh Marina',
        city: 'Sharm El Sheikh',
        country: 'Egypt',
        locationType: 'Port',
        description: 'Marina for boats and yachts in Sharm El Sheikh',
        imageUrl: 'https://images.unsplash.com/photo-1589308247424-d591f0c4a1d6',
        popular: true,
        latitude: 27.8578,
        longitude: 34.3053,
        status: 'active',
        createdAt: new Date(),
        updatedAt: null
      });
      
      this.transportLocations.push({
        id: 6,
        name: 'Petra Visitor Center',
        city: 'Wadi Musa',
        country: 'Jordan',
        locationType: 'Attraction',
        description: 'Starting point for Petra visits',
        imageUrl: 'https://images.unsplash.com/photo-1563177978-4c518ed7ce48',
        popular: true,
        latitude: 30.3221,
        longitude: 35.4793,
        status: 'active',
        createdAt: new Date(),
        updatedAt: null
      });
    }
    
    // Add sample transport durations
    if (this.transportDurations.length === 0) {
      this.transportDurations.push({
        id: 1,
        name: 'Short Transfer',
        hours: 1,
        description: 'Quick transfers under one hour',
        status: 'active',
        createdAt: new Date(),
        updatedAt: null
      });
      
      this.transportDurations.push({
        id: 2,
        name: 'Half-Day',
        hours: 4,
        description: 'Perfect for a morning or afternoon excursion',
        status: 'active',
        createdAt: new Date(),
        updatedAt: null
      });
      
      this.transportDurations.push({
        id: 3,
        name: 'Full-Day',
        hours: 8,
        description: 'Comprehensive full-day experience',
        status: 'active',
        createdAt: new Date(),
        updatedAt: null
      });
      
      this.transportDurations.push({
        id: 4,
        name: 'Extended Journey',
        hours: 12,
        description: 'Long-distance travel between destinations',
        status: 'active',
        createdAt: new Date(),
        updatedAt: null
      });
    }
    
    // Add sample destinations if not already present
    if (this.destinations.length === 0) {
      this.destinations.push({
        id: 1,
        name: 'Cairo',
        country: 'Egypt',
        description: 'The vibrant capital city of Egypt, home to ancient wonders and modern attractions.',
        imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a',
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      this.destinations.push({
        id: 2,
        name: 'Sharm El Sheikh',
        country: 'Egypt',
        description: 'A beautiful resort town on the Red Sea coast, known for its stunning beaches and coral reefs.',
        imageUrl: 'https://images.unsplash.com/photo-1559472944-8baf80b39e90',
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      this.destinations.push({
        id: 3,
        name: 'Petra',
        country: 'Jordan',
        description: 'An ancient city and archaeological site famous for its rock-cut architecture.',
        imageUrl: 'https://images.unsplash.com/photo-1563177978-4c518ed7ce48',
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Add transportation options
    this.transportations.push({
      id: 1,
      name: 'Private Airport Transfer',
      typeId: 1, // Car
      description: 'Comfortable private car service from Cairo International Airport to your hotel in the city center.',
      destinationId: 1, // Cairo
      fromLocationId: 1, // Cairo Airport
      toLocationId: 2, // Cairo City Center
      durationId: 1, // Short Transfer
      price: 45,
      discountedPrice: 39,
      imageUrl: 'https://images.unsplash.com/photo-1597404294360-feeeda04612e',
      passengerCapacity: 4,
      baggageCapacity: 3,
      features: ["Air conditioning", "Free Wi-Fi", "Bottled water", "Professional driver", "From Cairo Airport to city center"],
      withDriver: true,
      available: true,
      pickupIncluded: true,
      featured: true,
      rating: 4.8,
      reviewCount: 325,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    this.transportations.push({
      id: 2,
      name: 'Luxury Nile River Boat',
      typeId: 3, // Boat
      description: 'Scenic river transportation along the Nile with panoramic views of Cairo, from Cairo Nile Docks to Giza River Port.',
      destinationId: 1, // Cairo
      fromLocationId: 2, // Cairo City Center
      toLocationId: 3, // Giza Pyramids
      durationId: 2, // Medium duration
      price: 75,
      discountedPrice: 65,
      imageUrl: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16',
      passengerCapacity: 12,
      baggageCapacity: 8,
      features: ["Open deck", "Refreshments", "Tour guide", "Sunset views", "2-hour Nile cruise"],
      withDriver: true,
      available: true,
      pickupIncluded: true,
      featured: true,
      rating: 4.9,
      reviewCount: 187,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    this.transportations.push({
      id: 3,
      name: 'Bedouin Jeep Safari',
      typeId: 4, // Jeep
      description: 'Exciting desert transportation with 4x4 jeeps in the Sinai Desert near Sharm El Sheikh. Includes pickup from hotels.',
      destinationId: 2, // Sharm El Sheikh
      fromLocationId: 4, // Sharm El Sheikh Airport
      toLocationId: 5, // Sharm El Sheikh Marina
      durationId: 3, // Long duration
      price: 65,
      discountedPrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1630150275481-d54a9557aff9',
      passengerCapacity: 6,
      baggageCapacity: 4,
      features: ["Off-road experience", "Bedouin guide", "Sunset views", "Photo stops", "4-hour adventure"],
      withDriver: true,
      available: true,
      pickupIncluded: true,
      featured: true,
      rating: 4.7,
      reviewCount: 213,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    this.transportations.push({
      id: 4,
      name: 'Petra Horse Carriage',
      typeId: 1, // Car (using Car type as placeholder since we don't have a carriage type)
      description: 'Traditional horse carriage ride through the Siq to the Treasury at Petra. Starts at Petra Visitor Center.',
      destinationId: 3, // Petra
      fromLocationId: 6, // Petra Visitor Center
      toLocationId: 6, // Petra Visitor Center (round trip)
      durationId: 1, // Short duration
      price: 35,
      discountedPrice: 30,
      imageUrl: 'https://images.unsplash.com/photo-1603380680631-5a689c1d7aba',
      passengerCapacity: 4,
      baggageCapacity: 2,
      features: ["Traditional experience", "Local guide", "Photo opportunities", "30-minute ride"],
      withDriver: true,
      available: true,
      pickupIncluded: false,
      featured: true,
      rating: 4.6,
      reviewCount: 156,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    this.transportations.push({
      id: 5,
      name: 'Luxury Charter Yacht',
      typeId: 5, // Yacht
      description: 'Private yacht charter for exploring the Red Sea coast from Sharm El Sheikh. Full-day experience departing from Sharm El Sheikh Marina.',
      destinationId: 2, // Sharm El Sheikh
      fromLocationId: 5, // Sharm El Sheikh Marina
      toLocationId: 5, // Sharm El Sheikh Marina (round trip)
      durationId: 3, // Long duration
      price: 350,
      discountedPrice: 299,
      imageUrl: 'https://images.unsplash.com/photo-1588913290805-98799acdf363',
      passengerCapacity: 10,
      baggageCapacity: 6,
      features: ["Captain and crew", "Snorkeling equipment", "Lunch and drinks", "Music system", "Sun deck", "8-hour cruise"],
      withDriver: true,
      available: true,
      pickupIncluded: true,
      featured: true,
      rating: 4.9,
      reviewCount: 87,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Add admin user
    this.users.push({
      id: 1,
      username: 'admin',
      // Format: hash.salt (password: 'password')
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8.a1b2c3d4e5f6g7h8i9j0',
      email: 'admin@example.com',
      displayName: null,
      firstName: null,
      lastName: null,
      phoneNumber: null,
      fullName: 'Admin User',
      role: 'admin',
      bio: 'System administrator',
      avatarUrl: null,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Add test user
    this.users.push({
      id: 2,
      username: 'testadmin',
      // Format: hash.salt (password: 'test123')
      password: '935f6333b23d5f62ccbfa35dbe3a4b5e5bd06350c1060d9e9603b0dc347a5458.b1c2d3e4f5g6h7i8j9k0',
      email: 'test@example.com',
      displayName: 'Test Admin',
      firstName: 'Test',
      lastName: 'Admin',
      phoneNumber: '+1234567890',
      fullName: 'Test Admin User',
      role: 'admin',
      bio: 'Test admin account for development',
      avatarUrl: null,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Add regular user
    this.users.push({
      id: 3,
      username: 'user',
      // Format: hash.salt (password: 'user123')
      password: '2c6b6ef0854860a7ee5add529129fe1f4bb32dcbeaa28954516c4517f67f8ca8.c1d2e3f4g5h6i7j8k9l0',
      email: 'user@example.com',
      displayName: 'Regular User',
      firstName: 'Regular',
      lastName: 'User',
      phoneNumber: null,
      fullName: 'Regular User',
      role: 'user',
      bio: 'A regular user account',
      avatarUrl: null,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Add sample hotels
    this.hotels.push({
      id: 1,
      name: 'Nile Ritz-Carlton',
      description: 'Luxury hotel with stunning Nile River views in the heart of Cairo.',
      destinationId: 1, // Cairo
      address: '1113 Corniche El Nil',
      city: 'Cairo',
      country: 'Egypt',
      postalCode: '11221',
      phone: '+20 2 25778899',
      email: 'info@nilecairo.com',
      website: 'https://www.ritzcarlton.com/cairo',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      stars: 5,
      amenities: ["Swimming Pool", "Spa", "Fitness Center", "Free WiFi", "Airport Shuttle"],
      checkInTime: '15:00',
      checkOutTime: '12:00',
      longitude: 31.2357,
      latitude: 30.0444,
      featured: true,
      rating: 4.8,
      reviewCount: 456,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    this.hotels.push({
      id: 2,
      name: 'Mövenpick Resort Sharm El Sheikh',
      description: 'Luxury resort overlooking Naama Bay with private beach access.',
      destinationId: 2, // Sharm El Sheikh
      address: 'Naama Bay',
      city: 'Sharm El Sheikh',
      country: 'Egypt',
      postalCode: '46619',
      phone: '+20 69 3600100',
      email: 'resort.sharm@movenpick.com',
      website: 'https://www.movenpick.com/sharm',
      imageUrl: 'https://images.unsplash.com/photo-1580977276076-ae4b8c219b8e',
      stars: 5,
      amenities: ["Private Beach", "Swimming Pools", "Spa", "Water Sports", "Kids Club"],
      checkInTime: '14:00',
      checkOutTime: '12:00',
      longitude: 34.3279,
      latitude: 27.9158,
      featured: true,
      rating: 4.7,
      reviewCount: 874,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    this.hotels.push({
      id: 3,
      name: 'Petra Marriott Hotel',
      description: 'Overlooking the spectacular Petra Valley, this hotel combines traditional hospitality with modern amenities.',
      destinationId: 3, // Petra
      address: 'Queen Rania Street',
      city: 'Wadi Musa',
      country: 'Jordan',
      postalCode: '71811',
      phone: '+962 3 215 6407',
      email: 'petra.reservations@marriott.com',
      website: 'https://www.marriott.com/petra',
      imageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2',
      stars: 5,
      amenities: ["Mountain View", "Restaurant", "Fitness Center", "Spa", "Free Parking"],
      checkInTime: '15:00',
      checkOutTime: '12:00',
      longitude: 35.4788,
      latitude: 30.3224,
      featured: true,
      rating: 4.6,
      reviewCount: 320,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Add sample rooms
    this.rooms.push({
      id: 1,
      name: 'Deluxe King Room',
      description: 'Spacious room with king-sized bed and Nile view',
      hotelId: 1, // Nile Ritz-Carlton
      locationType: 'Deluxe',
      maxOccupancy: 2,
      maxAdults: 2,
      maxChildren: 1,
      maxInfants: 1,
      price: 250,
      discountedPrice: 225,
      imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
      size: '45m²',
      bedType: 'King',
      amenities: ["Free WiFi", "Air Conditioning", "Minibar", "Safe", "Flat-screen TV"],
      view: 'Nile River',
      available: true,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    this.rooms.push({
      id: 2,
      name: 'Executive Suite',
      description: 'Luxury suite with separate living area and panoramic views',
      hotelId: 1, // Nile Ritz-Carlton
      locationType: 'Suite',
      maxOccupancy: 3,
      maxAdults: 2,
      maxChildren: 2,
      maxInfants: 1,
      price: 450,
      discountedPrice: 405,
      imageUrl: 'https://images.unsplash.com/photo-1591088398332-8a7791972843',
      size: '75m²',
      bedType: 'King',
      amenities: ["Free WiFi", "Air Conditioning", "Minibar", "Safe", "Flat-screen TV", "Lounge Access", "Butler Service"],
      view: 'Nile River and City',
      available: true,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    this.rooms.push({
      id: 3,
      name: 'Sea View Double Room',
      description: 'Comfortable room with a terrace overlooking the Red Sea',
      hotelId: 2, // Mövenpick Resort
      locationType: 'Standard',
      maxOccupancy: 2,
      maxAdults: 2,
      maxChildren: 1,
      maxInfants: 1,
      price: 180,
      discountedPrice: 162,
      imageUrl: 'https://images.unsplash.com/photo-1562438668-bcf0ca6578f0',
      size: '38m²',
      bedType: 'Queen',
      amenities: ["Free WiFi", "Air Conditioning", "Minibar", "Balcony", "Flat-screen TV"],
      view: 'Sea View',
      available: true,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    this.rooms.push({
      id: 4,
      name: 'Mountain View Room',
      description: 'Room with spectacular views of the Petra mountains',
      hotelId: 3, // Petra Marriott
      locationType: 'Standard',
      maxOccupancy: 2,
      maxAdults: 2,
      maxChildren: 1,
      maxInfants: 0,
      price: 150,
      discountedPrice: 135,
      imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
      size: '40m²',
      bedType: 'King',
      amenities: ["Free WiFi", "Air Conditioning", "Minibar", "Safe", "Flat-screen TV"],
      view: 'Mountain View',
      available: true,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Add sample tours
    this.tours.push({
      id: 1,
      name: 'Pyramids and Sphinx Tour with Premium Transportation',
      description: 'Discover the ancient wonders of Egypt with a guided tour of the Pyramids of Giza and the Great Sphinx. Includes comfortable private transportation and expert guides.',
      imageUrl: 'https://images.unsplash.com/photo-1503177847378-d2079072a621',
      destinationId: 1, // Cairo
      duration: 6,
      price: 95,
      discountedPrice: 85,
      included: [
        "Guided tour by certified Egyptologist", 
        "Entrance fees to all attractions", 
        "Premium air-conditioned private car service",
        "Hotel pickup and drop-off included",
        "Bottled water and refreshments"
      ],
      excluded: ["Gratuities", "Lunch (optional at local restaurant)"],
      itinerary: "09:00 - Luxury car pickup from your hotel\n09:45 - Arrival at Giza Plateau\n10:00 - Guided tour of the Great Pyramids\n12:30 - Lunch break at local restaurant (optional)\n14:00 - The Great Sphinx tour\n15:30 - Visit the Valley Temple\n16:30 - Return to hotel in comfort",
      maxGroupSize: 10,
      featured: true,
      rating: 4.9,
      status: 'active',
      reviewCount: 288,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    this.tours.push({
      id: 2,
      name: 'Red Sea Snorkeling Adventure with Luxury Yacht Transportation',
      description: 'Explore the vibrant underwater world of the Red Sea with a full-day snorkeling trip from Sharm El Sheikh aboard a premium yacht with all amenities.',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
      destinationId: 2, // Sharm El Sheikh
      duration: 8,
      price: 150,
      discountedPrice: 130,
      included: [
        "Modern yacht transportation with sun deck",
        "Professional captain and crew",
        "Premium snorkeling equipment",
        "Gourmet lunch served onboard",
        "Unlimited soft drinks and bottled water",
        "Marine life expert guide",
        "Luxury hotel transfers in air-conditioned vehicles"
      ],
      excluded: ["Gratuities", "Professional underwater photography (optional add-on)"],
      itinerary: "08:00 - Luxury minivan pickup from hotel\n08:45 - Arrival at Sharm El Sheikh Marina\n09:00 - Yacht departure with welcome refreshments\n09:45 - First premium snorkeling location\n11:30 - Second snorkeling spot at coral gardens\n13:00 - Gourmet lunch served on yacht\n14:30 - Third exclusive snorkeling location\n16:00 - Return cruise to marina with refreshments\n17:00 - Hotel drop-off in comfort",
      maxGroupSize: 8,
      featured: true,
      rating: 4.9,
      status: 'active',
      reviewCount: 203,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    this.tours.push({
      id: 3,
      name: 'Petra by Night Experience with Traditional Carriage',
      description: 'Experience the magic of Petra illuminated by candlelight on this enchanting evening tour featuring traditional horse carriage transport to enhance the atmosphere.',
      imageUrl: 'https://images.unsplash.com/photo-1579606246651-32a0404f4f65',
      destinationId: 3, // Petra
      duration: 4,
      price: 75,
      discountedPrice: 65,
      included: [
        "Entrance fee to Petra by Night event",
        "Expert local guide",
        "Traditional horse carriage transportation",
        "Souvenir candle lantern",
        "Hot Bedouin tea service",
        "Hotel pickup and drop-off in comfort"
      ],
      excluded: [
        "Gratuities (optional)",
        "Professional photography (available as add-on)",
        "Alcoholic beverages"
      ],
      itinerary: "19:00 - Luxury transportation pickup from your hotel\n19:30 - Arrival at Petra Visitor Center\n19:45 - Welcome refreshments and tour briefing\n20:00 - Begin journey through the Siq in traditional horse carriage\n20:30 - Walk the final stretch by candlelight\n21:00 - Arrival at the Treasury for traditional music and storytelling\n22:15 - Tea service and local sweets\n22:45 - Return transportation to hotel",
      maxGroupSize: 12,
      featured: true,
      rating: 4.8,
      status: 'active',
      reviewCount: 156,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Add additional packages including visa, transportation, and flights
    this.packages.push({
      id: 3,
      title: 'Complete Cairo Adventure with Visa Service & Premium Transportation',
      description: 'Experience Cairo with this all-inclusive package that includes visa processing, flights, premium transportation services, and 5-star accommodation.',
      price: 1200,
      duration: 7,
      discountedPrice: 1080,
      imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a',
      rating: 4.8,
      destinationId: 1, // Cairo
      featured: true,
      locationType: 'All-Inclusive',
      inclusions: [
        "Tourist visa processing and fees",
        "Round-trip international flights",
        "Private airport transfers with luxury car service",
        "Nile River boat transportation for sightseeing",
        "6 nights at Nile Ritz-Carlton",
        "Daily breakfast and dinner",
        "Full-day Pyramids and Sphinx tour",
        "Egyptian Museum guided visit",
        "Nile dinner cruise with entertainment",
        "24/7 customer support"
      ],
      reviewCount: 89
    });
    
    this.packages.push({
      id: 4,
      title: 'Sharm El Sheikh Dive Expedition with Transportation',
      description: 'Complete diving package with premium transportation between all activities and luxury beachfront accommodation.',
      price: 950,
      duration: 5,
      discountedPrice: 855,
      imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b',
      rating: 4.9,
      destinationId: 2, // Sharm El Sheikh
      featured: true,
      locationType: 'Adventure',
      inclusions: [
        "Private airport transfers",
        "Daily transportation to dive sites",
        "4 nights at Mövenpick Resort",
        "3 days of diving (2 dives per day)",
        "Full diving equipment",
        "PADI-certified instructor",
        "All meals included",
        "Transportation between all activities"
      ],
      reviewCount: 74
    });
    
    this.packages.push({
      id: 5,
      title: 'Jordan Explorer with Premium Transportation',
      description: 'Comprehensive Jordan tour package including international flights, luxury transportation options, and 5-star accommodation.',
      price: 1600,
      duration: 8,
      discountedPrice: 1440,
      imageUrl: 'https://images.unsplash.com/photo-1549140600-78c9b8275e3d',
      rating: 4.7,
      destinationId: 3, // Petra
      featured: true,
      locationType: 'Cultural',
      inclusions: [
        "Round-trip international flights",
        "Visa processing assistance",
        "Private luxury car transfers",
        "Traditional horse carriage ride in Petra",
        "4x4 Jeep tours in Wadi Rum",
        "7 nights accommodation (3 nights in Petra Marriott)",
        "Daily breakfast and dinner",
        "Guided tour of Petra",
        "Petra by Night experience",
        "Dead Sea excursion",
        "Wadi Rum desert safari"
      ],
      reviewCount: 62
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
  
  async listUsers(): Promise<User[]> {
    return [...this.users];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const now = new Date();
    const newUser: User = {
      id: generateId(this.users),
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email,
      displayName: insertUser.displayName || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      phoneNumber: insertUser.phoneNumber || null,
      fullName: insertUser.fullName || null,
      role: insertUser.role || 'user',
      bio: insertUser.bio || null,
      avatarUrl: insertUser.avatarUrl || null,
      status: insertUser.status || 'active',
      createdAt: now,
      updatedAt: now
    };
    this.users.push(newUser);
    return newUser;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return undefined;
    
    const updatedUser: User = {
      ...this.users[index],
      ...userData,
      updatedAt: new Date()
    };
    this.users[index] = updatedUser;
    return updatedUser;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    return initialLength > this.users.length;
  }
  
  // Country methods
  async getCountry(id: number): Promise<Country | undefined> {
    return this.countries.find(c => c.id === id);
  }
  
  async getCountryByCode(code: string): Promise<Country | undefined> {
    return this.countries.find(c => c.code === code);
  }
  
  async listCountries(active?: boolean): Promise<Country[]> {
    if (active !== undefined) {
      return this.countries.filter(c => c.active === active);
    }
    return [...this.countries];
  }
  
  async createCountry(country: InsertCountry): Promise<Country> {
    const id = generateId(this.countries);
    const now = new Date();
    const newCountry: Country = {
      id,
      ...country,
      createdAt: now,
      updatedAt: now
    };
    this.countries.push(newCountry);
    return newCountry;
  }
  
  async updateCountry(id: number, country: Partial<InsertCountry>): Promise<Country | undefined> {
    const index = this.countries.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    
    const now = new Date();
    const existingCountry = this.countries[index];
    const updatedCountry: Country = {
      ...existingCountry,
      ...country,
      updatedAt: now
    };
    
    this.countries[index] = updatedCountry;
    return updatedCountry;
  }
  
  async deleteCountry(id: number): Promise<boolean> {
    // Check if there are any cities associated with this country
    const hasAssociatedCities = this.cities.some(city => city.countryId === id);
    if (hasAssociatedCities) {
      // Cannot delete a country with associated cities
      return false;
    }
    
    const initialLength = this.countries.length;
    this.countries = this.countries.filter(c => c.id !== id);
    return this.countries.length !== initialLength;
  }
  
  // City methods
  async getCity(id: number): Promise<City | undefined> {
    return this.cities.find(c => c.id === id);
  }
  
  async listCities(active?: boolean): Promise<City[]> {
    if (active !== undefined) {
      return this.cities.filter(c => c.active === active);
    }
    return [...this.cities];
  }
  
  async getCitiesByCountry(countryId: number): Promise<City[]> {
    return this.cities.filter(c => c.countryId === countryId);
  }
  
  async createCity(city: InsertCity): Promise<City> {
    const id = generateId(this.cities);
    const now = new Date();
    const newCity: City = {
      id,
      ...city,
      createdAt: now,
      updatedAt: now
    };
    this.cities.push(newCity);
    return newCity;
  }
  
  async updateCity(id: number, city: Partial<InsertCity>): Promise<City | undefined> {
    const index = this.cities.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    
    const now = new Date();
    const existingCity = this.cities[index];
    const updatedCity: City = {
      ...existingCity,
      ...city,
      updatedAt: now
    };
    
    this.cities[index] = updatedCity;
    return updatedCity;
  }
  
  async deleteCity(id: number): Promise<boolean> {
    // Check if there are any airports associated with this city
    const airportsForCity = this.airports.filter(a => a.cityId === id);
    if (airportsForCity.length > 0) {
      // Cannot delete a city with associated airports
      return false;
    }
    
    const initialLength = this.cities.length;
    this.cities = this.cities.filter(c => c.id !== id);
    return this.cities.length !== initialLength;
  }
  
  // Airport methods
  async getAirport(id: number): Promise<Airport | undefined> {
    return this.airports.find(a => a.id === id);
  }
  
  async listAirports(active?: boolean): Promise<Airport[]> {
    if (active !== undefined) {
      return this.airports.filter(a => a.active === active);
    }
    return [...this.airports];
  }
  
  async getAirportsByCity(cityId: number): Promise<Airport[]> {
    return this.airports.filter(a => a.cityId === cityId);
  }
  
  async createAirport(airport: InsertAirport): Promise<Airport> {
    const id = generateId(this.airports);
    const createdAt = new Date();
    const updatedAt = null;
    
    const newAirport = {
      id,
      name: airport.name,
      code: airport.code,
      cityId: airport.cityId,
      description: airport.description ?? null,
      imageUrl: airport.imageUrl ?? null,
      active: airport.active ?? true,
      createdAt,
      updatedAt
    };
    
    this.airports.push(newAirport);
    return newAirport;
  }
  
  async updateAirport(id: number, airport: Partial<InsertAirport>): Promise<Airport | undefined> {
    const index = this.airports.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    
    const updatedAirport = {
      ...this.airports[index],
      ...airport,
      updatedAt: new Date()
    };
    
    this.airports[index] = updatedAirport;
    return updatedAirport;
  }
  
  async deleteAirport(id: number): Promise<boolean> {
    const initialLength = this.airports.length;
    this.airports = this.airports.filter(a => a.id !== id);
    return this.airports.length !== initialLength;
  }

  // Destination methods
  async getDestination(id: number): Promise<Destination | undefined> {
    return this.destinations.find(dest => dest.id === id);
  }

  async listDestinations(featured?: boolean): Promise<Destination[]> {
    if (featured !== undefined) {
      return this.destinations.filter(dest => dest.featured === featured);
    }
    return [...this.destinations];
  }

  async createDestination(insertDestination: InsertDestination): Promise<Destination> {
    const newDestination: Destination = {
      id: generateId(this.destinations),
      name: insertDestination.name,
      country: insertDestination.country,
      description: insertDestination.description || null,
      imageUrl: insertDestination.imageUrl || null,
      featured: insertDestination.featured || null
    };
    this.destinations.push(newDestination);
    return newDestination;
  }
  
  async updateDestination(id: number, updateData: Partial<InsertDestination>): Promise<Destination | undefined> {
    const index = this.destinations.findIndex(dest => dest.id === id);
    if (index === -1) return undefined;
    
    const updatedDestination: Destination = {
      ...this.destinations[index],
      ...updateData
    };
    this.destinations[index] = updatedDestination;
    return updatedDestination;
  }
  
  async deleteDestination(id: number): Promise<boolean> {
    const initialLength = this.destinations.length;
    this.destinations = this.destinations.filter(dest => dest.id !== id);
    return initialLength > this.destinations.length;
  }

  // Package methods
  async getPackage(id: number): Promise<Package | undefined> {
    return this.packages.find(pkg => pkg.id === id);
  }

  async listPackages(featured?: boolean): Promise<Package[]> {
    if (featured !== undefined) {
      return this.packages.filter(pkg => pkg.featured === featured);
    }
    return [...this.packages];
  }

  async getPackagesByDestination(destinationId: number): Promise<Package[]> {
    return this.packages.filter(pkg => pkg.destinationId === destinationId);
  }

  async createPackage(insertPackage: InsertPackage): Promise<Package> {
    const newPackage: Package = {
      id: generateId(this.packages),
      title: insertPackage.title,
      description: insertPackage.description,
      price: insertPackage.price,
      duration: insertPackage.duration,
      discountedPrice: insertPackage.discountedPrice || null,
      imageUrl: insertPackage.imageUrl || null,
      rating: insertPackage.rating || null,
      destinationId: insertPackage.destinationId || null,
      featured: insertPackage.featured || null,
      locationType: insertPackage.type || null,
      inclusions: insertPackage.inclusions || null,
      reviewCount: 0
    };
    this.packages.push(newPackage);
    return newPackage;
  }
  
  async updatePackage(id: number, updateData: Partial<InsertPackage>): Promise<Package | undefined> {
    const index = this.packages.findIndex(pkg => pkg.id === id);
    if (index === -1) return undefined;
    
    const updatedPackage: Package = {
      ...this.packages[index],
      ...updateData
    };
    this.packages[index] = updatedPackage;
    return updatedPackage;
  }
  
  async deletePackage(id: number): Promise<boolean> {
    const initialLength = this.packages.length;
    this.packages = this.packages.filter(pkg => pkg.id !== id);
    return initialLength > this.packages.length;
  }

  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.find(booking => booking.id === id);
  }

  async listBookingsByUser(userId: number): Promise<Booking[]> {
    return this.bookings.filter(booking => booking.userId === userId);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const now = new Date();
    
    const newBooking: Booking = {
      id: generateId(this.bookings),
      userId: insertBooking.userId || null,
      packageId: insertBooking.packageId || null,
      status: insertBooking.status || 'pending',
      travelDate: insertBooking.travelDate,
      numberOfTravelers: insertBooking.numberOfTravelers,
      totalPrice: insertBooking.totalPrice,
      bookingDate: now
    };
    this.bookings.push(newBooking);
    return newBooking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const index = this.bookings.findIndex(booking => booking.id === id);
    if (index === -1) return undefined;
    
    const updatedBooking: Booking = {
      ...this.bookings[index],
      status
    };
    this.bookings[index] = updatedBooking;
    return updatedBooking;
  }
  
  // Tour methods
  async getTour(id: number): Promise<Tour | undefined> {
    return this.tours.find(tour => tour.id === id);
  }

  async listTours(featured?: boolean): Promise<Tour[]> {
    if (featured !== undefined) {
      return this.tours.filter(tour => tour.featured === featured);
    }
    return [...this.tours];
  }

  async getToursByDestination(destinationId: number): Promise<Tour[]> {
    return this.tours.filter(tour => tour.destinationId === destinationId);
  }

  async createTour(insertTour: InsertTour): Promise<Tour> {
    const now = new Date();
    const newTour: Tour = {
      id: generateId(this.tours),
      name: insertTour.name,
      description: insertTour.description || null,
      imageUrl: insertTour.imageUrl || null,
      destinationId: insertTour.destinationId || null,
      duration: insertTour.duration,
      price: insertTour.price,
      discountedPrice: insertTour.discountedPrice || null,
      included: insertTour.included || null,
      excluded: insertTour.excluded || null,
      itinerary: insertTour.itinerary || null,
      maxGroupSize: insertTour.maxGroupSize || null,
      featured: insertTour.featured || null,
      rating: insertTour.rating || null,
      status: insertTour.status || null,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now
    };
    this.tours.push(newTour);
    return newTour;
  }
  
  async updateTour(id: number, updateData: Partial<InsertTour>): Promise<Tour | undefined> {
    const index = this.tours.findIndex(tour => tour.id === id);
    if (index === -1) return undefined;
    
    const updatedTour: Tour = {
      ...this.tours[index],
      ...updateData,
      updatedAt: new Date()
    };
    this.tours[index] = updatedTour;
    return updatedTour;
  }
  
  async deleteTour(id: number): Promise<boolean> {
    const initialLength = this.tours.length;
    this.tours = this.tours.filter(tour => tour.id !== id);
    return initialLength > this.tours.length;
  }

  // Hotel methods
  async getHotel(id: number): Promise<Hotel | undefined> {
    return this.hotels.find(hotel => hotel.id === id);
  }

  async listHotels(featured?: boolean): Promise<Hotel[]> {
    if (featured !== undefined) {
      return this.hotels.filter(hotel => hotel.featured === featured);
    }
    return [...this.hotels];
  }

  async getHotelsByDestination(destinationId: number): Promise<Hotel[]> {
    return this.hotels.filter(hotel => hotel.destinationId === destinationId);
  }

  async createHotel(insertHotel: InsertHotel): Promise<Hotel> {
    const now = new Date();
    const newHotel: Hotel = {
      id: generateId(this.hotels),
      name: insertHotel.name,
      description: insertHotel.description || null,
      destinationId: insertHotel.destinationId || null,
      address: insertHotel.address || null,
      city: insertHotel.city || null,
      country: insertHotel.country || null,
      postalCode: insertHotel.postalCode || null,
      phone: insertHotel.phone || null,
      email: insertHotel.email || null,
      website: insertHotel.website || null,
      imageUrl: insertHotel.imageUrl || null,
      stars: insertHotel.stars || null,
      amenities: insertHotel.amenities || null,
      checkInTime: insertHotel.checkInTime || null,
      checkOutTime: insertHotel.checkOutTime || null,
      featured: insertHotel.featured || null,
      rating: insertHotel.rating || null,
      status: insertHotel.status || null,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now
    };
    this.hotels.push(newHotel);
    return newHotel;
  }
  
  async updateHotel(id: number, updateData: Partial<InsertHotel>): Promise<Hotel | undefined> {
    const index = this.hotels.findIndex(hotel => hotel.id === id);
    if (index === -1) return undefined;
    
    const updatedHotel: Hotel = {
      ...this.hotels[index],
      ...updateData,
      updatedAt: new Date()
    };
    this.hotels[index] = updatedHotel;
    return updatedHotel;
  }
  
  async deleteHotel(id: number): Promise<boolean> {
    const initialLength = this.hotels.length;
    this.hotels = this.hotels.filter(hotel => hotel.id !== id);
    return initialLength > this.hotels.length;
  }

  // Room methods
  async getRoom(id: number): Promise<Room | undefined> {
    return this.rooms.find(room => room.id === id);
  }

  async listRooms(): Promise<Room[]> {
    return [...this.rooms];
  }

  async getRoomsByHotel(hotelId: number): Promise<Room[]> {
    return this.rooms.filter(room => room.hotelId === hotelId);
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const now = new Date();
    const newRoom: Room = {
      id: generateId(this.rooms),
      name: insertRoom.name,
      description: insertRoom.description || null,
      hotelId: insertRoom.hotelId,
      locationType: insertRoom.type,
      maxOccupancy: insertRoom.maxOccupancy,
      maxAdults: insertRoom.maxAdults,
      maxChildren: insertRoom.maxChildren || 0,
      maxInfants: insertRoom.maxInfants || 0,
      price: insertRoom.price,
      discountedPrice: insertRoom.discountedPrice || null,
      imageUrl: insertRoom.imageUrl || null,
      size: insertRoom.size || null,
      bedType: insertRoom.bedType || null,
      amenities: insertRoom.amenities || null,
      view: insertRoom.view || null,
      available: insertRoom.available || true,
      status: insertRoom.status || 'active',
      createdAt: now,
      updatedAt: now
    };
    this.rooms.push(newRoom);
    return newRoom;
  }
  
  async updateRoom(id: number, updateData: Partial<InsertRoom>): Promise<Room | undefined> {
    const index = this.rooms.findIndex(room => room.id === id);
    if (index === -1) return undefined;
    
    const updatedRoom: Room = {
      ...this.rooms[index],
      ...updateData,
      updatedAt: new Date()
    };
    this.rooms[index] = updatedRoom;
    return updatedRoom;
  }
  
  async deleteRoom(id: number): Promise<boolean> {
    const initialLength = this.rooms.length;
    this.rooms = this.rooms.filter(room => room.id !== id);
    return initialLength > this.rooms.length;
  }

  // Room Combinations methods
  async getRoomCombination(id: number): Promise<RoomCombination | undefined> {
    return this.roomCombinations.find(combo => combo.id === id);
  }

  async getRoomCombinationsByRoom(roomId: number): Promise<RoomCombination[]> {
    return this.roomCombinations.filter(combo => combo.roomId === roomId);
  }

  async createRoomCombination(combination: InsertRoomCombination): Promise<RoomCombination> {
    const id = generateId(this.roomCombinations);
    const newCombination: RoomCombination = {
      ...combination,
      id,
      createdAt: new Date(),
      updatedAt: null
    };
    this.roomCombinations.push(newCombination);
    return newCombination;
  }

  async updateRoomCombination(id: number, combination: Partial<InsertRoomCombination>): Promise<RoomCombination | undefined> {
    const index = this.roomCombinations.findIndex(combo => combo.id === id);
    if (index === -1) return undefined;
    
    const updatedCombination = {
      ...this.roomCombinations[index],
      ...combination,
      updatedAt: new Date()
    };
    
    this.roomCombinations[index] = updatedCombination;
    return updatedCombination;
  }

  async deleteRoomCombination(id: number): Promise<boolean> {
    const initialLength = this.roomCombinations.length;
    this.roomCombinations = this.roomCombinations.filter(combo => combo.id !== id);
    return initialLength > this.roomCombinations.length;
  }

  // Transportation methods
  async getTransportation(id: number): Promise<Transportation | undefined> {
    return this.transportations.find(t => t.id === id);
  }
  
  async listTransportation(featured?: boolean): Promise<Transportation[]> {
    if (featured) {
      return this.transportations.filter(t => t.featured);
    }
    return [...this.transportations];
  }
  
  async getTransportationByDestination(destinationId: number): Promise<Transportation[]> {
    return this.transportations.filter(t => t.destinationId === destinationId);
  }
  
  async createTransportation(transport: InsertTransportation): Promise<Transportation> {
    const now = new Date();
    const newTransport: Transportation = {
      id: generateId(this.transportations),
      name: transport.name,
      typeId: transport.typeId,
      description: transport.description || null,
      destinationId: transport.destinationId || null,
      fromLocationId: transport.fromLocationId || null,
      toLocationId: transport.toLocationId || null,
      durationId: transport.durationId || null,
      price: transport.price,
      discountedPrice: transport.discountedPrice || null,
      imageUrl: transport.imageUrl || null,
      passengerCapacity: transport.passengerCapacity,
      baggageCapacity: transport.baggageCapacity,
      features: transport.features || [],
      withDriver: transport.withDriver !== undefined ? transport.withDriver : true,
      available: transport.available !== undefined ? transport.available : true,
      pickupIncluded: transport.pickupIncluded !== undefined ? transport.pickupIncluded : true,
      featured: transport.featured || false,
      rating: transport.rating || 0,
      reviewCount: 0,
      status: transport.status || 'active',
      createdAt: now,
      updatedAt: now
    };
    this.transportations.push(newTransport);
    return newTransport;
  }
  
  async updateTransportation(id: number, updateData: Partial<InsertTransportation>): Promise<Transportation | undefined> {
    const index = this.transportations.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    
    const updatedTransport: Transportation = {
      ...this.transportations[index],
      ...updateData,
      updatedAt: new Date()
    };
    
    this.transportations[index] = updatedTransport;
    return updatedTransport;
  }
  
  async deleteTransportation(id: number): Promise<boolean> {
    const initialLength = this.transportations.length;
    this.transportations = this.transportations.filter(t => t.id !== id);
    return initialLength > this.transportations.length;
  }
  
  // Transport Type methods
  async getTransportType(id: number): Promise<TransportType | undefined> {
    return this.transportTypes.find(type => type.id === id);
  }
  
  async listTransportTypes(): Promise<TransportType[]> {
    return this.transportTypes;
  }
  
  async createTransportType(locationType: InsertTransportType): Promise<TransportType> {
    const newType: TransportType = {
      id: generateId(this.transportTypes),
      name: type.name,
      description: type.description,
      passengerCapacity: type.passengerCapacity,
      baggageCapacity: type.baggageCapacity,
      imageUrl: type.imageUrl,
      defaultFeatures: type.defaultFeatures || null,
      status: type.status || 'active',
      createdAt: new Date(),
      updatedAt: null
    };
    
    this.transportTypes.push(newType);
    return newType;
  }
  
  async updateTransportType(id: number, updateData: Partial<InsertTransportType>): Promise<TransportType | undefined> {
    const typeIndex = this.transportTypes.findIndex(t => t.id === id);
    if (typeIndex === -1) return undefined;
    
    const updatedType: TransportType = {
      ...this.transportTypes[typeIndex],
      ...updateData,
      updatedAt: new Date()
    };
    
    this.transportTypes[typeIndex] = updatedType;
    return updatedType;
  }
  
  async deleteTransportType(id: number): Promise<boolean> {
    const initialLength = this.transportTypes.length;
    this.transportTypes = this.transportTypes.filter(t => t.id !== id);
    return initialLength > this.transportTypes.length;
  }
  
  // Transport Location methods
  async getTransportLocation(id: number): Promise<TransportLocation | undefined> {
    return this.transportLocations.find(location => location.id === id);
  }
  
  async listTransportLocations(): Promise<TransportLocation[]> {
    return this.transportLocations;
  }
  
  async createTransportLocation(location: InsertTransportLocation): Promise<TransportLocation> {
    const newLocation: TransportLocation = {
      id: generateId(this.transportLocations),
      name: location.name,
      city: location.city,
      country: location.country,
      locationType: location.locationType,
      description: location.description,
      imageUrl: location.imageUrl,
      popular: location.popular || false,
      latitude: location.latitude,
      longitude: location.longitude,
      status: location.status || 'active',
      createdAt: new Date(),
      updatedAt: null
    };
    
    this.transportLocations.push(newLocation);
    return newLocation;
  }
  
  async updateTransportLocation(id: number, updateData: Partial<InsertTransportLocation>): Promise<TransportLocation | undefined> {
    const locationIndex = this.transportLocations.findIndex(l => l.id === id);
    if (locationIndex === -1) return undefined;
    
    const updatedLocation: TransportLocation = {
      ...this.transportLocations[locationIndex],
      ...updateData,
      updatedAt: new Date()
    };
    
    this.transportLocations[locationIndex] = updatedLocation;
    return updatedLocation;
  }
  
  async deleteTransportLocation(id: number): Promise<boolean> {
    const initialLength = this.transportLocations.length;
    this.transportLocations = this.transportLocations.filter(l => l.id !== id);
    return initialLength > this.transportLocations.length;
  }
  
  // Transport Duration methods
  async getTransportDuration(id: number): Promise<TransportDuration | undefined> {
    return this.transportDurations.find(duration => duration.id === id);
  }
  
  async listTransportDurations(): Promise<TransportDuration[]> {
    return this.transportDurations;
  }
  
  async createTransportDuration(duration: InsertTransportDuration): Promise<TransportDuration> {
    const newDuration: TransportDuration = {
      id: generateId(this.transportDurations),
      name: duration.name,
      hours: duration.hours,
      description: duration.description,
      status: duration.status || 'active',
      createdAt: new Date(),
      updatedAt: null
    };
    
    this.transportDurations.push(newDuration);
    return newDuration;
  }
  
  async updateTransportDuration(id: number, updateData: Partial<InsertTransportDuration>): Promise<TransportDuration | undefined> {
    const durationIndex = this.transportDurations.findIndex(d => d.id === id);
    if (durationIndex === -1) return undefined;
    
    const updatedDuration: TransportDuration = {
      ...this.transportDurations[durationIndex],
      ...updateData,
      updatedAt: new Date()
    };
    
    this.transportDurations[durationIndex] = updatedDuration;
    return updatedDuration;
  }
  
  async deleteTransportDuration(id: number): Promise<boolean> {
    const initialLength = this.transportDurations.length;
    this.transportDurations = this.transportDurations.filter(d => d.id !== id);
    return initialLength > this.transportDurations.length;
  }
  
  // Favorites methods
  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const now = new Date();
    const newFavorite: Favorite = {
      ...favorite,
      createdAt: now
    };
    this.favorites.push(newFavorite);
    return newFavorite;
  }
  
  async removeFavorite(userId: number, destinationId: number): Promise<boolean> {
    const initialLength = this.favorites.length;
    this.favorites = this.favorites.filter(
      fav => !(fav.userId === userId && fav.destinationId === destinationId)
    );
    return initialLength > this.favorites.length;
  }
  
  async listUserFavorites(userId: number): Promise<Destination[]> {
    const userFavoriteIds = this.favorites
      .filter(fav => fav.userId === userId)
      .map(fav => fav.destinationId);
    
    return this.destinations.filter(dest => userFavoriteIds.includes(dest.id));
  }
  
  async checkIsFavorite(userId: number, destinationId: number): Promise<boolean> {
    return this.favorites.some(
      fav => fav.userId === userId && fav.destinationId === destinationId
    );
  }
  
  // Menu methods
  private menus: Menu[] = [];
  private menuItems: MenuItem[] = [];
  
  async getMenu(id: number): Promise<Menu | undefined> {
    return this.menus.find(menu => menu.id === id);
  }
  
  async getMenuByName(name: string): Promise<Menu | undefined> {
    return this.menus.find(menu => menu.name === name);
  }
  
  async getMenuByLocation(location: string): Promise<Menu | undefined> {
    return this.menus.find(menu => menu.location === location);
  }
  
  async listMenus(active?: boolean): Promise<Menu[]> {
    if (active !== undefined) {
      return this.menus.filter(menu => menu.active === active);
    }
    return this.menus;
  }
  
  async createMenu(menu: InsertMenu): Promise<Menu> {
    const id = generateId(this.menus);
    const newMenu: Menu = {
      id,
      ...menu,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.menus.push(newMenu);
    return newMenu;
  }
  
  async updateMenu(id: number, menu: Partial<InsertMenu>): Promise<Menu | undefined> {
    const index = this.menus.findIndex(m => m.id === id);
    if (index === -1) return undefined;
    
    const updatedMenu = {
      ...this.menus[index],
      ...menu,
      updatedAt: new Date(),
    };
    this.menus[index] = updatedMenu;
    return updatedMenu;
  }
  
  async deleteMenu(id: number): Promise<boolean> {
    const index = this.menus.findIndex(menu => menu.id === id);
    if (index === -1) return false;
    
    this.menus.splice(index, 1);
    // Also delete all menu items belonging to this menu
    this.menuItems = this.menuItems.filter(item => item.menuId !== id);
    return true;
  }
  
  // Menu Item methods
  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.find(item => item.id === id);
  }
  
  async listMenuItems(menuId: number, active?: boolean): Promise<MenuItem[]> {
    let items = this.menuItems.filter(item => item.menuId === menuId);
    if (active !== undefined) {
      items = items.filter(item => item.active === active);
    }
    return items.sort((a, b) => a.order - b.order);
  }
  
  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const id = generateId(this.menuItems);
    const newItem: MenuItem = {
      id,
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.menuItems.push(newItem);
    return newItem;
  }
  
  async updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const index = this.menuItems.findIndex(i => i.id === id);
    if (index === -1) return undefined;
    
    const updatedItem = {
      ...this.menuItems[index],
      ...item,
      updatedAt: new Date(),
    };
    this.menuItems[index] = updatedItem;
    return updatedItem;
  }
  
  async deleteMenuItem(id: number): Promise<boolean> {
    const index = this.menuItems.findIndex(item => item.id === id);
    if (index === -1) return false;
    
    this.menuItems.splice(index, 1);
    // Update any items that have this item as parent
    this.menuItems.forEach((item, idx) => {
      if (item.parentId === id) {
        this.menuItems[idx] = {
          ...item,
          parentId: null,
        };
      }
    });
    return true;
  }
}

// PostgreSQL database storage implementation
export class PostgresDatabaseStorage implements IStorage {
  // Hotel Facilities methods
  async listHotelFacilities(): Promise<any[]> {
    try {
      return await db.query.hotelFacilities.findMany({
        orderBy: (facilities) => [facilities.name]
      });
    } catch (error) {
      console.error("Error listing hotel facilities:", error);
      return [];
    }
  }
  
  async getHotelFacility(id: number): Promise<any | undefined> {
    try {
      return await db.query.hotelFacilities.findFirst({
        where: (facilities, { eq }) => eq(facilities.id, id)
      });
    } catch (error) {
      console.error(`Error getting hotel facility with ID ${id}:`, error);
      return undefined;
    }
  }
  
  async createHotelFacility(facility: any): Promise<any> {
    try {
      const result = await db.insert(hotelFacilities).values({
        name: facility.name,
        description: facility.description,
        icon: facility.icon,
        category: facility.category,
        active: facility.active !== undefined ? facility.active : true,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      return result[0];
    } catch (error) {
      console.error("Error creating hotel facility:", error);
      throw error;
    }
  }
  
  async updateHotelFacility(id: number, facility: any): Promise<any | undefined> {
    try {
      const result = await db.update(hotelFacilities)
        .set({
          name: facility.name,
          description: facility.description,
          icon: facility.icon,
          category: facility.category,
          active: facility.active,
          updatedAt: new Date()
        })
        .where(eq(hotelFacilities.id, id))
        .returning();
      
      return result[0];
    } catch (error) {
      console.error(`Error updating hotel facility with ID ${id}:`, error);
      return undefined;
    }
  }
  
  async deleteHotelFacility(id: number): Promise<boolean> {
    try {
      await db.delete(hotelFacilities)
        .where(eq(hotelFacilities.id, id));
      return true;
    } catch (error) {
      console.error(`Error deleting hotel facility with ID ${id}:`, error);
      return false;
    }
  }
  
  // Hotel Highlights methods
  async listHotelHighlights(): Promise<any[]> {
    try {
      return await db.query.hotelHighlights.findMany({
        orderBy: (highlights) => [highlights.name]
      });
    } catch (error) {
      console.error("Error listing hotel highlights:", error);
      return [];
    }
  }
  
  async getHotelHighlight(id: number): Promise<any | undefined> {
    try {
      return await db.query.hotelHighlights.findFirst({
        where: (highlights, { eq }) => eq(highlights.id, id)
      });
    } catch (error) {
      console.error(`Error getting hotel highlight with ID ${id}:`, error);
      return undefined;
    }
  }
  
  async createHotelHighlight(highlight: any): Promise<any> {
    try {
      const result = await db.insert(hotelHighlights).values({
        name: highlight.name,
        description: highlight.description,
        icon: highlight.icon,
        active: highlight.active !== undefined ? highlight.active : true,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      return result[0];
    } catch (error) {
      console.error("Error creating hotel highlight:", error);
      throw error;
    }
  }
  
  async updateHotelHighlight(id: number, highlight: any): Promise<any | undefined> {
    try {
      const result = await db.update(hotelHighlights)
        .set({
          name: highlight.name,
          description: highlight.description,
          icon: highlight.icon,
          active: highlight.active,
          updatedAt: new Date()
        })
        .where(eq(hotelHighlights.id, id))
        .returning();
      
      return result[0];
    } catch (error) {
      console.error(`Error updating hotel highlight with ID ${id}:`, error);
      return undefined;
    }
  }
  
  async deleteHotelHighlight(id: number): Promise<boolean> {
    try {
      await db.delete(hotelHighlights)
        .where(eq(hotelHighlights.id, id));
      return true;
    } catch (error) {
      console.error(`Error deleting hotel highlight with ID ${id}:`, error);
      return false;
    }
  }
  
  // Cleanliness Features methods
  async listCleanlinessFeatures(): Promise<any[]> {
    try {
      return await db.query.cleanlinessFeatures.findMany({
        orderBy: (features) => [features.name]
      });
    } catch (error) {
      console.error("Error listing cleanliness features:", error);
      return [];
    }
  }
  
  async getCleanlinessFeature(id: number): Promise<any | undefined> {
    try {
      return await db.query.cleanlinessFeatures.findFirst({
        where: (features, { eq }) => eq(features.id, id)
      });
    } catch (error) {
      console.error(`Error getting cleanliness feature with ID ${id}:`, error);
      return undefined;
    }
  }
  
  async createCleanlinessFeature(feature: any): Promise<any> {
    try {
      const result = await db.insert(cleanlinessFeatures).values({
        name: feature.name,
        description: feature.description,
        icon: feature.icon,
        active: feature.active !== undefined ? feature.active : true,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      return result[0];
    } catch (error) {
      console.error("Error creating cleanliness feature:", error);
      throw error;
    }
  }
  
  async updateCleanlinessFeature(id: number, feature: any): Promise<any | undefined> {
    try {
      const result = await db.update(cleanlinessFeatures)
        .set({
          name: feature.name,
          description: feature.description,
          icon: feature.icon,
          active: feature.active,
          updatedAt: new Date()
        })
        .where(eq(cleanlinessFeatures.id, id))
        .returning();
      
      return result[0];
    } catch (error) {
      console.error(`Error updating cleanliness feature with ID ${id}:`, error);
      return undefined;
    }
  }
  
  async deleteCleanlinessFeature(id: number): Promise<boolean> {
    try {
      await db.delete(cleanlinessFeatures)
        .where(eq(cleanlinessFeatures.id, id));
      return true;
    } catch (error) {
      console.error(`Error deleting cleanliness feature with ID ${id}:`, error);
      return false;
    }
  }
  // Tour Category methods
  async getTourCategory(id: number): Promise<TourCategory | undefined> {
    return await db.query.tourCategories.findFirst({
      where: eq(tourCategories.id, id)
    });
  }

  async listTourCategories(active?: boolean): Promise<TourCategory[]> {
    if (active !== undefined) {
      return await db.query.tourCategories.findMany({
        where: eq(tourCategories.active, active)
      });
    }
    return await db.query.tourCategories.findMany();
  }

  async createTourCategory(category: InsertTourCategory): Promise<TourCategory> {
    const [newCategory] = await db.insert(tourCategories).values(category).returning();
    return newCategory;
  }

  async updateTourCategory(id: number, category: Partial<InsertTourCategory>): Promise<TourCategory | undefined> {
    const [updatedCategory] = await db.update(tourCategories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(tourCategories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteTourCategory(id: number): Promise<boolean> {
    try {
      await db.delete(tourCategories).where(eq(tourCategories.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting tour category:', error);
      return false;
    }
  }

  // Hotel Category methods
  async getHotelCategory(id: number): Promise<HotelCategory | undefined> {
    return await db.query.hotelCategories.findFirst({
      where: eq(hotelCategories.id, id)
    });
  }

  async listHotelCategories(active?: boolean): Promise<HotelCategory[]> {
    if (active !== undefined) {
      return await db.query.hotelCategories.findMany({
        where: eq(hotelCategories.active, active)
      });
    }
    return await db.query.hotelCategories.findMany();
  }

  async createHotelCategory(category: InsertHotelCategory): Promise<HotelCategory> {
    const [newCategory] = await db.insert(hotelCategories).values(category).returning();
    return newCategory;
  }

  async updateHotelCategory(id: number, category: Partial<InsertHotelCategory>): Promise<HotelCategory | undefined> {
    const [updatedCategory] = await db.update(hotelCategories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(hotelCategories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteHotelCategory(id: number): Promise<boolean> {
    try {
      await db.delete(hotelCategories).where(eq(hotelCategories.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting hotel category:', error);
      return false;
    }
  }

  // Room Category methods
  async getRoomCategory(id: number): Promise<RoomCategory | undefined> {
    return await db.query.roomCategories.findFirst({
      where: eq(roomCategories.id, id)
    });
  }

  async listRoomCategories(active?: boolean): Promise<RoomCategory[]> {
    if (active !== undefined) {
      return await db.query.roomCategories.findMany({
        where: eq(roomCategories.active, active)
      });
    }
    return await db.query.roomCategories.findMany();
  }

  async createRoomCategory(category: InsertRoomCategory): Promise<RoomCategory> {
    const [newCategory] = await db.insert(roomCategories).values(category).returning();
    return newCategory;
  }

  async updateRoomCategory(id: number, category: Partial<InsertRoomCategory>): Promise<RoomCategory | undefined> {
    const [updatedCategory] = await db.update(roomCategories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(roomCategories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteRoomCategory(id: number): Promise<boolean> {
    try {
      await db.delete(roomCategories).where(eq(roomCategories.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting room category:', error);
      return false;
    }
  }

  // Package Category methods
  async getPackageCategory(id: number): Promise<PackageCategory | undefined> {
    return await db.query.packageCategories.findFirst({
      where: eq(packageCategories.id, id)
    });
  }

  async listPackageCategories(active?: boolean): Promise<PackageCategory[]> {
    if (active !== undefined) {
      return await db.query.packageCategories.findMany({
        where: eq(packageCategories.active, active)
      });
    }
    return await db.query.packageCategories.findMany();
  }

  async createPackageCategory(category: InsertPackageCategory): Promise<PackageCategory> {
    const [newCategory] = await db.insert(packageCategories).values(category).returning();
    return newCategory;
  }

  async updatePackageCategory(id: number, category: Partial<InsertPackageCategory>): Promise<PackageCategory | undefined> {
    const [updatedCategory] = await db.update(packageCategories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(packageCategories.id, id))
      .returning();
    return updatedCategory;
  }

  async deletePackageCategory(id: number): Promise<boolean> {
    try {
      await db.delete(packageCategories).where(eq(packageCategories.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting package category:', error);
      return false;
    }
  }
  sessionStore: session.Store;

  constructor() {
    const MemoryStoreSession = MemoryStore(session);
    this.sessionStore = new MemoryStoreSession({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async listUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db
      .delete(users)
      .where(eq(users.id, id));
    return !!result;
  }

  // Country methods
  async getCountry(id: number): Promise<Country | undefined> {
    const [country] = await db.select().from(countries).where(eq(countries.id, id));
    return country || undefined;
  }
  
  async getCountryByCode(code: string): Promise<Country | undefined> {
    const [country] = await db.select().from(countries).where(eq(countries.code, code));
    return country || undefined;
  }
  
  async listCountries(active?: boolean): Promise<Country[]> {
    if (active !== undefined) {
      return await db.select().from(countries).where(eq(countries.active, active));
    }
    return await db.select().from(countries);
  }
  
  async createCountry(country: InsertCountry): Promise<Country> {
    const [newCountry] = await db.insert(countries).values(country).returning();
    return newCountry;
  }
  
  async updateCountry(id: number, country: Partial<InsertCountry>): Promise<Country | undefined> {
    const [updatedCountry] = await db
      .update(countries)
      .set(country)
      .where(eq(countries.id, id))
      .returning();
    return updatedCountry || undefined;
  }
  
  async deleteCountry(id: number): Promise<boolean> {
    // Check if there are any cities associated with this country
    const citiesList = await db.select().from(cities).where(eq(cities.countryId, id));
    if (citiesList.length > 0) {
      // Cannot delete a country with associated cities
      return false;
    }
    
    const result = await db
      .delete(countries)
      .where(eq(countries.id, id));
    return !!result;
  }
  
  // City methods
  async getCity(id: number): Promise<City | undefined> {
    const [city] = await db.select().from(cities).where(eq(cities.id, id));
    return city || undefined;
  }
  
  async listCities(active?: boolean): Promise<City[]> {
    if (active !== undefined) {
      return await db.select().from(cities).where(eq(cities.active, active));
    }
    return await db.select().from(cities);
  }
  
  async getCitiesByCountry(countryId: number): Promise<City[]> {
    return await db.select().from(cities).where(eq(cities.countryId, countryId));
  }
  
  async createCity(city: InsertCity): Promise<City> {
    const [newCity] = await db.insert(cities).values(city).returning();
    return newCity;
  }
  
  async updateCity(id: number, city: Partial<InsertCity>): Promise<City | undefined> {
    const [updatedCity] = await db
      .update(cities)
      .set(city)
      .where(eq(cities.id, id))
      .returning();
    return updatedCity || undefined;
  }
  
  async deleteCity(id: number): Promise<boolean> {
    // Check if there are any airports associated with this city
    const airportsList = await db.select().from(airports).where(eq(airports.cityId, id));
    if (airportsList.length > 0) {
      // Cannot delete a city with associated airports
      return false;
    }
    
    const result = await db
      .delete(cities)
      .where(eq(cities.id, id));
    return !!result;
  }
  
  // Airport methods
  async getAirport(id: number): Promise<Airport | undefined> {
    const [airport] = await db.select().from(airports).where(eq(airports.id, id));
    return airport || undefined;
  }
  
  async listAirports(active?: boolean): Promise<Airport[]> {
    if (active !== undefined) {
      return await db.select().from(airports).where(eq(airports.active, active));
    }
    return await db.select().from(airports);
  }
  
  async getAirportsByCity(cityId: number): Promise<Airport[]> {
    return await db.select().from(airports).where(eq(airports.cityId, cityId));
  }
  
  async createAirport(airport: InsertAirport): Promise<Airport> {
    const [newAirport] = await db.insert(airports).values(airport).returning();
    return newAirport;
  }
  
  async updateAirport(id: number, airport: Partial<InsertAirport>): Promise<Airport | undefined> {
    const [updatedAirport] = await db
      .update(airports)
      .set(airport)
      .where(eq(airports.id, id))
      .returning();
    return updatedAirport || undefined;
  }
  
  async deleteAirport(id: number): Promise<boolean> {
    const result = await db
      .delete(airports)
      .where(eq(airports.id, id));
    return !!result;
  }

  // Destination methods
  async getDestination(id: number): Promise<Destination | undefined> {
    const [destination] = await db.select().from(destinations).where(eq(destinations.id, id));
    return destination || undefined;
  }

  async listDestinations(featured?: boolean): Promise<Destination[]> {
    if (featured !== undefined) {
      return db.select().from(destinations).where(eq(destinations.featured, featured));
    }
    return db.select().from(destinations);
  }

  async createDestination(destination: InsertDestination): Promise<Destination> {
    const [newDestination] = await db
      .insert(destinations)
      .values(destination)
      .returning();
    return newDestination;
  }

  async updateDestination(id: number, destination: Partial<InsertDestination>): Promise<Destination | undefined> {
    const [updatedDestination] = await db
      .update(destinations)
      .set(destination)
      .where(eq(destinations.id, id))
      .returning();
    return updatedDestination;
  }

  async deleteDestination(id: number): Promise<boolean> {
    const result = await db
      .delete(destinations)
      .where(eq(destinations.id, id));
    return !!result;
  }

  // Package methods
  async getPackage(id: number): Promise<Package | undefined> {
    const [pkg] = await db.select().from(packages).where(eq(packages.id, id));
    return pkg || undefined;
  }
  
  async getPackageBySlug(slug: string): Promise<Package | undefined> {
    const [pkg] = await db.select().from(packages).where(eq(packages.slug, slug));
    return pkg || undefined;
  }

  async listPackages(featured?: boolean): Promise<Package[]> {
    if (featured !== undefined) {
      return db.select().from(packages).where(eq(packages.featured, featured));
    }
    return db.select().from(packages);
  }

  async getPackagesByDestination(destinationId: number): Promise<Package[]> {
    return db.select().from(packages).where(eq(packages.destinationId, destinationId));
  }

  async createPackage(pkg: InsertPackage): Promise<Package> {
    const [newPackage] = await db
      .insert(packages)
      .values(pkg)
      .returning();
    return newPackage;
  }

  async updatePackage(id: number, pkg: Partial<InsertPackage>): Promise<Package | undefined> {
    const [updatedPackage] = await db
      .update(packages)
      .set(pkg)
      .where(eq(packages.id, id))
      .returning();
    return updatedPackage;
  }

  async updatePackageSlug(id: number, slug: string): Promise<Package | undefined> {
    // First check if the slug is already in use by another package
    const [existingPackage] = await db
      .select()
      .from(packages)
      .where(and(eq(packages.slug, slug), ne(packages.id, id)));
    
    if (existingPackage) {
      return undefined; // Slug is already in use
    }
    
    const [updatedPackage] = await db
      .update(packages)
      .set({ slug })
      .where(eq(packages.id, id))
      .returning();
    return updatedPackage;
  }

  async deletePackage(id: number): Promise<boolean> {
    const result = await db
      .delete(packages)
      .where(eq(packages.id, id));
    return !!result;
  }

  // Tour methods
  async getTour(id: number): Promise<Tour | undefined> {
    const [tour] = await db.select().from(tours).where(eq(tours.id, id));
    return tour || undefined;
  }

  async listTours(featured?: boolean): Promise<Tour[]> {
    if (featured !== undefined) {
      return db.select().from(tours).where(eq(tours.featured, featured));
    }
    return db.select().from(tours);
  }

  async getToursByDestination(destinationId: number): Promise<Tour[]> {
    return db.select().from(tours).where(eq(tours.destinationId, destinationId));
  }

  async createTour(tour: InsertTour): Promise<Tour> {
    const [newTour] = await db
      .insert(tours)
      .values(tour)
      .returning();
    return newTour;
  }

  async updateTour(id: number, tour: Partial<InsertTour>): Promise<Tour | undefined> {
    const [updatedTour] = await db
      .update(tours)
      .set(tour)
      .where(eq(tours.id, id))
      .returning();
    return updatedTour;
  }

  async deleteTour(id: number): Promise<boolean> {
    const result = await db
      .delete(tours)
      .where(eq(tours.id, id));
    return !!result;
  }

  // Hotel methods
  async getHotel(id: number): Promise<Hotel | undefined> {
    const [hotel] = await db.select().from(hotels).where(eq(hotels.id, id));
    return hotel || undefined;
  }

  async listHotels(featured?: boolean): Promise<Hotel[]> {
    if (featured !== undefined) {
      return db.select().from(hotels).where(eq(hotels.featured, featured));
    }
    return db.select().from(hotels);
  }

  async getHotelsByDestination(destinationId: number): Promise<Hotel[]> {
    return db.select().from(hotels).where(eq(hotels.destinationId, destinationId));
  }

  async createHotel(hotel: InsertHotel): Promise<Hotel> {
    const [newHotel] = await db
      .insert(hotels)
      .values(hotel)
      .returning();
    return newHotel;
  }

  async updateHotel(id: number, hotel: Partial<InsertHotel>): Promise<Hotel | undefined> {
    const [updatedHotel] = await db
      .update(hotels)
      .set(hotel)
      .where(eq(hotels.id, id))
      .returning();
    return updatedHotel;
  }

  async deleteHotel(id: number): Promise<boolean> {
    const result = await db
      .delete(hotels)
      .where(eq(hotels.id, id));
    return !!result;
  }

  // Room methods
  async getRoom(id: number): Promise<Room | undefined> {
    const [room] = await db.select().from(rooms).where(eq(rooms.id, id));
    return room || undefined;
  }

  async listRooms(): Promise<Room[]> {
    return db.select().from(rooms);
  }

  async getRoomsByHotel(hotelId: number): Promise<Room[]> {
    return db.select().from(rooms).where(eq(rooms.hotelId, hotelId));
  }

  async createRoom(room: InsertRoom): Promise<Room> {
    const [newRoom] = await db
      .insert(rooms)
      .values(room)
      .returning();
    return newRoom;
  }

  async updateRoom(id: number, room: Partial<InsertRoom>): Promise<Room | undefined> {
    const [updatedRoom] = await db
      .update(rooms)
      .set(room)
      .where(eq(rooms.id, id))
      .returning();
    return updatedRoom;
  }

  async deleteRoom(id: number): Promise<boolean> {
    const result = await db
      .delete(rooms)
      .where(eq(rooms.id, id));
    return !!result;
  }

  // Room Combinations methods
  async getRoomCombination(id: number): Promise<RoomCombination | undefined> {
    const [combination] = await db.select().from(roomCombinations).where(eq(roomCombinations.id, id));
    return combination || undefined;
  }

  async getRoomCombinationsByRoom(roomId: number): Promise<RoomCombination[]> {
    return db.select().from(roomCombinations).where(eq(roomCombinations.roomId, roomId));
  }

  async createRoomCombination(combination: InsertRoomCombination): Promise<RoomCombination> {
    const [newCombination] = await db
      .insert(roomCombinations)
      .values(combination)
      .returning();
    return newCombination;
  }

  async updateRoomCombination(id: number, combination: Partial<InsertRoomCombination>): Promise<RoomCombination | undefined> {
    const [updatedCombination] = await db
      .update(roomCombinations)
      .set(combination)
      .where(eq(roomCombinations.id, id))
      .returning();
    return updatedCombination;
  }

  async deleteRoomCombination(id: number): Promise<boolean> {
    const result = await db
      .delete(roomCombinations)
      .where(eq(roomCombinations.id, id));
    return !!result;
  }

  // Transport Types methods
  async getTransportType(id: number): Promise<TransportType | undefined> {
    const [type] = await db.select().from(transportTypes).where(eq(transportTypes.id, id));
    return type || undefined;
  }

  async listTransportTypes(): Promise<TransportType[]> {
    return db.select().from(transportTypes);
  }

  async createTransportType(locationType: InsertTransportType): Promise<TransportType> {
    const [newType] = await db
      .insert(transportTypes)
      .values(locationType)
      .returning();
    return newType;
  }

  async updateTransportType(id: number, locationType: Partial<InsertTransportType>): Promise<TransportType | undefined> {
    const [updatedType] = await db
      .update(transportTypes)
      .set(locationType)
      .where(eq(transportTypes.id, id))
      .returning();
    return updatedType;
  }

  async deleteTransportType(id: number): Promise<boolean> {
    const result = await db
      .delete(transportTypes)
      .where(eq(transportTypes.id, id));
    return !!result;
  }

  // Transport Locations methods
  async getTransportLocation(id: number): Promise<TransportLocation | undefined> {
    const [location] = await db.select().from(transportLocations).where(eq(transportLocations.id, id));
    return location || undefined;
  }

  async listTransportLocations(): Promise<TransportLocation[]> {
    return db.select().from(transportLocations);
  }

  async createTransportLocation(location: InsertTransportLocation): Promise<TransportLocation> {
    const [newLocation] = await db
      .insert(transportLocations)
      .values(location)
      .returning();
    return newLocation;
  }

  async updateTransportLocation(id: number, location: Partial<InsertTransportLocation>): Promise<TransportLocation | undefined> {
    const [updatedLocation] = await db
      .update(transportLocations)
      .set(location)
      .where(eq(transportLocations.id, id))
      .returning();
    return updatedLocation;
  }

  async deleteTransportLocation(id: number): Promise<boolean> {
    const result = await db
      .delete(transportLocations)
      .where(eq(transportLocations.id, id));
    return !!result;
  }

  // Transport Durations methods
  async getTransportDuration(id: number): Promise<TransportDuration | undefined> {
    const [duration] = await db.select().from(transportDurations).where(eq(transportDurations.id, id));
    return duration || undefined;
  }

  async listTransportDurations(): Promise<TransportDuration[]> {
    return db.select().from(transportDurations);
  }

  async createTransportDuration(duration: InsertTransportDuration): Promise<TransportDuration> {
    const [newDuration] = await db
      .insert(transportDurations)
      .values(duration)
      .returning();
    return newDuration;
  }

  async updateTransportDuration(id: number, duration: Partial<InsertTransportDuration>): Promise<TransportDuration | undefined> {
    const [updatedDuration] = await db
      .update(transportDurations)
      .set(duration)
      .where(eq(transportDurations.id, id))
      .returning();
    return updatedDuration;
  }

  async deleteTransportDuration(id: number): Promise<boolean> {
    const result = await db
      .delete(transportDurations)
      .where(eq(transportDurations.id, id));
    return !!result;
  }

  // Transportation methods
  async getTransportation(id: number): Promise<Transportation | undefined> {
    try {
      // Create aliases for the tables
      const fromLocations = transportLocations;
      const toLocations = transportLocations.as('toLocation');
      
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
      })
      .from(transportation)
      .leftJoin(transportTypes, eq(transportation.typeId, transportTypes.id))
      .leftJoin(fromLocations, eq(transportation.fromLocationId, fromLocations.id))
      .leftJoin(toLocations, eq(transportation.toLocationId, toLocations.id))
      .leftJoin(transportDurations, eq(transportation.durationId, transportDurations.id))
      .where(eq(transportation.id, id));
      
      return transport || undefined;
    } catch (error) {
      console.error("Error in getTransportation:", error);
      return undefined;
    }
  }

  async listTransportation(featured?: boolean): Promise<Transportation[]> {
    try {
      // Create aliases for the tables
      const fromLocations = transportLocations;
      const toLocations = transportLocations.as('toLocation');
      
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
      })
      .from(transportation)
      .leftJoin(transportTypes, eq(transportation.typeId, transportTypes.id))
      .leftJoin(fromLocations, eq(transportation.fromLocationId, fromLocations.id))
      .leftJoin(toLocations, eq(transportation.toLocationId, toLocations.id))
      .leftJoin(transportDurations, eq(transportation.durationId, transportDurations.id));

      if (featured !== undefined) {
        return query.where(eq(transportation.featured, featured));
      }
      
      return query;
    } catch (error) {
      console.error("Error in listTransportation:", error);
      return [];
    }
  }

  async getTransportationByDestination(destinationId: number): Promise<Transportation[]> {
    return db.select().from(transportation).where(eq(transportation.destinationId, destinationId));
  }

  async createTransportation(transport: InsertTransportation): Promise<Transportation> {
    const [newTransport] = await db
      .insert(transportation)
      .values(transport)
      .returning();
    return newTransport;
  }

  async updateTransportation(id: number, transport: Partial<InsertTransportation>): Promise<Transportation | undefined> {
    const [updatedTransport] = await db
      .update(transportation)
      .set(transport)
      .where(eq(transportation.id, id))
      .returning();
    return updatedTransport;
  }

  async deleteTransportation(id: number): Promise<boolean> {
    const result = await db
      .delete(transportation)
      .where(eq(transportation.id, id));
    return !!result;
  }
  
  // Translation methods
  async getTranslation(id: number): Promise<Translation | undefined> {
    const [translation] = await db
      .select()
      .from(translations)
      .where(eq(translations.id, id));
    return translation;
  }
  
  async getTranslationByKey(key: string): Promise<Translation | undefined> {
    const [translation] = await db
      .select()
      .from(translations)
      .where(eq(translations.key, key));
    return translation;
  }
  
  async listTranslations(category?: string): Promise<Translation[]> {
    if (category) {
      return db
        .select()
        .from(translations)
        .where(eq(translations.category, category));
    }
    return db.select().from(translations);
  }
  
  async createTranslation(translation: InsertTranslation): Promise<Translation> {
    const now = new Date(); // Use Date object instead of string
    const [newTranslation] = await db
      .insert(translations)
      .values({
        ...translation,
        createdAt: now,
        updatedAt: now
      })
      .returning();
    return newTranslation;
  }
  
  async updateTranslation(id: number, translation: Partial<InsertTranslation>): Promise<Translation | undefined> {
    const [updatedTranslation] = await db
      .update(translations)
      .set({
        ...translation,
        updatedAt: new Date(), // Use Date object directly
      })
      .where(eq(translations.id, id))
      .returning();
    return updatedTranslation;
  }
  
  async deleteTranslation(id: number): Promise<boolean> {
    const result = await db
      .delete(translations)
      .where(eq(translations.id, id));
    return !!result;
  }
  
  // Dictionary Entry methods
  async getDictionaryEntry(id: number): Promise<DictionaryEntry | undefined> {
    const [entry] = await db
      .select()
      .from(dictionaryEntries)
      .where(eq(dictionaryEntries.id, id));
    return entry;
  }
  
  async getDictionaryEntryByWord(word: string): Promise<DictionaryEntry | undefined> {
    const [entry] = await db
      .select()
      .from(dictionaryEntries)
      .where(eq(dictionaryEntries.word, word));
    return entry;
  }
  
  async searchDictionaryEntries(searchTerm: string): Promise<DictionaryEntry[]> {
    return db
      .select()
      .from(dictionaryEntries)
      .where(
        // Case-insensitive search using ILIKE operator
        or(
          ilike(dictionaryEntries.word, `%${searchTerm}%`),
          ilike(dictionaryEntries.englishDefinition, `%${searchTerm}%`),
          ilike(dictionaryEntries.arabicTranslation, `%${searchTerm}%`)
        )
      );
  }
  
  async listDictionaryEntries(): Promise<DictionaryEntry[]> {
    return db.select().from(dictionaryEntries);
  }
  
  async createDictionaryEntry(entry: InsertDictionaryEntry): Promise<DictionaryEntry> {
    const [newEntry] = await db
      .insert(dictionaryEntries)
      .values(entry)
      .returning();
    return newEntry;
  }
  
  async updateDictionaryEntry(id: number, entry: Partial<InsertDictionaryEntry>): Promise<DictionaryEntry | undefined> {
    const [updatedEntry] = await db
      .update(dictionaryEntries)
      .set({
        ...entry,
        updatedAt: new Date(),
      })
      .where(eq(dictionaryEntries.id, id))
      .returning();
    return updatedEntry;
  }
  
  async deleteDictionaryEntry(id: number): Promise<boolean> {
    const result = await db
      .delete(dictionaryEntries)
      .where(eq(dictionaryEntries.id, id));
    return !!result;
  }
  
  // Site Language Settings methods
  async getSiteLanguageSettings(): Promise<SiteLanguageSetting | undefined> {
    const [settings] = await db
      .select()
      .from(siteLanguageSettings)
      .limit(1);
    return settings;
  }
  
  async updateSiteLanguageSettings(settings: Partial<InsertSiteLanguageSetting>): Promise<SiteLanguageSetting | undefined> {
    // Get the existing settings first
    const existingSettings = await this.getSiteLanguageSettings();
    
    if (existingSettings) {
      // Update existing settings
      const [updatedSettings] = await db
        .update(siteLanguageSettings)
        .set({
          ...settings,
          updatedAt: new Date(),
        })
        .where(eq(siteLanguageSettings.id, existingSettings.id))
        .returning();
      return updatedSettings;
    } else {
      // Create new settings if none exist
      const [newSettings] = await db
        .insert(siteLanguageSettings)
        .values({
          defaultLanguage: settings.defaultLanguage || 'en',
          availableLanguages: settings.availableLanguages || ['en', 'ar'],
          rtlLanguages: settings.rtlLanguages || ['ar'],
        })
        .returning();
      return newSettings;
    }
  }

  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async listBookingsByUser(userId: number): Promise<Booking[]> {
    return db.select().from(bookings).where(eq(bookings.userId, userId));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db
      .insert(bookings)
      .values(booking)
      .returning();
    return newBooking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking;
  }

  // Favorites methods
  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const [newFavorite] = await db
      .insert(favorites)
      .values(favorite)
      .returning();
    return newFavorite;
  }

  async removeFavorite(userId: number, destinationId: number): Promise<boolean> {
    const result = await db
      .delete(favorites)
      .where(and(
        eq(favorites.userId, userId),
        eq(favorites.destinationId, destinationId)
      ));
    return !!result;
  }

  async listUserFavorites(userId: number): Promise<Destination[]> {
    const favoriteDestinations = await db
      .select({
        destination: destinations
      })
      .from(favorites)
      .innerJoin(destinations, eq(favorites.destinationId, destinations.id))
      .where(eq(favorites.userId, userId));
    
    return favoriteDestinations.map(row => row.destination);
  }

  async checkIsFavorite(userId: number, destinationId: number): Promise<boolean> {
    const [favorite] = await db
      .select()
      .from(favorites)
      .where(and(
        eq(favorites.userId, userId),
        eq(favorites.destinationId, destinationId)
      ));
    return !!favorite;
  }

  // Menu methods
  async getMenu(id: number): Promise<Menu | undefined> {
    const [menu] = await db.select().from(menus).where(eq(menus.id, id));
    return menu;
  }
  
  async getMenuByName(name: string): Promise<Menu | undefined> {
    const [menu] = await db.select().from(menus).where(eq(menus.name, name));
    return menu;
  }
  
  async getMenuByLocation(location: string): Promise<Menu | undefined> {
    const [menu] = await db.select().from(menus).where(eq(menus.location, location));
    return menu;
  }
  
  async listMenus(active?: boolean): Promise<Menu[]> {
    if (active !== undefined) {
      return db.select().from(menus).where(eq(menus.active, active));
    }
    return db.select().from(menus);
  }
  
  async createMenu(menu: InsertMenu): Promise<Menu> {
    const [newMenu] = await db.insert(menus).values({
      ...menu,
      active: menu.active ?? true,
      description: menu.description ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return newMenu;
  }
  
  async updateMenu(id: number, menu: Partial<InsertMenu>): Promise<Menu | undefined> {
    const [updatedMenu] = await db
      .update(menus)
      .set({
        ...menu,
        updatedAt: new Date()
      })
      .where(eq(menus.id, id))
      .returning();
    return updatedMenu;
  }
  
  async deleteMenu(id: number): Promise<boolean> {
    // First delete all menu items belonging to this menu
    await db.delete(menuItems).where(eq(menuItems.menuId, id));
    
    // Then delete the menu
    const result = await db.delete(menus).where(eq(menus.id, id));
    return !!result;
  }
  
  // Menu Item methods
  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const [menuItem] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return menuItem;
  }
  
  async listMenuItems(menuId: number, active?: boolean): Promise<MenuItem[]> {
    if (active !== undefined) {
      return db
        .select()
        .from(menuItems)
        .where(
          and(
            eq(menuItems.menuId, menuId),
            eq(menuItems.active, active)
          )
        )
        .orderBy(menuItems.order);
    }
    
    return db
      .select()
      .from(menuItems)
      .where(eq(menuItems.menuId, menuId))
      .orderBy(menuItems.order);
  }
  
  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const [newMenuItem] = await db.insert(menuItems).values({
      ...item,
      active: item.active ?? true,
      icon: item.icon ?? null,
      target: item.target ?? null,
      parentId: item.parentId ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return newMenuItem;
  }
  
  async updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const [updatedMenuItem] = await db
      .update(menuItems)
      .set({
        ...item,
        updatedAt: new Date()
      })
      .where(eq(menuItems.id, id))
      .returning();
    return updatedMenuItem;
  }
  
  async deleteMenuItem(id: number): Promise<boolean> {
    // Update any items that have this item as parent
    await db
      .update(menuItems)
      .set({ parentId: null })
      .where(eq(menuItems.parentId, id));
    
    // Then delete the menu item
    const result = await db.delete(menuItems).where(eq(menuItems.id, id));
    return !!result;
  }
  
  // Dictionary methods
  async getDictionaryEntry(id: number): Promise<DictionaryEntry | undefined> {
    const [entry] = await db
      .select()
      .from(dictionaryEntries)
      .where(eq(dictionaryEntries.id, id));
    return entry;
  }
  
  async getDictionaryEntryByWord(word: string): Promise<DictionaryEntry | undefined> {
    const [entry] = await db
      .select()
      .from(dictionaryEntries)
      .where(eq(dictionaryEntries.word, word.toLowerCase().trim()));
    return entry;
  }
  
  async listDictionaryEntries(): Promise<DictionaryEntry[]> {
    return db.select().from(dictionaryEntries);
  }
  
  async searchDictionaryEntries(term: string): Promise<DictionaryEntry[]> {
    return db
      .select()
      .from(dictionaryEntries)
      .where(
        or(
          ilike(dictionaryEntries.word, `%${term}%`),
          ilike(dictionaryEntries.englishDefinition, `%${term}%`),
          ilike(dictionaryEntries.arabicTranslation, `%${term}%`)
        )
      );
  }
  
  async createDictionaryEntry(entry: InsertDictionaryEntry): Promise<DictionaryEntry> {
    const [newEntry] = await db
      .insert(dictionaryEntries)
      .values({
        ...entry,
        word: entry.word.toLowerCase().trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newEntry;
  }
  
  async updateDictionaryEntry(id: number, entry: Partial<InsertDictionaryEntry>): Promise<DictionaryEntry | undefined> {
    // If word is being updated, ensure it's lowercase and trimmed
    const dataToUpdate = {
      ...entry,
      updatedAt: new Date()
    };
    
    if (entry.word) {
      dataToUpdate.word = entry.word.toLowerCase().trim();
    }
    
    const [updatedEntry] = await db
      .update(dictionaryEntries)
      .set(dataToUpdate)
      .where(eq(dictionaryEntries.id, id))
      .returning();
    return updatedEntry;
  }
  
  async deleteDictionaryEntry(id: number): Promise<boolean> {
    const result = await db
      .delete(dictionaryEntries)
      .where(eq(dictionaryEntries.id, id));
    return !!result;
  }
}

// Initialize storage with PostgreSQL database implementation
export const storage = new PostgresDatabaseStorage();