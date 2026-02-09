import { useState, useEffect } from 'react';
import { marketDataService, PriceData } from '../services/marketData';
import { binanceWS, LivePriceData } from '../services/binanceWebSocket';

const COINS = ['BTC', 'ETH', 'BNB', 'ADA', 'XRP', 'SOL', 'DOT', 'DOGE'];

// Default export - THIS IS IMPORTANT
export default function MarketOverview() {
  const [coins, setCoins] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Load initial data via REST API
  useEffect(() => {
    const loadData = async () => {
      const data = await marketDataService.get24hrTickers(COINS);
      setCoins(data);
      setLoading(false);
    };
    loadData();
  }, []);

  // 2. Connect to WebSocket for live updates
  useEffect(() => {
    if (coins.length === 0) return;
    
    // Connect to Binance WS
    binanceWS.connect(COINS.map(c => `${c}USDT`));
    
    // Subscribe each coin to updates
    COINS.forEach(coin => {
      binanceWS.subscribe(coin, (update: LivePriceData) => {
        setCoins(prev => prev.map(c => 
          c.symbol === update.symbol 
            ? { ...c, price: update.price, changePercent24h: update.changePercent }
            : c
        ));
      });
    });
    
    return () => binanceWS.disconnect();
  }, [coins.length]);

  if (loading) return <div className="p-4 text-white">Loading...</div>;

  return (
    <div className="space-y-2 p-4">
      <h2 className="text-xl font-bold text-white mb-4">Live Market</h2>
      
      {coins.map((coin) => (
        <div key={coin.symbol} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">
              {coin.symbol[0]}
            </div>
            <div>
              <div className="font-bold text-white">{coin.symbol}/USDT</div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-white font-mono text-lg">
              ${coin.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </div>
            <div className={`text-sm ${coin.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {coin.changePercent24h >= 0 ? '+' : ''}{coin.changePercent24h.toFixed(2)}%
            </div>
          </div>
        </div>
      ))}
      
      <p className="text-xs text-gray-500 text-center mt-4">Live via Binance</p>
    </div>
  );
}
