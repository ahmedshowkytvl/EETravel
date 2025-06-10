const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Mock hero slides endpoint for testing
app.get('/api/hero-slides/active', (req, res) => {
  const slides = [
    {
      id: 1,
      title: 'Journey Through Time',
      subtitle: 'Egypt & Jordan Adventures',
      description: 'Experience the mysteries of the pyramids and the beauty of Petra in our exclusive Middle Eastern tours.',
      imageUrl: '/assets/desert-sunset.jpg',
      buttonText: 'Explore Now',
      buttonLink: '/destinations',
      secondaryButtonText: 'Learn More',
      secondaryButtonLink: '/about',
      order: 1,
      active: true
    }
  ];
  res.json(slides);
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});