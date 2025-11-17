import { useEffect, useState } from 'react'
import { NewsItem } from '../types'
import { fetchMarketNews } from '../services/api'
import { TrendingUp, TrendingDown, Minus, ExternalLink, Activity, Flame, Building2 } from 'lucide-react'
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
      case 'bullish': return 'text-green-400 bg-green-500/10'
      case 'bearish': return 'text-red-400 bg-red-500/10'
      default: return 'text-gray-400 bg-gray-500/10'
    }
  }

  const getPublisherIcon = (source: string) => {
    const lowerSource = source.toLowerCase();
    if (lowerSource.includes('bloomberg')) return '📊';
    if (lowerSource.includes('reuters')) return '📡';
    if (lowerSource.includes('financial times') || lowerSource.includes('ft')) return '📰';
    if (lowerSource.includes('cnbc')) return '📺';
    if (lowerSource.includes('market') || lowerSource.includes('watch')) return '📈';
    return '📄';
  }

  const filteredNews = filter === 'all' 
    ? news 
    : news.filter(item => item.sentiment === filter)

  const hotStories = news.filter(item => item.recommendation === 'long' || item.recommendation === 'short').slice(0, 3);

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

      {hotStories.length > 0 && (
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Flame className="text-orange-400" size={28} />
            Hot Stories - Trading Signals
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {hotStories.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800/80 border border-orange-500/20 rounded-lg p-4 hover:border-orange-500/50 transition-all group"
              >
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-2xl">{getPublisherIcon(item.source)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="text-purple-400" size={14} />
                      <span className="text-purple-300 text-xs font-semibold uppercase">{item.source}</span>
                    </div>
                    <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRecommendationColor(item.recommendation)} flex items-center gap-1`}>
                    {getRecommendationIcon(item.recommendation)}
                    {item.recommendation?.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getSentimentColor(item.sentiment)}`}>
                    {item.sentiment}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

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
            <span className="text-gray-300">Strong sell signal - consider short position</span>
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
        {filteredNews.map((item, index) => (
          <div
            key={index}
            className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{getPublisherIcon(item.source)}</span>
                  <div className="flex items-center gap-2">
                    <Building2 className="text-purple-400" size={16} />
                    <span className="text-purple-300 font-bold text-sm">{item.source}</span>
                  </div>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-400 text-sm">
                    {new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 hover:text-purple-300 transition-colors">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2">
                    {item.title}
                    <ExternalLink className="flex-shrink-0 mt-1" size={16} />
                  </a>
                </h3>
                <p className="text-gray-300 mb-4">{item.summary}</p>
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-lg font-bold border ${getRecommendationColor(item.recommendation)} flex items-center gap-2`}>
                  {getRecommendationIcon(item.recommendation)}
                  {item.recommendation?.toUpperCase() || 'HOLD'}
                </span>
                <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getSentimentColor(item.sentiment)}`}>
                  Sentiment: {item.sentiment}
                </span>
              </div>

              {item.tickers && item.tickers.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">Related:</span>
                  <div className="flex gap-2">
                    {item.tickers.slice(0, 3).map((ticker, i) => (
                      <span key={i} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-semibold">
                        {ticker}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No {filter !== 'all' ? filter : ''} news available at the moment.</p>
        </div>
      )}
    </div>
  )
}
