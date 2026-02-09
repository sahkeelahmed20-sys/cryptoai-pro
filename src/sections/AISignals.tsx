import { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, Minus, Target, Shield, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import type { TradingState } from '@/App';

interface AISignalsProps {
  tradingState: TradingState;
}

interface Agent {
  id: string;
  name: string;
  vote: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  weight: number;
  description: string;
}

interface Signal {
  type: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
}

export function AISignals({ tradingState }: AISignalsProps) {
  const [agents, setAgents] = useState<Agent[]>([
    { id: '1', name: 'Trend Follower', vote: 'BUY', confidence: 85, weight: 0.25, description: 'Moving average crossover strategy' },
    { id: '2', name: 'Momentum AI', vote: 'BUY', confidence: 72, weight: 0.20, description: 'RSI and MACD analysis' },
    { id: '3', name: 'Volatility Scout', vote: 'HOLD', confidence: 45, weight: 0.15, description: 'Bollinger Bands and ATR' },
    { id: '4', name: 'Sentiment Analyzer', vote: 'BUY', confidence: 91, weight: 0.25, description: 'Social media and news sentiment' },
    { id: '5', name: 'Pattern Recognition', vote: 'HOLD', confidence: 38, weight: 0.15, description: 'Chart pattern detection' },
  ]);

  const [signal, setSignal] = useState<Signal>({
    type: 'BUY',
    confidence: 87,
    entry: 68230,
    stopLoss: 66500,
    takeProfit: 71000,
    riskReward: 1.67,
  });

  // Simulate agent voting updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        confidence: Math.max(0, Math.min(100, agent.confidence + (Math.random() - 0.5) * 10)),
        vote: Math.random() > 0.7 
          ? (['BUY', 'SELL', 'HOLD'] as const)[Math.floor(Math.random() * 3)]
          : agent.vote,
      })));

      setSignal(prev => ({
        ...prev,
        confidence: Math.max(0, Math.min(100, prev.confidence + (Math.random() - 0.5) * 5)),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const buyVotes = agents.filter(a => a.vote === 'BUY').length;
  const sellVotes = agents.filter(a => a.vote === 'SELL').length;
  const holdVotes = agents.filter(a => a.vote === 'HOLD').length;

  const weightedConfidence = agents.reduce((acc, agent) => 
    acc + (agent.confidence * agent.weight), 0
  );

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#f6f6f6] flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#d0ff59]" />
          AI Trading Signals
        </h2>
        <div className="flex items-center gap-2 text-sm text-[#888888]">
          <span>Multi-Agent Consensus</span>
          <span className="text-[#444444]">|</span>
          <span className="text-[#d0ff59]">{agents.length} Agents Active</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Signal Card */}
        <div className="col-span-1 bg-[#0b0b0b] border border-[#222222] rounded-2xl p-6">
          <div className="text-center mb-6">
            <p className="text-sm text-[#888888] mb-2">AI Signal</p>
            <div className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-xl text-2xl font-bold',
              signal.type === 'BUY' && 'bg-[#d0ff59]/20 text-[#d0ff59] border border-[#d0ff59]/50',
              signal.type === 'SELL' && 'bg-red-500/20 text-red-500 border border-red-500/50',
              signal.type === 'HOLD' && 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50'
            )}>
              {signal.type === 'BUY' && <TrendingUp className="w-6 h-6" />}
              {signal.type === 'SELL' && <TrendingDown className="w-6 h-6" />}
              {signal.type === 'HOLD' && <Minus className="w-6 h-6" />}
              {signal.type}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#888888]">Confidence</span>
              <span className={cn(
                'text-lg font-bold',
                signal.confidence >= 70 ? 'text-[#d0ff59]' : 
                signal.confidence >= 40 ? 'text-yellow-500' : 'text-red-500'
              )}>
                {signal.confidence.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-[#1a1a1a] rounded-full h-2">
              <div 
                className={cn(
                  'h-2 rounded-full transition-all duration-500',
                  signal.confidence >= 70 ? 'bg-[#d0ff59]' : 
                  signal.confidence >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                )}
                style={{ width: `${signal.confidence}%` }}
              />
            </div>

            <div className="pt-4 border-t border-[#222222] space-y-3">
              <SignalRow label="Entry Price" value={`$${signal.entry.toLocaleString()}`} />
              <SignalRow label="Stop Loss" value={`$${signal.stopLoss.toLocaleString()}`} color="text-red-500" />
              <SignalRow label="Take Profit" value={`$${signal.takeProfit.toLocaleString()}`} color="text-[#d0ff59]" />
              <SignalRow label="Risk/Reward" value={`1:${signal.riskReward}`} />
            </div>
          </div>
        </div>

        {/* Agent Voting Panel */}
        <div className="col-span-2 bg-[#0b0b0b] border border-[#222222] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#f6f6f6]">Agent Voting</h3>
            <div className="flex items-center gap-4">
              <VoteBadge count={buyVotes} type="BUY" />
              <VoteBadge count={sellVotes} type="SELL" />
              <VoteBadge count={holdVotes} type="HOLD" />
            </div>
          </div>

          <div className="space-y-3">
            {agents.map((agent) => (
              <div 
                key={agent.id}
                className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-xl hover:bg-[#222222] transition-colors"
              >
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  agent.vote === 'BUY' && 'bg-[#d0ff59]/20',
                  agent.vote === 'SELL' && 'bg-red-500/20',
                  agent.vote === 'HOLD' && 'bg-yellow-500/20'
                )}>
                  {agent.vote === 'BUY' && <TrendingUp className="w-5 h-5 text-[#d0ff59]" />}
                  {agent.vote === 'SELL' && <TrendingDown className="w-5 h-5 text-red-500" />}
                  {agent.vote === 'HOLD' && <Minus className="w-5 h-5 text-yellow-500" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#f6f6f6]">{agent.name}</span>
                    <span className="text-xs text-[#888888]">({(agent.weight * 100).toFixed(0)}% weight)</span>
                  </div>
                  <p className="text-xs text-[#888888]">{agent.description}</p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-sm font-medium',
                      agent.confidence >= 70 ? 'text-[#d0ff59]' : 
                      agent.confidence >= 40 ? 'text-yellow-500' : 'text-red-500'
                    )}>
                      {agent.confidence.toFixed(0)}%
                    </span>
                    <span className="text-xs text-[#888888]">confidence</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ensemble Score */}
          <div className="mt-6 p-4 bg-gradient-to-r from-[#d0ff59]/10 to-transparent rounded-xl border border-[#d0ff59]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-[#d0ff59]" />
                <div>
                  <p className="text-sm font-medium text-[#f6f6f6]">Ensemble Score</p>
                  <p className="text-xs text-[#888888]">Weighted aggregation of all agents</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  'text-2xl font-bold',
                  weightedConfidence >= 70 ? 'text-[#d0ff59]' : 
                  weightedConfidence >= 40 ? 'text-yellow-500' : 'text-red-500'
                )}>
                  {(weightedConfidence / 100).toFixed(2)}
                </p>
                <p className="text-xs text-[#888888]">
                  {weightedConfidence >= 70 ? 'Strong Signal' : weightedConfidence >= 40 ? 'Moderate Signal' : 'Weak Signal'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trading Conditions */}
      <div className="grid grid-cols-4 gap-4">
        <ConditionCard
          title="Risk Systems"
          status={tradingState.killSwitchLevel === 'OFF' ? 'Active' : 'Triggered'}
          icon={Shield}
          active={tradingState.killSwitchLevel === 'OFF'}
        />
        <ConditionCard
          title="AI Confidence"
          status={signal.confidence >= 70 ? 'High' : 'Low'}
          icon={CheckCircle2}
          active={signal.confidence >= 70}
        />
        <ConditionCard
          title="Market Data"
          status="Connected"
          icon={Target}
          active={true}
        />
        <ConditionCard
          title="Trade Execution"
          status={tradingState.aiEnabled && signal.confidence >= 70 ? 'Ready' : 'Blocked'}
          icon={tradingState.aiEnabled && signal.confidence >= 70 ? CheckCircle2 : XCircle}
          active={tradingState.aiEnabled && signal.confidence >= 70}
        />
      </div>
    </div>
  );
}

