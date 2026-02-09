import { useState, useEffect } from 'react';
import { useDemoTrading } from './hooks/useDemoTrading';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import KillSwitchBanner from './components/KillSwitchBanner';
import AIControlPanel from './components/AIControlPanel';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/use-toast';
import type { TradingState, MarketRegime, KillSwitchLevel } from './types';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { toast } = useToast();
  
  const {
    positions,
    prices,
    changes,
    trades,
    balance,
    equity,
    openPosition,
    closePosition,
    isConnected
  } = useDemoTrading();

  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState<'LONG' | 'SHORT'>('LONG');
  const [size, setSize] = useState(0.1);

  const [tradingState, setTradingState] = useState<TradingState>({
    aiEnabled: true,
    isEnabled: true,
    marketRegime: 'TREND',
    killSwitchLevel: 'OFF',
    killReason: null,
    confidence: 87,
    ensembleScore: 0.72,
    lastUpdate: new Date().toISOString(),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const regimes: MarketRegime[] = ['TREND', 'CHOP', 'PANIC'];
      const randomRegime = regimes[Math.floor(Math.random() * regimes.length)];
      
      setTradingState(prev => {
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
            isEnabled: false,
            lastUpdate: new Date().toISOString(),
          };
        }
        return { 
          ...prev, 
          marketRegime: randomRegime,
          lastUpdate: new Date().toISOString(),
        };
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
    setTradingState(prev => ({ 
      ...prev, 
      aiEnabled: enabled,
      isEnabled: enabled,
      lastUpdate: new Date().toISOString(),
    }));
  };

  const handleResetKillSwitch = () => {
    setTradingState(prev => ({
      ...prev,
      killSwitchLevel: 'OFF',
      killReason: null,
      aiEnabled: true,
      isEnabled: true,
      lastUpdate: new Date().toISOString(),
    }));
    toast({
      title: 'Kill Switch Reset',
      description: 'AI trading has been re-enabled',
    });
  };

  const handleOpenPosition = () => {
    openPosition(symbol, side, size);
    toast({
      title: 'Position Opened',
      description: `${side} ${size} ${symbol} at $${prices[symbol]?.toLocaleString() || 'N/A'}`,
    });
  };

  const handleClosePosition = (id: number) => {
    const position = positions.find(p => p.id === id);
    closePosition(id);
    if (position) {
      toast({
        title: 'Position Closed',
        description: `${position.side} ${position.symbol} P&L: $${position.pnl.toFixed(2)}`,
      });
    }
  };

  const currentPrice = prices[symbol] || 0;

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#1a1a24] rounded-2xl p-6 border border-[#2a2a3a]">
                <div className="text-[#8b8b9f] text-sm mb-3 uppercase">Portfolio Balance</div>
                <div className="text-3xl font-bold mb-2">${balance.toLocaleString()}</div>
                <div className="text-[#00d084] text-sm font-bold">+2.45%</div>
              </div>
              <div className="bg-[#1a1a24] rounded-2xl p-6 border border-[#2a2a3a]">
                <div className="text-[#8b8b9f] text-sm mb-3 uppercase">Equity</div>
                <div className="text-3xl font-bold mb-2">${equity.toLocaleString()}</div>
                <div className="text-[#8b8b9f] text-sm">+${(equity - balance).toFixed(2)} unrealized</div>
              </div>
              <div className="bg-[#1a1a24] rounded-2xl p-6 border border-[#2a2a3a]">
                <div className="text-[#8b8b9f] text-sm mb-3 uppercase">Available Margin</div>
                <div className="text-3xl font-bold mb-2">
                  ${(balance - positions.reduce((sum, p) => sum + p.entryPrice * p.size * 0.1, 0)).toLocaleString()}
                </div>
                <div className="text-[#8b8b9f] text-sm">
                  ${positions.reduce((sum, p) => sum + p.entryPrice * p.size * 0.1, 0).toFixed(0)} used
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a24] rounded-2xl border border-[#2a2a3a]">
              <div className="p-6 border-b border-[#2a2a3a] flex items-center justify-between">
                <h3 className="text-lg font-bold">🎯 Market Overview</h3>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#3742fa]/10 text-[#3742fa] rounded-lg text-sm font-bold">
                  📈 {tradingState.marketRegime} — Directional bias detected
                </div>
              </div>
              <div className="p-6">
                <div className="flex gap-6 mb-6 p-4 bg-[#12121a] rounded-xl text-sm">
                  <span>Status: <strong className="text-white">Active</strong></span>
                  <span>Regime: <strong className="text-white">{tradingState.marketRegime}</strong></span>
                  <span>Kill Switch: <strong className="text-white">{tradingState.killSwitchLevel}</strong></span>
                </div>
                {Object.entries(prices).map(([sym, price]) => (
                  <div key={sym} className="bg-[#12121a] rounded-xl p-5 mb-3 border border-[#2a2a3a] flex justify-between items-center">
                    <div>
                      <h4 className="font-bold mb-1">{sym}</h4>
                      <div className="text-2xl font-bold">${price.toLocaleString()}</div>
                      <div className="text-[#8b8b9f] text-xs mt-1">Vol: ${((price * 1000000) / 1e6).toFixed(2)}M</div>
                    </div>
                    <div className={`text-sm font-bold ${(changes[sym] || 0) >= 0 ? 'text-[#00d084]' : 'text-[#ff4757]'}`}>
                      {(changes[sym] || 0) >= 0 ? '+' : ''}{(changes[sym] || 0).toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1a1a24] rounded-2xl border border-[#2a2a3a]">
              <div className="p-6 border-b border-[#2a2a3a]">
                <h3 className="text-lg font-bold">📊 Performance Metrics</h3>
              </div>
              <div className="grid grid-cols-3 gap-6 p-6">
                <div className="text-center p-5 bg-[#12121a] rounded-xl">
                  <div className="text-[#8b8b9f] text-xs mb-3">Total Return</div>
                  <div className="text-2xl font-bold text-[#00d084]">+2.45%</div>
                </div>
                <div className="text-center p-5 bg-[#12121a] rounded-xl">
                  <div className="text-[#8b8b9f] text-xs mb-3">Max Drawdown</div>
                  <div className="text-2xl font-bold text-[#ff4757]">-3.2%</div>
                </div>
                <div className="text-center p-5 bg-[#12121a] rounded-xl">
                  <div className="text-[#8b8b9f] text-xs mb-3">Win Rate</div>
                  <div className="text-2xl font-bold">68.5%</div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'demo-trading':
        return (
          <div className="bg-[#1a1a24] rounded-2xl border border-[#2a2a3a]">
            <div className="p-6 border-b border-[#2a2a3a]">
              <h3 className="text-lg font-bold">💰 Demo Trading Account</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-[#8b8b9f] text-xs mb-1">Portfolio Balance</div>
                  <div className="text-xl font-bold">${balance.toLocaleString()}</div>
                  <div className="text-[#00d084] text-xs">+2.45%</div>
                </div>
                <div>
                  <div className="text-[#8b8b9f] text-xs mb-1">Equity</div>
                  <div className="text-xl font-bold">${equity.toLocaleString()}</div>
                  <div className="text-[#8b8b9f] text-xs">+${(equity - balance).toFixed(2)} unrealized</div>
                </div>
                <div>
                  <div className="text-[#8b8b9f] text-xs mb-1">Available Margin</div>
                  <div className="text-xl font-bold">
                    ${(balance - positions.reduce((sum, p) => sum + p.entryPrice * p.size * 0.1, 0)).toLocaleString()}
                  </div>
                  <div className="text-[#8b8b9f] text-xs">
                    ${positions.reduce((sum, p) => sum + p.entryPrice * p.size * 0.1, 0).toFixed(0)} used
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <select
                  value={symbol}
                  onChange={e => setSymbol(e.target.value)}
                  className="w-full p-4 bg-[#2a2a3a] border border-[#2a2a3a] rounded-xl text-white text-base"
                >
                  <option value="BTCUSDT">BTC/USDT</option>
                  <option value="ETHUSDT">ETH/USDT</option>
                  <option value="SOLUSDT">SOL/USDT</option>
                </select>

                <div className="text-center p-6 bg-[#12121a] rounded-xl">
                  <div className="text-[#8b8b9f] text-sm mb-2">Current {symbol.replace('USDT', '/USDT')} Price</div>
                  <div className="text-4xl font-bold">${currentPrice.toLocaleString()}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSide('LONG')}
                    className={`p-4 rounded-xl font-bold text-base ${
                      side === 'LONG' 
                        ? 'bg-[#00d084] text-black border-2 border-[#00d084]' 
                        : 'bg-[#2a2a3a] text-[#8b8b9f] border-2 border-[#2a2a3a]'
                    }`}
                  >LONG</button>
                  <button
                    onClick={() => setSide('SHORT')}
                    className={`p-4 rounded-xl font-bold text-base ${
                      side === 'SHORT' 
                        ? 'bg-[#ff4757] text-white border-2 border-[#ff4757]' 
                        : 'bg-[#2a2a3a] text-[#8b8b9f] border-2 border-[#2a2a3a]'
                    }`}
                  >SHORT</button>
                </div>

                <input
                  type="number"
                  step="0.01"
                  value={size}
                  onChange={e => setSize(parseFloat(e.target.value))}
                  placeholder="Size"
                  className="w-full p-4 bg-[#2a2a3a] border border-[#2a2a3a] rounded-xl text-white text-base"
                />

                <button
                  onClick={handleOpenPosition}
                  className={`w-full p-5 rounded-xl font-bold text-base uppercase ${
                    side === 'LONG' ? 'bg-[#00d084] text-black' : 'bg-[#ff4757] text-white'
                  }`}
                >
                  Open {side} Position
                </button>
              </div>

              <div className="mt-6">
                <h4 className="mb-4 text-base font-bold">Open Positions ({positions.length})</h4>
                {positions.length === 0 ? (
                  <div className="text-center p-12 text-[#8b8b9f] bg-[#12121a] rounded-xl border border-dashed border-[#2a2a3a]">
                    No open positions
                  </div>
                ) : (
                  positions.map(pos => (
                    <div key={pos.id} className="bg-[#12121a] rounded-xl p-5 mb-3 border border-[#2a2a3a]"
                      style={{ borderLeft: `4px solid ${pos.side === 'LONG' ? '#00d084' : '#ff4757'}` }}>
                      <div className="flex justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-md text-xs font-bold ${
                            pos.side === 'LONG' ? 'bg-[#00d084] text-black' : 'bg-[#ff4757] text-white'
                          }`}>{pos.side}</span>
                          <span className="font-bold">{pos.symbol}</span>
                        </div>
                        <span className={`font-bold ${pos.pnl >= 0 ? 'text-[#00d084]' : 'text-[#ff4757]'}`}>
                          {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-[#2a2a3a] rounded-lg">
                        <div>
                          <div className="text-[#8b8b9f] text-xs">Entry</div>
                          <div className="font-bold">${pos.entryPrice.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-[#8b8b9f] text-xs">Current</div>
                          <div className="font-bold">${pos.currentPrice.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-[#8b8b9f] text-xs">Size</div>
                          <div className="font-bold">{pos.size}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleClosePosition(pos.id)}
                        className="w-full p-3 bg-transparent border border-[#2a2a3a] text-[#8b8b9f] rounded-lg hover:border-[#ff4757] hover:text-[#ff4757]"
                      >Close Position</button>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6">
                <h4 className="mb-4 text-base font-bold">Trade History ({trades.length})</h4>
                {trades.length === 0 ? (
                  <div className="text-center p-12 text-[#8b8b9f] bg-[#12121a] rounded-xl border border-dashed border-[#2a2a3a]">
                    No trades yet
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {trades.map(trade => (
                      <div key={trade.id} className="flex items-center justify-between p-4 bg-[#12121a] rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                            trade.side === 'BUY' ? 'bg-[#00d084]/10 text-[#00d084]' : 'bg-[#ff4757]/10 text-[#ff4757]'
                          }`}>{trade.side === 'BUY' ? '↑' : '↓'}</div>
                          <div>
                            <div className="font-bold">{trade.type} {trade.symbol}</div>
                            <div className="text-[#8b8b9f] text-sm">{trade.side} @ ${trade.price.toLocaleString()}</div>
                          </div>
                        </div>
                        {trade.pnl !== undefined && (
                          <div className={`font-bold ${trade.pnl >= 0 ? 'text-[#00d084]' : 'text-[#ff4757]'}`}>
                            {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'backtesting':
        return (
          <div className="bg-[#1a1a24] rounded-2xl border border-[#2a2a3a] p-6">
            <h3 className="text-lg font-bold mb-4">📈 Backtesting</h3>
            <p className="text-[#8b8b9f]">Backtesting module coming soon...</p>
          </div>
        );
      
      case 'strategies':
        return (
          <div className="bg-[#1a1a24] rounded-2xl border border-[#2a2a3a] p-6">
            <h3 className="text-lg font-bold mb-4">🤖 Strategy Comparison</h3>
            <p className="text-[#8b8b9f]">Strategy comparison module coming soon...</p>
          </div>
        );
      
      case 'news':
        return (
          <div className="bg-[#1a1a24] rounded-2xl border border-[#2a2a3a] p-6">
            <h3 className="text-lg font-bold mb-4">📰 News Analysis</h3>
            <p className="text-[#8b8b9f]">News analysis module coming soon...</p>
          </div>
        );
      
      case 'bitnodes':
        return (
          <div className="bg-[#1a1a24] rounded-2xl border border-[#2a2a3a] p-6">
            <h3 className="text-lg font-bold mb-4">🌐 Bitnodes Analysis</h3>
            <p className="text-[#8b8b9f]">Bitnodes analysis module coming soon...</p>
          </div>
        );
      
      default:
        return null;
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
          <Header tradingState={tradingState} prices={prices} isConnected={isConnected} />
          <AIControlPanel 
  tradingState={tradingState}
  onToggle={() => handleAIToggle(!tradingState.aiEnabled)}
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
