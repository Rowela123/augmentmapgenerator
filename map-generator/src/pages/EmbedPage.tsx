import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import USMap from '../components/USMap';
import { StateData } from '../types/dataTypes';

const EmbedContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
`;

interface EmbedPageParams {
  mapId: string;
}

const EmbedPage: React.FC = () => {
  const { mapId } = useParams<EmbedPageParams>();
  const [stateData, setStateData] = useState<StateData[]>([]);
  const [colorScheme, setColorScheme] = useState<string>('blues');
  const [mapTitle, setMapTitle] = useState<string>('');
  const [legendTitle, setLegendTitle] = useState<string>('');
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // In a real application, this would fetch the map data from a backend
    // For now, we'll simulate loading data from localStorage
    try {
      const savedMap = localStorage.getItem(`map_${mapId}`);
      
      if (savedMap) {
        const mapData = JSON.parse(savedMap);
        setStateData(mapData.stateData || []);
        setColorScheme(mapData.colorScheme || 'blues');
        setMapTitle(mapData.title || '');
        setLegendTitle(mapData.legendTitle || '');
        setShowLabels(mapData.showLabels !== undefined ? mapData.showLabels : true);
      } else {
        setError('Map not found');
      }
    } catch (err) {
      setError('Error loading map data');
    } finally {
      setLoading(false);
    }
  }, [mapId]);

  if (loading) {
    return <div>Loading map...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <EmbedContainer>
      <USMap
        data={stateData}
        colorScheme={colorScheme}
        title={mapTitle}
        legendTitle={legendTitle}
        showLabels={showLabels}
        isEmbed={true}
      />
    </EmbedContainer>
  );
};

export default EmbedPage;
