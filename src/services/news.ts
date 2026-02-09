import api from './api';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  relatedCoins: string[];
  imageUrl?: string;
}

export interface SentimentAnalysis {
  overall: 'bullish' | 'bearish' | 'neutral';
  score: number;
  volume: number;
  trending: string[];
}

class NewsService {
  async getLatestNews(coin?: string, limit = 20): Promise<NewsArticle[]> {
    const params = new URLSearchParams();
    if (coin) params.append('coin', coin);
    params.append('limit', limit.toString());
    
    const response = await api.get(`/news?${params.toString()}`);
    return response.data;
  }

  async getSentimentAnalysis(coin: string): Promise<SentimentAnalysis> {
    const response = await api.get(`/news/sentiment/${coin}`);
    return response.data;
  }

  async analyzeText(text: string): Promise<{ sentiment: string; score: number }> {
    const response = await api.post('/news/analyze', { text });
    return response.data;
  }

  // Aggregate news from multiple sources for AI analysis
  async getAggregatedNews(coins: string[]): Promise<Record<string, NewsArticle[]>> {
    const promises = coins.map((coin) => this.getLatestNews(coin, 10));
    const results = await Promise.all(promises);
    
    return coins.reduce((acc, coin, index) => {
      acc[coin] = results[index];
      return acc;
    }, {} as Record<string, NewsArticle[]>);
  }
}

export const newsService = new NewsService();
