import React, { useState } from 'react';
import styled from 'styled-components';
import USMap from '../components/USMap';
import DataUploader from '../components/DataUploader';
import ColorSchemeSelector from '../components/ColorSchemeSelector';
import MapSettings from '../components/MapSettings';
import EmbedCodeGenerator from '../components/EmbedCodeGenerator';
import { StateData } from '../types/dataTypes';

const EditorContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MapContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: var(--primary-color);
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
`;

const MapEditorPage: React.FC = () => {
  const [stateData, setStateData] = useState<StateData[]>([]);
  const [colorScheme, setColorScheme] = useState<string>('blues');
  const [mapTitle, setMapTitle] = useState<string>('US Map');
  const [legendTitle, setLegendTitle] = useState<string>('Legend');
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [mapId, setMapId] = useState<string>('');

  const handleDataUpload = (data: StateData[]) => {
    setStateData(data);
    // Generate a unique ID for the map
    setMapId(Date.now().toString());
  };

  const handleColorSchemeChange = (scheme: string) => {
    setColorScheme(scheme);
  };

  const handleSettingsChange = (
    title: string,
    legend: string,
    labels: boolean
  ) => {
    setMapTitle(title);
    setLegendTitle(legend);
    setShowLabels(labels);
  };

  return (
    <EditorContainer>
      <MapContainer>
        <USMap
          data={stateData}
          colorScheme={colorScheme}
          title={mapTitle}
          legendTitle={legendTitle}
          showLabels={showLabels}
        />
      </MapContainer>

      <SidebarContainer>
        <SectionCard>
          <SectionTitle>Upload Data</SectionTitle>
          <DataUploader onDataUpload={handleDataUpload} />
        </SectionCard>

        <SectionCard>
          <SectionTitle>Color Scheme</SectionTitle>
          <ColorSchemeSelector
            selectedScheme={colorScheme}
            onSchemeChange={handleColorSchemeChange}
          />
        </SectionCard>

        <SectionCard>
          <SectionTitle>Map Settings</SectionTitle>
          <MapSettings
            title={mapTitle}
            legendTitle={legendTitle}
            showLabels={showLabels}
            onSettingsChange={handleSettingsChange}
          />
        </SectionCard>

        <SectionCard>
          <SectionTitle>Embed Code</SectionTitle>
          <EmbedCodeGenerator mapId={mapId} />
        </SectionCard>
      </SidebarContainer>
    </EditorContainer>
  );
};

export default MapEditorPage;
