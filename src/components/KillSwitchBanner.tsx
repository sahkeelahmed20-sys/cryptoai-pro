import type { TradingState } from '../types';

interface KillSwitchBannerProps {
  tradingState: TradingState;
}

export default function KillSwitchBanner({ tradingState }: KillSwitchBannerProps) {
  const { killSwitchLevel } = tradingState;
  
  if (killSwitchLevel === 'SOFT') return null;

  return (
    <div className={`kill-switch-banner ${killSwitchLevel.toLowerCase()}`}>
      <span>⚠️ {killSwitchLevel} KILL SWITCH ACTIVE — Trading halted due to extreme volatility</span>
    </div>
  );
}
