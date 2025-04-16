// State code to name mapping
export const stateCodeToName: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'District of Columbia'
};

// State name to code mapping
export const stateNameToCode: Record<string, string> = {};
for (const [code, name] of Object.entries(stateCodeToName)) {
  stateNameToCode[name.toUpperCase()] = code;
}

// Helper function to convert numeric state IDs to state codes
export function getStateInfoFromId(id: string) {
  // This is a simplified mapping - in a real app, you'd use a complete mapping
  const stateMapping: Record<string, { code: string; name: string }> = {
    "01": { code: "AL", name: "Alabama" },
    "02": { code: "AK", name: "Alaska" },
    "04": { code: "AZ", name: "Arizona" },
    "05": { code: "AR", name: "Arkansas" },
    "06": { code: "CA", name: "California" },
    "08": { code: "CO", name: "Colorado" },
    "09": { code: "CT", name: "Connecticut" },
    "10": { code: "DE", name: "Delaware" },
    "11": { code: "DC", name: "District of Columbia" },
    "12": { code: "FL", name: "Florida" },
    "13": { code: "GA", name: "Georgia" },
    "15": { code: "HI", name: "Hawaii" },
    "16": { code: "ID", name: "Idaho" },
    "17": { code: "IL", name: "Illinois" },
    "18": { code: "IN", name: "Indiana" },
    "19": { code: "IA", name: "Iowa" },
    "20": { code: "KS", name: "Kansas" },
    "21": { code: "KY", name: "Kentucky" },
    "22": { code: "LA", name: "Louisiana" },
    "23": { code: "ME", name: "Maine" },
    "24": { code: "MD", name: "Maryland" },
    "25": { code: "MA", name: "Massachusetts" },
    "26": { code: "MI", name: "Michigan" },
    "27": { code: "MN", name: "Minnesota" },
    "28": { code: "MS", name: "Mississippi" },
    "29": { code: "MO", name: "Missouri" },
    "30": { code: "MT", name: "Montana" },
    "31": { code: "NE", name: "Nebraska" },
    "32": { code: "NV", name: "Nevada" },
    "33": { code: "NH", name: "New Hampshire" },
    "34": { code: "NJ", name: "New Jersey" },
    "35": { code: "NM", name: "New Mexico" },
    "36": { code: "NY", name: "New York" },
    "37": { code: "NC", name: "North Carolina" },
    "38": { code: "ND", name: "North Dakota" },
    "39": { code: "OH", name: "Ohio" },
    "40": { code: "OK", name: "Oklahoma" },
    "41": { code: "OR", name: "Oregon" },
    "42": { code: "PA", name: "Pennsylvania" },
    "44": { code: "RI", name: "Rhode Island" },
    "45": { code: "SC", name: "South Carolina" },
    "46": { code: "SD", name: "South Dakota" },
    "47": { code: "TN", name: "Tennessee" },
    "48": { code: "TX", name: "Texas" },
    "49": { code: "UT", name: "Utah" },
    "50": { code: "VT", name: "Vermont" },
    "51": { code: "VA", name: "Virginia" },
    "53": { code: "WA", name: "Washington" },
    "54": { code: "WV", name: "West Virginia" },
    "55": { code: "WI", name: "Wisconsin" },
    "56": { code: "WY", name: "Wyoming" }
  };

  return stateMapping[id];
}

// Helper function to check if a string is a valid CSS color name
export function isNamedColor(color: string): boolean {
  // Create a temporary element to test if the color is valid
  if (typeof document !== 'undefined') {
    const tempElement = document.createElement('div');
    tempElement.style.color = color;
    
    // If the color is valid, the browser will set the style
    return tempElement.style.color !== '';
  }
  
  // If running on server, return true for common color names
  const commonColors = [
    'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 
    'white', 'gray', 'cyan', 'magenta', 'lime', 'olive', 'navy', 'teal', 'aqua', 'silver'
  ];
  
  return commonColors.includes(color.toLowerCase());
}
