export interface PriceData {
  symbol: string;
  price: number;
  timestamp: number;
  volume?: number;
  change24h?: number;
  high24h?: number;
  low24h?: number;
}

export interface OrderBook {
  symbol: string;
  bids: [number, number][];
  asks: [number, number][];
  lastUpdateId: number;
  timestamp: number;
}

export interface LivePriceData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  high24h: number;
  low24h: number;
}

export interface Position {
  id: number;
  symbol: string;
  side: 'LONG' | 'SHORT';
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  stopLoss?: number;
  takeProfit?: number;
  timestamp: string;
}

export interface Trade {
  id: number;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'OPEN' | 'CLOSE';
  price: number;
  size: number;
  pnl?: number;
  timestamp: string;
}

export type MarketRegime = 'TREND' | 'CHOP' | 'PANIC';
export type KillSwitchLevel = 'OFF' | 'SOFT' | 'HARD' | 'LOCKED';

export interface TradingState {
  aiEnabled: boolean;
  isEnabled: boolean;
  marketRegime: MarketRegime;
  killSwitchLevel: KillSwitchLevel;
  killReason: string | null;
  confidence: number;
  ensembleScore: number;
  lastUpdate: string;
}

