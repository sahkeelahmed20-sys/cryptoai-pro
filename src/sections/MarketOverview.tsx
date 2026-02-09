import { useState, useEffect } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3 } from 'lucide-react';
import type { TradingState } from '@/App';

interface MarketOverviewProps {
  tradingState: TradingState;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars

interface ChartData {
  time: string;
  price: number;
  volume: number;
  rsi: number;
  macd: number;
}

export function MarketOverview({ tradingState: _tradingState }: MarketOverviewProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');

  // Generate simulated chart data
  useEffect(() => {
    const generateData = () => {
      const data: ChartData[] = [];
      let price = 68230;
      const now = new Date();
      
      for (let i = 60; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60000);
        price = price * (1 + (Math.random() - 0.48) * 0.002);
        data.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          price: price,
          volume: Math.random() * 1000 + 500,
          rsi: 30 + Math.random() * 40,
          macd: (Math.random() - 0.5) * 100,
        });
      }
      return data;
    };

    setChartData(generateData());

    const interval = setInterval(() => {
      setChartData(prev => {
        const lastPrice = prev[prev.length - 1]?.price || 68230;
        const newPrice = lastPrice * (1 + (Math.random() - 0.48) * 0.002);
        const newData = [...prev.slice(1), {
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          price: newPrice,
          volume: Math.random() * 1000 + 500,
          rsi: 30 + Math.random() * 40,
          macd: (Math.random() - 0.5) * 100,
        }];
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedTimeframe]);

  const currentPrice = chartData[chartData.length - 1]?.price || 68230;
  const priceChange = chartData.length > 1 
    ? ((currentPrice - chartData[0].price) / chartData[0].price) * 100 
    : 0;

  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D'];
  const pairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'];

  return (
    <div className="space-y-6">
      {/* Price Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <select
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
            className="bg-[#1a1a1a] border border-[#222222] rounded-xl px-4 py-2 text-[#f6f6f6] font-semibold"
          >
            {pairs.map(pair => (
              <option key={pair} value={pair}>{pair}</option>
            ))}
          </select>
          <div>
            <span className="text-3xl font-bold text-[#f6f6f6]">
              ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={cn(
              'ml-3 text-sm font-medium flex items-center gap-1 inline-flex',
              priceChange >= 0 ? 'text-[#d0ff59]' : 'text-red-500'
            )}>
              {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(priceChange).toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="flex gap-1">
          {timeframes.map(tf => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                selectedTimeframe === tf
                  ? 'bg-[#d0ff59] text-black'
                  : 'bg-[#1a1a1a] text-[#888888] hover:text-[#cccccc]'
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-[#0b0b0b] border border-[#222222] rounded-2xl p-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d0ff59" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#d0ff59" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
              <XAxis 
                dataKey="time" 
                stroke="#444444" 
                tick={{ fill: '#888888', fontSize: 10 }}
                tickLine={false}
              />
              <YAxis 
                domain={['auto', 'auto']}
                stroke="#444444"
                tick={{ fill: '#888888', fontSize: 10 }}
                tickLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(1)}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b0b0b',
                  border: '1px solid #222222',
                  borderRadius: '12px',
                }}
                labelStyle={{ color: '#888888' }}
                itemStyle={{ color: '#d0ff59' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#d0ff59"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Indicators Grid */}
      <div className="grid grid-cols-4 gap-4">
        <IndicatorCard
          title="RSI (14)"
          value={chartData[chartData.length - 1]?.rsi.toFixed(1) || '50.0'}
          status={chartData[chartData.length - 1]?.rsi > 70 ? 'Overbought' : chartData[chartData.length - 1]?.rsi < 30 ? 'Oversold' : 'Neutral'}
          icon={Activity}
          color={chartData[chartData.length - 1]?.rsi > 70 ? 'text-red-500' : chartData[chartData.length - 1]?.rsi < 30 ? 'text-[#d0ff59]' : 'text-yellow-500'}
        />
        <IndicatorCard
          title="MACD"
          value={chartData[chartData.length - 1]?.macd.toFixed(2) || '0.00'}
          status={chartData[chartData.length - 1]?.macd > 0 ? 'Bullish' : 'Bearish'}
          icon={BarChart3}
          color={chartData[chartData.length - 1]?.macd > 0 ? 'text-[#d0ff59]' : 'text-red-500'}
        />
        <IndicatorCard
          title="24h Volume"
          value="$2.4B"
          status="High"
          icon={DollarSign}
          color="text-[#d0ff59]"
        />
        <IndicatorCard
          title="Market Cap"
          value="$1.3T"
          status="Rank #1"
          icon={TrendingUp}
          color="text-[#d0ff59]"
        />
      </div>
    </div>
  );
}

interface IndicatorCardProps {
  title: string;
  value: string;
  status: string;
  icon: React.ElementType;
  color: string;
}

function IndicatorCard({ title, value, status, icon: Icon, color }: IndicatorCardProps) {
  return (
    <div className="bg-[#0b0b0b] border border-[#222222] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#888888]">{title}</span>
        <Icon className={cn('w-4 h-4', color)} />
      </div>
      <p className="text-xl font-bold text-[#f6f6f6]">{value}</p>
      <p className={cn('text-xs mt-1', color)}>{status}</p>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
