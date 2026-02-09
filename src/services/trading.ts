import api from './api';

export interface TradeSignal {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  confidence: number;
  strategy: string;
  timestamp: number;
  timeframe: string;
}

export interface BacktestResult {
  strategy: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
  trades: Trade[];
  equityCurve: { date: string; value: number }[];
}

export interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  entryPrice: number;
  exitPrice?: number;
  size: number;
  pnl?: number;
  pnlPercent?: number;
  entryTime: string;
  exitTime?: string;
  status: 'open' | 'closed';
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, number | boolean | string>;
  performance: {
    monthlyReturn: number;
    winRate: number;
    sharpeRatio: number;
  };
}

class TradingService {
  async getAISignals(): Promise<TradeSignal[]> {
    const response = await api.get('/trading/signals');
    return response.data;
  }

  async executeDemoTrade(signalId: string, amount: number): Promise<Trade> {
    const response = await api.post('/trading/demo/execute', {
      signalId,
      amount,
    });
    return response.data;
  }

  async getOpenPositions(): Promise<Trade[]> {
    const response = await api.get('/trading/positions');
    return response.data;
  }

  async closePosition(tradeId: string): Promise<Trade> {
    const response = await api.post(`/trading/positions/${tradeId}/close`);
    return response.data;
  }

  async runBacktest(
    strategyId: string,
    symbol: string,
    startDate: string,
    endDate: string,
    initialCapital: number
  ): Promise<BacktestResult> {
    const response = await api.post('/trading/backtest', {
      strategyId,
      symbol,
      startDate,
      endDate,
      initialCapital,
    });
    return response.data;
  }

  async getStrategies(): Promise<Strategy[]> {
    const response = await api.get('/trading/strategies');
    return response.data;
  }

  async compareStrategies(
    strategyIds: string[],
    symbol: string,
    period: string
  ): Promise<BacktestResult[]> {
    const response = await api.post('/trading/compare', {
      strategyIds,
      symbol,
      period,
    });
    return response.data;
  }

  // Risk management calculations
  calculatePositionSize(
    accountBalance: number,
    riskPercent: number,
    entryPrice: number,
    stopLoss: number
  ): number {
    const riskAmount = accountBalance * (riskPercent / 100);
    const priceRisk = Math.abs(entryPrice - stopLoss);
    return riskAmount / priceRisk;
  }
}

export const tradingService = new TradingService();
