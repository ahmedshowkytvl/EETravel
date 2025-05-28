import { db } from "./db";
import { 
  hotelFacilities, 
  hotelHighlights, 
  cleanlinessFeatures,
} from "@shared/schema";
import { eq } from "drizzle-orm";

// Hotel Facilities methods
export const hotelFacilitiesImplementation = {
  async getHotelFacility(id: number): Promise<any | undefined> {
    return await db.query.hotelFacilities.findFirst({
      where: eq(hotelFacilities.id, id)
    });
  },

  async listHotelFacilities(active?: boolean): Promise<any[]> {
    if (active !== undefined) {
      return await db.query.hotelFacilities.findMany({
        where: eq(hotelFacilities.active, active)
      });
    }
    return await db.query.hotelFacilities.findMany();
  },

  async createHotelFacility(facility: any): Promise<any> {
    const [newFacility] = await db.insert(hotelFacilities).values(facility).returning();
    return newFacility;
  },

  async updateHotelFacility(id: number, facility: any): Promise<any | undefined> {
    const [updatedFacility] = await db.update(hotelFacilities)
      .set({ ...facility, updatedAt: new Date() })
      .where(eq(hotelFacilities.id, id))
      .returning();
    return updatedFacility;
  },

  async deleteHotelFacility(id: number): Promise<boolean> {
    try {
      await db.delete(hotelFacilities).where(eq(hotelFacilities.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting hotel facility:', error);
      return false;
    }
  }
};

// Hotel Highlights methods
export const hotelHighlightsImplementation = {
  async getHotelHighlight(id: number): Promise<any | undefined> {
    return await db.query.hotelHighlights.findFirst({
      where: eq(hotelHighlights.id, id)
    });
  },

  async listHotelHighlights(active?: boolean): Promise<any[]> {
    if (active !== undefined) {
      return await db.query.hotelHighlights.findMany({
        where: eq(hotelHighlights.active, active)
      });
    }
    return await db.query.hotelHighlights.findMany();
  },

  async createHotelHighlight(highlight: any): Promise<any> {
    const [newHighlight] = await db.insert(hotelHighlights).values(highlight).returning();
    return newHighlight;
  },

  async updateHotelHighlight(id: number, highlight: any): Promise<any | undefined> {
    const [updatedHighlight] = await db.update(hotelHighlights)
      .set({ ...highlight, updatedAt: new Date() })
      .where(eq(hotelHighlights.id, id))
      .returning();
    return updatedHighlight;
  },

  async deleteHotelHighlight(id: number): Promise<boolean> {
    try {
      await db.delete(hotelHighlights).where(eq(hotelHighlights.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting hotel highlight:', error);
      return false;
    }
  }
};

// Cleanliness Features methods
export const cleanlinessImplementation = {
  async getCleanlinessFeature(id: number): Promise<any | undefined> {
    return await db.query.cleanlinessFeatures.findFirst({
      where: eq(cleanlinessFeatures.id, id)
    });
  },

  async listCleanlinessFeatures(active?: boolean): Promise<any[]> {
    if (active !== undefined) {
      return await db.query.cleanlinessFeatures.findMany({
        where: eq(cleanlinessFeatures.active, active)
      });
    }
    return await db.query.cleanlinessFeatures.findMany();
  },

  async createCleanlinessFeature(feature: any): Promise<any> {
    const [newFeature] = await db.insert(cleanlinessFeatures).values(feature).returning();
    return newFeature;
  },

  async updateCleanlinessFeature(id: number, feature: any): Promise<any | undefined> {
    const [updatedFeature] = await db.update(cleanlinessFeatures)
      .set({ ...feature, updatedAt: new Date() })
      .where(eq(cleanlinessFeatures.id, id))
      .returning();
    return updatedFeature;
  },

  async deleteCleanlinessFeature(id: number): Promise<boolean> {
    try {
      await db.delete(cleanlinessFeatures).where(eq(cleanlinessFeatures.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting cleanliness feature:', error);
      return false;
    }
  }
};