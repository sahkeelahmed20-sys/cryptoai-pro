import type { PriceData, LivePriceData } from '../types';

type PriceCallback = (symbol: string, price: number, change24h: number) => void;

class BinanceWebSocketService {
  private ws: WebSocket | null = null;
  private callbacks: Set<PriceCallback> = new Set();
  private reconnectTimer: NodeJS.Timeout | null = null;
  private symbols: string[] = [];
  private isConnected = false;
  private priceData: Map<string, LivePriceData> = new Map();

  subscribe(callback: PriceCallback) {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  connect(symbols: string[] = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT']) {
    this.symbols = symbols;
    this.disconnect();
    
    const streams = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/');
    const url = `wss://stream.binance.com:9443/ws/${streams}`;
    
    this.ws = new WebSocket(url);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.s && data.c) {
        const price = parseFloat(data.c);
        const change24h = parseFloat(data.P);
        const volume = parseFloat(data.v);
        const high24h = parseFloat(data.h);
        const low24h = parseFloat(data.l);
        
        this.priceData.set(data.s, {
          symbol: data.s,
          price,
          change24h,
          volume,
          high24h,
          low24h
        });
        
        this.callbacks.forEach(cb => cb(data.s, price, change24h));
      }
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket disconnected, reconnecting...');
      this.isConnected = false;
      this.reconnectTimer = setTimeout(() => this.connect(this.symbols), 3000);
    };
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  getStatus() {
    return this.isConnected;
  }

  getPriceData(symbol: string): LivePriceData | undefined {
    return this.priceData.get(symbol);
  }

  getAllPriceData(): LivePriceData[] {
    return Array.from(this.priceData.values());
  }
}

export const binanceWS = new BinanceWebSocketService();
export type { LivePriceData };
