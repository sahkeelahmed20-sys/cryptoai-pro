
// src/types/index.ts - Keep only ONE declaration of each interface

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
  bids: [number, number][];  // [price, quantity]
  asks: [number, number][];
  lastUpdateId: number;
  timestamp: number;
}

// Add any other unique interfaces below...
export interface Trade {
  id: number;
  symbol: string;
  price: number;
  quantity: number;
  time: number;
  isBuyerMaker: boolean;
}

export interface Ticker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  lastPrice: string;
  volume: string;
  quoteVolume: string;
}
