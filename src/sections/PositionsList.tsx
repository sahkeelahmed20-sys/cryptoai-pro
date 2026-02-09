import { Position } from '../hooks/useDemoTrading';

interface Props {
  positions: Position[];
  onClose: (id: number) => void;
}

export function PositionsList({ positions, onClose }: Props) {
  if (positions.length === 0) {
    return <div className="positions-empty">No open positions</div>;
  }

  return (
    <div className="positions-list">
      <h3>Open Positions ({positions.length})</h3>
      
      {positions.map(pos => (
        <div key={pos.id} className={`position-card ${pos.side.toLowerCase()}`}>
          <div className="position-header">
            <span className={`badge ${pos.side.toLowerCase()}`}>{pos.side}</span>
            <span className="symbol">{pos.symbol}</span>
            <button onClick={() => onClose(pos.id)} className="close-btn">Close</button>
          </div>
          
          <div className="position-details">
            <div>
              <label>Entry</label>
              <span>${pos.entryPrice.toLocaleString()}</span>
            </div>
            <div>
              <label>Current</label>
              <span>${pos.currentPrice.toLocaleString()}</span>
            </div>
            <div>
              <label>Size</label>
              <span>{pos.size}</span>
            </div>
          </div>
          
          <div className={`pnl ${pos.pnl >= 0 ? 'positive' : 'negative'}`}>
            {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)} ({pos.pnlPercent.toFixed(2)}%)
          </div>
          
          {pos.stopLoss && (
            <div className="sl-tp">SL: ${pos.stopLoss}</div>
          )}
          {pos.takeProfit && (
            <div className="sl-tp">TP: ${pos.takeProfit}</div>
          )}
        </div>
      ))}
    </div>
  );
}
