import { binanceWS } from '../services/binanceWebSocket';
import type { TradingState, LivePriceData } from '../types';

interface MarketOverviewProps {
  tradingState: TradingState;
}

export default function MarketOverview({ tradingState }: MarketOverviewProps) {
  const priceData = binanceWS.getAllPriceData();

  return (
    <div className="market-overview">
      <h2>Market Overview</h2>
      <div className="market-status">
        <div>Status: {tradingState.isEnabled ? 'Active' : 'Paused'}</div>
        <div>Regime: {tradingState.marketRegime}</div>
        <div>Kill Switch: {tradingState.killSwitchLevel}</div>
      </div>
      
      <div className="price-grid">
        {priceData.map((data: LivePriceData) => (
          <div key={data.symbol} className="price-card">
            <h3>{data.symbol}</h3>
            <div className="price">${data.price.toLocaleString()}</div>
            <div className={`change ${data.change24h >= 0 ? 'positive' : 'negative'}`}>
              {data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(2)}%
            </div>
            <div className="volume">Vol: ${(data.volume * data.price / 1e6).toFixed(2)}M</div>
          </div>
        ))}
      </div>
    </div>
  );
}
