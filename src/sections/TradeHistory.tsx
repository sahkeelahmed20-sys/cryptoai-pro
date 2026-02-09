import type { Trade } from '../types';

interface TradeHistoryProps {
  trades: Trade[];
}

export default function TradeHistory({ trades }: TradeHistoryProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>📈 Trade History</h3>
      </div>
      
      <div className="card-body">
        {trades.length === 0 ? (
          <div className="empty-state">No trades yet</div>
        ) : (
          <div className="trade-list">
            {trades.map(trade => (
              <div key={trade.id} className="trade-item">
                <div className="trade-info">
                  <div className={`trade-icon ${trade.side.toLowerCase()}`}>
                    {trade.side === 'BUY' ? '↑' : '↓'}
                  </div>
                  <div className="trade-details">
                    <h4>{trade.type} {trade.symbol}</h4>
                    <p>{trade.side} @ ${trade.price.toLocaleString()} • Size: {trade.size}</p>
                  </div>
                </div>
                {trade.pnl !== undefined && (
                  <div className={`trade-pnl ${trade.pnl >= 0 ? 'positive' : 'negative'}`}>
                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
