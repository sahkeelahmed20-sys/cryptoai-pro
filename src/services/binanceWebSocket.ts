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
    
    this.ws.onopen = () => {
      console.log('Binance WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const symbol = data.s.replace('USDT', '');
      
      const update: LivePriceData = {
        symbol: symbol,
        price: parseFloat(data.c),
        changePercent: parseFloat(data.P),
        high: parseFloat(data.h),
        low: parseFloat(data.l),
        volume: parseFloat(data.v)
      };
      
      const callbacks = this.subscribers.get(symbol) || [];
      callbacks.forEach(cb => cb(update));
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed');
    };
  }

  subscribe(symbol: string, callback: (data: LivePriceData) => void) {
    const upperSymbol = symbol.toUpperCase();
    if (!this.subscribers.has(upperSymbol)) {
      this.subscribers.set(upperSymbol, []);
    }
    this.subscribers.get(upperSymbol)?.push(callback);
  }

  unsubscribe(symbol: string, callback: (data: LivePriceData) => void) {
    const callbacks = this.subscribers.get(symbol.toUpperCase()) || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  disconnect() {
    this.ws?.close();
  }
}

export const binanceWS = new BinanceWebSocket();
