import { Request, Response, NextFunction, Express } from 'express';
import { IStorage } from './storage';
import { insertVisaSchema, insertNationalitySchema, insertNationalityVisaRequirementSchema } from '@shared/schema';
import { z } from 'zod';

export function setupVisaRoutes(app: Express, storage: IStorage, isAdmin: (req: Request, res: Response, next: NextFunction) => void) {
  // Get all visas
  app.get('/api/visas', async (req: Request, res: Response) => {
    try {
      const visas = await storage.listVisas();
      res.json(visas);
    } catch (error) {
      console.error('Error fetching visas:', error);
      res.status(500).json({ message: 'Failed to fetch visas' });
    }
  });

  // Get visa by ID
  app.get('/api/visas/:id', async (req: Request, res: Response) => {
    try {
      const visa = await storage.getVisa(Number(req.params.id));
      if (!visa) {
        return res.status(404).json({ message: 'Visa not found' });
      }
      res.json(visa);
    } catch (error) {
      console.error('Error fetching visa:', error);
      res.status(500).json({ message: 'Failed to fetch visa' });
    }
  });

  // Get visas by country
  app.get('/api/visas/country/:countryId', async (req: Request, res: Response) => {
    try {
      const visas = await storage.getVisasByCountry(Number(req.params.countryId));
      res.json(visas);
    } catch (error) {
      console.error('Error fetching visas by country:', error);
      res.status(500).json({ message: 'Failed to fetch visas by country' });
    }
  });

  // Create visa (admin only)
  app.post('/api/visas', isAdmin, async (req: Request, res: Response) => {
    try {
      const parsedBody = insertVisaSchema.parse(req.body);
      const newVisa = await storage.createVisa(parsedBody);
      res.status(201).json(newVisa);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      console.error('Error creating visa:', error);
      res.status(500).json({ message: 'Failed to create visa' });
    }
  });

  // Update visa (admin only)
  app.put('/api/visas/:id', isAdmin, async (req: Request, res: Response) => {
    try {
      const visa = await storage.getVisa(Number(req.params.id));
      if (!visa) {
        return res.status(404).json({ message: 'Visa not found' });
      }
      
      const parsedBody = insertVisaSchema.partial().parse(req.body);
      const updatedVisa = await storage.updateVisa(Number(req.params.id), parsedBody);
      res.json(updatedVisa);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      console.error('Error updating visa:', error);
      res.status(500).json({ message: 'Failed to update visa' });
    }
  });

  // Delete visa (admin only)
  app.delete('/api/visas/:id', isAdmin, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteVisa(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ message: 'Visa not found or could not be deleted' });
      }
      res.json({ message: 'Visa deleted successfully' });
    } catch (error) {
      console.error('Error deleting visa:', error);
      res.status(500).json({ message: 'Failed to delete visa' });
    }
  });

  // ========================= Nationalities Routes =========================
  
  // Get all nationalities
  app.get('/api/nationalities', async (req: Request, res: Response) => {
    try {
      const active = req.query.active === 'true' ? true : undefined;
      const nationalities = await storage.listNationalities(active);
      res.json(nationalities);
    } catch (error) {
      console.error('Error fetching nationalities:', error);
      res.status(500).json({ message: 'Failed to fetch nationalities' });
    }
  });

  // Get nationality by ID
  app.get('/api/nationalities/:id', async (req: Request, res: Response) => {
    try {
      const nationality = await storage.getNationality(Number(req.params.id));
      if (!nationality) {
        return res.status(404).json({ message: 'Nationality not found' });
      }
      res.json(nationality);
    } catch (error) {
      console.error('Error fetching nationality:', error);
      res.status(500).json({ message: 'Failed to fetch nationality' });
    }
  });

  // Create nationality (admin only)
  app.post('/api/nationalities', isAdmin, async (req: Request, res: Response) => {
    try {
      const parsedBody = insertNationalitySchema.parse(req.body);
      const newNationality = await storage.createNationality(parsedBody);
      res.status(201).json(newNationality);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      console.error('Error creating nationality:', error);
      res.status(500).json({ message: 'Failed to create nationality' });
    }
  });

  // Update nationality (admin only)
  app.put('/api/nationalities/:id', isAdmin, async (req: Request, res: Response) => {
    try {
      const nationality = await storage.getNationality(Number(req.params.id));
      if (!nationality) {
        return res.status(404).json({ message: 'Nationality not found' });
      }
      
      const parsedBody = insertNationalitySchema.partial().parse(req.body);
      const updatedNationality = await storage.updateNationality(Number(req.params.id), parsedBody);
      res.json(updatedNationality);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      console.error('Error updating nationality:', error);
      res.status(500).json({ message: 'Failed to update nationality' });
    }
  });

  // Delete nationality (admin only)
  app.delete('/api/nationalities/:id', isAdmin, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteNationality(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ message: 'Nationality not found or could not be deleted' });
      }
      res.json({ message: 'Nationality deleted successfully' });
    } catch (error) {
      console.error('Error deleting nationality:', error);
      res.status(500).json({ message: 'Failed to delete nationality' });
    }
  });

  // ========================= Nationality Visa Requirements Routes =========================
  
  // Get all nationality visa requirements
  app.get('/api/nationality-visa-requirements', async (req: Request, res: Response) => {
    try {
      const visaId = req.query.visaId ? Number(req.query.visaId) : undefined;
      const nationalityId = req.query.nationalityId ? Number(req.query.nationalityId) : undefined;
      const requirements = await storage.listNationalityVisaRequirements(visaId, nationalityId);
      res.json(requirements);
    } catch (error) {
      console.error('Error fetching nationality visa requirements:', error);
      res.status(500).json({ message: 'Failed to fetch nationality visa requirements' });
    }
  });

  // Get nationality visa requirement by ID
  app.get('/api/nationality-visa-requirements/:id', async (req: Request, res: Response) => {
    try {
      const requirement = await storage.getNationalityVisaRequirement(Number(req.params.id));
      if (!requirement) {
        return res.status(404).json({ message: 'Nationality visa requirement not found' });
      }
      res.json(requirement);
    } catch (error) {
      console.error('Error fetching nationality visa requirement:', error);
      res.status(500).json({ message: 'Failed to fetch nationality visa requirement' });
    }
  });

  // Get nationality visa requirement by visa and nationality
  app.get('/api/nationality-visa-requirements/visa/:visaId/nationality/:nationalityId', async (req: Request, res: Response) => {
    try {
      const requirement = await storage.getNationalityVisaRequirementByVisaAndNationality(
        Number(req.params.visaId),
        Number(req.params.nationalityId)
      );
      if (!requirement) {
        return res.status(404).json({ message: 'Nationality visa requirement not found' });
      }
      res.json(requirement);
    } catch (error) {
      console.error('Error fetching nationality visa requirement:', error);
      res.status(500).json({ message: 'Failed to fetch nationality visa requirement' });
    }
  });

  // Create nationality visa requirement (admin only)
  app.post('/api/nationality-visa-requirements', isAdmin, async (req: Request, res: Response) => {
    try {
      const parsedBody = insertNationalityVisaRequirementSchema.parse(req.body);
      const newRequirement = await storage.createNationalityVisaRequirement(parsedBody);
      res.status(201).json(newRequirement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      console.error('Error creating nationality visa requirement:', error);
      res.status(500).json({ message: 'Failed to create nationality visa requirement' });
    }
  });

  // Update nationality visa requirement (admin only)
  app.put('/api/nationality-visa-requirements/:id', isAdmin, async (req: Request, res: Response) => {
    try {
      const requirement = await storage.getNationalityVisaRequirement(Number(req.params.id));
      if (!requirement) {
        return res.status(404).json({ message: 'Nationality visa requirement not found' });
      }
      
      const parsedBody = insertNationalityVisaRequirementSchema.partial().parse(req.body);
      const updatedRequirement = await storage.updateNationalityVisaRequirement(Number(req.params.id), parsedBody);
      res.json(updatedRequirement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      console.error('Error updating nationality visa requirement:', error);
      res.status(500).json({ message: 'Failed to update nationality visa requirement' });
    }
  });

  // Delete nationality visa requirement (admin only)
  app.delete('/api/nationality-visa-requirements/:id', isAdmin, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteNationalityVisaRequirement(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ message: 'Nationality visa requirement not found or could not be deleted' });
      }
      res.json({ message: 'Nationality visa requirement deleted successfully' });
    } catch (error) {
      console.error('Error deleting nationality visa requirement:', error);
      res.status(500).json({ message: 'Failed to delete nationality visa requirement' });
    }
  });
}