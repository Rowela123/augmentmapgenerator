'use client';

import { useEffect, useState } from 'react';
import { USMap } from '@/components/USMapNew';
import { MapData } from '@/lib/types';

export default function EmbedPage({ params }: { params: { id: string } }) {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMapData() {
      try {
        const response = await fetch(`/api/maps/${params.id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch map data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setMapData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching map data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load map data');
        setLoading(false);
      }
    }

    fetchMapData();
  }, [params.id]);

  if (loading) {
    return <div className="loading">Loading map...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!mapData) {
    return <div className="error">Map not found</div>;
  }

  return (
    <div className="map-container">
      <USMap
        stateData={mapData.stateData}
        colorScheme={mapData.colorScheme}
        title={mapData.title}
        legendTitle={mapData.legendTitle}
        legendMinLabel={mapData.legendMinLabel}
        legendMaxLabel={mapData.legendMaxLabel}
        showLabels={mapData.showLabels}
        customColors={mapData.customColors || {}}
      />
    </div>
  );
}
