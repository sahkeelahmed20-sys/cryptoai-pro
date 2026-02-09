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

  const currentPrice = prices[symbol] || 0;

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <div className="card-header">
        <h3>💰 Demo Trading Account</h3>
      </div>
      
      <div className="card-body">
        <div className="trading-panel">
          <select 
            className="symbol-select"
            value={symbol} 
            onChange={e => setSymbol(e.target.value)}
          >
            <option value="BTCUSDT">BTC/USDT</option>
            <option value="ETHUSDT">ETH/USDT</option>
            <option value="SOLUSDT">SOL/USDT</option>
          </select>

          <div className="current-price">
            <div className="label">Current {symbol.replace('USDT', '/USDT')} Price</div>
            <div className="value">${currentPrice.toLocaleString()}</div>
          </div>

          <div className="side-selector">
            <button 
              type="button" 
              className={`side-btn long ${side === 'LONG' ? 'active' : ''}`}
              onClick={() => setSide('LONG')}
            >
              LONG
            </button>
            <button 
              type="button" 
              className={`side-btn short ${side === 'SHORT' ? 'active' : ''}`}
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
            className="size-input"
          />

          <button 
            onClick={handleOpen} 
            className={`submit-btn ${side.toLowerCase()}`}
          >
            Open {side} Position
          </button>
        </div>

        <div className="positions-list" style={{ marginTop: '24px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>
            Open Positions ({positions.length})
          </h3>
          
          {positions.length === 0 ? (
            <div className="empty-state">No open positions</div>
          ) : (
            positions.map(pos => (
              <div key={pos.id} className={`position-card ${pos.side.toLowerCase()}`}>
                <div className="position-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className={`position-badge ${pos.side.toLowerCase()}`}>{pos.side}</span>
                    <span className="position-symbol">{pos.symbol}</span>
                  </div>
                  <span className={`position-pnl ${pos.pnl >= 0 ? 'positive' : 'negative'}`}>
                    {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                  </span>
                </div>
                
                <div className="position-details">
                  <div className="detail-item">
                    <span className="label">Entry Price</span>
                    <span className="value">${pos.entryPrice.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Current Price</span>
                    <span className="value">${pos.currentPrice.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Size</span>
                    <span className="value">{pos.size}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => onClosePosition(pos.id)} 
                  className="close-btn"
                >
                  Close Position
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
