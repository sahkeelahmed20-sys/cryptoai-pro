import { useState, useEffect, useCallback } from 'react';
import { binanceWS } from '../services/binanceWebSocket';
import type { Position, Trade } from '../types';

// Re-export Position type
export type { Position };

export function useDemoTrading() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [changes, setChanges] = useState<Record<string, number>>({});
  const [trades, setTrades] = useState<Trade[]>([]);
  const [balance, setBalance] = useState(100000);
  const [equity, setEquity] = useState(100000);

  useEffect(() => {
    const unsubscribe = binanceWS.subscribe((symbol, price, change24h) => {
      setPrices(prev => ({ ...prev, [symbol]: price }));
      setChanges(prev => ({ ...prev, [symbol]: change24h }));
    });
    
    binanceWS.connect();
    
    return () => {
      unsubscribe();
      binanceWS.disconnect();
    };
  }, []);

  useEffect(() => {
    setPositions(prev => prev.map(pos => {
      const currentPrice = prices[pos.symbol] || pos.currentPrice;
      const priceDiff = currentPrice - pos.entryPrice;
      const multiplier = pos.side === 'LONG' ? 1 : -1;
      const pnl = priceDiff * pos.size * multiplier;
      const pnlPercent = (priceDiff / pos.entryPrice) * 100 * multiplier;
      
      return {
        ...pos,
        currentPrice,
        pnl,
        pnlPercent
      };
    }));
  }, [prices]);

  useEffect(() => {
    const totalPnl = positions.reduce((sum, pos) => sum + pos.pnl, 0);
    setEquity(balance + totalPnl);
  }, [positions, balance]);

  const openPosition = useCallback((symbol: string, side: 'LONG' | 'SHORT', size: number, stopLoss?: number, takeProfit?: number) => {
    const currentPrice = prices[symbol];
    if (!currentPrice) {
      alert('Price not available');
      return;
    }

    const margin = currentPrice * size * 0.1;
    if (margin > balance) {
      alert('Insufficient balance');
      return;
    }

    const newPosition: Position = {
      id: Date.now(),
      symbol,
      side,
      size,
      entryPrice: currentPrice,
      currentPrice,
      pnl: 0,
      pnlPercent: 0,
      stopLoss,
      takeProfit,
      timestamp: new Date().toISOString()
    };

    setPositions(prev => [...prev, newPosition]);
    setBalance(prev => prev - margin);

    const newTrade: Trade = {
      id: Date.now(),
      symbol,
      side: side === 'LONG' ? 'BUY' : 'SELL',
      type: 'OPEN',
      price: currentPrice,
      size,
      timestamp: new Date().toISOString()
    };
    setTrades(prev => [newTrade, ...prev]);
  }, [prices, balance]);

  const closePosition = useCallback((positionId: number) => {
    setPositions(prev => {
      const pos = prev.find(p => p.id === positionId);
      if (!pos) return prev;

      const margin = pos.entryPrice * pos.size * 0.1;
      setBalance(b => b + margin + pos.pnl);

      const newTrade: Trade = {
        id: Date.now(),
        symbol: pos.symbol,
        side: pos.side === 'LONG' ? 'SELL' : 'BUY',
        type: 'CLOSE',
        price: pos.currentPrice,
        size: pos.size,
        pnl: pos.pnl,
        timestamp: new Date().toISOString()
      };
      setTrades(t => [newTrade, ...t]);

      return prev.filter(p => p.id !== positionId);
    });
  }, []);

  return {
    positions,
    prices,
    changes,
    trades,
    balance,
    equity,
    openPosition,
    closePosition,
    isConnected: binanceWS.getStatus()
  };
}
