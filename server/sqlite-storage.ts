import { eq, and, sql, desc, asc } from "drizzle-orm";
import * as schema from "@shared/schema-sqlite";
import { db } from "./db";
import { IStorage } from "./storage";
import bcrypt from "bcryptjs";

// SQLite storage implementation for local development
export class SQLiteStorage implements IStorage {
  
  // Transport Type methods
  async getTransportType(id: number): Promise<schema.TransportType | undefined> {
    return await db.query.transportTypes.findFirst({
      where: eq(schema.transportTypes.id, id)
    });
  }

  async listTransportTypes(active?: boolean): Promise<schema.TransportType[]> {
    try {
      if (active !== undefined) {
        return await db.select().from(schema.transportTypes).where(
          eq(schema.transportTypes.status, active ? "active" : "inactive")
        );
      }
      return await db.select().from(schema.transportTypes);
    } catch (error) {
      console.error("Error listing transport types:", error);
      return [];
    }
  }

  async createTransportType(data: schema.InsertTransportType): Promise<schema.TransportType> {
    try {
      // Handle features - SQLite needs JSON as string
      const formattedData = {
        ...data,
        defaultFeatures: Array.isArray(data.defaultFeatures) 
          ? JSON.stringify(data.defaultFeatures) 
          : data.defaultFeatures
      };
      
      const [newType] = await db.insert(schema.transportTypes)
        .values({
          ...formattedData,
          createdAt: String(new Date()),
          updatedAt: String(new Date())
        })
        .returning();
      
      // Parse features back to array for consistent return type
      return {
        ...newType,
        defaultFeatures: typeof newType.defaultFeatures === 'string' 
          ? JSON.parse(newType.defaultFeatures) 
          : newType.defaultFeatures
      };
    } catch (error) {
      console.error("Error creating transport type:", error);
      throw error;
    }
  }

  async updateTransportType(id: number, data: Partial<schema.InsertTransportType>): Promise<schema.TransportType | undefined> {
    try {
      // Handle features - SQLite needs JSON as string
      const formattedData = {
        ...data,
        defaultFeatures: Array.isArray(data.defaultFeatures) 
          ? JSON.stringify(data.defaultFeatures) 
          : data.defaultFeatures,
        updatedAt: String(new Date())
      };
      
      const [updatedType] = await db.update(schema.transportTypes)
        .set(formattedData)
        .where(eq(schema.transportTypes.id, id))
        .returning();
      
      if (!updatedType) return undefined;
      
      // Parse features back to array for consistent return type
      return {
        ...updatedType,
        defaultFeatures: typeof updatedType.defaultFeatures === 'string' 
          ? JSON.parse(updatedType.defaultFeatures) 
          : updatedType.defaultFeatures
      };
    } catch (error) {
      console.error(`Error updating transport type with ID ${id}:`, error);
      return undefined;
    }
  }

  async deleteTransportType(id: number): Promise<boolean> {
    try {
      await db.delete(schema.transportTypes)
        .where(eq(schema.transportTypes.id, id));
      return true;
    } catch (error) {
      console.error(`Error deleting transport type with ID ${id}:`, error);
      return false;
    }
  }
  
  // Stub implementations for the other methods required by IStorage
  // These will need to be implemented as needed
  
  // User methods
  async getUser(id: number): Promise<any> {
    throw new Error("Method not implemented");
  }
  
  async getUserByUsername(username: string): Promise<any> {
    throw new Error("Method not implemented");
  }
  
  async listUsers(): Promise<any[]> {
    throw new Error("Method not implemented");
  }
  
  async createUser(user: any): Promise<any> {
    throw new Error("Method not implemented");
  }
  
  async updateUser(id: number, userData: any): Promise<any> {
    throw new Error("Method not implemented");
  }
  
  async deleteUser(id: number): Promise<boolean> {
    throw new Error("Method not implemented");
  }
  
  // Add other required method stubs here
  // These will be implemented as needed for each feature
  
  // Required for IStorage interface
  async listHotelFacilities(): Promise<any[]> { return []; }
  async getHotelFacility(id: number): Promise<any> { return null; }
  async createHotelFacility(facility: any): Promise<any> { throw new Error("Not implemented"); }
  async updateHotelFacility(id: number, facility: any): Promise<any> { throw new Error("Not implemented"); }
  async deleteHotelFacility(id: number): Promise<boolean> { return false; }
  
  async listHotelHighlights(): Promise<any[]> { return []; }
  async getHotelHighlight(id: number): Promise<any> { return null; }
  async createHotelHighlight(highlight: any): Promise<any> { throw new Error("Not implemented"); }
  async updateHotelHighlight(id: number, highlight: any): Promise<any> { throw new Error("Not implemented"); }
  async deleteHotelHighlight(id: number): Promise<boolean> { return false; }
  
  async listCleanlinessFeatures(): Promise<any[]> { return []; }
  async getCleanlinessFeature(id: number): Promise<any> { return null; }
  async createCleanlinessFeature(feature: any): Promise<any> { throw new Error("Not implemented"); }
  async updateCleanlinessFeature(id: number, feature: any): Promise<any> { throw new Error("Not implemented"); }
  async deleteCleanlinessFeature(id: number): Promise<boolean> { return false; }
}