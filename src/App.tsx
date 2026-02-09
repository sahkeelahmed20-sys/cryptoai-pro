import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
// ✅ Use default import syntax (no curly braces)
import MarketOverview from './sections/MarketOverview';
import { AISignals } from './sections/AISignals';
import { DemoTrading } from './sections/DemoTrading';
import { Backtesting } from './sections/Backtesting';
import { StrategyComparison } from './sections/StrategyComparison';
import { NewsAnalysis } from './sections/NewsAnalysis';
import { BitnodesAnalysis } from './sections/BitnodesAnalysis';
import { KillSwitchBanner } from './components/KillSwitchBanner';
import { AIControlPanel } from './components/AIControlPanel';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/use-toast';

export type MarketRegime = 'TREND' | 'CHOP' | 'PANIC';
export type KillSwitchLevel = 'OFF' | 'SOFT' | 'HARD' | 'LOCKED';

export interface TradingState {
  aiEnabled: boolean;
  marketRegime: MarketRegime;
  killSwitchLevel: KillSwitchLevel;
  killReason: string | null;
  confidence: number;
  ensembleScore: number;
}

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [tradingState, setTradingState] = useState<TradingState>({
    aiEnabled: true,
    marketRegime: 'TREND',
    killSwitchLevel: 'OFF',
    killReason: null,
    confidence: 87,
    ensembleScore: 0.72,
  });
  const { toast } = useToast();

  // Simulate market regime changes
  useEffect(() => {
    const interval = setInterval(() => {
      const regimes: MarketRegime[] = ['TREND', 'CHOP', 'PANIC'];
      const randomRegime = regimes[Math.floor(Math.random() * regimes.length)];
      
      setTradingState(prev => {
        // Auto-disable AI in PANIC mode
        if (randomRegime === 'PANIC' && prev.killSwitchLevel === 'OFF') {
          toast({
            title: 'Kill Switch Activated',
            description: 'AI trading disabled due to market panic',
            variant: 'destructive',
          });
          return {
            ...prev,
            marketRegime: randomRegime,
            killSwitchLevel: 'HARD',
            killReason: 'Extreme volatility detected',
            aiEnabled: false,
          };
        }
        return { ...prev, marketRegime: randomRegime };
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [toast]);

  const handleAIToggle = (enabled: boolean) => {
    if (tradingState.killSwitchLevel === 'LOCKED') {
      toast({
        title: 'AI Locked',
        description: 'Cannot enable AI while kill switch is LOCKED',
        variant: 'destructive',
      });
      return;
    }
    setTradingState(prev => ({ ...prev, aiEnabled: enabled }));
  };

  const handleResetKillSwitch = () => {
    setTradingState(prev => ({
      ...prev,
      killSwitchLevel: 'OFF',
      killReason: null,
      aiEnabled: true,
    }));
    toast({
      title: 'Kill Switch Reset',
      description: 'AI trading has been re-enabled',
    });
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <MarketOverview />
            <AISignals tradingState={tradingState} />
          </>
        );
      case 'demo-trading':
        return <DemoTrading tradingState={tradingState} />;
      case 'backtesting':
        return <Backtesting />;
      case 'strategies':
        return <StrategyComparison />;
      case 'news':
        return <NewsAnalysis />;
      case 'bitnodes':
        return <BitnodesAnalysis />;
      default:
        return <MarketOverview tradingState={tradingState} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#010101] text-[#f6f6f6] font-sans">
      <KillSwitchBanner 
        tradingState={tradingState} 
        onReset={handleResetKillSwitch}
      />
      <div className="flex">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="flex-1 flex flex-col ml-64">
          <Header tradingState={tradingState} />
          <AIControlPanel 
            tradingState={tradingState}
            onToggleAI={handleAIToggle}
          />
          <main className="flex-1 p-6 overflow-auto">
            {renderSection()}
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
