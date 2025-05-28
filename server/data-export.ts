import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { db } from './db';
import { sql } from 'drizzle-orm';

async function exportData(entityName: string, query: any): Promise<string> {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const filename = `${entityName}_export_${timestamp}.json`;
  const filePath = path.join(process.cwd(), 'exports', filename);
  
  const results = await query;
  
  fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
  
  return filename;
}

export const exportHandlers = {
  async exportRooms(req: Request, res: Response) {
    try {
      const filename = await exportData('rooms', db.query.rooms.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error('Error exporting rooms:', error);
      res.status(500).json({ success: false, message: 'Failed to export rooms' });
    }
  },

  async exportHotels(req: Request, res: Response) {
    try {
      const filename = await exportData('hotels', db.query.hotels.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error('Error exporting hotels:', error);
      res.status(500).json({ success: false, message: 'Failed to export hotels' });
    }
  },

  async exportTours(req: Request, res: Response) {
    try {
      const filename = await exportData('tours', db.query.tours.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error('Error exporting tours:', error);
      res.status(500).json({ success: false, message: 'Failed to export tours' });
    }
  },

  async exportPackages(req: Request, res: Response) {
    try {
      const filename = await exportData('packages', db.query.packages.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error('Error exporting packages:', error);
      res.status(500).json({ success: false, message: 'Failed to export packages' });
    }
  },

  async exportTransportationTypes(req: Request, res: Response) {
    try {
      const filename = await exportData('transportation_types', db.query.transportationTypes.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error('Error exporting transportation types:', error);
      res.status(500).json({ success: false, message: 'Failed to export transportation types' });
    }
  },

  async exportTransportationLocations(req: Request, res: Response) {
    try {
      const filename = await exportData('transportation_locations', db.query.transportationLocations.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error('Error exporting transportation locations:', error);
      res.status(500).json({ success: false, message: 'Failed to export transportation locations' });
    }
  },

  async exportTransportationDurations(req: Request, res: Response) {
    try {
      const filename = await exportData('transportation_durations', db.query.transportationDurations.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error('Error exporting transportation durations:', error);
      res.status(500).json({ success: false, message: 'Failed to export transportation durations' });
    }
  },

  async exportPackageCategories(req: Request, res: Response) {
    try {
      const filename = await exportData('package_categories', db.query.packageCategories.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error('Error exporting package categories:', error);
      res.status(500).json({ success: false, message: 'Failed to export package categories' });
    }
  },

  async exportRoomCategories(req: Request, res: Response) {
    try {
      const filename = await exportData('room_categories', db.query.roomCategories.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error('Error exporting room categories:', error);
      res.status(500).json({ success: false, message: 'Failed to export room categories' });
    }
  },

  async exportTourCategories(req: Request, res: Response) {
    try {
      const filename = await exportData('tour_categories', db.query.tourCategories.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error('Error exporting tour categories:', error);
      res.status(500).json({ success: false, message: 'Failed to export tour categories' });
    }
  },

  async exportHotelCategories(req: Request, res: Response) {
    try {
      const filename = await exportData('hotel_categories', db.query.hotelCategories.findMany({}));
      res.json({ success: true, filename });
    } catch (error) {
      console.error('Error exporting hotel categories:', error);
      res.status(500).json({ success: false, message: 'Failed to export hotel categories' });
    }
  },

  async exportFullDatabase(req: Request, res: Response) {
    try {
      // Get a list of all tables in the database
      const tablesResult = await db.execute(sql`
        SELECT tablename 
        FROM pg_catalog.pg_tables 
        WHERE schemaname != 'pg_catalog' 
        AND schemaname != 'information_schema'
      `);
      
      const tables = tablesResult.map((row: any) => row.tablename);
      
      // Export data from each table
      const exportData: Record<string, any> = {};
      
      for (const table of tables) {
        const results = await db.execute(sql`SELECT * FROM ${sql.identifier(table)}`);
        exportData[table] = results;
      }
      
      // Save the full database export
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const filename = `full_database_export_${timestamp}.json`;
      const filePath = path.join(process.cwd(), 'exports', filename);
      
      fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));
      
      res.json({ success: true, filename });
    } catch (error) {
      console.error('Error exporting full database:', error);
      res.status(500).json({ success: false, message: 'Failed to export full database' });
    }
  },

  async getExports(req: Request, res: Response) {
    try {
      const exportsDir = path.join(process.cwd(), 'exports');
      
      if (!fs.existsSync(exportsDir)) {
        fs.mkdirSync(exportsDir, { recursive: true });
      }
      
      const files = fs.readdirSync(exportsDir);
      
      const exports = files.map(file => {
        const filePath = path.join(exportsDir, file);
        const stats = fs.statSync(filePath);
        
        return {
          name: file,
          size: stats.size,
          created: stats.birthtime,
          isDirectory: stats.isDirectory()
        };
      }).filter(file => !file.isDirectory);
      
      // Sort by most recent first
      exports.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
      
      res.json({ success: true, exports });
    } catch (error) {
      console.error('Error getting exports:', error);
      res.status(500).json({ success: false, message: 'Failed to get exports' });
    }
  },

  async downloadExport(req: Request, res: Response) {
    try {
      const { filename } = req.params;
      const filePath = path.join(process.cwd(), 'exports', filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: 'Export file not found' });
      }
      
      res.download(filePath);
    } catch (error) {
      console.error('Error downloading export:', error);
      res.status(500).json({ success: false, message: 'Failed to download export' });
    }
  },

  async deleteExport(req: Request, res: Response) {
    try {
      const { filename } = req.params;
      const filePath = path.join(process.cwd(), 'exports', filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: 'Export file not found' });
      }
      
      fs.unlinkSync(filePath);
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting export:', error);
      res.status(500).json({ success: false, message: 'Failed to delete export' });
    }
  }
};