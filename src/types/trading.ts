export interface Position {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  margin: number;
  leverage: number;
  liquidationPrice?: number;
  timestamp: number;
}

export interface Order {
  id: string;
  symbol: string;
  type: 'market' | 'limit' | 'stop';
  side: 'buy' | 'sell';
  size: number;
  price?: number;
  stopPrice?: number;
  status: 'pending' | 'filled' | 'cancelled';
  filledSize: number;
  timestamp: number;
}

export interface MarketMetrics {
  symbol: string;
  priceChange24h: number;
  volume24h: number;
  marketCap?: number;
  dominance?: number;
  volatility: number;
  rsi: number;
  macd: {
    value: number;
    signal: number;
    histogram: number;
  };
}

export type TimeFrame = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w';
