import React, { useState } from 'react';
import { TrendingUp, Target, BarChart3, Activity, CheckCircle, Zap, Shield, DollarSign } from 'lucide-react';

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
    riskReward: string;
  };
  bestFor: string[];
  chartPattern: string;
}

const ChartPattern: React.FC<{ pattern: string }> = ({ pattern }) => {
  const patterns: { [key: string]: JSX.Element } = {
    'moving-average': (
      <svg viewBox="0 0 200 100" className="w-full h-32">
        <defs>
          <linearGradient id="bullishGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#4ade80" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d="M10,80 Q50,70 100,40 T190,20" stroke="#4ade80" strokeWidth="2" fill="none"/>
        <path d="M10,85 Q50,80 100,60 T190,50" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="4"/>
        <circle cx="100" cy="50" r="4" fill="#4ade80" className="animate-pulse"/>
        <text x="105" y="45" fill="#4ade80" fontSize="10">Golden Cross</text>
      </svg>
    ),
    'rsi-divergence': (
      <svg viewBox="0 0 200 100" className="w-full h-32">
        <path d="M10,60 L40,50 L70,40 L100,35" stroke="#f87171" strokeWidth="2" fill="none"/>
        <path d="M10,90 L40,85 L70,75 L100,65" stroke="#4ade80" strokeWidth="2" fill="none"/>
        <line x1="35" y1="50" x2="35" y2="85" stroke="#a78bfa" strokeWidth="1" strokeDasharray="2"/>
        <line x1="65" y1="40" x2="65" y2="75" stroke="#a78bfa" strokeWidth="1" strokeDasharray="2"/>
        <text x="110" y="40" fill="#4ade80" fontSize="10">Bullish Div</text>
      </svg>
    ),
    'bollinger-squeeze': (
      <svg viewBox="0 0 200 100" className="w-full h-32">
        <path d="M10,30 Q50,25 100,30 T190,40" stroke="#f59e0b" strokeWidth="1.5" fill="none"/>
        <path d="M10,50 Q50,48 100,50 T190,52" stroke="#fff" strokeWidth="2" fill="none"/>
        <path d="M10,70 Q50,71 100,70 T190,64" stroke="#f59e0b" strokeWidth="1.5" fill="none"/>
        <rect x="90" y="45" width="20" height="10" fill="#4ade80" opacity="0.3"/>
        <path d="M110,50 L150,30 L160,25" stroke="#4ade80" strokeWidth="2" fill="none"/>
        <text x="120" y="25" fill="#4ade80" fontSize="10">Breakout!</text>
      </svg>
    ),
    'macd-histogram': (
      <svg viewBox="0 0 200 100" className="w-full h-32">
        <line x1="0" y1="50" x2="200" y2="50" stroke="#666" strokeWidth="1"/>
        <rect x="20" y="40" width="8" height="10" fill="#4ade80"/>
        <rect x="35" y="35" width="8" height="15" fill="#4ade80"/>
        <rect x="50" y="30" width="8" height="20" fill="#4ade80"/>
        <rect x="65" y="35" width="8" height="15" fill="#4ade80"/>
        <rect x="80" y="50" width="8" height="8" fill="#f87171"/>
        <rect x="95" y="50" width="8" height="15" fill="#f87171"/>
        <rect x="110" y="50" width="8" height="12" fill="#f87171"/>
        <rect x="125" y="50" width="8" height="8" fill="#f87171"/>
        <rect x="140" y="45" width="8" height="5" fill="#4ade80"/>
        <circle cx="144" cy="42" r="6" stroke="#fbbf24" strokeWidth="2" fill="none" className="animate-pulse"/>
      </svg>
    ),
    'support-resistance': (
      <svg viewBox="0 0 200 100" className="w-full h-32">
        <line x1="0" y1="70" x2="200" y2="70" stroke="#f87171" strokeWidth="2" strokeDasharray="4"/>
        <line x1="0" y1="30" x2="200" y2="30" stroke="#4ade80" strokeWidth="2" strokeDasharray="4"/>
        <path d="M10,60 L30,40 L50,50 L70,35 L90,45 L110,32 L130,40 L150,55 L170,45" stroke="#fff" strokeWidth="2" fill="none"/>
        <circle cx="30" cy="70" r="4" fill="#4ade80" className="animate-pulse"/>
        <circle cx="110" cy="70" r="4" fill="#4ade80" className="animate-pulse"/>
        <text x="5" y="25" fill="#4ade80" fontSize="9">Resistance</text>
        <text x="5" y="85" fill="#f87171" fontSize="9">Support</text>
      </svg>
    ),
    'breakout-volume': (
      <svg viewBox="0 0 200 100" className="w-full h-32">
        <line x1="0" y1="50" x2="120" y2="50" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4"/>
        <path d="M10,55 Q60,52 120,50" stroke="#fff" strokeWidth="2" fill="none"/>
        <path d="M120,50 L140,35 L160,30 L180,25" stroke="#4ade80" strokeWidth="3" fill="none"/>
        <rect x="10" y="85" width="15" height="10" fill="#666"/>
        <rect x="30" y="82" width="15" height="13" fill="#666"/>
        <rect x="50" y="80" width="15" height="15" fill="#666"/>
        <rect x="120" y="70" width="15" height="25" fill="#4ade80" className="animate-pulse"/>
        <text x="125" y="20" fill="#4ade80" fontSize="10">Volume Spike</text>
      </svg>
    ),
    'fibonacci': (
      <svg viewBox="0 0 200 100" className="w-full h-32">
        <line x1="0" y1="80" x2="200" y2="80" stroke="#666" strokeWidth="1" strokeDasharray="2"/>
        <line x1="0" y1="65" x2="200" y2="65" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2"/>
        <line x1="0" y1="50" x2="200" y2="50" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2"/>
        <line x1="0" y1="35" x2="200" y2="35" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2"/>
        <line x1="0" y1="20" x2="200" y2="20" stroke="#666" strokeWidth="1" strokeDasharray="2"/>
        <path d="M10,80 L60,20 L120,50 L180,15" stroke="#4ade80" strokeWidth="2" fill="none"/>
        <circle cx="120" cy="50" r="5" fill="#4ade80" className="animate-pulse"/>
        <text x="5" y="52" fill="#f59e0b" fontSize="9">50%</text>
        <text x="5" y="37" fill="#fbbf24" fontSize="9">61.8%</text>
      </svg>
    ),
    'gap-fill': (
      <svg viewBox="0 0 200 100" className="w-full h-32">
        <rect x="10" y="50" width="60" height="30" fill="#4ade80" opacity="0.3"/>
        <rect x="70" y="30" width="60" height="30" fill="#fff" opacity="0.1"/>
        <rect x="130" y="40" width="60" height="30" fill="#f87171" opacity="0.3"/>
        <path d="M40,65 L70,65" stroke="#fff" strokeWidth="2" fill="none"/>
        <path d="M70,30 L70,65" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4"/>
        <path d="M130,55 L130,30" stroke="#4ade80" strokeWidth="2" fill="none"/>
        <text x="75" y="50" fill="#fbbf24" fontSize="10">Gap</text>
        <text x="135" y="50" fill="#4ade80" fontSize="10">Fill</text>
      </svg>
    )
  };

  return patterns[pattern] || patterns['moving-average'];
};

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
        stopLoss: '5% below entry price or below recent support level',
        riskReward: '1:3 (Risk $1 to make $3)'
      },
      bestFor: ['Large cap stocks', 'Index ETFs', 'Stable market conditions'],
      chartPattern: 'moving-average'
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
        stopLoss: 'Place 2% below the divergence low point',
        riskReward: '1:2.5 (Risk $1 to make $2.50)'
      },
      bestFor: ['Volatile stocks', 'Oversold/Overbought conditions', 'Swing trading'],
      chartPattern: 'rsi-divergence'
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
        stopLoss: 'Place stop just inside the middle band (20-day MA)',
        riskReward: '1:4 (Risk $1 to make $4)'
      },
      bestFor: ['High volatility stocks', 'Earnings plays', 'News-driven events'],
      chartPattern: 'bollinger-squeeze'
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
        stopLoss: 'Set stop 3% beyond recent swing point',
        riskReward: '1:2 (Risk $1 to make $2)'
      },
      bestFor: ['Medium-term trading', 'Trending stocks', 'Index trading'],
      chartPattern: 'macd-histogram'
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
        stopLoss: 'Place 1-2% beyond the support/resistance level',
        riskReward: '1:3 (Risk $1 to make $3)'
      },
      bestFor: ['Range-bound markets', 'Blue chip stocks', 'Conservative trading'],
      chartPattern: 'support-resistance'
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
        stopLoss: 'Place stop just below breakout level or recent low',
        riskReward: '1:3.5 (Risk $1 to make $3.50)'
      },
      bestFor: ['Gap ups', 'Earnings releases', 'News catalysts'],
      chartPattern: 'breakout-volume'
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
        stopLoss: 'Place stop below 78.6% Fibonacci level',
        riskReward: '1:4 (Risk $1 to make $4)'
      },
      bestFor: ['Strong trending stocks', 'Pullback trading', 'Technical traders'],
      chartPattern: 'fibonacci'
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
        stopLoss: 'Set stop at 1.5x the gap size beyond entry',
        riskReward: '1:2.5 (Risk $1 to make $2.50)'
      },
      bestFor: ['Large cap stocks', 'Post-earnings', 'Mean reversion trading'],
      chartPattern: 'gap-fill'
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
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Target className="w-8 h-8 text-purple-400" />
            Trading Strategies
          </h1>
          <p className="text-gray-300 mt-1">
            Proven strategies with visual patterns and risk management
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              selectedCategory === category
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50'
                : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700'
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
              className={`bg-slate-800/50 backdrop-blur-sm border rounded-xl p-6 cursor-pointer transition-all transform hover:scale-[1.02] hover:shadow-xl ${
                selectedStrategy?.id === strategy.id 
                  ? 'ring-2 ring-purple-400 shadow-lg shadow-purple-500/30' 
                  : 'border-purple-500/20 hover:border-purple-500/40'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{strategy.name}</h3>
                  <span className="text-sm text-purple-300 font-semibold">{strategy.category}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(strategy.difficulty)}`}>
                  {strategy.difficulty}
                </span>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-3 mb-4 border border-purple-500/10">
                <ChartPattern pattern={strategy.chartPattern} />
              </div>

              <p className="text-gray-300 text-sm mb-4">{strategy.description}</p>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-2 bg-slate-900/30 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Success Rate</p>
                  <p className="text-white font-bold text-lg">{strategy.successRate}%</p>
                </div>
                <div className="text-center p-2 bg-slate-900/30 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Risk Level</p>
                  <p className={`font-bold text-lg ${getRiskColor(strategy.riskLevel)}`}>
                    {strategy.riskLevel}
                  </p>
                </div>
                <div className="text-center p-2 bg-slate-900/30 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Timeframe</p>
                  <p className="text-white font-bold text-sm">{strategy.timeframe}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:sticky lg:top-6 h-fit">
          {selectedStrategy ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 backdrop-blur-sm border-2 border-red-500/50 rounded-xl p-6 shadow-xl shadow-red-500/20">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-red-500 rounded-full p-3">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                      Stop Loss Protection
                    </h3>
                    <p className="text-red-200 text-sm">Critical risk management rule</p>
                  </div>
                </div>
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-3">
                  <p className="text-white text-lg font-semibold leading-relaxed">
                    {selectedStrategy.rules.stopLoss}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-yellow-300">
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold">{selectedStrategy.rules.riskReward}</span>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                  {selectedStrategy.name}
                </h2>
                <p className="text-gray-400 text-sm mb-6">{selectedStrategy.description}</p>

                <div className="space-y-5">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <ChartPattern pattern={selectedStrategy.chartPattern} />
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Key Signals to Watch
                    </h3>
                    <div className="space-y-2">
                      {selectedStrategy.signals.map((signal, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-200">
                          <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                          <span className="font-medium">{signal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-300 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Entry Rules
                    </h3>
                    <ul className="space-y-2">
                      {selectedStrategy.rules.entry.map((rule, index) => (
                        <li key={index} className="text-gray-200 text-sm flex gap-3">
                          <span className="text-green-400 font-bold text-lg">{index + 1}</span>
                          <span className="pt-0.5">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-orange-300 mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Exit Rules
                    </h3>
                    <ul className="space-y-2">
                      {selectedStrategy.rules.exit.map((rule, index) => (
                        <li key={index} className="text-gray-200 text-sm flex gap-3">
                          <span className="text-orange-400 font-bold text-lg">{index + 1}</span>
                          <span className="pt-0.5">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Best For
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStrategy.bestFor.map((item, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-12 text-center">
              <div className="animate-bounce mb-4">
                <Target className="w-16 h-16 text-purple-400 mx-auto" />
              </div>
              <p className="text-gray-400 text-lg font-semibold">
                Select a strategy to view visual patterns and detailed rules
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Click any strategy card on the left to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingStrategies;
