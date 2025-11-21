import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import MarketOverview from './pages/MarketOverview'
import MyTrades from './pages/MyTrades'
import NewsFeed from './pages/NewsFeed'
import TradingStrategies from './pages/TradingStrategies'
import AIRecommendations from './pages/AIRecommendations'
import StockAnalyzer from './pages/StockAnalyzer'

function App() {
  return (
    <Router basename="/">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <Routes>
          <Route path="/" element={<MarketOverview />} />
          <Route path="/trades" element={<MyTrades />} />
          <Route path="/news" element={<NewsFeed />} />
          <Route path="/strategies" element={<TradingStrategies />} />
          <Route path="/ai-recommendations" element={<AIRecommendations />} />
          <Route path="/analyzer" element={<StockAnalyzer />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
