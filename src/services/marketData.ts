import api from './api';

export interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

export interface OrderBook {
  bids: [number, number][];
  asks: [number, number][];
  timestamp: number;
}

class MarketDataService {
  private ws: WebSocket | null = null;
  private subscribers: Map<string, ((data: PriceData) => void)[]> = new Map();

  async getTopCoins(limit = 100): Promise<PriceData[]> {
    const response = await api.get(`/market/coins?limit=${limit}`);
    return response.data;
  }

  async getPriceHistory(symbol: string, timeframe: string): Promise<any[]> {
    const response = await api.get(`/market/history/${symbol}?timeframe=${timeframe}`);
    return response.data;
  }

  async getOrderBook(symbol: string): Promise<OrderBook> {
    const response = await api.get(`/market/orderbook/${symbol}`);
    return response.data;
  }

  connectWebSocket(symbols: string[]) {
    const wsUrl = `${import.meta.env.VITE_WS_URL}/prices`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('Market data WebSocket connected');
      this.ws?.send(JSON.stringify({ type: 'subscribe', symbols }));
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.notifySubscribers(data.symbol, data);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  subscribe(symbol: string, callback: (data: PriceData) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, []);
    }
    this.subscribers.get(symbol)?.push(callback);
  }

  unsubscribe(symbol: string, callback: (data: PriceData) => void) {
    const callbacks = this.subscribers.get(symbol) || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  private notifySubscribers(symbol: string, data: PriceData) {
    const callbacks = this.subscribers.get(symbol) || [];
    callbacks.forEach((cb) => cb(data));
  }

  disconnect() {
    this.ws?.close();
  }
}

export const marketDataService = new MarketDataService();
