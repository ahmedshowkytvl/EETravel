import { db } from './db';
import { 
  nationalities, Nationality, InsertNationality,
  visas, Visa, InsertVisa,
  nationalityVisaRequirements, NationalityVisaRequirement, InsertNationalityVisaRequirement,
  countries
} from '@shared/schema';
import { eq, and, or } from 'drizzle-orm';

// Nationality methods
export const nationalityImplementation = {
  async getNationality(id: number): Promise<Nationality | undefined> {
    const [nationality] = await db.select().from(nationalities).where(eq(nationalities.id, id));
    return nationality;
  },

  async listNationalities(active?: boolean): Promise<Nationality[]> {
    if (active !== undefined) {
      return db.select().from(nationalities).where(eq(nationalities.active, active));
    }
    return db.select().from(nationalities);
  },

  async createNationality(data: InsertNationality): Promise<Nationality> {
    const [newNationality] = await db.insert(nationalities).values(data).returning();
    return newNationality;
  },

  async updateNationality(id: number, data: Partial<InsertNationality>): Promise<Nationality | undefined> {
    const [updatedNationality] = await db.update(nationalities)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(nationalities.id, id))
      .returning();
    return updatedNationality;
  },

  async deleteNationality(id: number): Promise<boolean> {
    try {
      await db.delete(nationalities).where(eq(nationalities.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting nationality:', error);
      return false;
    }
  }
};

// Visa methods
export const visaImplementation = {
  async getVisa(id: number): Promise<Visa | undefined> {
    const [visa] = await db.select().from(visas).where(eq(visas.id, id));
    return visa;
  },

  async listVisas(active?: boolean): Promise<Visa[]> {
    if (active !== undefined) {
      return db.select().from(visas).where(eq(visas.active, active));
    }
    return db.select().from(visas);
  },

  async getVisasByCountry(countryId: number): Promise<Visa[]> {
    return db.select().from(visas).where(eq(visas.targetCountryId, countryId));
  },

  async createVisa(data: InsertVisa): Promise<Visa> {
    const [newVisa] = await db.insert(visas).values(data).returning();
    return newVisa;
  },

  async updateVisa(id: number, data: Partial<InsertVisa>): Promise<Visa | undefined> {
    const [updatedVisa] = await db.update(visas)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(visas.id, id))
      .returning();
    return updatedVisa;
  },

  async deleteVisa(id: number): Promise<boolean> {
    try {
      await db.delete(visas).where(eq(visas.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting visa:', error);
      return false;
    }
  }
};

// Nationality visa requirement methods
export const nationalityVisaRequirementImplementation = {
  async getNationalityVisaRequirement(id: number): Promise<NationalityVisaRequirement | undefined> {
    const [requirement] = await db.select().from(nationalityVisaRequirements).where(eq(nationalityVisaRequirements.id, id));
    return requirement;
  },

  async getNationalityVisaRequirementByVisaAndNationality(visaId: number, nationalityId: number): Promise<NationalityVisaRequirement | undefined> {
    const [requirement] = await db.select().from(nationalityVisaRequirements)
      .where(and(
        eq(nationalityVisaRequirements.visaId, visaId),
        eq(nationalityVisaRequirements.nationalityId, nationalityId)
      ));
    return requirement;
  },

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
  },

  async createNationalityVisaRequirement(data: InsertNationalityVisaRequirement): Promise<NationalityVisaRequirement> {
    const [newRequirement] = await db.insert(nationalityVisaRequirements).values(data).returning();
    return newRequirement;
  },

  async updateNationalityVisaRequirement(id: number, data: Partial<InsertNationalityVisaRequirement>): Promise<NationalityVisaRequirement | undefined> {
    const [updatedRequirement] = await db.update(nationalityVisaRequirements)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(nationalityVisaRequirements.id, id))
      .returning();
    return updatedRequirement;
  },

  async deleteNationalityVisaRequirement(id: number): Promise<boolean> {
    try {
      await db.delete(nationalityVisaRequirements).where(eq(nationalityVisaRequirements.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting nationality visa requirement:', error);
      return false;
    }
  }
};