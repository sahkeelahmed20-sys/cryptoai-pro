import { AlertTriangle, Shield, Lock } from 'lucide-react';
import type { TradingState, KillSwitchLevel } from '@/App';

interface KillSwitchBannerProps {
  tradingState: TradingState;
  onReset: () => void;
}

const killSwitchConfig: Record<KillSwitchLevel, { 
  color: string; 
  bgColor: string;
  icon: React.ElementType;
  label: string;
}> = {
  OFF: { 
    color: 'text-[#d0ff59]', 
    bgColor: 'bg-[#d0ff59]/10',
    icon: Shield,
    label: 'Systems Normal'
  },
  SOFT: { 
    color: 'text-yellow-500', 
    bgColor: 'bg-yellow-500/10',
    icon: AlertTriangle,
    label: 'Soft Kill Active'
  },
  HARD: { 
    color: 'text-orange-500', 
    bgColor: 'bg-orange-500/10',
    icon: AlertTriangle,
    label: 'Hard Kill Active'
  },
  LOCKED: { 
    color: 'text-red-500', 
    bgColor: 'bg-red-500/10',
    icon: Lock,
    label: 'System Locked'
  },
};

export function KillSwitchBanner({ tradingState, onReset }: KillSwitchBannerProps) {
  if (tradingState.killSwitchLevel === 'OFF') return null;

  const config = killSwitchConfig[tradingState.killSwitchLevel];
  const Icon = config.icon;

  return (
    <div className={cn(
      'fixed top-0 left-0 right-0 z-[100] px-6 py-3 flex items-center justify-between',
      config.bgColor,
      'border-b border-current',
      config.color
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center animate-pulse',
          'bg-current/20'
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">{config.label}</span>
            <span className="text-xs opacity-70">|</span>
            <span className="text-xs opacity-70">Level: {tradingState.killSwitchLevel}</span>
          </div>
          {tradingState.killReason && (
            <p className="text-xs opacity-80 mt-0.5">
              Reason: {tradingState.killReason}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs opacity-70">
          AI Trading Disabled
        </span>
        {tradingState.killSwitchLevel !== 'LOCKED' && (
          <button
            onClick={onReset}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-semibold transition-all',
              'bg-current text-black hover:opacity-80'
            )}
          >
            Reset System
          </button>
        )}
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
