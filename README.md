# US Map Generator

An interactive tool for creating, customizing, and embedding US maps.

## Features

- Upload data for US states
- Visualize data with customizable colors and settings
- Generate embed codes for integrating maps into websites (Shopify compatible)
- Save and manage multiple maps

## Technology Stack

- React
- TypeScript
- D3.js for map visualization
- Styled Components
- Vercel for deployment

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Rowela123/newmapgenerator.git
cd newmapgenerator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Usage

### Uploading Data

You can upload Excel (.xlsx) or CSV files with data for US states. The file should include a column with state codes (e.g., NY, CA) and values.

### Customizing Maps

- Change color schemes
- Customize scale titles and labels
- Add tooltips and descriptions

### Embedding Maps

Generate an iframe code to embed your map in any website. The embed is responsive and works well with Shopify.

## Deployment

The app is deployed on Vercel and can be accessed at: [https://newmapgenerator.vercel.app](https://newmapgenerator.vercel.app)

## License

MIT License 