import React, { useState } from 'react';
import { Search, TrendingUp, PieChart, BarChart3, Activity, Award } from 'lucide-react';
import StockChart from '../components/StockChart';
import { generateMockChartData } from '../utils/chartData';

interface StockAnalysis {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  peRatio: number;
  eps: number;
  dividend: number;
  beta: number;
  high52Week: number;
  low52Week: number;
  volume: number;
  avgVolume: number;
  technical: {
    rsi: number;
    macd: number;
    sma20: number;
    sma50: number;
    sma200: number;
    support: number;
    resistance: number;
  };
  fundamental: {
    revenue: string;
    netIncome: string;
    operatingMargin: number;
    profitMargin: number;
    roe: number;
    debtToEquity: number;
  };
  analyst: {
    rating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
    targetPrice: number;
    priceTarget: { low: number; avg: number; high: number };
  };
  chartPattern: string;
  trend: 'Bullish' | 'Bearish' | 'Neutral';
}

const StockAnalyzer: React.FC = () => {
  const [searchSymbol, setSearchSymbol] = useState('');
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeStock = () => {
    if (!searchSymbol.trim()) return;

    setLoading(true);
    
    setTimeout(() => {
      const mockAnalysis: StockAnalysis = {
        symbol: searchSymbol.toUpperCase(),
        name: getCompanyName(searchSymbol.toUpperCase()),
        price: 150 + Math.random() * 400,
        change: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 5,
        marketCap: `$${(Math.random() * 2000 + 500).toFixed(0)}B`,
        peRatio: 15 + Math.random() * 40,
        eps: 3 + Math.random() * 15,
        dividend: Math.random() * 3,
        beta: 0.8 + Math.random() * 0.8,
        high52Week: 200 + Math.random() * 400,
        low52Week: 100 + Math.random() * 200,
        volume: Math.floor(Math.random() * 50000000 + 5000000),
        avgVolume: Math.floor(Math.random() * 40000000 + 5000000),
        technical: {
          rsi: 30 + Math.random() * 40,
          macd: (Math.random() - 0.5) * 4,
          sma20: 145 + Math.random() * 395,
          sma50: 140 + Math.random() * 390,
          sma200: 130 + Math.random() * 380,
          support: 120 + Math.random() * 300,
          resistance: 180 + Math.random() * 450
        },
        fundamental: {
          revenue: `$${(Math.random() * 300 + 50).toFixed(0)}B`,
          netIncome: `$${(Math.random() * 50 + 5).toFixed(0)}B`,
          operatingMargin: 15 + Math.random() * 25,
          profitMargin: 10 + Math.random() * 20,
          roe: 15 + Math.random() * 30,
          debtToEquity: 0.2 + Math.random() * 1.5
        },
        analyst: {
          rating: ['Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell'][Math.floor(Math.random() * 5)] as any,
          targetPrice: 160 + Math.random() * 450,
          priceTarget: {
            low: 130 + Math.random() * 300,
            avg: 160 + Math.random() * 400,
            high: 190 + Math.random() * 500
          }
        },
        chartPattern: ['Cup and Handle', 'Head and Shoulders', 'Double Bottom', 'Ascending Triangle', 'Bull Flag'][Math.floor(Math.random() * 5)],
        trend: ['Bullish', 'Bearish', 'Neutral'][Math.floor(Math.random() * 3)] as any
      };

      setAnalysis(mockAnalysis);
      setLoading(false);
    }, 800);
  };

  const getCompanyName = (symbol: string): string => {
    const names: { [key: string]: string } = {
      'AAPL': 'Apple Inc.',
      'MSFT': 'Microsoft Corporation',
      'GOOGL': 'Alphabet Inc.',
      'AMZN': 'Amazon.com Inc.',
      'TSLA': 'Tesla Inc.',
      'NVDA': 'NVIDIA Corporation',
      'META': 'Meta Platforms Inc.',
      'AMD': 'Advanced Micro Devices Inc.',
      'NFLX': 'Netflix Inc.',
      'DIS': 'The Walt Disney Company'
    };
    return names[symbol] || `${symbol} Corporation`;
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'Bullish': return 'text-green-400';
      case 'Bearish': return 'text-red-400';
      case 'Neutral': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'Bullish': return <TrendingUp className="w-5 h-5" />;
      case 'Bearish': return <Activity className="w-5 h-5 rotate-180" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getRSISignal = (rsi: number) => {
    if (rsi > 70) return { text: 'Overbought', color: 'text-red-400' };
    if (rsi < 30) return { text: 'Oversold', color: 'text-green-400' };
    return { text: 'Neutral', color: 'text-yellow-400' };
  };

  const getAnalystColor = (rating: string) => {
    switch (rating) {
      case 'Strong Buy': return 'text-green-600 bg-green-100';
      case 'Buy': return 'text-green-500 bg-green-50';
      case 'Hold': return 'text-yellow-500 bg-yellow-50';
      case 'Sell': return 'text-orange-500 bg-orange-50';
      case 'Strong Sell': return 'text-red-600 bg-red-100';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <BarChart3 className="w-10 h-10" />
            Advanced Stock Analyzer
          </h1>
          <p className="text-gray-300 text-lg">
            Deep technical and fundamental analysis with AI-powered insights
          </p>
        </div>

        <div className="mb-8 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchSymbol}
              onChange={(e) => setSearchSymbol(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && analyzeStock()}
              placeholder="Enter stock symbol (e.g., AAPL, TSLA, NVDA)"
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <button
            onClick={analyzeStock}
            disabled={!searchSymbol.trim() || loading}
            className="px-8 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {analysis && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">{analysis.symbol}</h2>
                  <p className="text-gray-400">{analysis.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">${analysis.price.toFixed(2)}</p>
                  <p className={`text-lg font-semibold ${analysis.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {analysis.change >= 0 ? '+' : ''}{analysis.change.toFixed(2)} ({analysis.changePercent.toFixed(2)}%)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Market Cap</p>
                  <p className="text-white font-bold text-lg">{analysis.marketCap}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">P/E Ratio</p>
                  <p className="text-white font-bold text-lg">{analysis.peRatio.toFixed(2)}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">EPS</p>
                  <p className="text-white font-bold text-lg">${analysis.eps.toFixed(2)}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Dividend Yield</p>
                  <p className="text-white font-bold text-lg">{analysis.dividend.toFixed(2)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Price Chart
              </h3>
              <StockChart 
                data={generateMockChartData(analysis.price, 30)} 
                color={analysis.trend === 'Bullish' ? '#4ade80' : analysis.trend === 'Bearish' ? '#f87171' : '#9ca3af'}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-6 h-6" />
                  Technical Analysis
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Trend</span>
                    <div className={`flex items-center gap-2 font-bold ${getTrendColor(analysis.trend)}`}>
                      {getTrendIcon(analysis.trend)}
                      {analysis.trend}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Chart Pattern</span>
                    <span className="text-white font-semibold">{analysis.chartPattern}</span>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">RSI (14)</span>
                      <span className={`font-bold ${getRSISignal(analysis.technical.rsi).color}`}>
                        {analysis.technical.rsi.toFixed(1)} - {getRSISignal(analysis.technical.rsi).text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          analysis.technical.rsi > 70 ? 'bg-red-500' :
                          analysis.technical.rsi < 30 ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${analysis.technical.rsi}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">MACD</span>
                    <span className={`font-bold ${analysis.technical.macd >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {analysis.technical.macd.toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">SMA 20:</span>
                      <span className="text-white">${analysis.technical.sma20.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">SMA 50:</span>
                      <span className="text-white">${analysis.technical.sma50.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">SMA 200:</span>
                      <span className="text-white">${analysis.technical.sma200.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-xs mb-1">Support</p>
                      <p className="text-white font-bold">${analysis.technical.support.toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-green-400 text-xs mb-1">Resistance</p>
                      <p className="text-white font-bold">${analysis.technical.resistance.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <PieChart className="w-6 h-6" />
                  Fundamental Analysis
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Revenue (TTM)</span>
                    <span className="text-white font-bold">{analysis.fundamental.revenue}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Net Income</span>
                    <span className="text-green-400 font-bold">{analysis.fundamental.netIncome}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Operating Margin</span>
                    <span className="text-white font-bold">{analysis.fundamental.operatingMargin.toFixed(1)}%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Profit Margin</span>
                    <span className="text-white font-bold">{analysis.fundamental.profitMargin.toFixed(1)}%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">ROE</span>
                    <span className={`font-bold ${analysis.fundamental.roe > 15 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {analysis.fundamental.roe.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Debt/Equity</span>
                    <span className={`font-bold ${analysis.fundamental.debtToEquity < 0.5 ? 'text-green-400' : analysis.fundamental.debtToEquity < 1 ? 'text-yellow-400' : 'text-orange-400'}`}>
                      {analysis.fundamental.debtToEquity.toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <p className="text-blue-400 text-xs mb-1">Beta</p>
                      <p className="text-white font-bold">{analysis.beta.toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <p className="text-purple-400 text-xs mb-1">Volume</p>
                      <p className="text-white font-bold">{(analysis.volume / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-6 h-6" />
                Analyst Consensus
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-300">Overall Rating</span>
                    <span className={`px-4 py-2 rounded-lg font-bold ${getAnalystColor(analysis.analyst.rating)}`}>
                      {analysis.analyst.rating}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Price</span>
                      <span className="text-white font-bold">${analysis.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Average Target</span>
                      <span className="text-green-400 font-bold">${analysis.analyst.priceTarget.avg.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Upside Potential</span>
                      <span className={`font-bold ${analysis.analyst.priceTarget.avg > analysis.price ? 'text-green-400' : 'text-red-400'}`}>
                        {((analysis.analyst.priceTarget.avg / analysis.price - 1) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 mb-4">Price Target Range</p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-red-400">Low</span>
                      <span className="text-white font-semibold">${analysis.analyst.priceTarget.low.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" />
                      <div 
                        className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-purple-500"
                        style={{ 
                          left: `${Math.min(Math.max(((analysis.price - analysis.analyst.priceTarget.low) / (analysis.analyst.priceTarget.high - analysis.analyst.priceTarget.low)) * 100, 0), 100)}%` 
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-yellow-400">Average: ${analysis.analyst.priceTarget.avg.toFixed(2)}</span>
                      <span className="text-green-400">High: ${analysis.analyst.priceTarget.high.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!analysis && !loading && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-16 text-center">
            <Search className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Start Your Analysis</h3>
            <p className="text-gray-400 text-lg">
              Enter a stock symbol above to get comprehensive technical and fundamental analysis
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockAnalyzer;
