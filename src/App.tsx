import { useState } from 'react';
import { useDemoTrading } from './hooks/useDemoTrading';

function App() {
  const {
    positions,
    prices,
    changes,
    trades,
    balance,
    equity,
    openPosition,
    closePosition,
    isConnected
  } = useDemoTrading();

  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState<'LONG' | 'SHORT'>('LONG');
  const [size, setSize] = useState(0.1);

  const handleOpen = () => {
    openPosition(symbol, side, size);
  };

  const currentPrice = prices[symbol] || 0;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0f', 
      color: '#fff',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        background: '#12121a',
        borderBottom: '1px solid #2a2a3a'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 800, fontSize: '20px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #00d084, #3742fa)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>⚡</div>
          <span>CryptoAI Pro</span>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          {Object.entries(prices).map(([sym, price]) => (
            <div key={sym} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              background: '#1a1a24',
              borderRadius: '8px',
              border: '1px solid #2a2a3a'
            }}>
              <span style={{ color: '#8b8b9f', fontSize: '13px' }}>{sym.replace('USDT', '/USDT')}</span>
              <span style={{ fontWeight: 700 }}>${price.toLocaleString()}</span>
              <span style={{
                fontSize: '12px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: (changes[sym] || 0) >= 0 ? 'rgba(0,208,132,0.1)' : 'rgba(255,71,87,0.1)',
                color: (changes[sym] || 0) >= 0 ? '#00d084' : '#ff4757'
              }}>
                {(changes[sym] || 0) >= 0 ? '+' : ''}{(changes[sym] || 0).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '20px',
          background: '#1a1a24',
          border: `1px solid ${isConnected ? '#00d084' : '#2a2a3a'}`,
          color: isConnected ? '#00d084' : '#8b8b9f',
          fontSize: '13px',
          fontWeight: 600
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'currentColor'
          }}></span>
          {isConnected ? 'Live' : 'Offline'}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <div style={{
          width: '260px',
          background: '#12121a',
          borderRight: '1px solid #2a2a3a',
          padding: '20px 0',
          minHeight: 'calc(100vh - 65px)'
        }}>
          {[
            { icon: '📊', label: 'Dashboard', active: true },
            { icon: '💰', label: 'Demo Trading', active: false },
            { icon: '📈', label: 'Backtesting', active: false },
            { icon: '🤖', label: 'Strategies', active: false },
            { icon: '📰', label: 'News Analysis', active: false },
            { icon: '🌐', label: 'Bitnodes', active: false },
          ].map((item) => (
            <div key={item.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 24px',
              margin: '2px 12px',
              borderRadius: '10px',
              cursor: 'pointer',
              color: item.active ? '#00d084' : '#8b8b9f',
              background: item.active ? '#252532' : 'transparent',
              fontWeight: item.active ? 600 : 500
            }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '28px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Dashboard</h1>
          <p style={{ color: '#8b8b9f', marginBottom: '28px' }}>Intelligent Trading Dashboard</p>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '28px'
          }}>
            <div style={{
              background: '#1a1a24',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #2a2a3a'
            }}>
              <div style={{ color: '#8b8b9f', fontSize: '13px', marginBottom: '12px', textTransform: 'uppercase' }}>Portfolio Balance</div>
              <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>${balance.toLocaleString()}</div>
              <div style={{ color: '#00d084', fontSize: '14px', fontWeight: 700 }}>+2.45%</div>
            </div>
            <div style={{
              background: '#1a1a24',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #2a2a3a'
            }}>
              <div style={{ color: '#8b8b9f', fontSize: '13px', marginBottom: '12px', textTransform: 'uppercase' }}>Equity</div>
              <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>${equity.toLocaleString()}</div>
              <div style={{ color: '#8b8b9f', fontSize: '13px' }}>+${(equity - balance).toFixed(2)} unrealized</div>
            </div>
            <div style={{
              background: '#1a1a24',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #2a2a3a'
            }}>
              <div style={{ color: '#8b8b9f', fontSize: '13px', marginBottom: '12px', textTransform: 'uppercase' }}>Available Margin</div>
              <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>${(balance * 0.85).toLocaleString()}</div>
              <div style={{ color: '#8b8b9f', fontSize: '13px' }}>${(balance * 0.15).toFixed(0)} used</div>
            </div>
          </div>

          {/* Two Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Market Overview */}
              <div style={{
                background: '#1a1a24',
                borderRadius: '16px',
                border: '1px solid #2a2a3a'
              }}>
                <div style={{
                  padding: '24px',
                  borderBottom: '1px solid #2a2a3a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700 }}>🎯 Market Overview</h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: 'rgba(55,66,250,0.1)',
                    color: '#3742fa',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700
                  }}>📈 TREND — Directional bias detected</div>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{
                    display: 'flex',
                    gap: '24px',
                    marginBottom: '24px',
                    padding: '16px 20px',
                    background: '#12121a',
                    borderRadius: '12px',
                    fontSize: '14px'
                  }}>
                    <span>Status: <strong style={{ color: '#fff' }}>Active</strong></span>
                    <span>Regime: <strong style={{ color: '#fff' }}>TREND</strong></span>
                    <span>Kill Switch: <strong style={{ color: '#fff' }}>SOFT</strong></span>
                  </div>
                  {Object.entries(prices).map(([sym, price]) => (
                    <div key={sym} style={{
                      background: '#12121a',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '12px',
                      border: '1px solid #2a2a3a',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{sym}</h4>
                        <div style={{ fontSize: '28px', fontWeight: 800 }}>${price.toLocaleString()}</div>
                        <div style={{ color: '#8b8b9f', fontSize: '12px', marginTop: '4px' }}>
                          Vol: ${((price * 1000000) / 1e6).toFixed(2)}M
                        </div>
                      </div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: (changes[sym] || 0) >= 0 ? '#00d084' : '#ff4757'
                      }}>
                        {(changes[sym] || 0) >= 0 ? '+' : ''}{(changes[sym] || 0).toFixed(2)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              <div style={{
                background: '#1a1a24',
                borderRadius: '16px',
                border: '1px solid #2a2a3a'
              }}>
                <div style={{
                  padding: '24px',
                  borderBottom: '1px solid #2a2a3a'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700 }}>📊 Performance Metrics</h3>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '24px',
                  padding: '24px'
                }}>
                  <div style={{ textAlign: 'center', padding: '20px', background: '#12121a', borderRadius: '12px' }}>
                    <div style={{ color: '#8b8b9f', fontSize: '12px', marginBottom: '12px' }}>Total Return</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#00d084' }}>+2.45%</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '20px', background: '#12121a', borderRadius: '12px' }}>
                    <div style={{ color: '#8b8b9f', fontSize: '12px', marginBottom: '12px' }}>Max Drawdown</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#ff4757' }}>-3.2%</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '20px', background: '#12121a', borderRadius: '12px' }}>
                    <div style={{ color: '#8b8b9f', fontSize: '12px', marginBottom: '12px' }}>Win Rate</div>
                    <div style={{ fontSize: '28px', fontWeight: 800 }}>68.5%</div>
                  </div>
                </div>
              </div>

              {/* Demo Trading */}
              <div style={{
                background: '#1a1a24',
                borderRadius: '16px',
                border: '1px solid #2a2a3a'
              }}>
                <div style={{
                  padding: '24px',
                  borderBottom: '1px solid #2a2a3a'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700 }}>💰 Demo Trading Account</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  {/* Stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '16px',
                    marginBottom: '24px'
                  }}>
                    <div>
                      <div style={{ color: '#8b8b9f', fontSize: '12px', marginBottom: '4px' }}>Portfolio Balance</div>
                      <div style={{ fontSize: '20px', fontWeight: 700 }}>${balance.toLocaleString()}</div>
                      <div style={{ color: '#00d084', fontSize: '12px' }}>+2.45%</div>
                    </div>
                    <div>
                      <div style={{ color: '#8b8b9f', fontSize: '12px', marginBottom: '4px' }}>Equity</div>
                      <div style={{ fontSize: '20px', fontWeight: 700 }}>${equity.toLocaleString()}</div>
                      <div style={{ color: '#8b8b9f', fontSize: '12px' }}>+${(equity - balance).toFixed(2)} unrealized</div>
                    </div>
                    <div>
                      <div style={{ color: '#8b8b9f', fontSize: '12px', marginBottom: '4px' }}>Available Margin</div>
                      <div style={{ fontSize: '20px', fontWeight: 700 }}>${(balance - positions.reduce((sum, p) => sum + p.entryPrice * p.size * 0.1, 0)).toLocaleString()}</div>
                      <div style={{ color: '#8b8b9f', fontSize: '12px' }}>${positions.reduce((sum, p) => sum + p.entryPrice * p.size * 0.1, 0).toFixed(0)} used</div>
                    </div>
                  </div>

                  {/* Trading Form */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <select
                      value={symbol}
                      onChange={e => setSymbol(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        background: '#2a2a3a',
                        border: '1px solid #2a2a3a',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '15px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="BTCUSDT">BTC/USDT</option>
                      <option value="ETHUSDT">ETH/USDT</option>
                      <option value="SOLUSDT">SOL/USDT</option>
                    </select>

                    <div style={{
                      textAlign: 'center',
                      padding: '24px',
                      background: '#12121a',
                      borderRadius: '12px'
                    }}>
                      <div style={{ color: '#8b8b9f', fontSize: '13px', marginBottom: '8px' }}>Current {symbol.replace('USDT', '/USDT')} Price</div>
                      <div style={{ fontSize: '36px', fontWeight: 800 }}>${currentPrice.toLocaleString()}</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <button
                        onClick={() => setSide('LONG')}
                        style={{
                          padding: '16px',
                          border: `2px solid ${side === 'LONG' ? '#00d084' : '#2a2a3a'}`,
                          background: side === 'LONG' ? '#00d084' : '#2a2a3a',
                          color: side === 'LONG' ? '#000' : '#8b8b9f',
                          borderRadius: '12px',
                          fontWeight: 700,
                          fontSize: '15px',
                          cursor: 'pointer'
                        }}
                      >LONG</button>
                      <button
                        onClick={() => setSide('SHORT')}
                        style={{
                          padding: '16px',
                          border: `2px solid ${side === 'SHORT' ? '#ff4757' : '#2a2a3a'}`,
                          background: side === 'SHORT' ? '#ff4757' : '#2a2a3a',
                          color: '#fff',
                          borderRadius: '12px',
                          fontWeight: 700,
                          fontSize: '15px',
                          cursor: 'pointer'
                        }}
                      >SHORT</button>
                    </div>

                    <input
                      type="number"
                      step="0.01"
                      value={size}
                      onChange={e => setSize(parseFloat(e.target.value))}
                      placeholder="Size"
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        background: '#2a2a3a',
                        border: '1px solid #2a2a3a',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '15px'
                      }}
                    />

                    <button
                      onClick={handleOpen}
                      style={{
                        width: '100%',
                        padding: '18px',
                        border: 'none',
                        borderRadius: '12px',
                        background: side === 'LONG' ? '#00d084' : '#ff4757',
                        color: side === 'LONG' ? '#000' : '#fff',
                        fontWeight: 800,
                        fontSize: '16px',
                        cursor: 'pointer',
                        textTransform: 'uppercase'
                      }}
                    >
                      Open {side} Position
                    </button>
                  </div>

                  {/* Positions */}
                  <div style={{ marginTop: '24px' }}>
                    <h4 style={{ marginBottom: '16px', fontSize: '16px' }}>Open Positions ({positions.length})</h4>
                    {positions.length === 0 ? (
                      <div style={{
                        textAlign: 'center',
                        padding: '48px 24px',
                        color: '#8b8b9f',
                        background: '#12121a',
                        borderRadius: '12px',
                        border: '1px dashed #2a2a3a'
                      }}>No open positions</div>
                    ) : (
                      positions.map(pos => (
                        <div key={pos.id} style={{
                          background: '#12121a',
                          borderRadius: '12px',
                          padding: '20px',
                          marginBottom: '12px',
                          borderLeft: `4px solid ${pos.side === 'LONG' ? '#00d084' : '#ff4757'}`,
                          border: '1px solid #2a2a3a'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 800,
                                background: pos.side === 'LONG' ? '#00d084' : '#ff4757',
                                color: pos.side === 'LONG' ? '#000' : '#fff'
                              }}>{pos.side}</span>
                              <span style={{ fontWeight: 700 }}>{pos.symbol}</span>
                            </div>
                            <span style={{
                              fontWeight: 800,
                              color: pos.pnl >= 0 ? '#00d084' : '#ff4757'
                            }}>{pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}</span>
                          </div>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '16px',
                            marginBottom: '16px',
                            padding: '16px',
                            background: '#2a2a3a',
                            borderRadius: '10px'
                          }}>
                            <div>
                              <div style={{ color: '#8b8b9f', fontSize: '12px' }}>Entry</div>
                              <div style={{ fontWeight: 700 }}>${pos.entryPrice.toLocaleString()}</div>
                            </div>
                            <div>
                              <div style={{ color: '#8b8b9f', fontSize: '12px' }}>Current</div>
                              <div style={{ fontWeight: 700 }}>${pos.currentPrice.toLocaleString()}</div>
                            </div>
                            <div>
                              <div style={{ color: '#8b8b9f', fontSize: '12px' }}>Size</div>
                              <div style={{ fontWeight: 700 }}>{pos.size}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => closePosition(pos.id)}
                            style={{
                              width: '100%',
                              padding: '12px',
                              background: 'transparent',
                              border: '1px solid #2a2a3a',
                              color: '#8b8b9f',
                              borderRadius: '10px',
                              cursor: 'pointer'
                            }}
                          >Close Position</button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Trade History */}
            <div style={{
              background: '#1a1a24',
              borderRadius: '16px',
              border: '1px solid #2a2a3a',
              height: 'fit-content'
            }}>
              <div style={{
                padding: '24px',
                borderBottom: '1px solid #2a2a3a'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>📈 Trade History</h3>
              </div>
              <div style={{ padding: '24px' }}>
                {trades.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '48px 24px',
                    color: '#8b8b9f',
                    background: '#12121a',
                    borderRadius: '12px',
                    border: '1px dashed #2a2a3a'
                  }}>No trades yet</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {trades.map(trade => (
                      <div key={trade.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        background: '#12121a',
                        borderRadius: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: trade.side === 'BUY' ? 'rgba(0,208,132,0.1)' : 'rgba(255,71,87,0.1)',
                            color: trade.side === 'BUY' ? '#00d084' : '#ff4757',
                            fontWeight: 800
                          }}>{trade.side === 'BUY' ? '↑' : '↓'}</div>
                          <div>
                            <div style={{ fontWeight: 700 }}>{trade.type} {trade.symbol}</div>
                            <div style={{ color: '#8b8b9f', fontSize: '13px' }}>{trade.side} @ ${trade.price.toLocaleString()}</div>
                          </div>
                        </div>
                        {trade.pnl !== undefined && (
                          <div style={{
                            fontWeight: 800,
                            color: trade.pnl >= 0 ? '#00d084' : '#ff4757'
                          }}>{trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
