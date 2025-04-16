'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { StateData } from '@/lib/types';
import { getStateInfoFromId } from '@/lib/stateUtils';

interface USMapProps {
  stateData: StateData[];
  colorScheme: string;
  title: string;
  legendTitle: string;
  legendMinLabel: string;
  legendMaxLabel: string;
  showLabels: boolean;
  customColors: Record<string, string>;
}

export function USMap({
  stateData,
  colorScheme,
  title,
  legendTitle,
  legendMinLabel,
  legendMaxLabel,
  showLabels,
  customColors
}: USMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Create a map of state data for quick lookup
  const stateDataMap = stateData.reduce((acc, state) => {
    acc[state.stateCode] = state;
    return acc;
  }, {} as Record<string, StateData>);

  useEffect(() => {
    if (!mapRef.current) return;

    const drawMap = async () => {
      // Clear previous content
      d3.select(mapRef.current).selectAll('*').remove();

      try {
        // Load US TopoJSON data
        const us = await d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
          .catch(error => {
            console.error('Error loading US map data:', error);
            throw new Error('Failed to load US map data');
          });

        if (!us) throw new Error('Failed to load US map data');

        // Convert TopoJSON to GeoJSON
        const statesFeatures = topojson.feature(us, us.objects.states).features;

        // Add state names
        statesFeatures.forEach((state: any) => {
          const stateId = state.id;
          // Convert numeric IDs to state codes
          const stateInfo = getStateInfoFromId(stateId);
          if (stateInfo) {
            state.properties.code = stateInfo.code;
            state.properties.name = stateInfo.name;
          }
        });

        // Create SVG
        const width = mapRef.current.clientWidth;
        const height = mapRef.current.clientHeight;

        const svg = d3.select(mapRef.current)
          .append('svg')
          .attr('width', '100%')
          .attr('height', '100%')
          .attr('viewBox', `0 0 ${width} ${height}`)
          .attr('preserveAspectRatio', 'xMidYMid meet');

        // Create projection
        const projection = d3.geoAlbersUsa()
          .fitSize([width, height], { type: 'FeatureCollection', features: statesFeatures });

        // Create path generator
        const pathGenerator = d3.geoPath().projection(projection);

        // Create color scale
        let colorScale: any;

        // Set color scheme
        if (colorScheme === 'multi') {
          // For multi-color scheme, use a standard threshold scale
          colorScale = d3.scaleThreshold()
            .domain([25, 50, 75])
            .range(['#388e3c', '#fbc02d', '#f57c00', '#d32f2f']); // Green, Yellow, Orange, Red
        } else if (colorScheme === 'green-to-red') {
          // Create a custom green to red color scale
          colorScale = d3.scaleSequential()
            .interpolator(d3.interpolateRgbBasis(['#388e3c', '#fbc02d', '#f57c00', '#d32f2f'])); // Green, Yellow, Orange, Red
        } else {
          // Sequential color schemes
          colorScale = d3.scaleSequential();

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
            case 'viridis':
              colorScale.interpolator(d3.interpolateViridis);
              break;
            default:
              colorScale.interpolator(d3.interpolateBlues);
          }
        }

        // Find min and max values
        let minValue = 0;
        let maxValue = 100;

        if (stateData.length > 0) {
          const values = stateData
            .filter(d => d.value !== null)
            .map(d => d.value as number);

          if (values.length > 0) {
            minValue = Math.min(...values);
            maxValue = Math.max(...values);
          }
        }

        // Set domain for color scale
        colorScale.domain([minValue, maxValue]);

        // Create tooltip
        const tooltip = d3.select(tooltipRef.current);

        // Define small states that need special handling
        const smallStates = ['RI', 'DE', 'DC', 'CT', 'NJ', 'MD', 'MA', 'NH', 'VT'];

        // Draw states
        svg.selectAll('path')
          .data(statesFeatures)
          .enter()
          .append('path')
          .attr('d', (d: any) => pathGenerator(d) || '')
          .attr('fill', (d: any) => {
            const stateCode = d.properties.code;

            // If we're using multi-color scheme and have a custom color for this state, use it
            if (colorScheme === 'multi' && customColors[stateCode]) {
              return customColors[stateCode];
            }

            // Special case for Hawaii to ensure it's colored
            if (stateCode === 'HI') {
              return colorScale(minValue);
            }

            const stateDataItem = stateData.find(item => item.stateCode === stateCode);

            // If we have data for this state
            if (stateDataItem) {
              // If the state has a value (including zero), use the color scale; otherwise use a light gray
              return stateDataItem.value !== null ? colorScale(stateDataItem.value) : '#ccc';
            }

            // No data for this state
            return '#eee';
          })
          .attr('stroke', '#fff')
          .attr('stroke-width', 0.5)
          .attr('class', (d: any) => {
            // Add a class for small states for easier selection
            return smallStates.includes(d.properties.code) ? 'small-state' : '';
          })
          .on('mouseover', (event: any, d: any) => {
            const stateCode = d.properties.code;
            const stateName = d.properties.name;
            const stateDataItem = stateData.find(item => item.stateCode === stateCode);

            d3.select(event.currentTarget)
              .attr('stroke', '#333')
              .attr('stroke-width', 1.5);

            tooltip
              .style('opacity', 1)
              .style('left', `${event.pageX + 10}px`)
              .style('top', `${event.pageY + 10}px`);

            // Determine color for tooltip header based on value
            let headerColor = '#999';
            if (stateDataItem && stateDataItem.value !== null) {
              const value = stateDataItem.value;
              const normalizedValue = (value - minValue) / (maxValue - minValue);

              if (normalizedValue >= 0.75) {
                headerColor = '#d32f2f'; // Red for highest values
              } else if (normalizedValue >= 0.5) {
                headerColor = '#f57c00'; // Orange for high values
              } else if (normalizedValue >= 0.25) {
                headerColor = '#fbc02d'; // Yellow for medium values
              } else {
                headerColor = '#388e3c'; // Green for low values
              }
            }

            // Use the label as the header if available, otherwise use the state name
            const headerText = stateDataItem && stateDataItem.label ? stateDataItem.label : stateName;

            let tooltipContent = `
              <div class="tooltip-header" style="background-color: ${headerColor}">
                <div class="state-icon">${stateDataItem ? stateDataItem.stateCode : ''}</div>
                ${headerText}
              </div>
              <div class="tooltip-body">`;

            if (stateDataItem) {
              // If we're using a label as the header, show the state name in the body
              if (stateDataItem.label) {
                tooltipContent += `<p><strong>State:</strong> ${stateName}</p>`;
              }

              // We're not showing the value in this map as per user request
              // Value is still used for coloring the map, but not displayed in tooltip

              // Add info if available, preserving HTML formatting
              if (stateDataItem.info) {
                tooltipContent += `<p>${stateDataItem.info}</p>`;
              }
            } else {
              tooltipContent += '<p>No data available</p>';
            }

            tooltipContent += '</div>';

            tooltip.html(tooltipContent);
          })
          .on('mousemove', (event: any) => {
            tooltip
              .style('left', `${event.pageX + 10}px`)
              .style('top', `${event.pageY + 10}px`);
          })
          .on('mouseout', (event: any) => {
            d3.select(event.currentTarget)
              .attr('stroke', '#fff')
              .attr('stroke-width', 0.5);

            tooltip.style('opacity', 0);
          });

        // Add small states list to the side
        if (smallStates.length > 0) {
          // Create a group for the small states list
          // Position it at the far right edge of the SVG and centered vertically
          const smallStatesGroup = svg.append('g')
            .attr('class', 'small-states-list')
            .attr('transform', `translate(${width - 30}, ${height/2 - smallStates.length * 10})`);

          // Add each small state to the list
          smallStates.forEach((stateCode, index) => {
            const state = statesFeatures.find((d: any) => d.properties.code === stateCode);
            if (!state) return;

            const stateCentroid = pathGenerator.centroid(state as any);

            // Add small dot for the state
            smallStatesGroup.append('circle')
              .attr('cx', 0)
              .attr('cy', index * 20)
              .attr('r', 3)
              .attr('fill', '#666');

            // Add state code text
            smallStatesGroup.append('text')
              .attr('x', 10)
              .attr('y', index * 20 + 4)
              .attr('font-size', '10px')
              .attr('fill', '#333')
              .attr('text-anchor', 'start')
              .attr('alignment-baseline', 'middle')
              .text(stateCode);

            // Draw connecting line from list to state - curved line
            if (stateCentroid && stateCentroid.length === 2) {
              // Calculate the position relative to the smallStatesGroup
              const targetX = stateCentroid[0] - (width - 30);
              const targetY = stateCentroid[1] - (height/2 - smallStates.length * 10);

              // Create a curved path using SVG path commands
              const path = `M 0 ${index * 20} L -10 ${index * 20} Q -30 ${index * 20} ${targetX} ${targetY}`;

              smallStatesGroup.append('path')
                .attr('d', path)
                .attr('fill', 'none')
                .attr('stroke', '#ccc')
                .attr('stroke-width', 0.5);
            }
          });
        }

        // Add state labels if enabled
        if (showLabels) {
          svg.selectAll('text.state-label')
            .data(statesFeatures)
            .enter()
            .append('text')
            .attr('class', 'state-label')
            .attr('x', (d: any) => {
              const centroid = pathGenerator.centroid(d);
              return centroid[0];
            })
            .attr('y', (d: any) => {
              const centroid = pathGenerator.centroid(d);
              return centroid[1];
            })
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('font-size', '8px')
            .attr('fill', '#333')
            .text((d: any) => d.properties.code);
        }

        // Add legend if we have data
        if (stateData.length > 0) {
          const legendWidth = 200;
          const legendHeight = 20;
          // Position the legend to the right side of the map, between Texas and Florida
          const legendX = width * 0.58; // Moved a tiny bit more to the left
          const legendY = height - 40; // Very close to the bottom

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
            .style('fill', 'url(#legend-gradient)')
            .attr('stroke', '#ccc')
            .attr('stroke-width', 1);

          // Add legend title
          svg.append('text')
            .attr('x', legendX)
            .attr('y', legendY - 5)
            .attr('font-size', '12px')
            .attr('fill', '#333')
            .text(legendTitle);

          // Add min label directly below the scale
          svg.append('text')
            .attr('x', legendX)
            .attr('y', legendY + legendHeight + 15) // Positioned closer to the scale
            .attr('font-size', '12px')
            .attr('fill', '#000')
            .attr('font-weight', 'bold')
            .text(legendMinLabel);

          // Add max label directly below the scale
          svg.append('text')
            .attr('x', legendX + legendWidth)
            .attr('y', legendY + legendHeight + 15) // Positioned closer to the scale
            .attr('font-size', '12px')
            .attr('fill', '#000')
            .attr('text-anchor', 'end')
            .attr('font-weight', 'bold')
            .text(legendMaxLabel);
        }

        // Add title if provided
        if (title) {
          svg.append('text')
            .attr('x', width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .attr('fill', '#333')
            .text(title);
        }
      } catch (error) {
        console.error('Error drawing map:', error);
        // Show error message
        d3.select(mapRef.current)
          .append('div')
          .attr('class', 'error')
          .text('Error loading map data');
      }
    };

    drawMap();

    // Redraw on window resize
    const handleResize = () => {
      drawMap();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [stateData, colorScheme, title, legendTitle, legendMinLabel, legendMaxLabel, showLabels, customColors]);

  return (
    <>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
      <div ref={tooltipRef} className="tooltip"></div>
    </>
  );
}
