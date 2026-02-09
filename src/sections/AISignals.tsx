import type { TradingState } from '../types';

interface AISignalsProps {
  tradingState: TradingState;
}

export default function AISignals({ tradingState }: AISignalsProps) {
  return (
    <div className="ai-signals">
      <h3>AI Signals</h3>
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
