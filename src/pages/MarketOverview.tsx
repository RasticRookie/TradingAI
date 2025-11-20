import { useEffect, useState } from 'react'
import { TrendingStock } from '../types'
import { fetchTrendingStocks, fetchFutures, fetchForex, fetchCrypto } from '../services/api'
import { TrendingUp, TrendingDown, Minus, Activity, Plus, X } from 'lucide-react'
import StockChart from '../components/StockChart'
import ErrorNotification from '../components/ErrorNotification'
import { generateMockChartData } from '../utils/chartData'

type AssetType = 'stocks' | 'futures' | 'forex' | 'crypto';

export default function MarketOverview() {
  const [activeTab, setActiveTab] = useState<AssetType>('stocks')
  const [stocks, setStocks] = useState<TrendingStock[]>([])
  const [futures, setFutures] = useState<TrendingStock[]>([])
  const [forex, setForex] = useState<TrendingStock[]>([])
  const [crypto, setCrypto] = useState<TrendingStock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchSymbol, setSearchSymbol] = useState('')
  const [customSymbols, setCustomSymbols] = useState<string[]>(() => {
    const saved = localStorage.getItem('customWatchlist');
    return saved ? JSON.parse(saved) : [];
  })

  useEffect(() => {
    loadAllData()
    const interval = setInterval(loadAllData, 300000)
    return () => clearInterval(interval)
  }, [customSymbols])

  const loadAllData = async () => {
    try {
      setError(null)
      const [stocksData, futuresData, forexData, cryptoData] = await Promise.all([
        fetchTrendingStocks([...new Set(['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'AMD', ...customSymbols])]),
        fetchFutures(),
        fetchForex(),
        fetchCrypto()
      ])
      setStocks(stocksData)
      setFutures(futuresData)
      setForex(forexData)
      setCrypto(cryptoData)
    } catch (error) {
      console.error('Failed to load market data:', error)
      setError('Failed to load market data. Using cached/demo data.')
    } finally {
      setLoading(false)
    }
  }

  const addCustomSymbol = () => {
    const symbol = searchSymbol.trim().toUpperCase();
    if (symbol && !customSymbols.includes(symbol)) {
      const updated = [...customSymbols, symbol];
      setCustomSymbols(updated);
      localStorage.setItem('customWatchlist', JSON.stringify(updated));
      setSearchSymbol('');
    }
  }

  const removeCustomSymbol = (symbol: string) => {
    const updated = customSymbols.filter(s => s !== symbol);
    setCustomSymbols(updated);
    localStorage.setItem('customWatchlist', JSON.stringify(updated));
  }

  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case 'bullish': return 'text-green-400'
      case 'bearish': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getPredictionIcon = (prediction: string) => {
    switch (prediction) {
      case 'bullish': return <TrendingUp size={20} />
      case 'bearish': return <TrendingDown size={20} />
      default: return <Minus size={20} />
    }
  }

  const getCurrentData = () => {
    switch (activeTab) {
      case 'stocks': return stocks;
      case 'futures': return futures;
      case 'forex': return forex;
      case 'crypto': return crypto;
      default: return stocks;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Activity className="animate-spin mx-auto mb-4 text-purple-400" size={48} />
          <p className="text-gray-300">Loading market data...</p>
        </div>
      </div>
    )
  }

  const currentData = getCurrentData();

  return (
    <div className="space-y-6">
      {error && <ErrorNotification message={error} onClose={() => setError(null)} />}
      
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-white">Market Overview & Predictions</h1>
        <button
          onClick={loadAllData}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Refresh Data
        </button>
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <button
          onClick={() => setActiveTab('stocks')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'stocks' ? 'bg-purple-500 text-white' : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700'
          }`}
        >
          Stocks
        </button>
        <button
          onClick={() => setActiveTab('futures')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'futures' ? 'bg-purple-500 text-white' : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700'
          }`}
        >
          Futures
        </button>
        <button
          onClick={() => setActiveTab('forex')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'forex' ? 'bg-purple-500 text-white' : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700'
          }`}
        >
          Forex
        </button>
        <button
          onClick={() => setActiveTab('crypto')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'crypto' ? 'bg-purple-500 text-white' : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700'
          }`}
        >
          Crypto
        </button>
      </div>

      {activeTab === 'stocks' && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Add Stocks to Watchlist</h3>
          <div className="flex gap-2 flex-wrap items-start">
            <div className="flex gap-2 flex-1 min-w-[200px]">
              <input
                type="text"
                value={searchSymbol}
                onChange={(e) => setSearchSymbol(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomSymbol()}
                placeholder="Enter ticker (e.g., NFLX, DIS)"
                className="flex-1 px-4 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={addCustomSymbol}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Add
              </button>
            </div>
            {customSymbols.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {customSymbols.map(symbol => (
                  <span
                    key={symbol}
                    className="px-3 py-1 bg-purple-600 text-white rounded-full flex items-center gap-2 text-sm"
                  >
                    {symbol}
                    <button
                      onClick={() => removeCustomSymbol(symbol)}
                      className="hover:bg-purple-700 rounded-full p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentData.map((item) => (
          <div
            key={item.symbol}
            className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{item.symbol}</h3>
                <p className="text-sm text-gray-400">{item.name}</p>
              </div>
              <div className={`flex items-center space-x-1 ${getPredictionColor(item.prediction)}`}>
                {getPredictionIcon(item.prediction)}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-3xl font-bold text-white">
                ${item.price.toFixed(activeTab === 'forex' ? 4 : 2)}
              </p>
              <p className={`text-sm ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
              </p>
            </div>

            <div className="mb-4">
              <StockChart 
                data={generateMockChartData(item.price, 15)} 
                color={item.prediction === 'bullish' ? '#4ade80' : item.prediction === 'bearish' ? '#f87171' : '#9ca3af'}
              />
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Volume:</span>
                <span className="text-white">{(item.volume / 1000000).toFixed(2)}M</span>
              </div>
              {item.technicalIndicators.rsi && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">RSI:</span>
                  <span className={`${
                    item.technicalIndicators.rsi > 70 ? 'text-red-400' : 
                    item.technicalIndicators.rsi < 30 ? 'text-green-400' : 'text-white'
                  }`}>
                    {item.technicalIndicators.rsi.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400">AI Prediction</p>
                  <p className={`text-sm font-bold uppercase ${getPredictionColor(item.prediction)}`}>
                    {item.prediction}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Confidence</p>
                  <p className="text-sm font-bold text-white">{item.confidence.toFixed(0)}%</p>
                </div>
              </div>
              <div className="mt-2 bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    item.prediction === 'bullish' ? 'bg-green-400' :
                    item.prediction === 'bearish' ? 'bg-red-400' : 'bg-gray-400'
                  }`}
                  style={{ width: `${item.confidence}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Market Analysis</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-semibold text-purple-400 mb-2">Technical Analysis</h3>
            <p className="text-gray-300">We analyze RSI, MACD, and other indicators to detect trends and momentum across all asset classes.</p>
          </div>
          <div>
            <h3 className="font-semibold text-purple-400 mb-2">Multi-Asset Coverage</h3>
            <p className="text-gray-300">Track stocks, futures, forex pairs, and cryptocurrencies all in one place with real-time predictions.</p>
          </div>
          <div>
            <h3 className="font-semibold text-purple-400 mb-2">Smart Caching</h3>
            <p className="text-gray-300">Data is cached for 5 minutes to ensure consistency and reduce API usage while maintaining accuracy.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
