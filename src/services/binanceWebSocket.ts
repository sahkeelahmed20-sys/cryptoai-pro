export interface LivePriceData {
  symbol: string;
  price: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
}

export class BinanceWebSocket {
  private ws: WebSocket | null = null;
  private subscribers: Map<string, ((data: LivePriceData) => void)[]> = new Map();

  connect(symbols: string[]) {
    if (this.ws?.readyState === WebSocket.OPEN) return;
    
    const streams = symbols.map(s => `${s.toLowerCase()}usdt@ticker`).join('/');
    this.ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streams}`);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const symbol = data.s.replace('USDT', '');
      
      const update: LivePriceData = {
        symbol,
        price: parseFloat(data.c),
        changePercent: parseFloat(data.P),
        high: parseFloat(data.h),
        low: parseFloat(data.l),
        volume: parseFloat(data.v)
      };
      
      // Notify subscribers
      const callbacks = this.subscribers.get(symbol) || [];
      callbacks.forEach(cb => cb(update));
    };
    
    this.ws.onerror = (e) => console.error('WS Error:', e);
  }

  subscribe(symbol: string, callback: (data: LivePriceData) => void) {
    const upperSymbol = symbol.toUpperCase();
    if (!this.subscribers.has(upperSymbol)) {
      this.subscribers.set(upperSymbol, []);
    }
    this.subscribers.get(upperSymbol)?.push(callback);
  }

  disconnect() {
    this.ws?.close();
  }
}

export const binanceWS = new BinanceWebSocket();
