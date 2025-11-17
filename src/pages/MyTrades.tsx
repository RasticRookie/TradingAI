import { useState, useEffect } from 'react'
import { Trade } from '../types'
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react'

export default function MyTrades() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTrade, setNewTrade] = useState({
    symbol: '',
    type: 'buy' as 'buy' | 'sell',
    quantity: '',
    price: '',
  })

  useEffect(() => {
    const savedTrades = localStorage.getItem('trades')
    if (savedTrades) {
      setTrades(JSON.parse(savedTrades))
    }
  }, [])

  const saveTrades = (updatedTrades: Trade[]) => {
    localStorage.setItem('trades', JSON.stringify(updatedTrades))
    setTrades(updatedTrades)
  }

  const addTrade = () => {
    if (!newTrade.symbol || !newTrade.quantity || !newTrade.price) return

    const trade: Trade = {
      id: Date.now().toString(),
      symbol: newTrade.symbol.toUpperCase(),
      type: newTrade.type,
      quantity: parseFloat(newTrade.quantity),
      price: parseFloat(newTrade.price),
      date: new Date().toISOString(),
    }

    saveTrades([...trades, trade])
    setNewTrade({ symbol: '', type: 'buy', quantity: '', price: '' })
    setShowAddForm(false)
  }

  const deleteTrade = (id: string) => {
    saveTrades(trades.filter(t => t.id !== id))
  }

  const calculatePortfolio = () => {
    const positions: { [key: string]: { quantity: number; avgPrice: number; totalCost: number; realizedPL: number } } = {}

    trades.forEach(trade => {
      if (!positions[trade.symbol]) {
        positions[trade.symbol] = { quantity: 0, avgPrice: 0, totalCost: 0, realizedPL: 0 }
      }

      if (trade.type === 'buy') {
        const newTotalCost = positions[trade.symbol].totalCost + (trade.quantity * trade.price)
        const newQuantity = positions[trade.symbol].quantity + trade.quantity
        positions[trade.symbol].quantity = newQuantity
        positions[trade.symbol].totalCost = newTotalCost
        positions[trade.symbol].avgPrice = newQuantity > 0 ? newTotalCost / newQuantity : 0
      } else {
        const sellQuantity = Math.min(trade.quantity, positions[trade.symbol].quantity)
        const sellValue = sellQuantity * trade.price
        const costBasis = sellQuantity * positions[trade.symbol].avgPrice
        positions[trade.symbol].realizedPL += (sellValue - costBasis)
        
        const newQuantity = Math.max(0, positions[trade.symbol].quantity - sellQuantity)
        positions[trade.symbol].quantity = newQuantity
        positions[trade.symbol].totalCost = newQuantity * positions[trade.symbol].avgPrice
      }
    })

    return positions
  }

  const portfolio = calculatePortfolio()
  const totalInvested = Object.values(portfolio).reduce((sum, pos) => sum + pos.totalCost, 0)
  const totalRealizedPL = Object.values(portfolio).reduce((sum, pos) => sum + pos.realizedPL, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">My Trades</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Trade</span>
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Total Trades</p>
          <p className="text-3xl font-bold text-white">{trades.length}</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Active Positions</p>
          <p className="text-3xl font-bold text-white">
            {Object.values(portfolio).filter(p => p.quantity > 0).length}
          </p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Total Invested</p>
          <p className="text-3xl font-bold text-white">${totalInvested.toFixed(2)}</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Realized P/L</p>
          <p className={`text-3xl font-bold ${totalRealizedPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalRealizedPL >= 0 ? '+' : ''}${totalRealizedPL.toFixed(2)}
          </p>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Add New Trade</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Symbol (e.g., AAPL)"
              value={newTrade.symbol}
              onChange={e => setNewTrade({ ...newTrade, symbol: e.target.value })}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 outline-none"
            />
            <select
              value={newTrade.type}
              onChange={e => setNewTrade({ ...newTrade, type: e.target.value as 'buy' | 'sell' })}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 outline-none"
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
            <input
              type="number"
              placeholder="Quantity"
              value={newTrade.quantity}
              onChange={e => setNewTrade({ ...newTrade, quantity: e.target.value })}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 outline-none"
            />
            <input
              type="number"
              placeholder="Price"
              value={newTrade.price}
              onChange={e => setNewTrade({ ...newTrade, price: e.target.value })}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 outline-none"
            />
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={addTrade}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Add Trade
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {Object.keys(portfolio).length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Current Positions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(portfolio)
              .filter(([_, pos]) => pos.quantity > 0)
              .map(([symbol, pos]) => (
                <div key={symbol} className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-white">{symbol}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-300">
                      Quantity: <span className="text-white font-semibold">{pos.quantity.toFixed(2)}</span>
                    </p>
                    <p className="text-sm text-gray-300">
                      Avg Price: <span className="text-white font-semibold">${pos.avgPrice.toFixed(2)}</span>
                    </p>
                    <p className="text-sm text-gray-300">
                      Total Cost: <span className="text-white font-semibold">${pos.totalCost.toFixed(2)}</span>
                    </p>
                    {pos.realizedPL !== 0 && (
                      <p className="text-sm text-gray-300">
                        Realized P/L: <span className={`font-semibold ${pos.realizedPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {pos.realizedPL >= 0 ? '+' : ''}${pos.realizedPL.toFixed(2)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Trade History</h2>
        {trades.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No trades yet. Add your first trade to get started!</p>
        ) : (
          <div className="space-y-2">
            {[...trades].reverse().map(trade => (
              <div
                key={trade.id}
                className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${trade.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {trade.type === 'buy' ? (
                      <TrendingUp className="text-green-400" size={20} />
                    ) : (
                      <TrendingDown className="text-red-400" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{trade.symbol}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(trade.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-white font-semibold">
                      {trade.quantity} @ ${trade.price.toFixed(2)}
                    </p>
                    <p className={`text-sm ${trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                      {trade.type.toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteTrade(trade.id)}
                    className="text-red-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
