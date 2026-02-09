import { binanceWS } from '../services/binanceWebSocket';
import type { TradingState, LivePriceData } from '../types';

interface MarketOverviewProps {
  tradingState: TradingState;
}

export default function MarketOverview({ tradingState }: MarketOverviewProps) {
  const priceData = binanceWS.getAllPriceData();

  return (
    <div className="card">
      <div className="card-header">
        <h3>🎯 Market Overview</h3>
        <div className="ai-control">
          <div className="ai-toggle active"></div>
          <span className="ai-status active">AI Trading Engine</span>
        </div>
        <div className="market-regime">
          📈 {tradingState.marketRegime} — Directional bias detected
        </div>
      </div>
      
      <div className="card-body">
        <div className="market-status" style={{ marginBottom: '20px', display: 'flex', gap: '20px', color: '#8b8b9f' }}>
          <span>Status: <strong style={{ color: '#fff' }}>{tradingState.isEnabled ? 'Active' : 'Paused'}</strong></span>
          <span>Regime: <strong style={{ color: '#fff' }}>{tradingState.marketRegime}</strong></span>
          <span>Kill Switch: <strong style={{ color: '#fff' }}>{tradingState.killSwitchLevel}</strong></span>
        </div>
        
        <div style={{ display: 'grid', gap: '12px' }}>
          {priceData.map((data: LivePriceData) => (
            <div key={data.symbol} className="price-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{data.symbol}</h4>
                <span className={`change ${data.change24h >= 0 ? 'positive' : 'negative'}`}>
                  {data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(2)}%
                </span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
                ${data.price.toLocaleString()}
              </div>
              <div style={{ color: '#8b8b9f', fontSize: '12px' }}>
                Vol: ${(data.volume * data.price / 1e6).toFixed(2)}M
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
