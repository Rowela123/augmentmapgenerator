// Simple API endpoint to retrieve map data
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get map ID from query parameters
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'No map ID provided' });
    }

    // Construct the file path
    const dataDir = path.join('/tmp', 'map-data');
    const filePath = path.join(dataDir, `${id}.json`);
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Map not found' });
    }
    
    // Read the map data from the file
    const mapData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Return the map data
    res.status(200).json(mapData);
  } catch (error) {
    console.error('Error retrieving map data:', error);
    res.status(500).json({ error: 'Failed to retrieve map data' });
  }
};
