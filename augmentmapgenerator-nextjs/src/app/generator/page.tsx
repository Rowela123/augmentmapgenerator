'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { USMap } from '@/components/USMap';
import { MapData, StateData } from '@/lib/types';
import { stateCodeToName, stateNameToCode } from '@/lib/stateUtils';
import * as XLSX from 'xlsx';

export default function GeneratorPage() {
  const [stateData, setStateData] = useState<StateData[]>([]);
  const [colorScheme, setColorScheme] = useState<string>('green-to-red');
  const [mapTitle, setMapTitle] = useState<string>('US Map');
  const [legendTitle, setLegendTitle] = useState<string>('Value');
  const [legendMinLabel, setLegendMinLabel] = useState<string>('Low');
  const [legendMaxLabel, setLegendMaxLabel] = useState<string>('High');
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [customColors, setCustomColors] = useState<Record<string, string>>({});
  const [embedCode, setEmbedCode] = useState<string>('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file upload
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    setMessage(null);
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'csv') {
      // Handle CSV file
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string;
          const lines = csv.split('\\n');
          const headers = lines[0].split(',');
          
          // Process CSV data
          processData(headers, lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj: Record<string, string>, header, index) => {
              obj[header] = values[index] || '';
              return obj;
            }, {});
          }));
        } catch (error) {
          console.error('Error parsing CSV:', error);
          setMessage({ text: `Error parsing CSV: ${error}`, type: 'error' });
          setIsLoading(false);
        }
      };
      reader.onerror = () => {
        setMessage({ text: 'Error reading file', type: 'error' });
        setIsLoading(false);
      };
      reader.readAsText(file);
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      // Handle Excel file
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Process Excel data
          processData(Object.keys(jsonData[0] as object), jsonData as Record<string, string>[]);
        } catch (error) {
          console.error('Error parsing Excel file:', error);
          setMessage({ text: `Error parsing Excel file: ${error}`, type: 'error' });
          setIsLoading(false);
        }
      };
      reader.onerror = () => {
        setMessage({ text: 'Error reading file', type: 'error' });
        setIsLoading(false);
      };
      reader.readAsBinaryString(file);
    } else {
      setMessage({ text: 'Unsupported file format. Please upload a CSV or Excel file.', type: 'error' });
      setIsLoading(false);
    }
  };
  
  // Process uploaded data
  const processData = (columns: string[], rawData: Record<string, string>[]) => {
    try {
      if (!rawData || rawData.length === 0) {
        setMessage({ text: 'No data found in the file', type: 'error' });
        setIsLoading(false);
        return;
      }
      
      // Find state code and value columns
      let stateCodeColumn = '';
      let valueColumn = '';
      let infoColumn = '';
      let colorColumn = '';
      let labelColumn = '';
      
      // Try to automatically detect columns
      for (const column of columns) {
        const lowerColumn = column.toLowerCase();
        if (
          lowerColumn.includes('state') ||
          lowerColumn.includes('code') ||
          lowerColumn === 'st'
        ) {
          stateCodeColumn = column;
        } else if (
          lowerColumn.includes('value') ||
          lowerColumn.includes('data') ||
          lowerColumn.includes('count') ||
          lowerColumn.includes('amount')
        ) {
          valueColumn = column;
        } else if (
          lowerColumn.includes('info') ||
          lowerColumn.includes('description') ||
          lowerColumn.includes('notes') ||
          lowerColumn.includes('details')
        ) {
          infoColumn = column;
        } else if (
          lowerColumn.includes('color') ||
          lowerColumn.includes('colour') ||
          lowerColumn.includes('fill')
        ) {
          colorColumn = column;
        } else if (
          lowerColumn.includes('label') ||
          lowerColumn.includes('header') ||
          lowerColumn.includes('title')
        ) {
          labelColumn = column;
        }
      }
      
      // If we couldn't detect columns, use the first two
      if (!stateCodeColumn && columns.length > 0) {
        stateCodeColumn = columns[0];
      }
      
      if (!valueColumn && columns.length > 1) {
        valueColumn = columns[1];
      }
      
      if (!stateCodeColumn || !valueColumn) {
        setMessage({ text: 'Could not identify state code and value columns in your data', type: 'error' });
        setIsLoading(false);
        return;
      }
      
      // Process the data
      const newCustomColors: Record<string, string> = {};
      const processedData = rawData
        .filter(row => row[stateCodeColumn]) // Only filter by state code, allow blank values
        .map(row => {
          // Normalize state code to 2 letters
          let stateCode = String(row[stateCodeColumn]).trim().toUpperCase();
          
          // Handle full state names
          if (stateCode.length > 2) {
            if (stateNameToCode[stateCode]) {
              stateCode = stateNameToCode[stateCode];
            } else {
              // Try to match partial state names
              for (const [name, code] of Object.entries(stateNameToCode)) {
                if (name.includes(stateCode) || stateCode.includes(name)) {
                  stateCode = code;
                  break;
                }
              }
            }
          }
          
          // Ensure state code is exactly 2 characters
          if (stateCode.length !== 2 || !stateCodeToName[stateCode]) {
            return null;
          }
          
          // Parse value as number if it exists
          let value: number | null = null;
          // Check if the value column exists and is not an empty string
          if (row[valueColumn] !== undefined && row[valueColumn] !== '') {
            value = parseFloat(row[valueColumn]);
            // If value is not a valid number, set to null but don't return null
            if (isNaN(value)) {
              value = null;
            }
          }
          
          // Get info if available
          const info = infoColumn && row[infoColumn] ? String(row[infoColumn]) : null;
          
          // Get label if available
          const label = labelColumn && row[labelColumn] ? String(row[labelColumn]) : null;
          
          // Get color if available
          let color: string | null = null;
          if (colorColumn && row[colorColumn]) {
            color = String(row[colorColumn]).trim();
            
            // Try to validate the color
            if (color) {
              // If it doesn't start with #, try to add it (Excel might strip the #)
              if (!color.startsWith('#') && !color.match(/^rgb/i) && color.match(/^[0-9A-Fa-f]{6}$/)) {
                color = '#' + color;
              }
              
              // Store color in our custom colors object if it's a valid color
              if (color.startsWith('#') || color.match(/^rgb/i) || ['Red', 'Green', 'Blue', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Black', 'White', 'Gray', 'Cyan', 'Magenta', 'Lime', 'Olive', 'Navy', 'Teal', 'Aqua', 'Silver'].includes(color)) {
                newCustomColors[stateCode] = color;
              }
            }
          }
          
          return {
            stateCode,
            stateName: stateCodeToName[stateCode],
            value,
            info,
            label,
            color
          };
        })
        .filter(Boolean) as StateData[];
      
      if (processedData.length === 0) {
        setMessage({ text: 'No valid data found in the file', type: 'error' });
        setIsLoading(false);
        return;
      }
      
      // Update state data and custom colors
      setStateData(processedData);
      setCustomColors(newCustomColors);
      
      // Show success message
      const colorCount = Object.keys(newCustomColors).length;
      let successMessage = `Successfully loaded data for ${processedData.length} states`;
      if (colorCount > 0) {
        successMessage += `. Found ${colorCount} custom colors.`;
      }
      setMessage({ text: successMessage, type: 'success' });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error processing data:', error);
      setMessage({ text: `Error processing data: ${error}`, type: 'error' });
      setIsLoading(false);
    }
  };
  
  // Apply settings
  const applySettings = () => {
    // Nothing to do here, as the settings are already in state
    // and the map will re-render automatically
    setMessage({ text: 'Settings applied successfully', type: 'success' });
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };
  
  // Save map
  const saveMap = async () => {
    if (stateData.length === 0) {
      setMessage({ text: 'Please upload data first', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      // Create map data object
      const mapData: MapData = {
        stateData,
        colorScheme,
        title: mapTitle,
        legendTitle,
        legendMinLabel,
        legendMaxLabel,
        showLabels,
        customColors
      };
      
      // Send to API
      const response = await fetch('/api/maps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mapData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save map: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Generate embed code
      const embedUrl = `${window.location.origin}/embed/${result.id}`;
      const code = `<iframe
  src="${embedUrl}"
  width="100%"
  height="500"
  style="border: none; max-width: 100%;"
  title="${mapTitle}"
  allow="fullscreen">
</iframe>`;
      
      setEmbedCode(code);
      setMessage({ text: 'Map saved successfully! Copy the embed code below.', type: 'success' });
    } catch (error) {
      console.error('Error saving map:', error);
      setMessage({ text: `Error saving map: ${error}`, type: 'error' });
    }
    
    setIsLoading(false);
  };
  
  // Copy embed code
  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode)
      .then(() => {
        setMessage({ text: 'Embed code copied to clipboard!', type: 'success' });
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      })
      .catch(err => {
        console.error('Failed to copy embed code:', err);
        setMessage({ text: 'Failed to copy embed code', type: 'error' });
      });
  };
  
  return (
    <div className="container">
      <h1>US Map Generator</h1>
      
      <div className="section">
        <h2>1. Upload Data</h2>
        <p>Upload a CSV or Excel file with state data. The file should have columns for state codes/names and values.</p>
        
        <div className="file-upload">
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileUpload}
            ref={fileInputRef}
            disabled={isLoading}
          />
          {isLoading && <div className="loading-spinner">Loading...</div>}
        </div>
      </div>
      
      <div className="section">
        <h2>2. Map Settings</h2>
        
        <div className="form-group">
          <label htmlFor="map-title">Map Title:</label>
          <input
            type="text"
            id="map-title"
            value={mapTitle}
            onChange={(e) => setMapTitle(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="legend-title">Legend Title:</label>
          <input
            type="text"
            id="legend-title"
            value={legendTitle}
            onChange={(e) => setLegendTitle(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="legend-min">Legend Min Label:</label>
          <input
            type="text"
            id="legend-min"
            value={legendMinLabel}
            onChange={(e) => setLegendMinLabel(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="legend-max">Legend Max Label:</label>
          <input
            type="text"
            id="legend-max"
            value={legendMaxLabel}
            onChange={(e) => setLegendMaxLabel(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="show-labels">Show State Labels:</label>
          <input
            type="checkbox"
            id="show-labels"
            checked={showLabels}
            onChange={(e) => setShowLabels(e.target.checked)}
          />
        </div>
        
        <div className="form-group">
          <label>Color Scheme:</label>
          <div className="color-schemes">
            <button
              className={`color-scheme ${colorScheme === 'green-to-red' ? 'selected' : ''}`}
              onClick={() => setColorScheme('green-to-red')}
            >
              Green to Red
            </button>
            <button
              className={`color-scheme ${colorScheme === 'blues' ? 'selected' : ''}`}
              onClick={() => setColorScheme('blues')}
            >
              Blues
            </button>
            <button
              className={`color-scheme ${colorScheme === 'greens' ? 'selected' : ''}`}
              onClick={() => setColorScheme('greens')}
            >
              Greens
            </button>
            <button
              className={`color-scheme ${colorScheme === 'reds' ? 'selected' : ''}`}
              onClick={() => setColorScheme('reds')}
            >
              Reds
            </button>
            <button
              className={`color-scheme ${colorScheme === 'multi' ? 'selected' : ''}`}
              onClick={() => setColorScheme('multi')}
            >
              Multi-Color
            </button>
          </div>
        </div>
        
        <button className="button" onClick={applySettings}>Apply Settings</button>
      </div>
      
      <div className="section">
        <h2>3. Preview</h2>
        
        <div className="map-container">
          <USMap
            stateData={stateData}
            colorScheme={colorScheme}
            title={mapTitle}
            legendTitle={legendTitle}
            legendMinLabel={legendMinLabel}
            legendMaxLabel={legendMaxLabel}
            showLabels={showLabels}
            customColors={customColors}
          />
        </div>
      </div>
      
      <div className="section">
        <h2>4. Save & Embed</h2>
        
        <button className="button" onClick={saveMap} disabled={isLoading || stateData.length === 0}>
          Save Map
        </button>
        
        {embedCode && (
          <div className="embed-code">
            <h3>Embed Code</h3>
            <textarea
              value={embedCode}
              readOnly
              rows={6}
            />
            <button className="button" onClick={copyEmbedCode}>
              Copy Embed Code
            </button>
          </div>
        )}
      </div>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        h1 {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          border: 1px solid #eaeaea;
          border-radius: 10px;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }
        
        input[type="text"] {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        
        .color-schemes {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .color-scheme {
          padding: 0.5rem 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #f5f5f5;
          cursor: pointer;
        }
        
        .color-scheme.selected {
          border-color: #0070f3;
          background: #e6f7ff;
        }
        
        .button {
          padding: 0.5rem 1rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }
        
        .button:hover {
          background-color: #0051cc;
        }
        
        .button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        
        .map-container {
          width: 100%;
          height: 500px;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          overflow: hidden;
        }
        
        .embed-code {
          margin-top: 1rem;
        }
        
        textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-family: monospace;
          margin-bottom: 0.5rem;
        }
        
        .message {
          padding: 1rem;
          border-radius: 4px;
          margin-top: 1rem;
        }
        
        .message.success {
          background-color: #e6f7e6;
          color: #2e7d32;
          border: 1px solid #2e7d32;
        }
        
        .message.error {
          background-color: #fdecea;
          color: #d32f2f;
          border: 1px solid #d32f2f;
        }
        
        .loading-spinner {
          display: inline-block;
          margin-left: 1rem;
        }
      `}</style>
    </div>
  );
}
