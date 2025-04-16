# US Map Generator

An interactive USA map generator that allows users to upload Excel data and generate embed URLs for Shopify HTML pages.

## Features

- Upload Excel/CSV data with state codes and values
- Visualize data on an interactive US map
- Customize map appearance with different color schemes
- Add labels, tooltips, and legends
- Generate embed code for Shopify and other websites
- Save and share maps

## Quick Start

This project includes a standalone demo that doesn't require any installation:

1. Open `index.html` or `combined-demo.html` in your web browser
2. Upload your data file (CSV or Excel) with state codes and values
3. Customize the map appearance
4. Copy the embed code to use on your website

A sample data file (`sample-data.csv`) is included for testing.

## Full Installation

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Rowela123/map-generator.git
   cd map-generator
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

1. **Upload Data**: Click "Upload Data File" and select an Excel or CSV file with state codes (e.g., NY, CA) and values.

2. **Customize Map**: Choose a color scheme and adjust map settings like title, legend, and labels.

3. **Generate Embed Code**: Once your map is ready, copy the embed code to use on your Shopify store or other websites.

## Embedding in Shopify

1. Go to your Shopify admin panel
2. Navigate to Online Store > Themes
3. Click "Edit HTML/CSS"
4. Find the template where you want to add the map
5. Paste the embed code
6. Save changes

## Built With

- [D3.js](https://d3js.org/) - Data visualization
- [TopoJSON](https://github.com/topojson/topojson) - Geographic data manipulation
- [SheetJS](https://sheetjs.com/) - Excel file parsing
- [PapaParse](https://www.papaparse.com/) - CSV parsing

The standalone demo uses vanilla JavaScript, HTML, and CSS. The full version includes:

- [React](https://reactjs.org/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [Styled Components](https://styled-components.com/) - Styling

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [US Atlas](https://github.com/topojson/us-atlas) - For the US map data
- [D3 Color Schemes](https://github.com/d3/d3-scale-chromatic) - For color schemes

## Additional Documentation

- `DEMO_README.md` - Detailed instructions for the standalone demo
- `SUMMARY.md` - Project summary and status
- `Tasks.md` - Development task list and progress
