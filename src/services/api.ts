import axios from 'axios';
import { StockData, NewsItem, TrendingStock } from '../types';

const ALPHA_VANTAGE_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY || 'demo';
const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_KEY || 'demo';

const trendingSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'AMD'];

const dataCache: { [key: string]: { data: any; timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000;

const mockDataSeeds: { [key: string]: number } = {};

function getCachedData(key: string) {
  const cached = dataCache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: any) {
  dataCache[key] = { data, timestamp: Date.now() };
}

export const fetchTrendingStocks = async (symbols: string[] = trendingSymbols): Promise<TrendingStock[]> => {
  const cacheKey = `stocks_${symbols.join('_')}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const stockPromises = symbols.map(async (symbol) => {
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`
        );
        
        const quote = response.data['Global Quote'];
        if (!quote || !quote['05. price']) {
          return createMockStock(symbol);
        }

        const price = parseFloat(quote['05. price']);
        const change = parseFloat(quote['09. change']);
        const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));

        const prediction = getPrediction(changePercent);
        
        const stockData = {
          symbol,
          name: getCompanyName(symbol),
          price,
          change,
          changePercent,
          volume: parseInt(quote['06. volume']),
          prediction: prediction.signal,
          confidence: prediction.confidence,
          technicalIndicators: {
            rsi: 50 + (price % 20) + 20,
            macd: ((price % 10) - 5) / 5,
            sentiment: changePercent / 10
          }
        };
        return stockData;
      } catch (error) {
        return createMockStock(symbol);
      }
    });

    const stocks = await Promise.all(stockPromises);
    setCachedData(cacheKey, stocks);
    return stocks;
  } catch (error) {
    console.error('Error fetching trending stocks:', error);
    const fallback = symbols.map(createMockStock);
    setCachedData(cacheKey, fallback);
    return fallback;
  }
};

export const fetchMarketNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_KEY}`
    );

    if (!response.data || response.data.length === 0) {
      return generateMockNews();
    }

    return response.data.slice(0, 20).map((article: any) => {
      const sentiment = analyzeSentiment(article.headline + ' ' + article.summary);
      return {
        title: article.headline,
        source: article.source,
        url: article.url,
        publishedAt: new Date(article.datetime * 1000).toISOString(),
        summary: article.summary || article.headline,
        sentiment: sentiment.label,
        tickers: article.related ? [article.related] : [],
        recommendation: getRecommendation(sentiment.label, sentiment.score)
      };
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return generateMockNews();
  }
};

export const fetchStockQuote = async (symbol: string): Promise<StockData | null> => {
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`
    );
    
    const quote = response.data['Global Quote'];
    if (!quote || !quote['05. price']) {
      return null;
    }

    return {
      symbol,
      name: getCompanyName(symbol),
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume'])
    };
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    return null;
  }
};

function createMockStock(symbol: string): TrendingStock {
  if (!mockDataSeeds[symbol]) {
    mockDataSeeds[symbol] = Math.random();
  }
  
  const seed = mockDataSeeds[symbol];
  const basePrice = seed * 500 + 100;
  const change = (seed - 0.5) * 20;
  const changePercent = (change / basePrice) * 100;
  const prediction = getPrediction(changePercent);

  return {
    symbol,
    name: getCompanyName(symbol),
    price: basePrice,
    change,
    changePercent,
    volume: Math.floor(seed * 50000000) + 1000000,
    prediction: prediction.signal,
    confidence: prediction.confidence,
    technicalIndicators: {
      rsi: 40 + (seed * 40),
      macd: (seed - 0.5) * 2,
      sentiment: changePercent / 10
    }
  };
}

function getPrediction(changePercent: number): { signal: 'bullish' | 'bearish' | 'neutral', confidence: number } {
  const rsi = 50 + Math.random() * 40;
  
  let score = 0;
  if (changePercent > 0) score += 1;
  if (changePercent < 0) score -= 1;
  if (rsi > 70) score -= 0.5;
  if (rsi < 30) score += 0.5;
  
  const confidence = Math.min(Math.abs(score) * 30 + Math.random() * 20 + 50, 95);
  
  if (score > 0.3) return { signal: 'bullish', confidence };
  if (score < -0.3) return { signal: 'bearish', confidence };
  return { signal: 'neutral', confidence: confidence * 0.7 };
}

