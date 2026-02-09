import { useState, useEffect } from 'react';
import { 
  Newspaper, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock,
  ExternalLink,
  Filter,
  Search,
  BarChart3,
  Brain
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  category: string;
  summary: string;
  relatedCoins: string[];
}

interface SentimentData {
  overall: number;
  positive: number;
  negative: number;
  neutral: number;
}

export function NewsAnalysis() {
  const [news] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Bitcoin ETF Sees Record Inflows as Institutional Adoption Accelerates',
      source: 'CoinDesk',
      timestamp: '2 hours ago',
      sentiment: 'positive',
      impact: 'high',
      category: 'Institutional',
      summary: 'Major financial institutions continue to accumulate Bitcoin through ETFs, with daily inflows reaching $500M.',
      relatedCoins: ['BTC'],
    },
    {
      id: '2',
      title: 'Ethereum Network Upgrade Delayed Due to Technical Issues',
      source: 'The Block',
      timestamp: '4 hours ago',
      sentiment: 'negative',
      impact: 'medium',
      category: 'Technology',
      summary: 'The much-anticipated Dencun upgrade has been postponed by two weeks as developers address final concerns.',
      relatedCoins: ['ETH'],
    },
    {
      id: '3',
      title: 'Solana DeFi Ecosystem Reaches New TVL Milestone',
      source: 'DeFi Llama',
      timestamp: '6 hours ago',
      sentiment: 'positive',
      impact: 'medium',
      category: 'DeFi',
      summary: 'Total Value Locked on Solana surpasses $5 billion, marking a significant recovery from 2022 lows.',
      relatedCoins: ['SOL'],
    },
    {
      id: '4',
      title: 'Regulatory Concerns Mount as SEC Reviews Major Exchanges',
      source: 'Reuters',
      timestamp: '8 hours ago',
      sentiment: 'negative',
      impact: 'high',
      category: 'Regulation',
      summary: 'The SEC has intensified its scrutiny of cryptocurrency exchanges, requesting additional compliance documentation.',
      relatedCoins: ['BTC', 'ETH', 'SOL'],
    },
    {
      id: '5',
      title: 'Major Payment Processor Announces Crypto Integration',
      source: 'Bloomberg',
      timestamp: '12 hours ago',
      sentiment: 'positive',
      impact: 'high',
      category: 'Adoption',
      summary: 'A leading payment processor will enable crypto payments for millions of merchants worldwide.',
      relatedCoins: ['BTC', 'ETH'],
    },
    {
      id: '6',
      title: 'Bitcoin Mining Difficulty Adjusts Upward by 5.2%',
      source: 'CryptoSlate',
      timestamp: '14 hours ago',
      sentiment: 'neutral',
      impact: 'low',
      category: 'Mining',
      summary: 'Network difficulty reaches new all-time high as more miners join the network.',
      relatedCoins: ['BTC'],
    },
  ]);

  const [sentiment, setSentiment] = useState<SentimentData>({
    overall: 62,
    positive: 45,
    negative: 25,
    neutral: 30,
  });

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = news.filter(item => {
    if (filter !== 'all' && item.sentiment !== filter) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Simulate sentiment updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSentiment(prev => ({
        ...prev,
        overall: Math.max(0, Math.min(100, prev.overall + (Math.random() - 0.5) * 5)),
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#f6f6f6] flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-[#d0ff59]" />
          Crypto News Analysis
        </h2>
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-[#d0ff59]" />
          <span className="text-sm text-[#888888]">AI-Powered Sentiment Analysis</span>
        </div>
      </div>

      {/* Sentiment Overview */}
      <div className="grid grid-cols-4 gap-4">
        <SentimentCard
          title="Overall Sentiment"
          value={`${sentiment.overall.toFixed(0)}%`}
          subValue={sentiment.overall >= 60 ? 'Bullish' : sentiment.overall >= 40 ? 'Neutral' : 'Bearish'}
          icon={BarChart3}
          color={sentiment.overall >= 60 ? '[#d0ff59]' : sentiment.overall >= 40 ? 'yellow-500' : 'red-500'}
        />
        <SentimentCard
          title="Positive News"
          value={`${sentiment.positive}%`}
          subValue="Bullish indicators"
          icon={TrendingUp}
          color="[#d0ff59]"
        />
        <SentimentCard
          title="Negative News"
          value={`${sentiment.negative}%`}
          subValue="Bearish indicators"
          icon={TrendingDown}
          color="red-500"
        />
        <SentimentCard
          title="Neutral News"
          value={`${sentiment.neutral}%`}
          subValue="No clear direction"
          icon={Minus}
          color="[888888]"
        />
      </div>

      {/* Sentiment Bar */}
      <div className="bg-[#0b0b0b] border border-[#222222] rounded-2xl p-6">
        <h3 className="text-sm font-medium text-[#888888] mb-4">Sentiment Distribution</h3>
        <div className="flex h-4 rounded-full overflow-hidden">
          <div 
            className="bg-[#d0ff59]"
            style={{ width: `${sentiment.positive}%` }}
          />
          <div 
            className="bg-yellow-500"
            style={{ width: `${sentiment.neutral}%` }}
          />
          <div 
            className="bg-red-500"
            style={{ width: `${sentiment.negative}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-[#d0ff59]">Positive ({sentiment.positive}%)</span>
          <span className="text-yellow-500">Neutral ({sentiment.neutral}%)</span>
          <span className="text-red-500">Negative ({sentiment.negative}%)</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0b0b0b] border border-[#222222] rounded-xl pl-10 pr-4 py-2.5 text-[#f6f6f6] text-sm placeholder:text-[#888888]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#888888]" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#0b0b0b] border border-[#222222] rounded-xl px-4 py-2.5 text-[#f6f6f6] text-sm"
          >
            <option value="all">All Sentiment</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
      </div>

      {/* News Feed */}
      <div className="space-y-4">
        {filteredNews.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
    </div>
  );
}

interface NewsCardProps {
  news: NewsItem;
}

function NewsCard({ news }: NewsCardProps) {
  return (
    <div className="bg-[#0b0b0b] border border-[#222222] rounded-2xl p-6 hover:border-[#333333] transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className={cn(
            'px-2 py-1 rounded-lg text-xs font-medium',
            news.sentiment === 'positive' && 'bg-[#d0ff59]/20 text-[#d0ff59]',
            news.sentiment === 'negative' && 'bg-red-500/20 text-red-500',
            news.sentiment === 'neutral' && 'bg-[#888888]/20 text-[#888888]'
          )}>
            {news.sentiment === 'positive' && <TrendingUp className="w-3 h-3 inline mr-1" />}
            {news.sentiment === 'negative' && <TrendingDown className="w-3 h-3 inline mr-1" />}
            {news.sentiment === 'neutral' && <Minus className="w-3 h-3 inline mr-1" />}
            {news.sentiment.charAt(0).toUpperCase() + news.sentiment.slice(1)}
          </span>
          <span className={cn(
            'px-2 py-1 rounded-lg text-xs font-medium',
            news.impact === 'high' && 'bg-red-500/20 text-red-500',
            news.impact === 'medium' && 'bg-yellow-500/20 text-yellow-500',
            news.impact === 'low' && 'bg-[#888888]/20 text-[#888888]'
          )}>
            {news.impact === 'high' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
            {news.impact} Impact
          </span>
          <span className="text-xs text-[#888888]">{news.category}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#888888]">
          <Clock className="w-3 h-3" />
          {news.timestamp}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-[#f6f6f6] mb-2">{news.title}</h3>
      <p className="text-sm text-[#888888] mb-4">{news.summary}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#888888]">Source: {news.source}</span>
          <span className="text-[#444444]">|</span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-[#888888]">Related:</span>
            {news.relatedCoins.map((coin, index) => (
              <span key={coin} className="text-xs text-[#d0ff59]">
                {coin}{index < news.relatedCoins.length - 1 && ','}
              </span>
            ))}
          </div>
        </div>
        <button className="flex items-center gap-1 text-xs text-[#d0ff59] hover:underline">
          Read More
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

interface SentimentCardProps {
  title: string;
  value: string;
  subValue: string;
  icon: React.ElementType;
  color: string;
}

function SentimentCard({ title, value, subValue, icon: Icon, color }: SentimentCardProps) {
  return (
    <div className="bg-[#0b0b0b] border border-[#222222] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#888888]">{title}</span>
        <Icon className={`w-4 h-4 text-${color}`} />
      </div>
      <p className={`text-xl font-bold text-${color}`}>{value}</p>
      <p className="text-xs text-[#888888] mt-1">{subValue}</p>
    </div>
  );
}

function Minus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
