import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { geoAlbersUsa, geoPath } from 'd3-geo';

// Types
import { StateData, StateFeature } from '../types/dataTypes';

// US TopoJSON data
import usTopoJson from '../data/us-states.json';

interface USMapProps {
  data: StateData[];
  colorScheme: string;
  title: string;
  legendTitle: string;
  showLabels: boolean;
  isEmbed?: boolean;
}

const MapContainer = styled.div<{ isEmbed?: boolean }>`
  width: 100%;
  height: ${props => props.isEmbed ? '100vh' : '600px'};
  position: relative;
`;

const MapTitle = styled.h2`
  text-align: center;
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 20px;
`;

const TooltipContainer = styled.div`
  position: absolute;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 10px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const USMap = ({
  data,
  colorScheme,
  title,
  legendTitle,
  showLabels,
  isEmbed = false,
}: USMapProps) => {
  const mapRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [statesFeatures, setStatesFeatures] = useState<StateFeature[]>([]);
  
  // State code to name mapping
  const stateCodeToName: { [key: string]: string } = {
    AL: 'Alabama',
    AK: 'Alaska',
    AZ: 'Arizona',
    AR: 'Arkansas',
    CA: 'California',
    CO: 'Colorado',
    CT: 'Connecticut',
    DE: 'Delaware',
    FL: 'Florida',
    GA: 'Georgia',
    HI: 'Hawaii',
    ID: 'Idaho',
    IL: 'Illinois',
    IN: 'Indiana',
    IA: 'Iowa',
    KS: 'Kansas',
    KY: 'Kentucky',
    LA: 'Louisiana',
    ME: 'Maine',
    MD: 'Maryland',
    MA: 'Massachusetts',
    MI: 'Michigan',
    MN: 'Minnesota',
    MS: 'Mississippi',
    MO: 'Missouri',
    MT: 'Montana',
    NE: 'Nebraska',
    NV: 'Nevada',
    NH: 'New Hampshire',
    NJ: 'New Jersey',
    NM: 'New Mexico',
    NY: 'New York',
    NC: 'North Carolina',
    ND: 'North Dakota',
    OH: 'Ohio',
    OK: 'Oklahoma',
    OR: 'Oregon',
    PA: 'Pennsylvania',
    RI: 'Rhode Island',
    SC: 'South Carolina',
    SD: 'South Dakota',
    TN: 'Tennessee',
    TX: 'Texas',
    UT: 'Utah',
    VT: 'Vermont',
    VA: 'Virginia',
    WA: 'Washington',
    WV: 'West Virginia',
    WI: 'Wisconsin',
    WY: 'Wyoming',
    DC: 'District of Columbia',
  };

  // Convert TopoJSON to GeoJSON
  useEffect(() => {
    // @ts-ignore - TopoJSON typing issue
    const states = feature(usTopoJson, usTopoJson.objects.states);
    setStatesFeatures(states.features);
  }, []);

  // Draw the map
  useEffect(() => {
    if (!mapRef.current || statesFeatures.length === 0) return;

    const svg = d3.select(mapRef.current);
    const width = mapRef.current.clientWidth;
    const height = mapRef.current.clientHeight;
    
    // Clear previous content
    svg.selectAll('*').remove();
    
    // Create projection
    const projection = geoAlbersUsa()
      .fitSize([width, height], { type: 'FeatureCollection', features: statesFeatures });
    
    // Create path generator
    const pathGenerator = geoPath().projection(projection);
    
    // Create color scale
    const colorScale = d3.scaleSequential();
    
    // Set color scheme
    switch (colorScheme) {
      case 'blues':
        colorScale.interpolator(d3.interpolateBlues);
        break;
      case 'greens':
        colorScale.interpolator(d3.interpolateGreens);
        break;
      case 'reds':
        colorScale.interpolator(d3.interpolateReds);
        break;
      case 'purples':
        colorScale.interpolator(d3.interpolatePurples);
        break;
      case 'oranges':
        colorScale.interpolator(d3.interpolateOranges);
        break;
      default:
        colorScale.interpolator(d3.interpolateBlues);
    }
    
    // Find min and max values
    let minValue = Infinity;
    let maxValue = -Infinity;
    
    if (data.length > 0) {
      minValue = d3.min(data, d => d.value) || 0;
      maxValue = d3.max(data, d => d.value) || 100;
    } else {
      minValue = 0;
      maxValue = 100;
    }
    
    // Set domain for color scale
    colorScale.domain([minValue, maxValue]);
    
    // Create tooltip
    const tooltip = d3.select(tooltipRef.current);
    
    // Draw states
    svg.selectAll('path')
      .data(statesFeatures)
      .enter()
      .append('path')
      .attr('d', d => pathGenerator(d) || '')
      .attr('fill', d => {
        const stateCode = d.id;
        const stateData = data.find(item => item.stateCode === stateCode);
        return stateData ? colorScale(stateData.value) : '#eee';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .on('mouseover', (event, d) => {
        const stateCode = d.id as string;
        const stateData = data.find(item => item.stateCode === stateCode);
        const stateName = stateCodeToName[stateCode] || stateCode;
        
        d3.select(event.currentTarget)
          .attr('stroke', '#333')
          .attr('stroke-width', 1.5);
        
        tooltip
          .style('opacity', 1)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY + 10}px`);
        
        tooltip.html(`
          <strong>${stateName}</strong><br>
          ${stateData ? `Value: ${stateData.value}` : 'No data'}
        `);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY + 10}px`);
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget)
          .attr('stroke', '#fff')
          .attr('stroke-width', 0.5);
        
        tooltip.style('opacity', 0);
      });
    
    // Add state labels if enabled
    if (showLabels) {
      svg.selectAll('text')
        .data(statesFeatures)
        .enter()
        .append('text')
        .attr('x', d => {
          const centroid = pathGenerator.centroid(d);
          return centroid[0];
        })
        .attr('y', d => {
          const centroid = pathGenerator.centroid(d);
          return centroid[1];
        })
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', '8px')
        .attr('fill', '#333')
        .text(d => d.id as string);
    }
    
    // Add legend
    if (data.length > 0) {
      const legendWidth = 200;
      const legendHeight = 20;
      const legendX = width - legendWidth - 20;
      const legendY = height - 50;
      
      // Create gradient for legend
      const defs = svg.append('defs');
      const gradient = defs.append('linearGradient')
        .attr('id', 'legend-gradient')
        .attr('x1', '0%')
        .attr('x2', '100%')
        .attr('y1', '0%')
        .attr('y2', '0%');
      
      // Add color stops
      const numStops = 10;
      for (let i = 0; i <= numStops; i++) {
        const offset = `${i * 100 / numStops}%`;
        const value = minValue + (i / numStops) * (maxValue - minValue);
        gradient.append('stop')
          .attr('offset', offset)
          .attr('stop-color', colorScale(value));
      }
      
      // Draw legend rectangle
      svg.append('rect')
        .attr('x', legendX)
        .attr('y', legendY)
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .style('fill', 'url(#legend-gradient)');
      
      // Add legend title
      svg.append('text')
        .attr('x', legendX)
        .attr('y', legendY - 5)
        .attr('font-size', '12px')
        .attr('fill', '#333')
        .text(legendTitle);
      
      // Add min value
      svg.append('text')
        .attr('x', legendX)
        .attr('y', legendY + legendHeight + 15)
        .attr('font-size', '10px')
        .attr('fill', '#333')
        .text(minValue.toLocaleString());
      
      // Add max value
      svg.append('text')
        .attr('x', legendX + legendWidth)
        .attr('y', legendY + legendHeight + 15)
        .attr('font-size', '10px')
        .attr('fill', '#333')
        .attr('text-anchor', 'end')
        .text(maxValue.toLocaleString());
    }
  }, [statesFeatures, data, colorScheme, showLabels, legendTitle]);

  return (
    <div>
      {!isEmbed && <MapTitle>{title}</MapTitle>}
      <MapContainer isEmbed={isEmbed}>
        <svg ref={mapRef} width="100%" height="100%"></svg>
        <TooltipContainer ref={tooltipRef}></TooltipContainer>
      </MapContainer>
    </div>
  );
};

export default USMap;
