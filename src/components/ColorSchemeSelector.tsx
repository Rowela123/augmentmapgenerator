import React from 'react';
import styled from 'styled-components';

interface ColorSchemeProps {
  selectedScheme: string;
  onSchemeChange: (scheme: string) => void;
}

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SchemeOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const SchemeOption = styled.div<{ $selected: boolean }>`
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
  border: 2px solid ${props => props.$selected ? 'var(--primary-color)' : 'transparent'};
  box-shadow: ${props => props.$selected ? '0 0 0 2px var(--primary-color)' : 'none'};
  
  &:hover {
    transform: scale(1.05);
  }
`;

const BluesScheme = styled(SchemeOption)`
  background: linear-gradient(to right, #f7fbff, #deebf7, #c6dbef, #9ecae1, #6baed6, #4292c6, #2171b5, #084594);
`;

const GreensScheme = styled(SchemeOption)`
  background: linear-gradient(to right, #f7fcf5, #e5f5e0, #c7e9c0, #a1d99b, #74c476, #41ab5d, #238b45, #005a32);
`;

const RedsScheme = styled(SchemeOption)`
  background: linear-gradient(to right, #fff5f0, #fee0d2, #fcbba1, #fc9272, #fb6a4a, #ef3b2c, #cb181d, #99000d);
`;

const PurplesScheme = styled(SchemeOption)`
  background: linear-gradient(to right, #fcfbfd, #efedf5, #dadaeb, #bcbddc, #9e9ac8, #807dba, #6a51a3, #4a1486);
`;

const OrangesScheme = styled(SchemeOption)`
  background: linear-gradient(to right, #fff5eb, #fee6ce, #fdd0a2, #fdae6b, #fd8d3c, #f16913, #d94801, #8c2d04);
`;

const ViridisScheme = styled(SchemeOption)`
  background: linear-gradient(to right, #440154, #482777, #3f4a8a, #31678e, #26838f, #1f9d8a, #6cce5a, #fde725);
`;

const ColorSchemeSelector = ({ selectedScheme, onSchemeChange }: ColorSchemeProps) => {
  return (
    <SelectorContainer>
      <SchemeOptions>
        <BluesScheme 
          $selected={selectedScheme === 'blues'} 
          onClick={() => onSchemeChange('blues')}
          title="Blues"
        />
        <GreensScheme 
          $selected={selectedScheme === 'greens'} 
          onClick={() => onSchemeChange('greens')}
          title="Greens"
        />
        <RedsScheme 
          $selected={selectedScheme === 'reds'} 
          onClick={() => onSchemeChange('reds')}
          title="Reds"
        />
        <PurplesScheme 
          $selected={selectedScheme === 'purples'} 
          onClick={() => onSchemeChange('purples')}
          title="Purples"
        />
        <OrangesScheme 
          $selected={selectedScheme === 'oranges'} 
          onClick={() => onSchemeChange('oranges')}
          title="Oranges"
        />
        <ViridisScheme 
          $selected={selectedScheme === 'viridis'} 
          onClick={() => onSchemeChange('viridis')}
          title="Viridis"
        />
      </SchemeOptions>
    </SelectorContainer>
  );
};

export default ColorSchemeSelector;
