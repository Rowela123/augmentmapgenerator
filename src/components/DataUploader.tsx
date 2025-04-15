import React, { useState } from 'react';
import styled from 'styled-components';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

// Types
import { StateData } from '../types/dataTypes';

interface DataUploaderProps {
  onDataUpload: (data: StateData[]) => void;
}

const UploaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.label`
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--secondary-color);
  }
`;

const UploadInfo = styled.div`
  font-size: 0.9rem;
  color: var(--text-color);
  margin-top: 10px;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 0.9rem;
  margin-top: 10px;
`;

const SuccessMessage = styled.div`
  color: #388e3c;
  font-size: 0.9rem;
  margin-top: 10px;
`;

const DataUploader = ({ onDataUpload }: DataUploaderProps) => {
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError('');
    setSuccess('');

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      // Parse CSV
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          processData(results.data);
        },
        error: (error) => {
          setError(`Error parsing CSV: ${error.message}`);
        }
      });
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      // Parse Excel
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          processData(jsonData);
        } catch (error) {
          setError(`Error parsing Excel file: ${error}`);
        }
      };
      reader.onerror = () => {
        setError('Error reading file');
      };
      reader.readAsBinaryString(file);
    } else {
      setError('Unsupported file format. Please upload a CSV or Excel file.');
    }
  };

  const processData = (rawData: any[]) => {
    try {
      // Find state code and value columns
      const firstRow = rawData[0];
      const columns = Object.keys(firstRow);
      
      let stateCodeColumn = '';
      let valueColumn = '';
      
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
        setError('Could not identify state code and value columns in your data');
        return;
      }
      
      // Process the data
      const processedData: StateData[] = rawData
        .filter(row => row[stateCodeColumn] && row[valueColumn])
        .map(row => {
          // Normalize state code to 2 letters
          let stateCode = String(row[stateCodeColumn]).trim().toUpperCase();
          
          // Handle full state names
          const stateNameToCode: { [key: string]: string } = {
            'ALABAMA': 'AL',
            'ALASKA': 'AK',
            'ARIZONA': 'AZ',
            'ARKANSAS': 'AR',
            'CALIFORNIA': 'CA',
            'COLORADO': 'CO',
            'CONNECTICUT': 'CT',
            'DELAWARE': 'DE',
            'FLORIDA': 'FL',
            'GEORGIA': 'GA',
            'HAWAII': 'HI',
            'IDAHO': 'ID',
            'ILLINOIS': 'IL',
            'INDIANA': 'IN',
            'IOWA': 'IA',
            'KANSAS': 'KS',
            'KENTUCKY': 'KY',
            'LOUISIANA': 'LA',
            'MAINE': 'ME',
            'MARYLAND': 'MD',
            'MASSACHUSETTS': 'MA',
            'MICHIGAN': 'MI',
            'MINNESOTA': 'MN',
            'MISSISSIPPI': 'MS',
            'MISSOURI': 'MO',
            'MONTANA': 'MT',
            'NEBRASKA': 'NE',
            'NEVADA': 'NV',
            'NEW HAMPSHIRE': 'NH',
            'NEW JERSEY': 'NJ',
            'NEW MEXICO': 'NM',
            'NEW YORK': 'NY',
            'NORTH CAROLINA': 'NC',
            'NORTH DAKOTA': 'ND',
            'OHIO': 'OH',
            'OKLAHOMA': 'OK',
            'OREGON': 'OR',
            'PENNSYLVANIA': 'PA',
            'RHODE ISLAND': 'RI',
            'SOUTH CAROLINA': 'SC',
            'SOUTH DAKOTA': 'SD',
            'TENNESSEE': 'TN',
            'TEXAS': 'TX',
            'UTAH': 'UT',
            'VERMONT': 'VT',
            'VIRGINIA': 'VA',
            'WASHINGTON': 'WA',
            'WEST VIRGINIA': 'WV',
            'WISCONSIN': 'WI',
            'WYOMING': 'WY',
            'DISTRICT OF COLUMBIA': 'DC'
          };
          
          if (stateCode.length > 2 && stateNameToCode[stateCode]) {
            stateCode = stateNameToCode[stateCode];
          } else if (stateCode.length > 2) {
            // Try to match partial state names
            for (const [name, code] of Object.entries(stateNameToCode)) {
              if (name.includes(stateCode) || stateCode.includes(name)) {
                stateCode = code;
                break;
              }
            }
          }
          
          // Ensure state code is exactly 2 characters
          if (stateCode.length !== 2) {
            return null;
          }
          
          // Parse value as number
          const value = parseFloat(row[valueColumn]);
          
          if (isNaN(value)) {
            return null;
          }
          
          return {
            stateCode,
            value
          };
        })
        .filter(Boolean) as StateData[];
      
      if (processedData.length === 0) {
        setError('No valid data found in the file');
        return;
      }
      
      onDataUpload(processedData);
      setSuccess(`Successfully loaded data for ${processedData.length} states`);
    } catch (error) {
      setError(`Error processing data: ${error}`);
    }
  };

  return (
    <UploaderContainer>
      <FileInput
        type="file"
        id="file-upload"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileUpload}
      />
      <UploadButton htmlFor="file-upload">
        Upload Data File
      </UploadButton>
      
      {fileName && (
        <UploadInfo>
          Selected file: {fileName}
        </UploadInfo>
      )}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <UploadInfo>
        Upload a CSV or Excel file with state codes (e.g., NY, CA) and values.
      </UploadInfo>
    </UploaderContainer>
  );
};

export default DataUploader;
