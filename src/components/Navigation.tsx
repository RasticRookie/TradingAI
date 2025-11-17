import { Link, useLocation } from 'react-router-dom'
import { TrendingUp, Newspaper, Wallet, Target, Brain, BarChart3 } from 'lucide-react'

export default function Navigation() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-purple-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-purple-400" size={32} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              TradePredict Pro
            </h1>
          </div>
          
          <div className="flex space-x-1 overflow-x-auto">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive('/')
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-300 hover:bg-slate-800'
              }`}
            >
              <TrendingUp size={20} />
              <span>Market</span>
            </Link>
            
            <Link
              to="/trades"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive('/trades')
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-300 hover:bg-slate-800'
              }`}
            >
              <Wallet size={20} />
              <span>Trades</span>
            </Link>
            
            <Link
              to="/news"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive('/news')
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-300 hover:bg-slate-800'
              }`}
            >
              <Newspaper size={20} />
              <span>News</span>
            </Link>

            <Link
              to="/strategies"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive('/strategies')
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-300 hover:bg-slate-800'
              }`}
            >
              <Target size={20} />
              <span>Strategies</span>
            </Link>

            <Link
              to="/ai-recommendations"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive('/ai-recommendations')
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-300 hover:bg-slate-800'
              }`}
            >
              <Brain size={20} />
              <span>AI Recs</span>
            </Link>

            <Link
              to="/analyzer"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive('/analyzer')
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-300 hover:bg-slate-800'
              }`}
            >
              <BarChart3 size={20} />
              <span>Analyzer</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
