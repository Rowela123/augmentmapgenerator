import { NextRequest, NextResponse } from 'next/server';
import { mapStorage } from '@/lib/storage';

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

    // The demo map is now stored in the mapStorage

    // Check if map exists in storage
    // In a real app, you would fetch this from a database
    const mapData = mapStorage?.[mapId];
    if (!mapData) {
      return NextResponse.json(
        { error: 'Map not found' },
        { status: 404 }
      );
    }

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
    if (!mapStorage?.[mapId]) {
      return NextResponse.json(
        { error: 'Map not found' },
        { status: 404 }
      );
    }

    // Delete map from storage
    delete mapStorage[mapId];

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting map:', error);
    return NextResponse.json(
      { error: 'Failed to delete map' },
      { status: 500 }
    );
  }
}
