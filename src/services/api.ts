import axios from 'axios';
import { StockData, NewsItem, TrendingStock } from '../types';

const ALPHA_VANTAGE_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY || 'demo';
const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_KEY || 'demo';

const trendingSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'AMD'];

export const fetchTrendingStocks = async (): Promise<TrendingStock[]> => {
  try {
    const stockPromises = trendingSymbols.map(async (symbol) => {
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
        
        return {
          symbol,
          name: getCompanyName(symbol),
          price,
          change,
          changePercent,
          volume: parseInt(quote['06. volume']),
          prediction: prediction.signal,
          confidence: prediction.confidence,
          technicalIndicators: {
            rsi: 50 + Math.random() * 40,
            macd: (Math.random() - 0.5) * 2,
            sentiment: changePercent / 10
          }
        };
      } catch (error) {
        return createMockStock(symbol);
      }
    });

    const stocks = await Promise.all(stockPromises);
    return stocks;
  } catch (error) {
    console.error('Error fetching trending stocks:', error);
    return trendingSymbols.map(createMockStock);
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
  const basePrice = Math.random() * 500 + 100;
  const change = (Math.random() - 0.5) * 20;
  const changePercent = (change / basePrice) * 100;
  const prediction = getPrediction(changePercent);

  return {
    symbol,
    name: getCompanyName(symbol),
    price: basePrice,
    change,
    changePercent,
    volume: Math.floor(Math.random() * 50000000) + 1000000,
    prediction: prediction.signal,
    confidence: prediction.confidence,
    technicalIndicators: {
      rsi: 50 + Math.random() * 40,
      macd: (Math.random() - 0.5) * 2,
      sentiment: changePercent / 10
    }
  };
}

function getPrediction(changePercent: number): { signal: 'bullish' | 'bearish' | 'neutral', confidence: number } {
  const rsi = 50 + Math.random() * 40;
  const sentiment = changePercent / 10;
  
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
