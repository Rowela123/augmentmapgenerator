import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { MapData } from '@/lib/types';
import { mapStorage } from '@/lib/storage';

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

    // Store the map data in memory
    mapStorage[mapId] = mapDataWithMeta;

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
    const maps = Object.values(mapStorage)
      .map((mapData: any) => ({
        id: mapData.id,
        title: mapData.title,
        createdAt: mapData.createdAt,
        embedUrl: `/embed/${mapData.id}`,
      }))
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(maps);
  } catch (error) {
    console.error('Error listing maps:', error);
    return NextResponse.json(
      { error: 'Failed to list maps' },
      { status: 500 }
    );
  }
}
