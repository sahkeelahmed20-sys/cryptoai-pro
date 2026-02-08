import { Brain, Power, TrendingUp, Minus, AlertTriangle } from 'lucide-react';
import type { TradingState, MarketRegime } from '@/App';

interface AIControlPanelProps {
  tradingState: TradingState;
  onToggleAI: (enabled: boolean) => void;
}

const regimeConfig: Record<MarketRegime, { 
  color: string; 
  bgColor: string;
  icon: React.ElementType;
  description: string;
}> = {
  TREND: { 
    color: 'text-[#d0ff59]', 
    bgColor: 'bg-[#d0ff59]/10',
    icon: TrendingUp,
    description: 'Directional bias detected'
  },
  CHOP: { 
    color: 'text-yellow-500', 
    bgColor: 'bg-yellow-500/10',
    icon: Minus,
    description: 'Sideways market, low edge'
  },
  PANIC: { 
    color: 'text-red-500', 
    bgColor: 'bg-red-500/10',
    icon: AlertTriangle,
    description: 'Extreme volatility'
  },
};

export function AIControlPanel({ tradingState, onToggleAI }: AIControlPanelProps) {
  const regime = regimeConfig[tradingState.marketRegime];
  const RegimeIcon = regime.icon;

  return (
    <div className="bg-[#0b0b0b] border-b border-[#222222] px-6 py-4">
      <div className="flex items-center justify-between">
        {/* AI Status */}
        <div className="flex items-center gap-6">
          {/* AI Toggle */}
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center transition-all',
              tradingState.aiEnabled ? 'bg-[#d0ff59]/20' : 'bg-[#222222]'
            )}>
              <Brain className={cn(
                'w-6 h-6 transition-all',
                tradingState.aiEnabled ? 'text-[#d0ff59]' : 'text-[#888888]'
              )} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#f6f6f6]">AI Trading Engine</p>
              <p className={cn(
                'text-xs',
                tradingState.aiEnabled ? 'text-[#d0ff59]' : 'text-[#888888]'
              )}>
                {tradingState.aiEnabled ? 'Active & Monitoring' : 'Disabled'}
              </p>
            </div>
            <button
              onClick={() => onToggleAI(!tradingState.aiEnabled)}
              disabled={tradingState.killSwitchLevel === 'LOCKED'}
              className={cn(
                'ml-4 w-14 h-7 rounded-full relative transition-all duration-300',
                tradingState.aiEnabled ? 'bg-[#d0ff59]' : 'bg-[#333333]',
                tradingState.killSwitchLevel === 'LOCKED' && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className={cn(
                'absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all duration-300 flex items-center justify-center',
                tradingState.aiEnabled ? 'left-7' : 'left-0.5'
              )}>
                <Power className="w-3 h-3 text-black" />
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-10 bg-[#222222]" />

          {/* Market Regime */}
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              regime.bgColor
            )}>
              <RegimeIcon className={cn('w-5 h-5', regime.color)} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#f6f6f6]">Market Regime</p>
              <p className={cn('text-xs', regime.color)}>
                {tradingState.marketRegime} — {regime.description}
              </p>
            </div>
          </div>
        </div>

        {/* AI Metrics */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-[#888888]">AI Confidence</p>
            <p className={cn(
              'text-lg font-bold',
              tradingState.confidence >= 70 ? 'text-[#d0ff59]' : 
              tradingState.confidence >= 40 ? 'text-yellow-500' : 'text-red-500'
            )}>
              {tradingState.confidence.toFixed(1)}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#888888]">Ensemble Score</p>
            <p className="text-lg font-bold text-[#f6f6f6]">
              {(tradingState.ensembleScore * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
