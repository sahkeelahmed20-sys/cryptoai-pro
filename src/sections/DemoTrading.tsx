import { useState } from 'react';
import type { Position } from '../types';

interface DemoTradingProps {
  balance: number;
  equity: number;
  positions: Position[];
  prices: Record<string, number>;
  onOpenPosition: (symbol: string, side: 'LONG' | 'SHORT', size: number, sl?: number, tp?: number) => void;
  onClosePosition: (id: number) => void;
}

export default function DemoTrading({ 
  balance, 
  equity, 
  positions, 
  prices, 
  onOpenPosition, 
  onClosePosition 
}: DemoTradingProps) {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState<'LONG' | 'SHORT'>('LONG');
  const [size, setSize] = useState(0.1);

  const handleOpen = () => {
    onOpenPosition(symbol, side, size);
  };

  // Get current price for selected symbol
  const currentPrice = prices[symbol] || 0;

  return (
    <div className="demo-trading">
      <h2>Demo Trading Account</h2>
      
      <div className="account-stats">
        <div>Balance: ${balance.toLocaleString()}</div>
        <div>Equity: ${equity.toLocaleString()}</div>
      </div>

      <div className="trading-form">
        <select value={symbol} onChange={e => setSymbol(e.target.value)}>
          <option value="BTCUSDT">BTC/USDT</option>
          <option value="ETHUSDT">ETH/USDT</option>
          <option value="SOLUSDT">SOL/USDT</option>
        </select>

        <div className="current-price">
          Current {symbol} Price: ${currentPrice.toLocaleString()}
        </div>

        <div className="side-buttons">
          <button 
            className={side === 'LONG' ? 'active long' : 'long'}
            onClick={() => setSide('LONG')}
          >
            LONG
          </button>
          <button 
            className={side === 'SHORT' ? 'active short' : 'short'}
            onClick={() => setSide('SHORT')}
          >
            SHORT
          </button>
        </div>

        <input 
          type="number" 
          step="0.01" 
          value={size} 
          onChange={e => setSize(parseFloat(e.target.value))}
          placeholder="Size"
        />

        <button onClick={handleOpen} className={side.toLowerCase()}>
          Open {side}
        </button>
      </div>

      <div className="positions">
        <h3>Open Positions ({positions.length})</h3>
        {positions.map(pos => (
          <div key={pos.id} className={`position ${pos.side.toLowerCase()}`}>
            <div>{pos.side} {pos.symbol} @ ${pos.entryPrice.toLocaleString()}</div>
            <div>Size: {pos.size}</div>
            <div>Current: ${pos.currentPrice.toLocaleString()}</div>
            <div className={pos.pnl >= 0 ? 'positive' : 'negative'}>
              P&L: ${pos.pnl.toFixed(2)} ({pos.pnlPercent.toFixed(2)}%)
            </div>
            <button onClick={() => onClosePosition(pos.id)}>Close</button>
          </div>
        ))}
      </div>
    </div>
  );
}
