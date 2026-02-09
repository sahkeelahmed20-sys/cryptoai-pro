import type { Trade } from '../types';

interface TradeHistoryProps {
  trades: Trade[];
}

export default function TradeHistory({ trades }: TradeHistoryProps) {
  if (trades.length === 0) {
    return <div className="trade-history">No trades yet</div>;
  }

  return (
    <div className="trade-history">
      <h3>Trade History ({trades.length})</h3>
      <div className="trades-list">
        {trades.map(trade => (
          <div key={trade.id} className={`trade ${trade.type.toLowerCase()}`}>
            <span>{trade.type}</span>
            <span>{trade.side}</span>
            <span>{trade.symbol}</span>
            <span>${trade.price.toLocaleString()}</span>
            <span>Size: {trade.size}</span>
            {trade.pnl !== undefined && (
              <span className={trade.pnl >= 0 ? 'positive' : 'negative'}>
                P&L: ${trade.pnl.toFixed(2)}
              </span>
            )}
            <span className="time">
              {new Date(trade.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
