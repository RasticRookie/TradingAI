# 📈 TradePredict Pro

A comprehensive day trading application built with React, TypeScript, and Vite that provides AI-powered market predictions, real-time news analysis, and advanced trading strategies.

![TradePredict Pro](https://img.shields.io/badge/React-18.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-cyan)

## ✨ Features

### 📊 Market Overview
- **Multi-Asset Support**: Stocks, Futures, Forex, and Crypto markets in one unified view
- **Custom Watchlist**: Search and add any stock ticker to your personal watchlist
- **AI Predictions**: Bullish/Bearish/Neutral predictions with confidence scores
- **Technical Indicators**: RSI, MACD analysis for each asset
- **Smart Caching**: 5-minute cache system prevents constant data changes

### 📰 News Feed
- **Hot Stories**: Highlighted top 3 stories with strong trading signals
- **Publisher Prominence**: Bloomberg, Reuters, Market Watch, CNBC, Financial Times with icons
- **AI Sentiment Analysis**: Bullish/Bearish/Neutral classification
- **Trading Signals**: Long/Short/Hold recommendations
- **Filterable**: Sort by sentiment and trading action

### 🎯 Trading Strategies
- **8 Visual Chart Patterns**: Each strategy shows an interactive SVG chart pattern
- **Prominent Stop Loss**: Large red display box highlights risk management
- **Risk/Reward Ratios**: Clear 1:2, 1:3, 1:4 ratios for each strategy
- **Detailed Rules**: Step-by-step entry and exit instructions
- **Categories**: Trend Following, Momentum, Volatility, Price Action, Breakout, Technical

### 🤖 AI Recommendations
- ML-powered stock analysis with Buy/Sell/Hold signals
- Confidence scores and AI scores (0-100)
- Price targets with upside potential
- Key catalysts and risk factors

### 🔍 Stock Analyzer
- Deep technical and fundamental analysis
- Interactive price charts
- Chart pattern recognition
- Analyst consensus ratings

### 💼 My Trades
- Manual trade entry system
- Real-time portfolio calculation
- Position tracking with P&L
- Trade history and analytics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/TradePredict-Pro.git

# Navigate to project directory
cd TradePredict-Pro

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be running at `http://localhost:5000`

## 🔑 API Setup (Optional)

For real-time market data, you'll need free API keys:

### 1. Alpha Vantage (Stock Data)
- Visit: https://www.alphavantage.co/
- Get free API key (25 requests/day)

### 2. Finnhub (Market News)
- Visit: https://finnhub.io/
- Get free API key (60 calls/minute)

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_ALPHA_VANTAGE_KEY=your_alpha_vantage_key_here
VITE_FINNHUB_KEY=your_finnhub_key_here
```

**Note:** The app works perfectly with demo data if you don't have API keys!

## 📦 Build for Production

```bash
# Build the app
npm run build

# Preview production build locally
npm run preview
```

## 🌐 Deploy to GitHub Pages

We've made it super easy to deploy your app to GitHub Pages!

**Quick Deploy:**

```bash
# 1. Update package.json homepage with your GitHub username
# 2. Push your code to GitHub
# 3. Run deploy command
npm run deploy
```

**📖 Full deployment guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed step-by-step instructions.

Your app will be live at: `https://YOUR_USERNAME.github.io/TradePredict-Pro`

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Routing**: React Router DOM 6
- **Styling**: TailwindCSS 3
- **Charts**: Recharts 2
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Deployment**: GitHub Pages

## 📁 Project Structure

```
TradePredict-Pro/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navigation.tsx
│   │   ├── StockChart.tsx
│   │   └── ErrorNotification.tsx
│   ├── pages/              # Main application pages
│   │   ├── MarketOverview.tsx
│   │   ├── MyTrades.tsx
│   │   ├── NewsFeed.tsx
│   │   ├── TradingStrategies.tsx
│   │   ├── AIRecommendations.tsx
│   │   └── StockAnalyzer.tsx
│   ├── services/           # API integration
│   │   └── api.ts
│   ├── types/              # TypeScript definitions
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   └── chartData.ts
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── DEPLOYMENT.md          # Deployment guide
└── README.md              # This file
```

## 🎨 Features Showcase

### Visual Chart Patterns
Each trading strategy includes an interactive SVG chart showing the pattern:
- Moving Average Crossover (Golden Cross)
- RSI Divergence
- Bollinger Band Squeeze
- MACD Histogram Reversal
- Support & Resistance Bounce
- Breakout with Volume
- Fibonacci Retracement
- Gap Fill Strategy

### Multi-Asset Markets
- **Stocks**: AAPL, MSFT, GOOGL, AMZN, TSLA, NVDA, META, AMD + custom tickers
- **Futures**: S&P 500 (ES), Nasdaq (NQ), Dow (YM), Crude Oil (CL), Gold (GC)
- **Forex**: EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD
- **Crypto**: Bitcoin, Ethereum, Binance Coin, Solana, Cardano

## 🔒 Data & Privacy

- All trade data stored locally in browser (localStorage)
- No backend server or database required
- API keys stored in environment variables (never committed to git)
- No user authentication or personal data collection

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⚠️ Disclaimer

This app is for educational and informational purposes only. It does not provide financial advice. Trading involves substantial risk of loss. Always do your own research and consult with a licensed financial advisor before making investment decisions.

---

Built with ❤️ using React, TypeScript, and Vite

**Live Demo:** [TradePredict Pro on GitHub Pages](https://YOUR_USERNAME.github.io/TradePredict-Pro)
