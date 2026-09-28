import React, { useState } from 'react';
import { Post, SocialAccount } from '../types';
import { PlatformIcon, PLATFORM_CONFIG } from './PlatformBadge';
import { 
  Sparkles, 
  Trash2, 
  Edit3, 
  Clock, 
  CheckCircle, 
  Calendar, 
  ExternalLink, 
  Tag, 
  FileText,
  Search,
  Filter,
  Eye,
  Heart,
  MessageCircle,
  Repeat2
} from 'lucide-react';

interface PostsListViewProps {
  posts: Post[];
  accounts: SocialAccount[];
  onSelectPost: (post: Post) => void;
  onDeletePost: (id: string) => void;
  onNewPost: () => void;
}

export function PostsListView({ posts, accounts, onSelectPost, onDeletePost, onNewPost }: PostsListViewProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter((p) => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inContent = p.content.toLowerCase().includes(q);
      const inTags = p.tags.some(t => t.toLowerCase().includes(q));
      return inContent || inTags;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'scheduled', 'published', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search content or tags..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={onNewPost}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
          >
            + Create
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.map((post) => {
          const statusBadge = {
            published: { bg: 'bg-emerald-950/60', text: 'text-emerald-400', border: 'border-emerald-600/40', label: 'Published' },
            scheduled: { bg: 'bg-indigo-950/60', text: 'text-indigo-400', border: 'border-indigo-600/40', label: 'Scheduled' },
            draft: { bg: 'bg-slate-800/60', text: 'text-slate-400', border: 'border-slate-700/40', label: 'Draft' },
            failed: { bg: 'bg-red-950/60', text: 'text-red-400', border: 'border-red-600/40', label: 'Failed' },
            queued: { bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-600/40', label: 'In Queue' },
          }[post.status];

          return (
            <div
              key={post.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header: Platform icons, status, and actions */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    {post.platforms.map((p) => {
                      const conf = PLATFORM_CONFIG[p];
                      return (
                        <div
                          key={p}
                          title={conf.name}
                          className={`p-1.5 rounded-lg ${conf.bg} ${conf.border} border text-white`}
                        >
                          <PlatformIcon platform={p} className="w-3.5 h-3.5" />
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                    >
                      {statusBadge.label}
                    </span>
                    
                    <button
                      onClick={() => onSelectPost(post)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                      title="Edit Post"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    
                    <button
                      onClick={() => onDeletePost(post.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content snippet */}
                <p className="text-slate-200 text-xs sm:text-sm line-clamp-4 leading-relaxed mb-3 whitespace-pre-line">
                  {post.content}
                </p>

                {/* Media thumbnail if present */}
                {post.media.length > 0 && (
                  <div className="mb-3 rounded-xl overflow-hidden border border-slate-800 max-h-36 bg-slate-950">
                    <img
                      src={post.media[0].url}
                      alt={post.media[0].name}
                      className="w-full h-36 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Footer info: tags, timestamp, and stats */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((t) => (
                      <span key={t} className="text-[10px] bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded-md border border-slate-800">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span>
                      {new Date(post.scheduledAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {post.status === 'published' && post.stats && (
                    <div className="flex items-center gap-3 text-[11px] text-slate-300">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-sky-400" /> {post.stats.views?.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-pink-400" /> {post.stats.likes?.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {post.aiGenerated && (
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/20 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> AI Crafted
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredPosts.length === 0 && (
          <div className="col-span-full py-12 text-center bg-slate-900/50 border border-slate-800/80 rounded-2xl">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-medium">No posts match this filter</p>
            <p className="text-xs text-slate-500 mt-1">Create a new post or adjust your search filter</p>
            <button
              onClick={onNewPost}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5"
            >
              + Create New Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
