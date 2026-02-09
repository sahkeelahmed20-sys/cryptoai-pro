import type { TradingState } from '../types';

interface HeaderProps {
  tradingState: TradingState;
  prices: Record<string, number>;
}

export default function Header({ tradingState, prices }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="logo">CryptoAI Pro</div>
      <div className="ticker">
        {Object.entries(prices).slice(0, 3).map(([sym, price]) => (
          <span key={sym}>{sym.replace('USDT', '')}: ${price.toLocaleString()}</span>
        ))}
      </div>
      <div className="status">
        {tradingState.isEnabled ? '🟢' : '🔴'}
      </div>
    </header>
  );
}
