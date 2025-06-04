import { Express, Request, Response } from "express";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { heroSlides } from '../shared/schema';
import { eq, asc, desc } from 'drizzle-orm';

export function setupHeroSlidesRoutes(app: Express) {
  // Get all hero slides (admin)
  app.get('/api/hero-slides', async (req: Request, res: Response) => {
    let client: any = null;
    
    try {
      const DATABASE_URL = process.env.DATABASE_URL;
      if (!DATABASE_URL) {
        return res.status(500).json({ message: 'Database configuration missing' });
      }

      client = postgres(DATABASE_URL, { ssl: 'require' });
      const db = drizzle(client);

      const slides = await db
        .select()
        .from(heroSlides)
        .orderBy(asc(heroSlides.order), asc(heroSlides.id));

      await client.end();
      res.json(slides);
    } catch (error) {
      if (client) {
        try {
          await client.end();
        } catch (closeError) {
          console.error('Error closing database connection:', closeError);
        }
      }
      console.error('Error fetching hero slides:', error);
      res.status(500).json({ message: 'Failed to fetch slides' });
    }
  });

  // Get active hero slides (public)
  app.get('/api/hero-slides/active', async (req: Request, res: Response) => {
    let client: any = null;
    
    try {
      const DATABASE_URL = process.env.DATABASE_URL;
      if (!DATABASE_URL) {
        return res.status(500).json({ message: 'Database configuration missing' });
      }

      client = postgres(DATABASE_URL, { ssl: 'require' });
      const db = drizzle(client);

      const slides = await db
        .select()
        .from(heroSlides)
        .where(eq(heroSlides.active, true))
        .orderBy(asc(heroSlides.order), asc(heroSlides.id));

      await client.end();
      res.json(slides);
    } catch (error) {
      if (client) {
        try {
          await client.end();
        } catch (closeError) {
          console.error('Error closing database connection:', closeError);
        }
      }
      console.error('Error fetching active hero slides:', error);
      res.status(500).json({ message: 'Failed to fetch slides' });
    }
  });

  // Create new hero slide
  app.post('/api/hero-slides', async (req: Request, res: Response) => {
    let client: any = null;
    
    try {
      const {
        title,
        subtitle,
        description,
        imageUrl,
        buttonText,
        buttonLink,
        secondaryButtonText,
        secondaryButtonLink,
        order = 0,
        active = true
      } = req.body;

      if (!title || !imageUrl) {
        return res.status(400).json({ message: 'Title and image URL are required' });
      }

      const DATABASE_URL = process.env.DATABASE_URL;
      if (!DATABASE_URL) {
        return res.status(500).json({ message: 'Database configuration missing' });
      }

      client = postgres(DATABASE_URL, { ssl: 'require' });
      const db = drizzle(client);

      const [newSlide] = await db
        .insert(heroSlides)
        .values({
          title,
          subtitle,
          description,
          imageUrl,
          buttonText,
          buttonLink,
          secondaryButtonText,
          secondaryButtonLink,
          order,
          active
        })
        .returning();

      await client.end();
      res.status(201).json(newSlide);
    } catch (error) {
      if (client) {
        try {
          await client.end();
        } catch (closeError) {
          console.error('Error closing database connection:', closeError);
        }
      }
      console.error('Error creating hero slide:', error);
      res.status(500).json({ message: 'Failed to create slide' });
    }
  });

  // Update hero slide
  app.put('/api/hero-slides/:id', async (req: Request, res: Response) => {
    let client: any = null;
    
    try {
      const slideId = parseInt(req.params.id);
      const updateData = req.body;

      if (isNaN(slideId)) {
        return res.status(400).json({ message: 'Invalid slide ID' });
      }

      const DATABASE_URL = process.env.DATABASE_URL;
      if (!DATABASE_URL) {
        return res.status(500).json({ message: 'Database configuration missing' });
      }

      client = postgres(DATABASE_URL, { ssl: 'require' });
      const db = drizzle(client);

      const [updatedSlide] = await db
        .update(heroSlides)
        .set({
          ...updateData,
          updatedAt: new Date()
        })
        .where(eq(heroSlides.id, slideId))
        .returning();

      if (!updatedSlide) {
        await client.end();
        return res.status(404).json({ message: 'Slide not found' });
      }

      await client.end();
      res.json(updatedSlide);
    } catch (error) {
      if (client) {
        try {
          await client.end();
        } catch (closeError) {
          console.error('Error closing database connection:', closeError);
        }
      }
      console.error('Error updating hero slide:', error);
      res.status(500).json({ message: 'Failed to update slide' });
    }
  });

  // Delete hero slide
  app.delete('/api/hero-slides/:id', async (req: Request, res: Response) => {
    let client: any = null;
    
    try {
      const slideId = parseInt(req.params.id);

      if (isNaN(slideId)) {
        return res.status(400).json({ message: 'Invalid slide ID' });
      }

      const DATABASE_URL = process.env.DATABASE_URL;
      if (!DATABASE_URL) {
        return res.status(500).json({ message: 'Database configuration missing' });
      }

      client = postgres(DATABASE_URL, { ssl: 'require' });
      const db = drizzle(client);

      const [deletedSlide] = await db
        .delete(heroSlides)
        .where(eq(heroSlides.id, slideId))
        .returning();

      if (!deletedSlide) {
        await client.end();
        return res.status(404).json({ message: 'Slide not found' });
      }

      await client.end();
      res.json({ message: 'Slide deleted successfully' });
    } catch (error) {
      if (client) {
        try {
          await client.end();
        } catch (closeError) {
          console.error('Error closing database connection:', closeError);
        }
      }
      console.error('Error deleting hero slide:', error);
      res.status(500).json({ message: 'Failed to delete slide' });
    }
  });
}