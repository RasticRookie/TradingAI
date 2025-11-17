export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: string;
}

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  tickers: string[];
  recommendation?: 'long' | 'short' | 'hold';
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  date: string;
  profit?: number;
}

export interface TrendingStock extends StockData {
  prediction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  technicalIndicators: {
    rsi?: number;
    macd?: number;
    sentiment?: number;
  };
}
