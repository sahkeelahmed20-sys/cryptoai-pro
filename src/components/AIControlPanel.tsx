import type { TradingState } from '../types';

interface AIControlPanelProps {
  tradingState: TradingState;
  onToggle: () => void;
}

export default function AIControlPanel({ tradingState, onToggle }: AIControlPanelProps) {
  const { isEnabled, marketRegime } = tradingState;
  
  return (
    <div className="ai-control">
      <div 
        className={`ai-toggle ${isEnabled ? 'active' : ''}`}
        onClick={onToggle}
      ></div>
      <span className={`ai-status ${isEnabled ? 'active' : ''}`}>
        AI Trading Engine {isEnabled ? 'Enabled' : 'Disabled'}
      </span>
      <div className="market-regime">
        📈 {marketRegime} — Directional bias detected
      </div>
    </div>
  );
}
