import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface MapSettingsProps {
  title: string;
  legendTitle: string;
  showLabels: boolean;
  onSettingsChange: (title: string, legendTitle: string, showLabels: boolean) => void;
}

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: var(--text-color);
`;

const Input = styled.input`
  padding: 8px 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(42, 96, 153, 0.2);
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CheckboxInput = styled.input`
  margin: 0;
`;

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: var(--secondary-color);
  }
`;

const MapSettings: React.FC<MapSettingsProps> = ({
  title,
  legendTitle,
  showLabels,
  onSettingsChange,
}) => {
  const [mapTitle, setMapTitle] = useState(title);
  const [mapLegendTitle, setMapLegendTitle] = useState(legendTitle);
  const [mapShowLabels, setMapShowLabels] = useState(showLabels);

  useEffect(() => {
    setMapTitle(title);
    setMapLegendTitle(legendTitle);
    setMapShowLabels(showLabels);
  }, [title, legendTitle, showLabels]);

  const handleApplySettings = () => {
    onSettingsChange(mapTitle, mapLegendTitle, mapShowLabels);
  };

  return (
    <SettingsContainer>
      <FormGroup>
        <Label htmlFor="map-title">Map Title</Label>
        <Input
          id="map-title"
          type="text"
          value={mapTitle}
          onChange={(e) => setMapTitle(e.target.value)}
          placeholder="Enter map title"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="legend-title">Legend Title</Label>
        <Input
          id="legend-title"
          type="text"
          value={mapLegendTitle}
          onChange={(e) => setMapLegendTitle(e.target.value)}
          placeholder="Enter legend title"
        />
      </FormGroup>

      <Checkbox>
        <CheckboxInput
          id="show-labels"
          type="checkbox"
          checked={mapShowLabels}
          onChange={(e) => setMapShowLabels(e.target.checked)}
        />
        <Label htmlFor="show-labels">Show State Labels</Label>
      </Checkbox>

      <Button onClick={handleApplySettings}>Apply Settings</Button>
    </SettingsContainer>
  );
};

export default MapSettings;
