import { useState } from 'react';

interface Props {
  prices: Record<string, number>;
  onOpenPosition: (symbol: string, side: 'LONG' | 'SHORT', size: number, sl?: number, tp?: number) => void;
}

export function TradingPanel({ prices, onOpenPosition }: Props) {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState<'LONG' | 'SHORT'>('LONG');
  const [size, setSize] = useState(0.1);
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenPosition(
      symbol, 
      side, 
      size, 
      stopLoss ? parseFloat(stopLoss) : undefined,
      takeProfit ? parseFloat(takeProfit) : undefined
    );
  };

  const currentPrice = prices[symbol] || 0;

  return (
    <div className="trading-panel">
      <h3>Open New Position</h3>
      
      <form onSubmit={handleSubmit}>
        <select value={symbol} onChange={e => setSymbol(e.target.value)}>
          <option value="BTCUSDT">BTC/USDT</option>
          <option value="ETHUSDT">ETH/USDT</option>
          <option value="SOLUSDT">SOL/USDT</option>
        </select>

        <div className="side-selector">
          <button 
            type="button" 
            className={side === 'LONG' ? 'active long' : 'long'}
            onClick={() => setSide('LONG')}
          >
            LONG
          </button>
          <button 
            type="button" 
            className={side === 'SHORT' ? 'active short' : 'short'}
            onClick={() => setSide('SHORT')}
          >
            SHORT
          </button>
        </div>

        <div className="price-display">
          Current Price: ${currentPrice.toLocaleString()}
        </div>

        <input 
          type="number" 
          step="0.01" 
          value={size} 
          onChange={e => setSize(parseFloat(e.target.value))}
          placeholder="Size"
        />

        <input 
          type="number" 
          value={stopLoss} 
          onChange={e => setStopLoss(e.target.value)}
          placeholder="Stop Loss (optional)"
        />

        <input 
          type="number" 
          value={takeProfit} 
          onChange={e => setTakeProfit(e.target.value)}
          placeholder="Take Profit (optional)"
        />

        <button type="submit" className={side.toLowerCase()}>
          Open {side} Position
        </button>
      </form>
    </div>
  );
}
