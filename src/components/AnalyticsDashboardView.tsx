import React from 'react';
import { AnalyticsMetric, Post, SocialAccount } from '../types';
import { PlatformIcon, PLATFORM_CONFIG } from './PlatformBadge';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointerClick, 
  Share2, 
  ArrowUpRight, 
  Calendar,
  Sparkles,
  BarChart3,
  Flame
} from 'lucide-react';

interface AnalyticsDashboardViewProps {
  posts: Post[];
  accounts: SocialAccount[];
}

export function AnalyticsDashboardView({ posts, accounts }: AnalyticsDashboardViewProps) {
  // Aggregate mock metrics
  const totalFollowers = accounts.reduce((acc, a) => acc + (a.followerCount || 0), 0);
  const publishedPosts = posts.filter(p => p.status === 'published');
  const totalImpressions = publishedPosts.reduce((acc, p) => acc + (p.stats?.views || 450), 0);
  const totalEngagements = publishedPosts.reduce((acc, p) => acc + (p.stats?.likes || 32) + (p.stats?.comments || 8), 0);
  const totalClicks = publishedPosts.reduce((acc, p) => acc + (p.stats?.clicks || 14), 0);

  // 7-day trend mock data
  const trendDays = [
    { day: 'Mon', views: 2400, likes: 180, clicks: 92 },
    { day: 'Tue', views: 3800, likes: 290, clicks: 140 },
    { day: 'Wed', views: 5100, likes: 420, clicks: 210 },
    { day: 'Thu', views: 4200, likes: 310, clicks: 160 },
    { day: 'Fri', views: 6800, likes: 580, clicks: 310 },
    { day: 'Sat', views: 7400, likes: 640, clicks: 390 },
    { day: 'Sun', views: 8900, likes: 790, clicks: 450 },
  ];

  const maxViews = Math.max(...trendDays.map(t => t.views));

  return (
    <div className="space-y-6">
      {/* High-level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Audience Reach</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{totalFollowers.toLocaleString()}</span>
            <span className="text-xs text-emerald-400 font-medium flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +14.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across {accounts.length} connected channels</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Monthly Impressions</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{totalImpressions.toLocaleString()}</span>
            <span className="text-xs text-emerald-400 font-medium flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +28.5%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Organic cross-platform views</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Engagements</span>
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{totalEngagements.toLocaleString()}</span>
            <span className="text-xs text-emerald-400 font-medium flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +19.1%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Likes, comments, and reposts</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Link Click-Throughs</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{totalClicks.toLocaleString()}</span>
            <span className="text-xs text-emerald-400 font-medium flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +8.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Direct referral traffic generated</p>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Visualization (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                Audience Engagement Velocity
              </h3>
              <p className="text-xs text-slate-400">Daily performance metrics across all integrated accounts</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /> Impressions
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-pink-500" /> Interactions
              </span>
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-56 flex items-end gap-3 sm:gap-6 pt-6 pb-2 border-b border-slate-800">
            {trendDays.map((item, idx) => {
              const heightPct = (item.views / maxViews) * 100;
              const likePct = (item.likes / 800) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    {/* View bar */}
                    <div
                      className="w-1/2 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-300 group-hover:brightness-125 relative"
                      style={{ height: `${heightPct}%` }}
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] text-white px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
                        {item.views}
                      </span>
                    </div>
                    {/* Likes bar */}
                    <div
                      className="w-1/2 bg-gradient-to-t from-pink-600 to-rose-400 rounded-t-lg transition-all duration-300 group-hover:brightness-125 relative"
                      style={{ height: `${likePct}%` }}
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] text-white px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
                        {item.likes}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{item.day}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Peak engagement window: <strong>Tuesday & Friday 2:00 PM - 5:00 PM EST</strong></span>
            <span className="text-indigo-400 cursor-pointer hover:underline">Download CSV report →</span>
          </div>
        </div>

        {/* Platform Share Distribution (1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Channel Breakdown</h3>
            <p className="text-xs text-slate-400 mb-4">Audience distribution across networks</p>

            <div className="space-y-3">
              {accounts.map((acc) => {
                const conf = PLATFORM_CONFIG[acc.platform];
                const pct = totalFollowers > 0 ? Math.round((acc.followerCount / totalFollowers) * 100) : 0;

                return (
                  <div key={acc.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <PlatformIcon platform={acc.platform} className="w-3.5 h-3.5" />
                        <span className="text-slate-200 font-medium">{conf.name.split(' ')[0]}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-400">{acc.followerCount.toLocaleString()}</span>
                        <span className="text-slate-200 font-semibold">{pct}%</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Insights Box */}
          <div className="mt-6 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
            <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
              AI Optimal Dispatch Recommendation
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Your tech-related LinkedIn posts see <strong>2.8x higher comment density</strong> when published at 8:30 AM local time with 2 code snippets or diagrams.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
