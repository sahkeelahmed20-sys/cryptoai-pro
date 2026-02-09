import axios from 'axios';

const BINANCE_API = 'https://api.binance.com/api/v3';

export interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  quoteVolume: number;
  lastUpdated: number;
}

export interface OrderBook {
  bids: [number, number][];
  asks: [number, number][];
  timestamp: number;
}

class MarketDataService {
  // Get 24hr stats for multiple coins
  async get24hrTickers(symbols: string[]): Promise<PriceData[]> {
    try {
      const symbolParams = symbols.map(s => `"${s.toUpperCase()}USDT"`).join(',');
      const response = await axios.get(`${BINANCE_API}/ticker/24hr?symbols=[${symbolParams}]`);
      
      return response.data.map((ticker: any) => ({
        symbol: ticker.symbol.replace('USDT', ''),
        price: parseFloat(ticker.lastPrice),
        change24h: parseFloat(ticker.priceChange),
        changePercent24h: parseFloat(ticker.priceChangePercent),
        high24h: parseFloat(ticker.highPrice),
        low24h: parseFloat(ticker.lowPrice),
        volume24h: parseFloat(ticker.volume),
        quoteVolume: parseFloat(ticker.quoteVolume),
        lastUpdated: ticker.closeTime
      }));
    } catch (error) {
      console.error('Binance API Error:', error);
      return [];
    }
  }

  // Get chart data (klines/candles)
  async getKlines(symbol: string, interval = '1h', limit = 100): Promise<any[]> {
    try {
      const response = await axios.get(`${BINANCE_API}/klines`, {
        params: {
          symbol: `${symbol.toUpperCase()}USDT`,
          interval,
          limit
        }
      });
      
      // Binance returns arrays: [time, open, high, low, close, volume, ...]
      // All values are strings from API
      return response.data.map((k: (string | number)[]) => ({
        time: Number(k[0]),
        open: parseFloat(String(k[1])),
        high: parseFloat(String(k[2])),
        low: parseFloat(String(k[3])),
        close: parseFloat(String(k[4])),
        volume: parseFloat(String(k[5]))
      }));
    } catch (error) {
      console.error('Klines Error:', error);
      return [];
    }
  }
}

export const marketDataService = new MarketDataService();
