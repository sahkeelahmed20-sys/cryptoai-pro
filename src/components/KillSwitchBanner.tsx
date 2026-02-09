import type { KillSwitchLevel, TradingState } from '../types';

interface KillSwitchBannerProps {
  tradingState: TradingState;
}

export default function KillSwitchBanner({ tradingState }: KillSwitchBannerProps) {
  const { killSwitchLevel } = tradingState;
  
  if (killSwitchLevel === 'SOFT') return null;

  const colors = {
    HARD: '#ff9800',
    EMERGENCY: '#f44336'
  };

  return (
    <div className="kill-switch-banner" style={{ backgroundColor: colors[killSwitchLevel] }}>
      <span>⚠️ {killSwitchLevel} KILL SWITCH ACTIVE</span>
      <p>Trading halted due to extreme volatility</p>
    </div>
  );
}
