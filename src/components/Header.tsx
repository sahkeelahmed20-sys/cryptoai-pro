import { useState, useEffect } from 'react';
import { Bell, User, TrendingUp, TrendingDown } from 'lucide-react';
import type { TradingState } from '@/App';

interface HeaderProps {
  tradingState: TradingState;
}

interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
}

export function Header({ tradingState }: HeaderProps) {
  const [prices, setPrices] = useState<PriceData[]>([
    { symbol: 'BTC', price: 68230.50, change24h: 4.52 },
    { symbol: 'ETH', price: 3520.75, change24h: 3.18 },
    { symbol: 'SOL', price: 148.32, change24h: -2.45 },
  ]);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(crypto => ({
        ...crypto,
        price: crypto.price * (1 + (Math.random() - 0.5) * 0.002),
        change24h: crypto.change24h + (Math.random() - 0.5) * 0.1,
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-[#0b0b0b]/80 backdrop-blur-xl border-b border-[#222222] flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Live Price Ticker */}
      <div className="flex items-center gap-6">
        {prices.map((crypto) => (
          <div key={crypto.symbol} className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#888888]">{crypto.symbol}/USDT</span>
            <span className="text-sm font-semibold text-[#f6f6f6]">
              ${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={cn(
              'text-xs font-medium flex items-center gap-0.5',
              crypto.change24h >= 0 ? 'text-[#d0ff59]' : 'text-red-500'
            )}>
              {crypto.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(crypto.change24h).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      {/* Market Regime Badge */}
      <div className="flex items-center gap-4">
        <div className={cn(
          'px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2',
          tradingState.marketRegime === 'TREND' && 'bg-[#d0ff59]/10 text-[#d0ff59] border border-[#d0ff59]/30',
          tradingState.marketRegime === 'CHOP' && 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30',
          tradingState.marketRegime === 'PANIC' && 'bg-red-500/10 text-red-500 border border-red-500/30'
        )}>
          <div className={cn(
            'w-2 h-2 rounded-full animate-pulse',
            tradingState.marketRegime === 'TREND' && 'bg-[#d0ff59]',
            tradingState.marketRegime === 'CHOP' && 'bg-yellow-500',
            tradingState.marketRegime === 'PANIC' && 'bg-red-500'
          )} />
          {tradingState.marketRegime}
        </div>

        <button className="relative p-2 rounded-xl hover:bg-[#1a1a1a] transition-colors">
          <Bell className="w-5 h-5 text-[#888888]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#d0ff59] rounded-full" />
        </button>

        <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#1a1a1a] transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d0ff59] to-[#a8cc47] flex items-center justify-center">
            <User className="w-4 h-4 text-black" />
          </div>
          <span className="text-sm font-medium text-[#cccccc]">Demo User</span>
        </button>
      </div>
    </header>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
