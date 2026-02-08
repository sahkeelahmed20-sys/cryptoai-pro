import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  BarChart3, 
  Brain,
  Wallet,
  Zap,
  CheckCircle2,
  XCircle,
  Minus
} from 'lucide-react';

interface ComparisonData {
  date: string;
  aiStrategy: number;
  buyHold: number;
  benchmark: number;
}

interface Metric {
  label: string;
  ai: number | string;
  buyHold: number | string;
  better: 'ai' | 'buyhold' | 'tie';
}

export function StrategyComparison() {
  const [selectedPeriod, setSelectedPeriod] = useState('1y');

  // Simulated comparison data
  const comparisonData: ComparisonData[] = [
    { date: 'Jan', aiStrategy: 100000, buyHold: 100000, benchmark: 100000 },
    { date: 'Feb', aiStrategy: 108500, buyHold: 112000, benchmark: 103000 },
    { date: 'Mar', aiStrategy: 115200, buyHold: 108000, benchmark: 105000 },
    { date: 'Apr', aiStrategy: 122800, buyHold: 118000, benchmark: 108000 },
    { date: 'May', aiStrategy: 118500, buyHold: 105000, benchmark: 102000 },
    { date: 'Jun', aiStrategy: 128900, buyHold: 115000, benchmark: 106000 },
    { date: 'Jul', aiStrategy: 135400, buyHold: 122000, benchmark: 110000 },
    { date: 'Aug', aiStrategy: 142100, buyHold: 118000, benchmark: 108000 },
    { date: 'Sep', aiStrategy: 138700, buyHold: 108000, benchmark: 104000 },
    { date: 'Oct', aiStrategy: 148200, buyHold: 125000, benchmark: 112000 },
    { date: 'Nov', aiStrategy: 155800, buyHold: 132000, benchmark: 115000 },
    { date: 'Dec', aiStrategy: 162400, buyHold: 128000, benchmark: 113000 },
  ];

  const metrics: Metric[] = [
    { label: 'Total Return', ai: 62.4, buyHold: 28.0, better: 'ai' },
    { label: 'Sharpe Ratio', ai: 2.14, buyHold: 1.23, better: 'ai' },
    { label: 'Max Drawdown', ai: -8.5, buyHold: -25.3, better: 'ai' },
    { label: 'Win Rate', ai: 72.5, buyHold: 'N/A', better: 'ai' },
    { label: 'Volatility', ai: 18.2, buyHold: 42.5, better: 'ai' },
    { label: 'Calmar Ratio', ai: 7.34, buyHold: 1.11, better: 'ai' },
  ];

  const aiReturns = comparisonData[comparisonData.length - 1].aiStrategy - comparisonData[0].aiStrategy;
  const buyHoldReturns = comparisonData[comparisonData.length - 1].buyHold - comparisonData[0].buyHold;
  const outperformance = ((aiReturns - buyHoldReturns) / buyHoldReturns * 100).toFixed(1);

  const periods = [
    { id: '1m', label: '1 Month' },
    { id: '3m', label: '3 Months' },
    { id: '6m', label: '6 Months' },
    { id: '1y', label: '1 Year' },
    { id: 'all', label: 'All Time' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#f6f6f6] flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#d0ff59]" />
          Strategy Comparison
        </h2>
        <div className="flex gap-1">
          {periods.map(period => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                selectedPeriod === period.id
                  ? 'bg-[#d0ff59] text-black'
                  : 'bg-[#1a1a1a] text-[#888888] hover:text-[#cccccc]'
              )}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-3 gap-4">
        <SummaryCard
          title="AI Strategy"
          value="+$62,400"
          subValue="+62.4% return"
          icon={Brain}
          color="[#d0ff59]"
        />
        <SummaryCard
          title="Buy & Hold"
          value="+$28,000"
          subValue="+28.0% return"
          icon={Wallet}
          color="[888888]"
        />
        <SummaryCard
          title="Outperformance"
          value={`+${outperformance}%`}
          subValue="AI beats Buy & Hold"
          icon={Zap}
          color="[d0ff59]"
          highlight
        />
      </div>

      {/* Comparison Chart */}
      <div className="bg-[#0b0b0b] border border-[#222222] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-[#888888]">Performance Over Time</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#d0ff59]" />
              <span className="text-xs text-[#888888]">AI Strategy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#888888]" />
              <span className="text-xs text-[#888888]">Buy & Hold</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#444444]" />
              <span className="text-xs text-[#888888]">Benchmark</span>
            </div>
          </div>
        </div>
        
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={comparisonData}>
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
              />
              <Line
                type="monotone"
                dataKey="aiStrategy"
                stroke="#d0ff59"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#d0ff59' }}
              />
              <Line
                type="monotone"
                dataKey="buyHold"
                stroke="#888888"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="benchmark"
                stroke="#444444"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="bg-[#0b0b0b] border border-[#222222] rounded-2xl p-6">
        <h3 className="text-sm font-medium text-[#888888] mb-4">Detailed Metrics Comparison</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-4 text-xs font-medium text-[#888888]">Metric</th>
                <th className="pb-4 text-xs font-medium text-[#888888]">AI Strategy</th>
                <th className="pb-4 text-xs font-medium text-[#888888]">Buy & Hold</th>
                <th className="pb-4 text-xs font-medium text-[#888888]">Winner</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {metrics.map((metric, index) => (
                <tr key={index} className="border-t border-[#222222]">
                  <td className="py-4 text-[#cccccc]">{metric.label}</td>
                  <td className="py-4">
                    <span className={cn(
                      'font-medium',
                      typeof metric.ai === 'number' && metric.ai >= 0 ? 'text-[#d0ff59]' : 'text-[#f6f6f6]'
                    )}>
                      {typeof metric.ai === 'number' ? 
                        (metric.ai > 0 && metric.label !== 'Max Drawdown' && metric.label !== 'Volatility' ? '+' : '') + 
                        metric.ai + 
                        (metric.label.includes('Rate') || metric.label.includes('Ratio') || metric.label.includes('Drawdown') || metric.label.includes('Volatility') || metric.label.includes('Return') ? '' : '')
                        : metric.ai}
                      {metric.label.includes('Rate') && '%'}
                      {metric.label.includes('Return') && '%'}
                      {metric.label.includes('Drawdown') && '%'}
                      {metric.label.includes('Volatility') && '%'}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={cn(
                      'font-medium',
                      typeof metric.buyHold === 'number' && metric.buyHold >= 0 ? 'text-[#888888]' : 'text-[#888888]'
                    )}>
                      {typeof metric.buyHold === 'number' ? 
                        (metric.buyHold > 0 && metric.label !== 'Max Drawdown' && metric.label !== 'Volatility' ? '+' : '') + 
                        metric.buyHold + 
                        (metric.label.includes('Rate') || metric.label.includes('Ratio') || metric.label.includes('Drawdown') || metric.label.includes('Volatility') || metric.label.includes('Return') ? '' : '')
                        : metric.buyHold}
                      {metric.label.includes('Rate') && '%'}
                      {metric.label.includes('Return') && '%'}
                      {metric.label.includes('Drawdown') && '%'}
                      {metric.label.includes('Volatility') && '%'}
                    </span>
                  </td>
                  <td className="py-4">
                    {metric.better === 'ai' ? (
                      <span className="flex items-center gap-1 text-[#d0ff59]">
                        <CheckCircle2 className="w-4 h-4" />
                        AI Strategy
                      </span>
                    ) : metric.better === 'buyhold' ? (
                      <span className="flex items-center gap-1 text-[#888888]">
                        <CheckCircle2 className="w-4 h-4" />
                        Buy & Hold
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[#888888]">
                        <Minus className="w-4 h-4" />
                        Tie
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategy Features */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#0b0b0b] border border-[#222222] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#d0ff59]/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-[#d0ff59]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#f6f6f6]">AI Strategy</h3>
              <p className="text-xs text-[#888888]">Multi-agent ensemble system</p>
            </div>
          </div>
          
          <ul className="space-y-3">
            <FeatureItem text="Dynamic risk management" positive />
            <FeatureItem text="Market regime detection" positive />
            <FeatureItem text="Automatic position sizing" positive />
            <FeatureItem text="Kill switch protection" positive />
            <FeatureItem text="Requires active monitoring" negative />
          </ul>
        </div>

        <div className="bg-[#0b0b0b] border border-[#222222] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#888888]/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-[#888888]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#f6f6f6]">Buy & Hold</h3>
              <p className="text-xs text-[#888888]">Passive investment strategy</p>
            </div>
          </div>
          
          <ul className="space-y-3">
            <FeatureItem text="Simple and hands-off" positive />
            <FeatureItem text="No monitoring required" positive />
            <FeatureItem text="Low transaction costs" positive />
            <FeatureItem text="No downside protection" negative />
            <FeatureItem text="Full market exposure" negative />
          </ul>
        </div>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: string;
  subValue: string;
  icon: React.ElementType;
  color: string;
  highlight?: boolean;
}

function SummaryCard({ title, value, subValue, icon: Icon, color, highlight }: SummaryCardProps) {
  return (
    <div className={cn(
      'rounded-2xl p-6',
      highlight 
        ? 'bg-gradient-to-br from-[#d0ff59]/20 to-[#d0ff59]/5 border border-[#d0ff59]/50' 
        : 'bg-[#0b0b0b] border border-[#222222]'
    )}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-[#888888]">{title}</span>
        <Icon className={`w-5 h-5 text-${color}`} />
      </div>
      <p className={cn(
        'text-2xl font-bold',
        highlight ? 'text-[#d0ff59]' : 'text-[#f6f6f6]'
      )}>
        {value}
      </p>
      <p className="text-xs text-[#888888] mt-1">{subValue}</p>
    </div>
  );
}

interface FeatureItemProps {
  text: string;
  positive?: boolean;
  negative?: boolean;
}

function FeatureItem({ text, positive, negative }: FeatureItemProps) {
  return (
    <li className="flex items-center gap-2">
      {positive ? (
        <CheckCircle2 className="w-4 h-4 text-[#d0ff59]" />
      ) : negative ? (
        <XCircle className="w-4 h-4 text-red-500" />
      ) : (
        <CheckCircle2 className="w-4 h-4 text-[#888888]" />
      )}
      <span className="text-sm text-[#cccccc]">{text}</span>
    </li>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
