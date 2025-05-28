// Add this file to the repository with the hotel feature management routes

/**
 * This file contains the API routes for hotel features management
 * These routes handle facilities, highlights, and cleanliness features
 */

const setupHotelFeatureRoutes = (app, storage, isAdmin) => {
  // Hotel Facilities Routes
  app.get('/api/admin/hotel-facilities', isAdmin, async (req, res) => {
    try {
      // For now, returning hotel categories as facilities 
      const facilities = await storage.listHotelCategories();
      res.json(facilities);
    } catch (error) {
      console.error('Error fetching hotel facilities:', error);
      res.status(500).json({ error: 'Failed to fetch hotel facilities' });
    }
  });
  
  app.post('/api/admin/hotel-facilities', isAdmin, async (req, res) => {
    try {
      // For now, creating as hotel category
      const facility = await storage.createHotelCategory(req.body);
      res.status(201).json(facility);
    } catch (error) {
      console.error('Error creating hotel facility:', error);
      res.status(500).json({ error: 'Failed to create hotel facility' });
    }
  });
  
  app.put('/api/admin/hotel-facilities/:id', isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      // For now, updating as hotel category
      const facility = await storage.updateHotelCategory(parseInt(id), req.body);
      if (!facility) {
        return res.status(404).json({ error: 'Hotel facility not found' });
      }
      res.json(facility);
    } catch (error) {
      console.error('Error updating hotel facility:', error);
      res.status(500).json({ error: 'Failed to update hotel facility' });
    }
  });
  
  app.delete('/api/admin/hotel-facilities/:id', isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      // For now, deleting as hotel category
      await storage.deleteHotelCategory(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting hotel facility:', error);
      res.status(500).json({ error: 'Failed to delete hotel facility' });
    }
  });

  // Hotel Highlights Routes
  app.get('/api/admin/hotel-highlights', isAdmin, async (req, res) => {
    try {
      // For now, returning hotel categories as highlights
      const highlights = await storage.listHotelCategories();
      res.json(highlights);
    } catch (error) {
      console.error('Error fetching hotel highlights:', error);
      res.status(500).json({ error: 'Failed to fetch hotel highlights' });
    }
  });
  
  app.post('/api/admin/hotel-highlights', isAdmin, async (req, res) => {
    try {
      // For now, creating as hotel category
      const highlight = await storage.createHotelCategory(req.body);
      res.status(201).json(highlight);
    } catch (error) {
      console.error('Error creating hotel highlight:', error);
      res.status(500).json({ error: 'Failed to create hotel highlight' });
    }
  });
  
  app.put('/api/admin/hotel-highlights/:id', isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      // For now, updating as hotel category
      const highlight = await storage.updateHotelCategory(parseInt(id), req.body);
      if (!highlight) {
        return res.status(404).json({ error: 'Hotel highlight not found' });
      }
      res.json(highlight);
    } catch (error) {
      console.error('Error updating hotel highlight:', error);
      res.status(500).json({ error: 'Failed to update hotel highlight' });
    }
  });
  
  app.delete('/api/admin/hotel-highlights/:id', isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      // For now, deleting as hotel category
      await storage.deleteHotelCategory(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting hotel highlight:', error);
      res.status(500).json({ error: 'Failed to delete hotel highlight' });
    }
  });

  // Cleanliness Features Routes
  app.get('/api/admin/cleanliness-features', isAdmin, async (req, res) => {
    try {
      // For now, returning hotel categories as cleanliness features
      const features = await storage.listHotelCategories();
      res.json(features);
    } catch (error) {
      console.error('Error fetching cleanliness features:', error);
      res.status(500).json({ error: 'Failed to fetch cleanliness features' });
    }
  });
  
  app.post('/api/admin/cleanliness-features', isAdmin, async (req, res) => {
    try {
      // For now, creating as hotel category
      const feature = await storage.createHotelCategory(req.body);
      res.status(201).json(feature);
    } catch (error) {
      console.error('Error creating cleanliness feature:', error);
      res.status(500).json({ error: 'Failed to create cleanliness feature' });
    }
  });
  
  app.put('/api/admin/cleanliness-features/:id', isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      // For now, updating as hotel category
      const feature = await storage.updateHotelCategory(parseInt(id), req.body);
      if (!feature) {
        return res.status(404).json({ error: 'Cleanliness feature not found' });
      }
      res.json(feature);
    } catch (error) {
      console.error('Error updating cleanliness feature:', error);
      res.status(500).json({ error: 'Failed to update cleanliness feature' });
    }
  });
  
  app.delete('/api/admin/cleanliness-features/:id', isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      // For now, deleting as hotel category
      await storage.deleteHotelCategory(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting cleanliness feature:', error);
      res.status(500).json({ error: 'Failed to delete cleanliness feature' });
    }
  });
};

module.exports = setupHotelFeatureRoutes;