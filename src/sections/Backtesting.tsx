import { useState } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine
} from 'recharts';
import { 
  History, 
  Play, 
  Settings, 
  TrendingUp, 
  TrendingDown,
  Target,
  BarChart3,
  Download,
  RotateCcw
} from 'lucide-react';

interface BacktestResult {
  date: string;
  equity: number;
  drawdown: number;
  trades: number;
  pnl: number;
}

interface Trade {
  date: string;
  side: 'BUY' | 'SELL';
  price: number;
  pnl: number;
}

export function Backtesting() {
  const [selectedStrategy, setSelectedStrategy] = useState('ai-ensemble');
  const [dateRange, setDateRange] = useState('30d');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulated backtest data
  const backtestData: BacktestResult[] = [
    { date: 'Jan 1', equity: 100000, drawdown: 0, trades: 0, pnl: 0 },
    { date: 'Jan 5', equity: 102500, drawdown: -1.2, trades: 12, pnl: 2500 },
    { date: 'Jan 10', equity: 101800, drawdown: -2.8, trades: 28, pnl: 1800 },
    { date: 'Jan 15', equity: 105200, drawdown: -1.5, trades: 45, pnl: 5200 },
    { date: 'Jan 20', equity: 104500, drawdown: -3.2, trades: 62, pnl: 4500 },
    { date: 'Jan 25', equity: 108900, drawdown: -1.8, trades: 78, pnl: 8900 },
    { date: 'Jan 30', equity: 112400, drawdown: -0.5, trades: 95, pnl: 12400 },
  ];

  const trades: Trade[] = [
    { date: 'Jan 5', side: 'BUY', price: 42500, pnl: 850 },
    { date: 'Jan 8', side: 'SELL', price: 43800, pnl: -320 },
    { date: 'Jan 12', side: 'BUY', price: 41200, pnl: 1200 },
    { date: 'Jan 15', side: 'SELL', price: 44500, pnl: 680 },
    { date: 'Jan 18', side: 'BUY', price: 42800, pnl: -450 },
    { date: 'Jan 22', side: 'SELL', price: 46200, pnl: 1450 },
    { date: 'Jan 25', side: 'BUY', price: 44800, pnl: 920 },
    { date: 'Jan 28', side: 'SELL', price: 47800, pnl: 1100 },
  ];

  const metrics = {
    totalReturn: 12.4,
    sharpeRatio: 1.92,
    maxDrawdown: -3.2,
    winRate: 72.5,
    profitFactor: 2.34,
    totalTrades: 95,
    avgTrade: 130.53,
    avgWin: 420.80,
    avgLoss: -185.40,
  };

  const runBacktest = () => {
    setIsRunning(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const strategies = [
    { id: 'ai-ensemble', name: 'AI Ensemble', description: 'Multi-agent consensus strategy' },
    { id: 'trend-follow', name: 'Trend Following', description: 'Moving average crossover' },
    { id: 'mean-reversion', name: 'Mean Reversion', description: 'RSI and Bollinger Bands' },
    { id: 'momentum', name: 'Momentum', description: 'MACD and volume analysis' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#f6f6f6] flex items-center gap-2">
          <History className="w-5 h-5 text-[#d0ff59]" />
          Strategy Backtesting
        </h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={runBacktest}
            disabled={isRunning}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all',
              isRunning 
                ? 'bg-[#222222] text-[#888888] cursor-not-allowed' 
                : 'bg-[#d0ff59] text-black hover:bg-[#b8e04f]'
            )}
          >
            {isRunning ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Running... {progress}%
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Backtest
              </>
            )}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#222222] rounded-xl text-[#cccccc] hover:bg-[#222222] transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-[#0b0b0b] border border-[#222222] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-[#d0ff59]" />
          <h3 className="text-sm font-medium text-[#888888]">Configuration</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-[#888888] mb-2 block">Strategy</label>
            <select
              value={selectedStrategy}
              onChange={(e) => setSelectedStrategy(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#222222] rounded-xl px-4 py-2.5 text-[#f6f6f6] text-sm"
            >
              {strategies.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <p className="text-xs text-[#888888] mt-1">
              {strategies.find(s => s.id === selectedStrategy)?.description}
            </p>
          </div>

          <div>
            <label className="text-xs text-[#888888] mb-2 block">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#222222] rounded-xl px-4 py-2.5 text-[#f6f6f6] text-sm"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-[#888888] mb-2 block">Initial Capital</label>
            <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#222222] rounded-xl px-4 py-2.5">
              <span className="text-[#888888]">$</span>
              <input 
                type="text" 
                defaultValue="100,000"
                className="bg-transparent text-[#f6f6f6] text-sm w-full outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Total Return"
          value={`+${metrics.totalReturn}%`}
          subValue="$12,400 profit"
          positive
          icon={TrendingUp}
        />
        <MetricCard
          title="Sharpe Ratio"
          value={metrics.sharpeRatio.toString()}
          subValue="Risk-adjusted return"
          icon={BarChart3}
        />
        <MetricCard
          title="Max Drawdown"
          value={`${metrics.maxDrawdown}%`}
          subValue="Peak to trough"
          negative
          icon={TrendingDown}
        />
        <MetricCard
          title="Win Rate"
          value={`${metrics.winRate}%`}
          subValue={`${metrics.totalTrades} total trades`}
          positive
          icon={Target}
        />
      </div>

      {/* Equity Curve */}
      <div className="bg-[#0b0b0b] border border-[#222222] rounded-2xl p-6">
        <h3 className="text-sm font-medium text-[#888888] mb-4">Equity Curve</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={backtestData}>
              <defs>
                <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d0ff59" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#d0ff59" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
              <XAxis 
                dataKey="date" 
                stroke="#444444" 
                tick={{ fill: '#888888', fontSize: 10 }}
                tickLine={false}
              />
              <YAxis 
                stroke="#444444"
                tick={{ fill: '#888888', fontSize: 10 }}
                tickLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b0b0b',
                  border: '1px solid #222222',
                  borderRadius: '12px',
                }}
                labelStyle={{ color: '#888888' }}
                itemStyle={{ color: '#d0ff59' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Equity']}
              />
              <ReferenceLine y={100000} stroke="#444444" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="equity"
                stroke="#d0ff59"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorEquity)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Drawdown Chart */}
        <div className="bg-[#0b0b0b] border border-[#222222] rounded-2xl p-6">
          <h3 className="text-sm font-medium text-[#888888] mb-4">Drawdown Analysis</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={backtestData}>
                <defs>
                  <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                <XAxis 
                  dataKey="date" 
                  stroke="#444444" 
                  tick={{ fill: '#888888', fontSize: 10 }}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#444444"
                  tick={{ fill: '#888888', fontSize: 10 }}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b0b0b',
                    border: '1px solid #222222',
                    borderRadius: '12px',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Drawdown']}
                />
                <Area
                  type="monotone"
                  dataKey="drawdown"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDrawdown)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trade Distribution */}
        <div className="bg-[#0b0b0b] border border-[#222222] rounded-2xl p-6">
          <h3 className="text-sm font-medium text-[#888888] mb-4">Trade Distribution</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#888888]">Profit Factor</span>
              <span className="text-lg font-bold text-[#d0ff59]">{metrics.profitFactor}</span>
            </div>
            <div className="w-full bg-[#1a1a1a] rounded-full h-2">
              <div className="bg-[#d0ff59] h-2 rounded-full" style={{ width: `${(metrics.profitFactor / 3) * 100}%` }} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-[#1a1a1a] rounded-lg">
                <p className="text-xs text-[#888888]">Average Win</p>
                <p className="text-lg font-bold text-[#d0ff59]">+${metrics.avgWin}</p>
              </div>
              <div className="p-3 bg-[#1a1a1a] rounded-lg">
                <p className="text-xs text-[#888888]">Average Loss</p>
                <p className="text-lg font-bold text-red-500">${metrics.avgLoss}</p>
              </div>
              <div className="p-3 bg-[#1a1a1a] rounded-lg">
                <p className="text-xs text-[#888888]">Average Trade</p>
                <p className="text-lg font-bold text-[#f6f6f6]">${metrics.avgTrade}</p>
              </div>
              <div className="p-3 bg-[#1a1a1a] rounded-lg">
                <p className="text-xs text-[#888888]">Total Trades</p>
                <p className="text-lg font-bold text-[#f6f6f6]">{metrics.totalTrades}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="bg-[#0b0b0b] border border-[#222222] rounded-2xl p-6">
        <h3 className="text-sm font-medium text-[#888888] mb-4">Recent Trades</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-[#888888]">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Side</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">P&L</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {trades.map((trade, index) => (
                <tr key={index} className="border-t border-[#222222]">
                  <td className="py-3 text-[#cccccc]">{trade.date}</td>
                  <td className="py-3">
                    <span className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium',
                      trade.side === 'BUY' ? 'bg-[#d0ff59]/20 text-[#d0ff59]' : 'bg-red-500/20 text-red-500'
                    )}>
                      {trade.side}
                    </span>
                  </td>
                  <td className="py-3 text-[#cccccc]">${trade.price.toLocaleString()}</td>
                  <td className={cn(
                    'py-3 font-medium',
                    trade.pnl >= 0 ? 'text-[#d0ff59]' : 'text-red-500'
                  )}>
                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  subValue: string;
  positive?: boolean;
  negative?: boolean;
  icon: React.ElementType;
}

function MetricCard({ title, value, subValue, positive, negative, icon: Icon }: MetricCardProps) {
  return (
    <div className="bg-[#0b0b0b] border border-[#222222] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#888888]">{title}</span>
        <Icon className={cn(
          'w-4 h-4',
          positive ? 'text-[#d0ff59]' : negative ? 'text-red-500' : 'text-[#888888]'
        )} />
      </div>
      <p className={cn(
        'text-xl font-bold',
        positive && 'text-[#d0ff59]',
        negative && 'text-red-500',
        !positive && !negative && 'text-[#f6f6f6]'
      )}>
        {value}
      </p>
      <p className="text-xs text-[#888888] mt-1">{subValue}</p>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
