import { Express } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { exportHandlers } from './data-export';
import { importHandlers, upload } from './data-import';

export function setupExportImportRoutes(app: Express) {
  // Ensure exports directory exists
  const exportsDir = path.join(process.cwd(), 'exports');
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }

  // Data Export Routes
  app.get('/api/admin/exports', exportHandlers.getExports);
  app.get('/api/admin/exports/download/:filename', exportHandlers.downloadExport);
  app.delete('/api/admin/exports/:filename', exportHandlers.deleteExport);

  app.post('/api/admin/export/hotels', exportHandlers.exportHotels);
  app.post('/api/admin/export/rooms', exportHandlers.exportRooms);
  app.post('/api/admin/export/tours', exportHandlers.exportTours);
  app.post('/api/admin/export/packages', exportHandlers.exportPackages);
  app.post('/api/admin/export/transportation-types', exportHandlers.exportTransportationTypes);
  app.post('/api/admin/export/transportation-locations', exportHandlers.exportTransportationLocations);
  app.post('/api/admin/export/transportation-durations', exportHandlers.exportTransportationDurations);
  app.post('/api/admin/export/package-categories', exportHandlers.exportPackageCategories);
  app.post('/api/admin/export/room-categories', exportHandlers.exportRoomCategories);
  app.post('/api/admin/export/tour-categories', exportHandlers.exportTourCategories);
  app.post('/api/admin/export/hotel-categories', exportHandlers.exportHotelCategories);
  app.post('/api/admin/export/full-database', exportHandlers.exportFullDatabase);

  // Data Import Routes
  app.post('/api/admin/import/hotels', upload.single('file'), importHandlers.importHotels);
  app.post('/api/admin/import/rooms', upload.single('file'), importHandlers.importRooms);
  app.post('/api/admin/import/tours', upload.single('file'), importHandlers.importTours);
  app.post('/api/admin/import/packages', upload.single('file'), importHandlers.importPackages);
  app.post('/api/admin/import/transportation-types', upload.single('file'), importHandlers.importTransportationTypes);
  app.post('/api/admin/import/transportation-locations', upload.single('file'), importHandlers.importTransportationLocations);
  app.post('/api/admin/import/transportation-durations', upload.single('file'), importHandlers.importTransportationDurations);
  app.post('/api/admin/import/package-categories', upload.single('file'), importHandlers.importPackageCategories);
  app.post('/api/admin/import/room-categories', upload.single('file'), importHandlers.importRoomCategories);
  app.post('/api/admin/import/tour-categories', upload.single('file'), importHandlers.importTourCategories);
  app.post('/api/admin/import/hotel-categories', upload.single('file'), importHandlers.importHotelCategories);
  app.post('/api/admin/import/full-database', upload.single('file'), importHandlers.importFullDatabase);
}