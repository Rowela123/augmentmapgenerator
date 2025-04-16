// In-memory storage for maps (will be lost on server restart)
// For production, you would use a database like MongoDB, PostgreSQL, etc.
export const mapStorage: Record<string, any> = {};

// Demo map data
mapStorage['demo'] = {
  id: 'demo',
  title: 'Demo US Map',
  stateData: [
    { stateCode: 'NY', stateName: 'New York', value: 75 },
    { stateCode: 'CA', stateName: 'California', value: 50 },
    { stateCode: 'TX', stateName: 'Texas', value: 25 }
  ],
  colorScheme: 'green-to-red',
  legendTitle: 'Value',
  legendMinLabel: 'Low',
  legendMaxLabel: 'High',
  showLabels: true,
  customColors: {},
  createdAt: new Date().toISOString()
};
