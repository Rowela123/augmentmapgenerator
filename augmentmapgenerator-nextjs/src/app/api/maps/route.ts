import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { MapData } from '@/lib/types';

// Directory to store map data
const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const mapData: MapData = await request.json();
    
    // Generate a unique ID for the map
    const mapId = uuidv4();
    
    // Add creation timestamp
    const mapDataWithMeta = {
      ...mapData,
      id: mapId,
      createdAt: new Date().toISOString(),
    };
    
    // Save the map data to a file
    const filePath = path.join(DATA_DIR, `${mapId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(mapDataWithMeta, null, 2));
    
    // Return the map ID and embed URL
    return NextResponse.json({
      id: mapId,
      embedUrl: `/embed/${mapId}`,
      createdAt: mapDataWithMeta.createdAt,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating map:', error);
    return NextResponse.json(
      { error: 'Failed to create map' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get list of all maps
    const files = fs.readdirSync(DATA_DIR);
    
    // Read each map file and extract basic info
    const maps = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(DATA_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const mapData = JSON.parse(fileContent);
        
        return {
          id: mapData.id,
          title: mapData.title,
          createdAt: mapData.createdAt,
          embedUrl: `/embed/${mapData.id}`,
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json(maps);
  } catch (error) {
    console.error('Error listing maps:', error);
    return NextResponse.json(
      { error: 'Failed to list maps' },
      { status: 500 }
    );
  }
}
