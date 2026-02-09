import { useDemoTrading } from './hooks/useDemoTrading';
import MarketOverview from './sections/MarketOverview';
import DemoTrading from './sections/DemoTrading';
import TradeHistory from './sections/TradeHistory';
import type { KillSwitchLevel, MarketRegime, TradingState } from './types';

// Export types for other components
export type { KillSwitchLevel, MarketRegime, TradingState };

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

  const tradingState: TradingState = {
    isEnabled: true,
    killSwitchLevel: 'SOFT',
    marketRegime: 'TREND',
    lastUpdate: Date.now()
  };

  return (
    <div className="app">
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? '● Live' : '○ Offline'}
      </div>

      <div className="top-ticker">
        {Object.entries(prices).map(([symbol, price]) => (
          <div key={symbol} className="ticker-item">
            <span className="symbol">{symbol.replace('USDT', '/USDT')}</span>
            <span className="price">${price.toLocaleString()}</span>
            <span className={`change ${(changes[symbol] || 0) >= 0 ? 'positive' : 'negative'}`}>
              {(changes[symbol] || 0) >= 0 ? '+' : ''}{(changes[symbol] || 0).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      <div className="main-layout">
        <MarketOverview tradingState={tradingState} />
        <DemoTrading 
          balance={balance}
          equity={equity}
          positions={positions}
          prices={prices}
          onOpenPosition={openPosition}
          onClosePosition={closePosition}
        />
        <TradeHistory trades={trades} />
      </div>
    </div>
  );
}

export default App;
