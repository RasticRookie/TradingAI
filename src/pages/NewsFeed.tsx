import { useEffect, useState } from 'react'
import { NewsItem } from '../types'
import { fetchMarketNews } from '../services/api'
import { TrendingUp, TrendingDown, Minus, ExternalLink, Activity } from 'lucide-react'
import ErrorNotification from '../components/ErrorNotification'

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'bullish' | 'bearish'>('all')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadNews()
    const interval = setInterval(loadNews, 120000)
    return () => clearInterval(interval)
  }, [])

  const loadNews = async () => {
    try {
      setError(null)
      const data = await fetchMarketNews()
      setNews(data)
    } catch (error) {
      console.error('Failed to load news:', error)
      setError('Failed to load news feed. Using demo data. Check your API keys in .env file.')
    } finally {
      setLoading(false)
    }
  }

  const getRecommendationColor = (recommendation?: string) => {
    switch (recommendation) {
      case 'long': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'short': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getRecommendationIcon = (recommendation?: string) => {
    switch (recommendation) {
      case 'long': return <TrendingUp size={16} />
      case 'short': return <TrendingDown size={16} />
      default: return <Minus size={16} />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-400'
      case 'bearish': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const filteredNews = filter === 'all' 
    ? news 
    : news.filter(item => item.sentiment === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Activity className="animate-spin mx-auto mb-4 text-purple-400" size={48} />
          <p className="text-gray-300">Loading market news...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && <ErrorNotification message={error} onClose={() => setError(null)} />}
      
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-white">Real-Time Market News</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-purple-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('bullish')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'bullish' ? 'bg-green-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            Bullish
          </button>
          <button
            onClick={() => setFilter('bearish')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'bearish' ? 'bg-red-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            Bearish
          </button>
          <button
            onClick={loadNews}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-3">Trading Signals Legend</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full flex items-center space-x-1">
              <TrendingUp size={14} />
              <span className="font-semibold">LONG</span>
            </div>
            <span className="text-gray-300">Strong buy signal - consider entering long position</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full flex items-center space-x-1">
              <TrendingDown size={14} />
              <span className="font-semibold">SHORT</span>
            </div>
            <span className="text-gray-300">Strong sell signal - consider shorting or exiting</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-500/20 text-gray-400 border border-gray-500/30 px-3 py-1 rounded-full flex items-center space-x-1">
              <Minus size={14} />
              <span className="font-semibold">HOLD</span>
            </div>
            <span className="text-gray-300">Neutral - wait for clearer signals</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNews.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 text-center">
            <p className="text-gray-400">No news articles found for this filter.</p>
          </div>
        ) : (
          filteredNews.map((item, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{new Date(item.publishedAt).toLocaleString()}</span>
                    {item.tickers.length > 0 && (
                      <>
                        <span>•</span>
                        <div className="flex space-x-1">
                          {item.tickers.slice(0, 3).map(ticker => (
                            <span key={ticker} className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                              {ticker}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <ExternalLink size={20} />
                </a>
              </div>

              <p className="text-gray-300 mb-4">{item.summary}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Sentiment</p>
                    <p className={`font-semibold uppercase text-sm ${getSentimentColor(item.sentiment)}`}>
                      {item.sentiment}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Trading Signal:</span>
                  <div className={`px-3 py-1 rounded-full border flex items-center space-x-1 ${getRecommendationColor(item.recommendation)}`}>
                    {getRecommendationIcon(item.recommendation)}
                    <span className="font-semibold text-sm uppercase">{item.recommendation}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
