// Simple API endpoint to save map data
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get map data from request body
    const mapData = req.body;
    
    if (!mapData) {
      return res.status(400).json({ error: 'No map data provided' });
    }

    // Generate a unique ID for the map
    const mapId = uuidv4();
    
    // Create data directory if it doesn't exist
    const dataDir = path.join('/tmp', 'map-data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Save map data to a JSON file
    const filePath = path.join(dataDir, `${mapId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(mapData));
    
    // Return the map ID
    res.status(200).json({ 
      success: true, 
      mapId,
      embedUrl: `https://augmentmapgenerator.vercel.app/embed/${mapId}`,
      embedCode: `<iframe src="https://augmentmapgenerator.vercel.app/embed/${mapId}" width="100%" height="500" frameborder="0"></iframe>`
    });
  } catch (error) {
    console.error('Error saving map data:', error);
    res.status(500).json({ error: 'Failed to save map data' });
  }
};
