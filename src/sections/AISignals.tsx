import type { TradingState } from '../types';

interface AISignalsProps {
  tradingState: TradingState;
}

export default function AISignals({ tradingState }: AISignalsProps) {
  // Use tradingState to determine signal strength
  const { isEnabled, marketRegime } = tradingState;
  
  if (!isEnabled) {
    return <div className="ai-signals">AI Trading Disabled</div>;
  }

  return (
    <div className="ai-signals">
      <h3>AI Signals - {marketRegime} Mode</h3>
      <div className="signal-list">
        <div className="signal">
          <span>BTC/USDT</span>
          <span className="buy">BUY</span>
          <span>Confidence: 85%</span>
        </div>
        <div className="signal">
          <span>ETH/USDT</span>
          <span className="hold">HOLD</span>
          <span>Confidence: 72%</span>
        </div>
      </div>
    </div>
  );
}
