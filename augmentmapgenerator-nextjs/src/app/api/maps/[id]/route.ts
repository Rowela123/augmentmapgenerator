import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Directory to store map data
const DATA_DIR = path.join(process.cwd(), 'data');

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const mapId = params.id;
    
    // Validate map ID format
    if (!mapId || !mapId.match(/^[a-zA-Z0-9-]+$/)) {
      return NextResponse.json(
        { error: 'Invalid map ID' },
        { status: 400 }
      );
    }
    
    // Check if map exists
    const filePath = path.join(DATA_DIR, `${mapId}.json`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Map not found' },
        { status: 404 }
      );
    }
    
    // Read map data
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const mapData = JSON.parse(fileContent);
    
    return NextResponse.json(mapData);
  } catch (error) {
    console.error('Error retrieving map:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve map' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const mapId = params.id;
    
    // Validate map ID format
    if (!mapId || !mapId.match(/^[a-zA-Z0-9-]+$/)) {
      return NextResponse.json(
        { error: 'Invalid map ID' },
        { status: 400 }
      );
    }
    
    // Check if map exists
    const filePath = path.join(DATA_DIR, `${mapId}.json`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Map not found' },
        { status: 404 }
      );
    }
    
    // Delete map file
    fs.unlinkSync(filePath);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting map:', error);
    return NextResponse.json(
      { error: 'Failed to delete map' },
      { status: 500 }
    );
  }
}