function analyzeSentiment(text: string): { label: 'bullish' | 'bearish' | 'neutral', score: number } {
  const bullishWords = ['gain', 'profit', 'surge', 'rally', 'bullish', 'rise', 'growth', 'positive', 'strong'];
  const bearishWords = ['loss', 'decline', 'fall', 'drop', 'bearish', 'weak', 'negative', 'concern', 'risk'];
  
  const lowerText = text.toLowerCase();
  let score = 0;
  
  bullishWords.forEach(word => {
    if (lowerText.includes(word)) score += 1;
  });
  
  bearishWords.forEach(word => {
    if (lowerText.includes(word)) score -= 1;
  });
  
  if (score > 0) return { label: 'bullish', score };
  if (score < 0) return { label: 'bearish', score: Math.abs(score) };
  return { label: 'neutral', score: 0 };
}

function getRecommendation(sentiment: 'bullish' | 'bearish' | 'neutral', score: number): 'long' | 'short' | 'hold' {
  if (sentiment === 'bullish' && score >= 2) return 'long';
  if (sentiment === 'bearish' && score >= 2) return 'short';
  return 'hold';
}

function getCompanyName(symbol: string): string {
  const names: { [key: string]: string } = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'TSLA': 'Tesla Inc.',
    'NVDA': 'NVIDIA Corporation',
    'META': 'Meta Platforms Inc.',
    'AMD': 'Advanced Micro Devices Inc.'
  };
  return names[symbol] || symbol;
}

function generateMockNews(): NewsItem[] {
  const mockNews = [
    {
      title: 'Tech stocks rally as AI sector shows strong growth',
      source: 'Market Watch',
      url: '#',
      publishedAt: new Date().toISOString(),
      summary: 'Major tech companies see significant gains driven by AI innovations and investor optimism.',
      sentiment: 'bullish' as const,
      tickers: ['NVDA', 'MSFT', 'GOOGL'],
      recommendation: 'long' as const
    },
    {
      title: 'Federal Reserve signals potential rate changes',
      source: 'Financial Times',
      url: '#',
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      summary: 'Market analysts predict volatility as Fed considers monetary policy adjustments.',
      sentiment: 'neutral' as const,
      tickers: ['SPY'],
      recommendation: 'hold' as const
    },
    {
      title: 'Energy sector faces headwinds amid market uncertainty',
      source: 'Reuters',
      url: '#',
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      summary: 'Oil prices fluctuate as global demand concerns weigh on energy stocks.',
      sentiment: 'bearish' as const,
      tickers: ['XOM', 'CVX'],
      recommendation: 'short' as const
    },
    {
      title: 'Electric vehicle sales surge in Q4 earnings reports',
      source: 'Bloomberg',
      url: '#',
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      summary: 'EV manufacturers report record sales, boosting stock valuations across the sector.',
      sentiment: 'bullish' as const,
      tickers: ['TSLA'],
      recommendation: 'long' as const
    },
    {
      title: 'Semiconductor shortage concerns resurface',
      source: 'CNBC',
      url: '#',
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      summary: 'Supply chain issues could impact tech hardware production in coming quarters.',
      sentiment: 'bearish' as const,
      tickers: ['AMD', 'INTC'],
      recommendation: 'short' as const
    }
  ];

  return mockNews;
}

