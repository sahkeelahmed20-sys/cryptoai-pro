import { useDemoTrading } from './hooks/useDemoTrading';
import MarketOverview from './sections/MarketOverview';
import DemoTrading from './sections/DemoTrading';
import TradeHistory from './sections/TradeHistory';
import KillSwitchBanner from './components/KillSwitchBanner';
import type { KillSwitchLevel, MarketRegime, TradingState } from './types';

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
      <KillSwitchBanner tradingState={tradingState} />
      
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="logo">
          <div className="logo-icon">⚡</div>
          <span>CryptoAI Pro</span>
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
        
        <div className={`connection-status ${isConnected ? 'connected' : ''}`}>
          {isConnected ? 'Live' : 'Offline'}
        </div>
      </nav>

      <div className="main-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="nav-item active">
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">💰</span>
            <span>Demo Trading</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">📈</span>
            <span>Backtesting</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">🤖</span>
            <span>Strategies</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">📰</span>
            <span>News Analysis</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">🌐</span>
            <span>Bitnodes</span>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="content-header">
            <h1>Dashboard</h1>
            <p>Intelligent Trading Dashboard</p>
          </div>

          {/* Stats Grid */}
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="label">Portfolio Balance</div>
              <div className="value">${balance.toLocaleString()}</div>
              <div className="change positive">+2.45%</div>
            </div>
            <div className="stat-card">
              <div className="label">Equity</div>
              <div className="value">${equity.toLocaleString()}</div>
              <div className="sub-value">+$1,085.89 unrealized</div>
            </div>
            <div className="stat-card">
              <div className="label">Available Margin</div>
              <div className="value">$85,000</div>
              <div className="sub-value">$15,000 used</div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="two-column">
            <div className="left-column">
              <MarketOverview tradingState={tradingState} />
              
              <div className="card" style={{ marginTop: '20px' }}>
                <div className="card-header">
                  <h3>📊 Performance Metrics</h3>
                </div>
                <div className="metrics-grid">
                  <div className="metric-item">
                    <div className="label">Total Return</div>
                    <div className="value positive">+2.45%</div>
                  </div>
                  <div className="metric-item">
                    <div className="label">Max Drawdown</div>
                    <div className="value negative">-3.2%</div>
                  </div>
                  <div className="metric-item">
                    <div className="label">Win Rate</div>
                    <div className="value">68.5%</div>
                  </div>
                </div>
              </div>

              <DemoTrading 
                balance={balance}
                equity={equity}
                positions={positions}
                prices={prices}
                onOpenPosition={openPosition}
                onClosePosition={closePosition}
              />
            </div>

            <div className="right-column">
              <TradeHistory trades={trades} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
