import React from 'react';
import { SocialPlatform, PostMedia, SocialAccount } from '../types';
import { PLATFORM_CONFIG, PlatformIcon } from './PlatformBadge';
import { Heart, MessageCircle, Repeat2, Share2, Bookmark, Send, ThumbsUp, Eye, MoreHorizontal, ExternalLink } from 'lucide-react';

interface PostPreviewCardProps {
  platform: SocialPlatform;
  content: string;
  media: PostMedia[];
  accounts: SocialAccount[];
  scheduledAt?: string;
}

export function PostPreviewCard({ platform, content, media, accounts, scheduledAt }: PostPreviewCardProps) {
  const account = accounts.find(a => a.platform === platform) || {
    displayName: 'Your Name',
    username: '@handle',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    followerCount: 1200,
  };

  const config = PLATFORM_CONFIG[platform];
  const charLimit = config.charLimit;
  const currentLength = content.length;
  const isOverLimit = currentLength > charLimit;

  // Format content with clickable-looking tags
  const renderFormattedText = (text: string) => {
    if (!text) {
      return <span className="text-slate-500 italic">No content written yet... Start typing or use AI Copilot!</span>;
    }

    const lines = text.split('\n');
    return lines.map((line, i) => (
      <span key={i} className="block min-h-[1.25rem]">
        {line.split(/(\s+)/).map((word, j) => {
          if (word.startsWith('#') || word.startsWith('@')) {
            return (
              <span key={j} className="text-blue-400 hover:underline font-medium cursor-pointer">
                {word}
              </span>
            );
          }
          if (word.startsWith('http://') || word.startsWith('https://')) {
            return (
              <span key={j} className="text-blue-400 hover:underline break-all inline-flex items-center gap-0.5 cursor-pointer">
                {word} <ExternalLink className="w-2.5 h-2.5 inline" />
              </span>
            );
          }
          return word;
        })}
      </span>
    ));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all hover:border-slate-700">
      {/* Header bar: Platform tag and character meter */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${config.bg} ${config.border} border text-white`}>
            <PlatformIcon platform={platform} className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-200">{config.name} Preview</span>
            <span className="text-[10px] text-slate-400 block">Pixel-accurate simulator</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono ${isOverLimit ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
            {currentLength}/{charLimit}
          </span>
          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                isOverLimit ? 'bg-red-500' : currentLength > charLimit * 0.85 ? 'bg-amber-400' : 'bg-indigo-500'
              }`}
              style={{ width: `${Math.min(100, (currentLength / charLimit) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Simulator Content based on platform style */}
      <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/60 font-sans text-sm">
        {/* User identity row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              src={account.avatarUrl}
              alt={account.displayName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-800"
            />
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-100 hover:underline cursor-pointer">
                  {account.displayName}
                </span>
                {platform === 'x' && (
                  <span className="text-sky-400 text-xs" title="Verified">✓</span>
                )}
                {platform === 'linkedin' && (
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1 py-0.5 rounded">1st</span>
                )}
              </div>
              <span className="text-xs text-slate-400 font-normal">
                {platform === 'linkedin' ? 'Engineering Lead & Founder • 2h • 🌐' : `${account.username} • Just now`}
              </span>
            </div>
          </div>
          <button className="text-slate-500 hover:text-slate-300 p-1">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Text Body */}
        <div className="text-slate-200 text-sm leading-relaxed mb-3 break-words whitespace-pre-line">
          {renderFormattedText(content)}
        </div>

        {/* Attached Media */}
        {media.length > 0 && (
          <div className="mb-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
            {media.map((m) => (
              <div key={m.id} className="relative group">
                {m.type === 'image' ? (
                  <img
                    src={m.url}
                    alt={m.name}
                    className="w-full max-h-72 object-cover transition duration-300 group-hover:scale-[1.01]"
                  />
                ) : (
                  <div className="h-44 bg-slate-900 flex items-center justify-center text-slate-400">
                    <span>Video attachment: {m.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Interaction Bar simulator */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-slate-400 text-xs">
          {platform === 'x' && (
            <>
              <button className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
                <MessageCircle className="w-4 h-4" /> <span>12</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                <Repeat2 className="w-4 h-4" /> <span>4</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-pink-500 transition-colors">
                <Heart className="w-4 h-4" /> <span>89</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
                <Eye className="w-4 h-4" /> <span>1.4k</span>
              </button>
              <button className="hover:text-slate-200 transition-colors">
                <Bookmark className="w-4 h-4" />
              </button>
            </>
          )}

          {platform === 'linkedin' && (
            <>
              <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                <ThumbsUp className="w-4 h-4" /> <span>Like</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                <MessageCircle className="w-4 h-4" /> <span>Comment</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                <Repeat2 className="w-4 h-4" /> <span>Repost</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                <Send className="w-4 h-4" /> <span>Send</span>
              </button>
            </>
          )}

          {['bluesky', 'threads', 'mastodon', 'facebook', 'instagram', 'tiktok', 'youtube', 'pinterest', 'reddit'].includes(platform) && (
            <>
              <button className="flex items-center gap-1.5 hover:text-rose-400 transition-colors">
                <Heart className="w-4 h-4" /> <span>Like</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
                <MessageCircle className="w-4 h-4" /> <span>Reply</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                <Share2 className="w-4 h-4" /> <span>Share</span>
              </button>
            </>
          )}
        </div>
      </div>

      {scheduledAt && (
        <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Scheduled delivery:</span>
          <span className="font-mono text-indigo-300">
            {new Date(scheduledAt).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      )}
    </div>
  );
}