export const fetchFutures = async (): Promise<TrendingStock[]> => {
  const futuresSymbols = ['ES', 'NQ', 'YM', 'CL', 'GC'];
  const futuresNames: { [key: string]: string } = {
    'ES': 'S&P 500 Futures',
    'NQ': 'Nasdaq 100 Futures',
    'YM': 'Dow Jones Futures',
    'CL': 'Crude Oil Futures',
    'GC': 'Gold Futures'
  };
  
  const cacheKey = 'futures_data';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const futuresData = futuresSymbols.map(symbol => {
    if (!mockDataSeeds[symbol]) {
      mockDataSeeds[symbol] = Math.random();
    }
    const seed = mockDataSeeds[symbol];
    const basePrice = symbol === 'ES' ? 4500 + seed * 500 :
                      symbol === 'NQ' ? 15000 + seed * 2000 :
                      symbol === 'YM' ? 35000 + seed * 3000 :
                      symbol === 'CL' ? 70 + seed * 30 :
                      1800 + seed * 400;
    const change = (seed - 0.5) * (basePrice * 0.02);
    const changePercent = (change / basePrice) * 100;
    
    return {
      symbol,
      name: futuresNames[symbol],
      price: basePrice,
      change,
      changePercent,
      volume: Math.floor(seed * 200000) + 50000,
      prediction: changePercent > 0.5 ? 'bullish' : changePercent < -0.5 ? 'bearish' : 'neutral',
      confidence: 65 + seed * 25,
      technicalIndicators: {
        rsi: 40 + seed * 30,
        macd: (seed - 0.5) * 2,
        sentiment: changePercent / 10
      }
    } as TrendingStock;
  });
  
  setCachedData(cacheKey, futuresData);
  return futuresData;
};

export const fetchForex = async (): Promise<TrendingStock[]> => {
  const forexPairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD'];
  const cacheKey = 'forex_data';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const forexData = forexPairs.map(symbol => {
    if (!mockDataSeeds[symbol]) {
      mockDataSeeds[symbol] = Math.random();
    }
    const seed = mockDataSeeds[symbol];
    const basePrice = symbol === 'EUR/USD' ? 1.08 + seed * 0.08 :
                      symbol === 'GBP/USD' ? 1.25 + seed * 0.10 :
                      symbol === 'USD/JPY' ? 148 + seed * 10 :
                      symbol === 'USD/CHF' ? 0.88 + seed * 0.06 :
                      0.65 + seed * 0.05;
    const change = (seed - 0.5) * (basePrice * 0.015);
    const changePercent = (change / basePrice) * 100;
    
    return {
      symbol,
      name: symbol,
      price: basePrice,
      change,
      changePercent,
      volume: Math.floor(seed * 500000) + 100000,
      prediction: changePercent > 0.3 ? 'bullish' : changePercent < -0.3 ? 'bearish' : 'neutral',
      confidence: 60 + seed * 30,
      technicalIndicators: {
        rsi: 45 + seed * 25,
        macd: (seed - 0.5) * 1.5,
        sentiment: changePercent / 10
      }
    } as TrendingStock;
  });
  
  setCachedData(cacheKey, forexData);
  return forexData;
};

export const fetchCrypto = async (): Promise<TrendingStock[]> => {
  const cryptoSymbols = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA'];
  const cryptoNames: { [key: string]: string } = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'BNB': 'Binance Coin',
    'SOL': 'Solana',
    'ADA': 'Cardano'
  };
  
  const cacheKey = 'crypto_data';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const cryptoData = cryptoSymbols.map(symbol => {
    if (!mockDataSeeds[symbol]) {
      mockDataSeeds[symbol] = Math.random();
    }
    const seed = mockDataSeeds[symbol];
    const basePrice = symbol === 'BTC' ? 40000 + seed * 20000 :
                      symbol === 'ETH' ? 2200 + seed * 800 :
                      symbol === 'BNB' ? 300 + seed * 200 :
                      symbol === 'SOL' ? 100 + seed * 50 :
                      0.45 + seed * 0.30;
    const change = (seed - 0.5) * (basePrice * 0.08);
    const changePercent = (change / basePrice) * 100;
    
    return {
      symbol,
      name: cryptoNames[symbol],
      price: basePrice,
      change,
      changePercent,
      volume: Math.floor(seed * 2000000) + 500000,
      prediction: changePercent > 1 ? 'bullish' : changePercent < -1 ? 'bearish' : 'neutral',
      confidence: 55 + seed * 35,
      technicalIndicators: {
        rsi: 35 + seed * 40,
        macd: (seed - 0.5) * 3,
        sentiment: changePercent / 10
      }
    } as TrendingStock;
  });
  
  setCachedData(cacheKey, cryptoData);
  return cryptoData;
};
