# Day Trading App - TradePredict Pro

A comprehensive day trading application built with React, TypeScript, and Vite that provides market predictions, real-time news analysis, and trade tracking capabilities.

## Overview

TradePredict Pro is an advanced trading platform that helps traders make informed decisions through:
- AI-powered market predictions based on technical indicators
- Real-time financial news with sentiment analysis
- Long/short trading recommendations
- Personal trade tracking and portfolio management

## Recent Changes

**November 17, 2025 - Latest Update**
- Added three advanced new pages: Trading Strategies, AI Recommendations, and Stock Analyzer
- Created Trading Strategies page with 8 proven strategies including entry/exit rules and risk management
- Built AI Recommendations page with ML-powered stock analysis and buy/sell signals
- Developed Stock Analyzer with comprehensive technical and fundamental analysis
- Enhanced navigation with 6 total pages for complete trading workflow
- Fixed Vite configuration to use allowedHosts: true for Replit compatibility

**November 17, 2025 - Initial Launch**
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

### Trading Strategies
- 8 comprehensive trading strategies with detailed guidelines
- Strategies categorized by: Trend Following, Momentum, Volatility, Price Action, Breakout, Technical
- Detailed entry and exit rules for each strategy
- Risk management and stop-loss recommendations
- Success rates, timeframes, and difficulty levels
- Best use cases for different market conditions
- Interactive strategy selection and detailed view

### AI Recommendations
- AI-powered stock recommendations with Buy/Sell/Hold signals
- Machine learning analysis of technical, fundamental, sentiment, and momentum indicators
- Confidence scores and AI score (0-100) for each recommendation
- Price targets with upside potential calculations
- Key catalysts and risk factors for each stock
- Filterable by action (Strong Buy, Buy, Hold, Sell, Strong Sell)
- Real-time AI analysis refresh capability

### Stock Analyzer
- Deep stock analysis with search functionality
- Comprehensive technical analysis (RSI, MACD, Moving Averages, Support/Resistance)
- Fundamental metrics (Revenue, Net Income, P/E Ratio, ROE, Debt/Equity)
- Analyst consensus ratings and price targets
- Interactive price charts with historical data
- Chart pattern recognition (Cup and Handle, Head and Shoulders, etc.)
- Trend identification (Bullish/Bearish/Neutral)
- Market cap, volume, and 52-week high/low tracking

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
├── components/           # Reusable UI components
│   ├── Navigation.tsx    # Main navigation with 6 page links
│   ├── StockChart.tsx    # Recharts-based stock price chart
│   └── ErrorNotification.tsx  # Error/success notification system
├── pages/               # Main application pages (6 total)
│   ├── MarketOverview.tsx     # Trending stocks with predictions
│   ├── MyTrades.tsx           # Personal trade tracking
│   ├── NewsFeed.tsx           # Financial news with sentiment
│   ├── TradingStrategies.tsx  # Strategy library with rules
│   ├── AIRecommendations.tsx  # ML-powered stock picks
│   └── StockAnalyzer.tsx      # Deep stock analysis tool
├── services/        # API integration layer
│   └── api.ts       # Alpha Vantage & Finnhub API calls
├── types/           # TypeScript type definitions
│   └── index.ts     # All interface definitions
├── utils/           # Utility functions
│   └── chartData.ts # Chart data generation
├── App.tsx          # Main app with routing (6 routes)
├── main.tsx         # Application entry point
└── index.css        # Global styles and Tailwind imports
```

### Configuration Files
- `vite.config.ts`: Vite configuration (port 5000, host 0.0.0.0, allowedHosts: true for Replit)
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
- TradingView does not provide a public API for data access (only broker integration)
- Bloomberg API requires expensive institutional licensing
- All AI recommendations and analysis use algorithmic models, not external AI services