interface SignalRowProps {
  label: string;
  value: string;
  color?: string;
}

function SignalRow({ label, value, color = 'text-[#f6f6f6]' }: SignalRowProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-[#888888] flex items-center gap-2">
        {label === 'Stop Loss' && <AlertCircle className="w-3 h-3" />}
        {label === 'Take Profit' && <Target className="w-3 h-3" />}
        {label}
      </span>
      <span className={cn('text-sm font-semibold', color)}>{value}</span>
    </div>
  );
}

interface VoteBadgeProps {
  count: number;
  type: 'BUY' | 'SELL' | 'HOLD';
}

function VoteBadge({ count, type }: VoteBadgeProps) {
  return (
    <div className={cn(
      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium',
      type === 'BUY' && 'bg-[#d0ff59]/10 text-[#d0ff59]',
      type === 'SELL' && 'bg-red-500/10 text-red-500',
      type === 'HOLD' && 'bg-yellow-500/10 text-yellow-500'
    )}>
      {type === 'BUY' && <TrendingUp className="w-4 h-4" />}
      {type === 'SELL' && <TrendingDown className="w-4 h-4" />}
      {type === 'HOLD' && <Minus className="w-4 h-4" />}
      {count} {type}
    </div>
  );
}

interface ConditionCardProps {
  title: string;
  status: string;
  icon: React.ElementType;
  active: boolean;
}

function ConditionCard({ title, status, icon: Icon, active }: ConditionCardProps) {
  return (
    <div className={cn(
      'p-4 rounded-xl border transition-all',
      active 
        ? 'bg-[#d0ff59]/10 border-[#d0ff59]/30' 
        : 'bg-[#1a1a1a] border-[#222222]'
    )}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn('w-4 h-4', active ? 'text-[#d0ff59]' : 'text-red-500')} />
        <span className="text-xs text-[#888888]">{title}</span>
      </div>
      <p className={cn(
        'text-sm font-semibold',
        active ? 'text-[#d0ff59]' : 'text-red-500'
      )}>
        {status}
      </p>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
