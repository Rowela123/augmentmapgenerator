import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface EmbedCodeGeneratorProps {
  mapId: string;
}

const GeneratorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const CodeBox = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
  resize: none;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(42, 96, 153, 0.2);
  }
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

const Message = styled.div<{ $success?: boolean }>`
  padding: 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: ${props => props.$success ? '#e8f5e9' : '#ffebee'};
  color: ${props => props.$success ? '#388e3c' : '#d32f2f'};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EmbedCodeGenerator = ({ mapId }: EmbedCodeGeneratorProps) => {
  const [embedCode, setEmbedCode] = useState('');
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (mapId) {
      // Save current map data to localStorage
      const mapData = {
        stateData: [], // This would come from the parent component in a real app
        colorScheme: 'blues',
        title: 'US Map',
        legendTitle: 'Legend',
        showLabels: true,
      };
      
      localStorage.setItem(`map_${mapId}`, JSON.stringify(mapData));
      
      // Generate embed code
      const baseUrl = window.location.origin;
      const embedUrl = `${baseUrl}/embed/${mapId}`;
      
      const code = `<iframe 
  src="${embedUrl}" 
  width="100%" 
  height="500" 
  style="border: none; max-width: 100%;" 
  title="US Map" 
  allow="fullscreen">
</iframe>`;
      
      setEmbedCode(code);
    } else {
      setEmbedCode('');
    }
  }, [mapId]);
  
  const handleCopyCode = () => {
    if (embedCode) {
      navigator.clipboard.writeText(embedCode)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };
  
  if (!mapId) {
    return (
      <GeneratorContainer>
        <Message>
          Upload data first to generate an embed code.
        </Message>
      </GeneratorContainer>
    );
  }
  
  return (
    <GeneratorContainer>
      <CodeBox
        value={embedCode}
        readOnly
        onClick={(e) => (e.target as HTMLTextAreaElement).select()}
      />
      
      <Button onClick={handleCopyCode}>
        Copy Embed Code
      </Button>
      
      {copied && (
        <Message $success>
          ✓ Copied to clipboard!
        </Message>
      )}
    </GeneratorContainer>
  );
};

export default EmbedCodeGenerator;
