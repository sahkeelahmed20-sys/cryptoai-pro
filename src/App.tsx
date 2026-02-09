import { useDemoTrading } from './hooks/useDemoTrading';
import { MarketOverview } from './sections/MarketOverview';
import { TradingPanel } from './sections/TradingPanel';
import { PositionsList } from './sections/PositionsList';
import { TradeHistory } from './sections/TradeHistory';
import { PerformanceMetrics } from './sections/PerformanceMetrics';

function App() {
  const {
    positions,
    prices,
    changes,
    trades,
    balance,
    equity,
    openPosition,
    closePosition,
    isConnected
  } = useDemoTrading();

  return (
    <div className="app">
      {/* Connection Status */}
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? '● Live' : '○ Offline'}
      </div>

      {/* Top Ticker - Live Prices */}
      <div className="top-ticker">
        {Object.entries(prices).map(([symbol, price]) => (
          <div key={symbol} className="ticker-item">
            <span className="symbol">{symbol.replace('USDT', '/USDT')}</span>
            <span className="price">${price.toLocaleString()}</span>
            <span className={`change ${changes[symbol] >= 0 ? 'positive' : 'negative'}`}>
              {changes[symbol] >= 0 ? '+' : ''}{changes[symbol]?.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      <div className="main-layout">
        <MarketOverview 
          balance={balance} 
          equity={equity} 
          positions={positions}
        />
        
        <TradingPanel 
          prices={prices}
          onOpenPosition={openPosition}
        />
        
        <PositionsList 
          positions={positions}
          onClose={closePosition}
        />
        
        <TradeHistory trades={trades} />
      </div>
    </div>
  );
}

export default App;
