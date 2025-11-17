import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import MarketOverview from './pages/MarketOverview'
import MyTrades from './pages/MyTrades'
import NewsFeed from './pages/NewsFeed'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<MarketOverview />} />
            <Route path="/trades" element={<MyTrades />} />
            <Route path="/news" element={<NewsFeed />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
