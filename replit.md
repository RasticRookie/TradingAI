# Day Trading App - TradePredict Pro

A comprehensive day trading application built with React, TypeScript, and Vite that provides market predictions, real-time news analysis, and trade tracking capabilities.

## Overview

TradePredict Pro is an advanced trading platform that helps traders make informed decisions through:
- AI-powered market predictions based on technical indicators
- Real-time financial news with sentiment analysis
- Long/short trading recommendations
- Personal trade tracking and portfolio management

## Recent Changes

**November 17, 2025**
- Initial project setup with React, TypeScript, and Vite
- Implemented three main pages: Market Overview, My Trades, and News Feed
- Integrated Alpha Vantage and Finnhub APIs for market data
- Added prediction algorithm using technical indicators (RSI, MACD) and sentiment analysis
- Created responsive UI with TailwindCSS and gradient backgrounds
- Implemented local storage for trade tracking

## Features

### Market Overview
- Real-time trending stock data for major tech companies (AAPL, MSFT, GOOGL, AMZN, TSLA, NVDA, META, AMD)
- AI-powered predictions (Bullish/Bearish/Neutral) with confidence scores
- Technical indicators including RSI and MACD
- Visual confidence bars for each prediction
- Auto-refresh capability

### My Trades
- Manual trade entry system (buy/sell orders)
- Real-time portfolio calculation
- Position tracking with average price calculation
- Trade history with detailed view
- Total investment tracking
- Data persistence using localStorage

### News Feed
- Real-time financial news from multiple sources
- AI sentiment analysis (Bullish/Bearish/Neutral)
- Trading signal recommendations (Long/Short/Hold)
- Filterable by sentiment
- Related ticker symbols for each article
- External links to full articles

## Project Architecture

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Routing**: React Router DOM 6
- **Styling**: TailwindCSS 3
- **Charts**: Recharts 2
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Data Storage**: Browser localStorage for trades

### API Integrations
- **Alpha Vantage**: Stock quotes, technical indicators, market sentiment
- **Finnhub**: Real-time market news and additional stock data

### Project Structure
```
src/
├── components/       # Reusable UI components
│   └── Navigation.tsx
├── pages/           # Main application pages
│   ├── MarketOverview.tsx
│   ├── MyTrades.tsx
│   └── NewsFeed.tsx
├── services/        # API integration layer
│   └── api.ts
├── types/           # TypeScript type definitions
│   └── index.ts
├── App.tsx          # Main app component with routing
├── main.tsx         # Application entry point
└── index.css        # Global styles and Tailwind imports
```

### Configuration Files
- `vite.config.ts`: Vite configuration (port 5000, host 0.0.0.0)
- `tailwind.config.js`: TailwindCSS configuration
- `tsconfig.json`: TypeScript compiler options
- `package.json`: Dependencies and scripts

## Getting Started

### API Keys Setup
The app uses free APIs that require registration:

1. **Alpha Vantage** (for stock data):
   - Visit: https://www.alphavantage.co/
   - Get a free API key (25 requests/day)
   
2. **Finnhub** (for news):
   - Visit: https://finnhub.io/
   - Get a free API key (60 calls/minute)

3. Create a `.env` file in the root directory:
   ```
   VITE_ALPHA_VANTAGE_KEY=your_alpha_vantage_key
   VITE_FINNHUB_KEY=your_finnhub_key
   ```

### Running the App
The development server is configured to run on port 5000:
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

## User Preferences

None specified yet.

## Notes

- The app includes fallback mock data when API limits are reached
- Trades are stored locally in the browser (no backend database)
- API rate limits: Alpha Vantage (25/day), Finnhub (60/min free tier)
- Predictions are based on technical indicators and sentiment analysis, not guaranteed trading advice
- The app works best with real API keys but includes demo data for testing
