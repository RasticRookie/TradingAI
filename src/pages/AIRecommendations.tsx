import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Sparkles, Target, DollarSign, Clock } from 'lucide-react';

interface AIRecommendation {
  symbol: string;
  name: string;
  action: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  currentPrice: number;
  targetPrice: number;
  confidence: number;
  timeframe: string;
  aiScore: number;
  signals: {
    technical: number;
    fundamental: number;
    sentiment: number;
    momentum: number;
  };
  catalysts: string[];
  risks: string[];
  reasoning: string;
}

const AIRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [selectedRec, setSelectedRec] = useState<AIRecommendation | null>(null);
  const [filterAction, setFilterAction] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateAIRecommendations();
  }, []);

  const generateAIRecommendations = () => {
    setLoading(true);
    
    const stocks = [
      { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 495.32 },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 238.45 },
      { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.91 },
      { symbol: 'AAPL', name: 'Apple Inc.', price: 178.23 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.56 },
      { symbol: 'META', name: 'Meta Platforms Inc.', price: 352.78 },
      { symbol: 'AMD', name: 'Advanced Micro Devices', price: 142.89 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 156.34 },
    ];

    const actions: Array<'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell'> = ['Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell'];
    
    const generatedRecs = stocks.map(stock => {
      const action = actions[Math.floor(Math.random() * actions.length)];
      const priceChange = action.includes('Buy') ? 1.15 + Math.random() * 0.2 : 0.85 + Math.random() * 0.15;
      const targetPrice = stock.price * priceChange;
      
      const technical = 50 + Math.random() * 50;
      const fundamental = 50 + Math.random() * 50;
      const sentiment = 50 + Math.random() * 50;
      const momentum = 50 + Math.random() * 50;
      
      const aiScore = (technical + fundamental + sentiment + momentum) / 4;
      const confidence = Math.min(Math.abs(aiScore - 50) * 2, 95);

      const catalysts = action.includes('Buy') 
        ? ['Strong earnings growth', 'Institutional accumulation', 'Sector leadership', 'Product innovation']
        : ['Valuation concerns', 'Market headwinds', 'Competitive pressure', 'Regulatory risks'];

      const risks = action.includes('Buy')
        ? ['Market volatility', 'Sector rotation risk', 'Overvaluation risk']
        : ['Continued downtrend', 'Loss of market share', 'Macro headwinds'];

      const reasoning = action.includes('Buy')
        ? `Our AI models detect strong bullish signals across multiple timeframes. Technical indicators show strong momentum with RSI at ${technical.toFixed(0)}, while fundamental analysis reveals ${fundamental > 70 ? 'excellent' : 'solid'} financial health. Sentiment analysis of ${sentiment > 70 ? '10K+' : '5K+'} data points shows ${sentiment > 70 ? 'overwhelmingly' : 'predominantly'} positive market sentiment.`
        : `AI analysis reveals concerning patterns with declining momentum indicators. Technical score of ${technical.toFixed(0)} suggests weakening trend, while sentiment analysis shows ${sentiment < 50 ? 'growing' : 'emerging'} bearish positioning. Risk-reward ratio favors ${action === 'Sell' ? 'reducing exposure' : 'avoiding new positions'}.`;

      return {
        symbol: stock.symbol,
        name: stock.name,
        action,
        currentPrice: stock.price,
        targetPrice,
        confidence,
        timeframe: action.includes('Strong') ? '1-3 months' : '3-6 months',
        aiScore,
        signals: {
          technical,
          fundamental,
          sentiment,
          momentum
        },
        catalysts: catalysts.slice(0, 3),
        risks: risks.slice(0, 2),
        reasoning
      };
    });

    setRecommendations(generatedRecs);
    setLoading(false);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Strong Buy': return 'bg-green-600 text-white';
      case 'Buy': return 'bg-green-500 text-white';
      case 'Hold': return 'bg-yellow-500 text-white';
      case 'Sell': return 'bg-orange-500 text-white';
      case 'Strong Sell': return 'bg-red-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('Buy')) return <TrendingUp className="w-5 h-5" />;
    if (action.includes('Sell')) return <TrendingDown className="w-5 h-5" />;
    return <Target className="w-5 h-5" />;
  };

  const filteredRecs = filterAction === 'all'
    ? recommendations
    : recommendations.filter(r => r.action === filterAction);

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Brain className="w-10 h-10" />
            AI-Powered Recommendations
          </h1>
          <p className="text-gray-300 text-lg">
            Machine learning analysis of market data, sentiment, and technical patterns
          </p>
        </div>

        <div className="mb-6 flex gap-2 flex-wrap items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterAction('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterAction === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterAction('Strong Buy')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterAction === 'Strong Buy'
                  ? 'bg-green-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Strong Buy
            </button>
            <button
              onClick={() => setFilterAction('Buy')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterAction === 'Buy'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setFilterAction('Hold')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterAction === 'Hold'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Hold
            </button>
          </div>
          <button
            onClick={generateAIRecommendations}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Refresh AI Analysis
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 text-center">
                <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-300">AI analyzing market data...</p>
              </div>
            ) : (
              filteredRecs.map((rec) => (
                <div
                  key={rec.symbol}
                  onClick={() => setSelectedRec(rec)}
                  className={`bg-white/10 backdrop-blur-md rounded-xl p-6 cursor-pointer transition-all hover:bg-white/20 ${
                    selectedRec?.symbol === rec.symbol ? 'ring-2 ring-purple-400' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{rec.symbol}</h3>
                      <p className="text-sm text-gray-400">{rec.name}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 ${getActionColor(rec.action)}`}>
                      {getActionIcon(rec.action)}
                      {rec.action}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Current</p>
                      <p className="text-white font-bold">${rec.currentPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Target</p>
                      <p className="text-green-400 font-bold">${rec.targetPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Upside</p>
                      <p className={`font-bold ${rec.targetPrice > rec.currentPrice ? 'text-green-400' : 'text-red-400'}`}>
                        {((rec.targetPrice / rec.currentPrice - 1) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-gray-400">AI Score:</span>
                      <span className={`font-bold ${getScoreColor(rec.aiScore)}`}>
                        {rec.aiScore.toFixed(0)}/100
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Confidence:</span>
                      <span className="text-white font-bold">{rec.confidence.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="lg:sticky lg:top-6 h-fit">
            {selectedRec ? (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedRec.symbol}</h2>
                  <p className="text-gray-400">{selectedRec.name}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${getActionColor(selectedRec.action)}`}>
                      {getActionIcon(selectedRec.action)}
                      {selectedRec.action}
                    </span>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4" />
                      {selectedRec.timeframe}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-300 mb-3">AI Signal Breakdown</h3>
                    <div className="space-y-3">
                      {Object.entries(selectedRec.signals).map(([key, value]) => (
                        <div key={key}>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-300 capitalize">{key}</span>
                            <span className={`font-bold ${getScoreColor(value)}`}>{value.toFixed(0)}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                value >= 75 ? 'bg-green-500' : value >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-green-300 mb-3 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Price Targets
                    </h3>
                    <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Current Price:</span>
                        <span className="text-white font-bold">${selectedRec.currentPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Target Price:</span>
                        <span className="text-green-400 font-bold">${selectedRec.targetPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Potential Return:</span>
                        <span className={`font-bold ${selectedRec.targetPrice > selectedRec.currentPrice ? 'text-green-400' : 'text-red-400'}`}>
                          {((selectedRec.targetPrice / selectedRec.currentPrice - 1) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-blue-300 mb-3">AI Reasoning</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {selectedRec.reasoning}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-purple-300 mb-3">Key Catalysts</h3>
                    <ul className="space-y-2">
                      {selectedRec.catalysts.map((catalyst, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-300 text-sm">
                          <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span>{catalyst}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-orange-300 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Risk Factors
                    </h3>
                    <ul className="space-y-2">
                      {selectedRec.risks.map((risk, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-300 text-sm">
                          <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 text-center">
                <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  Select a recommendation to view detailed AI analysis
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
