export const generateMockChartData = (currentPrice: number, days: number = 30) => {
  const data = []
  let price = currentPrice * 0.9
  
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const timeLabel = i === 0 ? 'Now' : `${i}d`
    
    const volatility = (Math.random() - 0.5) * (price * 0.03)
    const trend = (currentPrice - price) / days
    price = price + trend + volatility
    
    data.push({
      time: timeLabel,
      price: parseFloat(price.toFixed(2))
    })
  }
  
  return data
}
