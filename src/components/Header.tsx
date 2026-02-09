import type { TradingState } from '../types';  

interface HeaderProps {
  tradingState: TradingState;
  prices: Record<string, number>;
  isConnected: boolean;
}

export function Header({ tradingState, prices, isConnected }: HeaderProps) {
  return (
    <header className="h-16 bg-[#12121a] border-b border-[#2a2a3a] flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        {Object.entries(prices).slice(0, 3).map(([sym, price]) => (
          <div key={sym} className="flex items-center gap-2">
            <span className="text-[#8b8b9f] text-sm">{sym.replace('USDT', '/USDT')}</span>
            <span className="font-bold">${price.toLocaleString()}</span>
          </div>
        ))}
      </div>
      
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${
        isConnected 
          ? 'text-[#00d084] border-[#00d084] bg-[#00d084]/10' 
          : 'text-[#8b8b9f] border-[#2a2a3a]'
      }`}>
        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#00d084]' : 'bg-[#8b8b9f]'}`}></span>
        {isConnected ? 'Live' : 'Offline'}
      </div>
    </header>
  );
}
