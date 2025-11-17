import React, { useState } from 'react';
import { TrendingUp, Target, BarChart3, Activity, AlertCircle, CheckCircle } from 'lucide-react';

interface Strategy {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeframe: string;
  successRate: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  signals: string[];
  rules: {
    entry: string[];
    exit: string[];
    stopLoss: string;
  };
  bestFor: string[];
}

const TradingStrategies: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

  const strategies: Strategy[] = [
    {
      id: '1',
      name: 'Moving Average Crossover',
      category: 'Trend Following',
      description: 'A classic strategy that identifies trend changes when short-term moving averages cross long-term moving averages.',
      difficulty: 'Beginner',
      timeframe: '1D - 1W',
      successRate: 68,
      riskLevel: 'Medium',
      signals: ['Golden Cross (50/200 MA)', 'Death Cross (50/200 MA)'],
      rules: {
        entry: [
          'Buy when 50-day MA crosses above 200-day MA',
          'Confirm with volume spike (>150% average)',
          'RSI should be between 40-70'
        ],
        exit: [
          'Sell when 50-day MA crosses below 200-day MA',
          'Take profit at 15-20% gain',
          'Exit if price drops below 50-day MA by 3%'
        ],
        stopLoss: '5% below entry price or below recent support level'
      },
      bestFor: ['Large cap stocks', 'Index ETFs', 'Stable market conditions']
    },
    {
      id: '2',
      name: 'RSI Divergence',
      category: 'Momentum',
      description: 'Exploits divergences between price action and RSI indicator to identify potential reversals.',
      difficulty: 'Intermediate',
      timeframe: '4H - 1D',
      successRate: 72,
      riskLevel: 'Medium',
      signals: ['Bullish Divergence', 'Bearish Divergence', 'Hidden Divergence'],
      rules: {
        entry: [
          'Bullish: Price makes lower low, RSI makes higher low',
          'Wait for RSI to cross above 30',
          'Confirm with bullish candlestick pattern'
        ],
        exit: [
          'Take profit when RSI reaches 70',
          'Exit if new divergence forms in opposite direction',
          'Trail stop loss below recent swing lows'
        ],
        stopLoss: 'Place 2% below the divergence low point'
      },
      bestFor: ['Volatile stocks', 'Oversold/Overbought conditions', 'Swing trading']
    },
    {
      id: '3',
      name: 'Bollinger Band Squeeze',
      category: 'Volatility',
      description: 'Capitalizes on low volatility periods (squeezes) that typically precede explosive price movements.',
      difficulty: 'Advanced',
      timeframe: '1H - 4H',
      successRate: 75,
      riskLevel: 'High',
      signals: ['Band Squeeze', 'Breakout Direction', 'Volume Confirmation'],
      rules: {
        entry: [
          'Identify when Bollinger Bands are at narrowest in 6 months',
          'Enter on breakout above/below bands with volume',
          'Use secondary indicator (MACD/RSI) for direction confirmation'
        ],
        exit: [
          'Exit when price touches opposite band',
          'Take profit at 2x the squeeze width',
          'Exit if volatility contracts again without reaching target'
        ],
        stopLoss: 'Place stop just inside the middle band (20-day MA)'
      },
      bestFor: ['High volatility stocks', 'Earnings plays', 'News-driven events']
    },
    {
      id: '4',
      name: 'MACD Histogram Reversal',
      category: 'Momentum',
      description: 'Uses MACD histogram peaks and troughs to identify early trend reversals before the main MACD line crosses.',
      difficulty: 'Intermediate',
      timeframe: '1D - 3D',
      successRate: 70,
      riskLevel: 'Medium',
      signals: ['Histogram Peak/Trough', 'Signal Line Cross', 'Zero Line Cross'],
      rules: {
        entry: [
          'Enter when histogram reverses from peak/trough',
          'Confirm with MACD line crossing signal line',
          'Price should be near support/resistance level'
        ],
        exit: [
          'Exit when histogram reaches opposite extreme',
          'Take profit at previous swing high/low',
          'Exit if MACD crosses zero line against position'
        ],
        stopLoss: 'Set stop 3% beyond recent swing point'
      },
      bestFor: ['Medium-term trading', 'Trending stocks', 'Index trading']
    },
    {
      id: '5',
      name: 'Support & Resistance Bounce',
      category: 'Price Action',
      description: 'Trades bounces off key support and resistance levels identified through historical price action.',
      difficulty: 'Beginner',
      timeframe: '1D - 1W',
      successRate: 65,
      riskLevel: 'Low',
      signals: ['Support Test', 'Resistance Test', 'Level Break'],
      rules: {
        entry: [
          'Buy at support with bullish reversal candle',
          'Short at resistance with bearish reversal candle',
          'Confirm with increased volume on bounce'
        ],
        exit: [
          'Take profit near opposite level (support/resistance)',
          'Exit if level is broken with conviction',
          'Trail stop loss once halfway to target'
        ],
        stopLoss: 'Place 1-2% beyond the support/resistance level'
      },
      bestFor: ['Range-bound markets', 'Blue chip stocks', 'Conservative trading']
    },
    {
      id: '6',
      name: 'Breakout with Volume',
      category: 'Breakout',
      description: 'Captures momentum from significant price breakouts confirmed by exceptional trading volume.',
      difficulty: 'Intermediate',
      timeframe: '1H - 1D',
      successRate: 73,
      riskLevel: 'High',
      signals: ['Price Breakout', 'Volume Surge', 'Consolidation Pattern'],
      rules: {
        entry: [
          'Enter on breakout above resistance with 200%+ normal volume',
          'Wait for first pullback to breakout level',
          'Confirm trend strength with ADX > 25'
        ],
        exit: [
          'Take profit at measured move target (pattern height)',
          'Exit if volume dies and price consolidates',
          'Trail stop loss using 15-minute swing lows'
        ],
        stopLoss: 'Place stop just below breakout level or recent low'
      },
      bestFor: ['Gap ups', 'Earnings releases', 'News catalysts']
    },
    {
      id: '7',
      name: 'Fibonacci Retracement',
      category: 'Technical',
      description: 'Uses Fibonacci levels to identify potential reversal points during pullbacks in trending markets.',
      difficulty: 'Advanced',
      timeframe: '4H - 1D',
      successRate: 71,
      riskLevel: 'Medium',
      signals: ['38.2% Retracement', '50% Retracement', '61.8% Golden Ratio'],
      rules: {
        entry: [
          'Identify strong trend and draw Fib from swing low to high',
          'Enter at 50% or 61.8% retracement level',
          'Confirm with bullish reversal pattern and volume'
        ],
        exit: [
          'Take profit at previous swing high (or new high)',
          'Exit if price breaks below 78.6% level',
          'Partial profit at 1:2 risk-reward ratio'
        ],
        stopLoss: 'Place stop below 78.6% Fibonacci level'
      },
      bestFor: ['Strong trending stocks', 'Pullback trading', 'Technical traders']
    },
    {
      id: '8',
      name: 'Gap Fill Strategy',
      category: 'Price Action',
      description: 'Trades on the statistical tendency for price gaps to eventually fill as markets normalize.',
      difficulty: 'Beginner',
      timeframe: '1D - 1W',
      successRate: 69,
      riskLevel: 'Low',
      signals: ['Gap Up', 'Gap Down', 'Partial Fill'],
      rules: {
        entry: [
          'Identify gap of 2%+ from previous close',
          'Enter counter-gap direction after initial momentum fades',
          'Wait for consolidation pattern near gap edge'
        ],
        exit: [
          'Exit when gap is 90% filled',
          'Take profit if gap fills completely',
          'Exit if new gap forms in same direction'
        ],
        stopLoss: 'Set stop at 1.5x the gap size beyond entry'
      },
      bestFor: ['Large cap stocks', 'Post-earnings', 'Mean reversion trading']
    }
  ];

  const categories = ['all', 'Trend Following', 'Momentum', 'Volatility', 'Price Action', 'Breakout', 'Technical'];

  const filteredStrategies = selectedCategory === 'all' 
    ? strategies 
    : strategies.filter(s => s.category === selectedCategory);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'Advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Target className="w-10 h-10" />
            Trading Strategies
          </h1>
          <p className="text-gray-300 text-lg">
            Proven strategies with detailed entry/exit rules and risk management
          </p>
        </div>

        <div className="mb-6 flex gap-2 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {filteredStrategies.map(strategy => (
              <div
                key={strategy.id}
                onClick={() => setSelectedStrategy(strategy)}
                className={`bg-white/10 backdrop-blur-md rounded-xl p-6 cursor-pointer transition-all hover:bg-white/20 ${
                  selectedStrategy?.id === strategy.id ? 'ring-2 ring-purple-400' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{strategy.name}</h3>
                    <span className="text-sm text-purple-300">{strategy.category}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(strategy.difficulty)}`}>
                    {strategy.difficulty}
                  </span>
                </div>

                <p className="text-gray-300 text-sm mb-4">{strategy.description}</p>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Success Rate</p>
                    <p className="text-white font-bold text-lg">{strategy.successRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Risk Level</p>
                    <p className={`font-bold text-lg ${getRiskColor(strategy.riskLevel)}`}>
                      {strategy.riskLevel}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Timeframe</p>
                    <p className="text-white font-bold text-lg">{strategy.timeframe}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-6 h-fit">
            {selectedStrategy ? (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  {selectedStrategy.name}
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Key Signals
                    </h3>
                    <div className="space-y-2">
                      {selectedStrategy.signals.map((signal, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span>{signal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-green-300 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Entry Rules
                    </h3>
                    <ul className="space-y-2">
                      {selectedStrategy.rules.entry.map((rule, index) => (
                        <li key={index} className="text-gray-300 text-sm flex gap-2">
                          <span className="text-green-400 font-bold">{index + 1}.</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-orange-300 mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Exit Rules
                    </h3>
                    <ul className="space-y-2">
                      {selectedStrategy.rules.exit.map((rule, index) => (
                        <li key={index} className="text-gray-300 text-sm flex gap-2">
                          <span className="text-orange-400 font-bold">{index + 1}.</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-red-300 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Stop Loss
                    </h3>
                    <p className="text-gray-300 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/30">
                      {selectedStrategy.rules.stopLoss}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">Best For</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStrategy.bestFor.map((item, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 text-center">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  Select a strategy to view detailed rules and guidelines
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingStrategies;
