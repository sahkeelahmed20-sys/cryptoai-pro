import type { TradingState, MarketRegime } from '../types';

interface AIControlPanelProps {
  tradingState: TradingState;
  onToggle: () => void;
}

export default function AIControlPanel({ tradingState, onToggle }: AIControlPanelProps) {
  return (
    <div className="ai-control-panel">
      <h3>AI Trading Engine</h3>
      <div className="status">{tradingState.isEnabled ? 'Enabled' : 'Disabled'}</div>
      <div className="regime">Market Regime: {tradingState.marketRegime}</div>
      <button onClick={onToggle}>
        {tradingState.isEnabled ? 'Disable' : 'Enable'}
      </button>
    </div>
  );
}
