import type { TradingState } from '../types';

interface AIControlPanelProps {
  tradingState: TradingState;
  onToggle: () => void;
}

export default function AIControlPanel({ tradingState, onToggle }: AIControlPanelProps) {
  // Use marketRegime from tradingState
  const { isEnabled, marketRegime } = tradingState;
  
  return (
    <div className="ai-control-panel">
      <h3>AI Trading Engine</h3>
      <div className="status">{isEnabled ? 'Enabled' : 'Disabled'}</div>
      <div className="regime">Market Regime: {marketRegime}</div>
      <button onClick={onToggle}>
        {isEnabled ? 'Disable' : 'Enable'}
      </button>
    </div>
  );
}
