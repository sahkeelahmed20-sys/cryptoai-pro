import { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target, 
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  History
} from 'lucide-react';
import type { TradingState } from '@/App';

interface DemoTradingProps {
  tradingState: TradingState;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars

interface Position {
  id: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  currentPrice: number;
  size: number;
  pnl: number;
  pnlPercent: number;
  stopLoss: number;
  takeProfit: number;
  openedAt: string;
}

interface Trade {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  price: number;
  size: number;
  pnl: number;
  closedAt: string;
}

interface Portfolio {
  balance: number;
  equity: number;
  availableMargin: number;
  usedMargin: number;
  unrealizedPnl: number;
  totalReturn: number;
  maxDrawdown: number;
  winRate: number;
}

export function DemoTrading({ tradingState: _tradingState }: DemoTradingProps) {
  const [portfolio, setPortfolio] = useState<Portfolio>({
    balance: 100000,
    equity: 102450,
    availableMargin: 85000,
    usedMargin: 15000,
    unrealizedPnl: 2450,
    totalReturn: 2.45,
    maxDrawdown: -3.2,
    winRate: 68.5,
  });

  const [positions, setPositions] = useState<Position[]>([
    {
      id: '1',
      symbol: 'BTC/USDT',
      side: 'LONG',
      entryPrice: 67200,
      currentPrice: 68230,
      size: 0.5,
      pnl: 515,
      pnlPercent: 1.53,
      stopLoss: 65500,
      takeProfit: 71000,
      openedAt: '2024-01-15 09:30:00',
    },
    {
      id: '2',
      symbol: 'ETH/USDT',
      side: 'LONG',
      entryPrice: 3450,
      currentPrice: 3520,
      size: 5,
      pnl: 350,
      pnlPercent: 2.03,
      stopLoss: 3300,
      takeProfit: 3800,
      openedAt: '2024-01-15 10:15:00',
    },
    {
      id: '3',
      symbol: 'SOL/USDT',
      side: 'SHORT',
      entryPrice: 152,
      currentPrice: 148,
      size: 50,
      pnl: 200,
      pnlPercent: 2.63,
      stopLoss: 158,
      takeProfit: 140,
      openedAt: '2024-01-15 11:00:00',
    },
  ]);

  const [tradeHistory] = useState<Trade[]>([
    { id: '1', symbol: 'BTC/USDT', side: 'BUY', price: 66500, size: 0.3, pnl: 450, closedAt: '2024-01-14 16:30:00' },
    { id: '2', symbol: 'ETH/USDT', side: 'SELL', price: 3580, size: 2, pnl: -120, closedAt: '2024-01-14 14:15:00' },
    { id: '3', symbol: 'BTC/USDT', side: 'BUY', price: 65800, size: 0.5, pnl: 890, closedAt: '2024-01-14 10:00:00' },
    { id: '4', symbol: 'SOL/USDT', side: 'BUY', price: 142, size: 30, pnl: 180, closedAt: '2024-01-13 18:45:00' },
  ]);

  // Simulate live position updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prev => prev.map(pos => {
        const priceChange = (Math.random() - 0.48) * 0.002;
        const newPrice = pos.currentPrice * (1 + priceChange);
        const pnl = pos.side === 'LONG' 
          ? (newPrice - pos.entryPrice) * pos.size
          : (pos.entryPrice - newPrice) * pos.size;
        const pnlPercent = (pnl / (pos.entryPrice * pos.size)) * 100;
        
        return {
          ...pos,
          currentPrice: newPrice,
          pnl: pnl,
          pnlPercent: pnlPercent,
        };
      }));

      setPortfolio(prev => {
        const totalUnrealized = positions.reduce((acc, pos) => acc + pos.pnl, 0);
        return {
          ...prev,
          unrealizedPnl: totalUnrealized,
          equity: prev.balance + totalUnrealized,
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [positions]);

  const totalExposure = positions.reduce((acc, pos) => acc + (pos.entryPrice * pos.size), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#f6f6f6] flex items-center gap-2">
          <Wallet className="w-5 h-5 text-[#d0ff59]" />
          Demo Trading Account
        </h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#d0ff59]/10 rounded-lg border border-[#d0ff59]/30">
          <Shield className="w-4 h-4 text-[#d0ff59]" />
          <span className="text-sm text-[#d0ff59]">Risk-Free Sandbox</span>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-4 gap-4">
        <PortfolioCard
          title="Portfolio Balance"
          value={`$${portfolio.balance.toLocaleString()}`}
          subValue={`+${portfolio.totalReturn}%`}
          positive
          icon={Wallet}
        />
        <PortfolioCard
          title="Equity"
          value={`$${portfolio.equity.toLocaleString()}`}
          subValue={`$${portfolio.unrealizedPnl >= 0 ? '+' : ''}${portfolio.unrealizedPnl.toFixed(2)} unrealized`}
          positive={portfolio.unrealizedPnl >= 0}
          icon={TrendingUp}
        />
        <PortfolioCard
          title="Available Margin"
          value={`$${portfolio.availableMargin.toLocaleString()}`}
          subValue={`$${portfolio.usedMargin.toLocaleString()} used`}
          icon={Shield}
        />
        <PortfolioCard
          title="Total Exposure"
          value={`$${totalExposure.toLocaleString()}`}
          subValue={`${positions.length} open positions`}
          icon={Target}
        />
      </div>

      {/* Performance Metrics */}
      <div className="bg-[#0b0b0b] border border-[#222222] rounded-2xl p-6">
        <h3 className="text-sm font-medium text-[#888888] mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-4 gap-6">
          <MetricItem
            label="Total Return"
            value={`+${portfolio.totalReturn}%`}
            positive
          />
          <MetricItem
            label="Max Drawdown"
            value={`${portfolio.maxDrawdown}%`}
            negative
          />
          <MetricItem
            label="Win Rate"
            value={`${portfolio.winRate}%`}
            neutral
          />
          <MetricItem
            label="Sharpe Ratio"
            value="1.84"
            positive
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Open Positions */}
        <div className="bg-[#0b0b0b] border border-[#222222] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#f6f6f6] flex items-center gap-2">
              <Target className="w-5 h-5 text-[#d0ff59]" />
              Open Positions
            </h3>
            <span className="text-sm text-[#888888]">{positions.length} active</span>
          </div>

          <div className="space-y-3">
            {positions.map((position) => (
              <div 
                key={position.id}
                className="p-4 bg-[#1a1a1a] rounded-xl hover:bg-[#222222] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium',
                      position.side === 'LONG' ? 'bg-[#d0ff59]/20 text-[#d0ff59]' : 'bg-red-500/20 text-red-500'
                    )}>
                      {position.side}
                    </span>
                    <span className="font-medium text-[#f6f6f6]">{position.symbol}</span>
                  </div>
                  <div className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    position.pnl >= 0 ? 'text-[#d0ff59]' : 'text-red-500'
                  )}>
                    {position.pnl >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    ${Math.abs(position.pnl).toFixed(2)} ({position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%)
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-[#888888]">Entry</p>
                    <p className="text-[#cccccc]">${position.entryPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#888888]">Current</p>
                    <p className="text-[#cccccc]">${position.currentPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#888888]">Size</p>
                    <p className="text-[#cccccc]">{position.size}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#333333]">
                  <div className="flex items-center gap-1 text-xs">
                    <Shield className="w-3 h-3 text-red-500" />
                    <span className="text-[#888888]">SL: ${position.stopLoss}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Target className="w-3 h-3 text-[#d0ff59]" />
                    <span className="text-[#888888]">TP: ${position.takeProfit}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs ml-auto">
                    <Clock className="w-3 h-3 text-[#888888]" />
                    <span className="text-[#888888]">{position.openedAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trade History */}
        <div className="bg-[#0b0b0b] border border-[#222222] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#f6f6f6] flex items-center gap-2">
              <History className="w-5 h-5 text-[#d0ff59]" />
              Trade History
            </h3>
            <span className="text-sm text-[#888888]">Last 24h</span>
          </div>

          <div className="space-y-3">
            {tradeHistory.map((trade) => (
              <div 
                key={trade.id}
                className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    trade.side === 'BUY' ? 'bg-[#d0ff59]/20' : 'bg-red-500/20'
                  )}>
                    {trade.side === 'BUY' ? 
                      <TrendingUp className="w-4 h-4 text-[#d0ff59]" /> : 
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-[#f6f6f6]">{trade.symbol}</p>
                    <p className="text-xs text-[#888888]">{trade.side} @ ${trade.price.toLocaleString()}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={cn(
                    'font-medium',
                    trade.pnl >= 0 ? 'text-[#d0ff59]' : 'text-red-500'
                  )}>
                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
                  </p>
                  <p className="text-xs text-[#888888]">{trade.closedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface PortfolioCardProps {
  title: string;
  value: string;
  subValue: string;
  positive?: boolean;
  icon: React.ElementType;
}

function PortfolioCard({ title, value, subValue, positive, icon: Icon }: PortfolioCardProps) {
  return (
    <div className="bg-[#0b0b0b] border border-[#222222] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#888888]">{title}</span>
        <Icon className="w-4 h-4 text-[#d0ff59]" />
      </div>
      <p className="text-xl font-bold text-[#f6f6f6]">{value}</p>
      <p className={cn(
        'text-xs mt-1',
        positive === true ? 'text-[#d0ff59]' : 
        positive === false ? 'text-red-500' : 'text-[#888888]'
      )}>
        {subValue}
      </p>
    </div>
  );
}

interface MetricItemProps {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
  neutral?: boolean;
}

function MetricItem({ label, value, positive, negative, neutral }: MetricItemProps) {
  return (
    <div>
      <p className="text-xs text-[#888888] mb-1">{label}</p>
      <p className={cn(
        'text-lg font-bold',
        positive && 'text-[#d0ff59]',
        negative && 'text-red-500',
        neutral && 'text-[#f6f6f6]'
      )}>
        {value}
      </p>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
