import { useEffect, useState } from 'react'
import { TrendingStock } from '../types'
import { fetchTrendingStocks } from '../services/api'
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react'
import StockChart from '../components/StockChart'
import ErrorNotification from '../components/ErrorNotification'
import { generateMockChartData } from '../utils/chartData'

export default function MarketOverview() {
  const [stocks, setStocks] = useState<TrendingStock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStocks()
    const interval = setInterval(loadStocks, 60000)
    return () => clearInterval(interval)
  }, [])

  const loadStocks = async () => {
    try {
      setError(null)
      const data = await fetchTrendingStocks()
      setStocks(data)
    } catch (error) {
      console.error('Failed to load stocks:', error)
      setError('Failed to load market data. Using demo data. Check your API keys in .env file.')
    } finally {
      setLoading(false)
    }
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

  return (
    <div className="space-y-6">
      {error && <ErrorNotification message={error} onClose={() => setError(null)} />}
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Market Overview & Predictions</h1>
        <button
          onClick={loadStocks}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{stock.symbol}</h3>
                <p className="text-sm text-gray-400">{stock.name}</p>
              </div>
              <div className={`flex items-center space-x-1 ${getPredictionColor(stock.prediction)}`}>
                {getPredictionIcon(stock.prediction)}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-3xl font-bold text-white">
                ${stock.price.toFixed(2)}
              </p>
              <p className={`text-sm ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </p>
            </div>

            <div className="mb-4">
              <StockChart 
                data={generateMockChartData(stock.price, 15)} 
                color={stock.prediction === 'bullish' ? '#4ade80' : stock.prediction === 'bearish' ? '#f87171' : '#9ca3af'}
              />
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Volume:</span>
                <span className="text-white">{(stock.volume / 1000000).toFixed(2)}M</span>
              </div>
              {stock.technicalIndicators.rsi && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">RSI:</span>
                  <span className={`${
                    stock.technicalIndicators.rsi > 70 ? 'text-red-400' : 
                    stock.technicalIndicators.rsi < 30 ? 'text-green-400' : 'text-white'
                  }`}>
                    {stock.technicalIndicators.rsi.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400">AI Prediction</p>
                  <p className={`text-sm font-bold uppercase ${getPredictionColor(stock.prediction)}`}>
                    {stock.prediction}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Confidence</p>
                  <p className="text-sm font-bold text-white">{stock.confidence.toFixed(0)}%</p>
                </div>
              </div>
              <div className="mt-2 bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    stock.prediction === 'bullish' ? 'bg-green-400' :
                    stock.prediction === 'bearish' ? 'bg-red-400' : 'bg-gray-400'
                  }`}
                  style={{ width: `${stock.confidence}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">How Predictions Work</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-semibold text-purple-400 mb-2">Technical Analysis</h3>
            <p className="text-gray-300">We analyze RSI, MACD, and other indicators to detect trends and momentum.</p>
          </div>
          <div>
            <h3 className="font-semibold text-purple-400 mb-2">Sentiment Analysis</h3>
            <p className="text-gray-300">AI scans news and market sentiment to gauge investor confidence.</p>
          </div>
          <div>
            <h3 className="font-semibold text-purple-400 mb-2">Price Action</h3>
            <p className="text-gray-300">Recent price movements and volume patterns help predict future direction.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
