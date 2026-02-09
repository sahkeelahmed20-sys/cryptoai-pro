import { useState, useEffect } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Network, 
  Globe, 
  Server, 
  Zap,
  Activity,
  Shield,
  Database
} from 'lucide-react';

interface NodeData {
  timestamp: string;
  totalNodes: number;
  reachableNodes: number;
  torNodes: number;
  avgConnections: number;
  hashRate: number;
  difficulty: number;
}

interface NetworkStats {
  totalNodes: number;
  reachableNodes: number;
  countries: number;
  torNodes: number;
  avgBlockTime: number;
  hashRate: number;
  difficulty: number;
  mempoolSize: number;
}

export function BitnodesAnalysis() {
  const [stats, setStats] = useState<NetworkStats>({
    totalNodes: 18472,
    reachableNodes: 15234,
    countries: 98,
    torNodes: 2847,
    avgBlockTime: 9.8,
    hashRate: 485.2,
    difficulty: 72.8,
    mempoolSize: 84732,
  });

  const [nodeHistory, setNodeHistory] = useState<NodeData[]>([]);

  // Generate simulated node history
  useEffect(() => {
    const generateData = () => {
      const data: NodeData[] = [];
      let nodes = 18000;
      const now = new Date();
      
      for (let i = 30; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 86400000);
        nodes = nodes + Math.floor((Math.random() - 0.5) * 200);
        data.push({
          timestamp: time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          totalNodes: nodes,
          reachableNodes: Math.floor(nodes * 0.82),
          torNodes: Math.floor(nodes * 0.15),
          avgConnections: 8 + Math.random() * 4,
          hashRate: 480 + Math.random() * 20,
          difficulty: 72 + Math.random() * 2,
        });
      }
      return data;
    };

    setNodeHistory(generateData());

    // Simulate live updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalNodes: prev.totalNodes + Math.floor((Math.random() - 0.5) * 10),
        hashRate: prev.hashRate + (Math.random() - 0.5) * 5,
        mempoolSize: Math.max(0, prev.mempoolSize + Math.floor((Math.random() - 0.5) * 1000)),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const topCountries = [
    { name: 'United States', nodes: 3421, percentage: 22.5 },
    { name: 'Germany', nodes: 1856, percentage: 12.2 },
    { name: 'France', nodes: 1243, percentage: 8.2 },
    { name: 'Netherlands', nodes: 987, percentage: 6.5 },
    { name: 'Canada', nodes: 756, percentage: 5.0 },
  ];

  const clientDistribution = [
    { name: 'Bitcoin Core', percentage: 94.2 },
    { name: 'Bitcoin Knots', percentage: 3.1 },
    { name: 'Other', percentage: 2.7 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#f6f6f6] flex items-center gap-2">
          <Network className="w-5 h-5 text-[#d0ff59]" />
          Bitcoin Network Analysis
        </h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#d0ff59]/10 rounded-lg border border-[#d0ff59]/30">
          <Activity className="w-4 h-4 text-[#d0ff59] animate-pulse" />
          <span className="text-sm text-[#d0ff59]">Live Network Data</span>
        </div>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Nodes"
          value={stats.totalNodes.toLocaleString()}
          subValue="+2.4% this week"
          icon={Server}
          positive
        />
        <StatCard
          title="Reachable Nodes"
          value={stats.reachableNodes.toLocaleString()}
          subValue={`${((stats.reachableNodes / stats.totalNodes) * 100).toFixed(1)}% of total`}
          icon={Globe}
        />
        <StatCard
          title="Hash Rate"
          value={`${stats.hashRate.toFixed(1)} EH/s`}
          subValue="Network security"
          icon={Zap}
        />
        <StatCard
          title="Mempool Size"
          value={`${(stats.mempoolSize / 1000).toFixed(1)} MB`}
          subValue="Pending transactions"
          icon={Database}
        />
      </div>

      {/* Node History Chart */}
      <div className="bg-[#0b0b0b] border border-[#222222] rounded-2xl p-6">
        <h3 className="text-sm font-medium text-[#888888] mb-4">Node Count History (30 Days)</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={nodeHistory}>
              <defs>
                <linearGradient id="colorNodes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d0ff59" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#d0ff59" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#444444" 
                tick={{ fill: '#888888', fontSize: 10 }}
                tickLine={false}
              />
              <YAxis 
                stroke="#444444"
                tick={{ fill: '#888888', fontSize: 10 }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b0b0b',
                  border: '1px solid #222222',
                  borderRadius: '12px',
                }}
                labelStyle={{ color: '#888888' }}
                itemStyle={{ color: '#d0ff59' }}
              />
              <Area
                type="monotone"
                dataKey="totalNodes"
                stroke="#d0ff59"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorNodes)"
                name="Total Nodes"
              />
              <Area
                type="monotone"
                dataKey="reachableNodes"
                stroke="#888888"
                strokeWidth={1}
                fillOpacity={0}
                fill="transparent"
                name="Reachable Nodes"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <div className="bg-[#0b0b0b] border border-[#222222] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-[#d0ff59]" />
            <h3 className="text-sm font-medium text-[#888888]">Geographic Distribution</h3>
          </div>
          
          <div className="space-y-3">
            {topCountries.map((country, index) => (
              <div key={country.name} className="flex items-center gap-4">
                <span className="w-6 text-sm text-[#888888]">{index + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-[#cccccc]">{country.name}</span>
                    <span className="text-sm text-[#888888]">{country.nodes.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                    <div 
                      className="bg-[#d0ff59] h-2 rounded-full transition-all"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-[#888888] w-12 text-right">{country.percentage}%</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[#222222]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#888888]">Total Countries</span>
              <span className="text-lg font-bold text-[#f6f6f6]">{stats.countries}</span>
            </div>
          </div>
        </div>

        {/* Client Distribution */}
        <div className="bg-[#0b0b0b] border border-[#222222] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-4 h-4 text-[#d0ff59]" />
            <h3 className="text-sm font-medium text-[#888888]">Client Distribution</h3>
          </div>
          
          <div className="space-y-4">
            {clientDistribution.map((client) => (
              <div key={client.name} className="p-4 bg-[#1a1a1a] rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-[#f6f6f6]">{client.name}</span>
                  <span className="text-sm text-[#d0ff59]">{client.percentage}%</span>
                </div>
                <div className="w-full bg-[#222222] rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-[#d0ff59] to-[#a8cc47] h-3 rounded-full transition-all"
                    style={{ width: `${client.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 bg-[#1a1a1a] rounded-xl text-center">
              <p className="text-xs text-[#888888]">Tor Nodes</p>
              <p className="text-lg font-bold text-[#f6f6f6]">{stats.torNodes.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-[#1a1a1a] rounded-xl text-center">
              <p className="text-xs text-[#888888]">Avg Block Time</p>
              <p className="text-lg font-bold text-[#f6f6f6]">{stats.avgBlockTime.toFixed(1)}s</p>
            </div>
          </div>
        </div>
      </div>

      {/* Network Health */}
      <div className="bg-[#0b0b0b] border border-[#222222] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-[#d0ff59]" />
          <h3 className="text-sm font-medium text-[#888888]">Network Health Indicators</h3>
        </div>
        
        <div className="grid grid-cols-4 gap-6">
          <HealthIndicator
            label="Network Difficulty"
            value={`${stats.difficulty.toFixed(1)}T`}
            status="good"
            description="Mining difficulty at optimal level"
          />
          <HealthIndicator
            label="Node Diversity"
            value="Excellent"
            status="good"
            description="Wide geographic distribution"
          />
          <HealthIndicator
            label="Protocol Version"
            value="70016"
            status="good"
            description="Latest protocol version"
          />
          <HealthIndicator
            label="Network Latency"
            value="45ms"
            status="warning"
            description="Slightly elevated latency"
          />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subValue: string;
  icon: React.ElementType;
  positive?: boolean;
}

function StatCard({ title, value, subValue, icon: Icon, positive }: StatCardProps) {
  return (
    <div className="bg-[#0b0b0b] border border-[#222222] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#888888]">{title}</span>
        <Icon className="w-4 h-4 text-[#d0ff59]" />
      </div>
      <p className="text-xl font-bold text-[#f6f6f6]">{value}</p>
      <p className={cn(
        'text-xs mt-1',
        positive ? 'text-[#d0ff59]' : 'text-[#888888]'
      )}>
        {subValue}
      </p>
    </div>
  );
}

interface HealthIndicatorProps {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

function HealthIndicator({ label, value, status, description }: HealthIndicatorProps) {
  return (
    <div className="text-center">
      <p className="text-xs text-[#888888] mb-1">{label}</p>
      <div className="flex items-center justify-center gap-2 mb-1">
        <div className={cn(
          'w-2 h-2 rounded-full',
          status === 'good' && 'bg-[#d0ff59]',
          status === 'warning' && 'bg-yellow-500',
          status === 'critical' && 'bg-red-500'
        )} />
        <p className={cn(
          'text-lg font-bold',
          status === 'good' && 'text-[#d0ff59]',
          status === 'warning' && 'text-yellow-500',
          status === 'critical' && 'text-red-500'
        )}>
          {value}
        </p>
      </div>
      <p className="text-xs text-[#888888]">{description}</p>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
