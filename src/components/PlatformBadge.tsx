import React from 'react';
import { SocialPlatform } from '../types';

interface PlatformBadgeProps {
  platform: SocialPlatform;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const PLATFORM_CONFIG: Record<
  SocialPlatform, 
  { 
    name: string; 
    color: string; 
    bg: string; 
    border: string;
    charLimit: number; 
    iconColor: string;
    description: string;
  }
> = {
  x: {
    name: 'X (Twitter)',
    color: '#000000',
    bg: 'bg-neutral-900',
    border: 'border-neutral-700',
    charLimit: 280,
    iconColor: 'text-white',
    description: 'Microblogging & viral discussions',
  },
  linkedin: {
    name: 'LinkedIn',
    color: '#0A66C2',
    bg: 'bg-blue-950/60',
    border: 'border-blue-700/60',
    charLimit: 3000,
    iconColor: 'text-blue-400',
    description: 'Professional network & thought leadership',
  },
  bluesky: {
    name: 'Bluesky',
    color: '#0085FF',
    bg: 'bg-sky-950/60',
    border: 'border-sky-600/60',
    charLimit: 300,
    iconColor: 'text-sky-400',
    description: 'Decentralized social AT protocol',
  },
  threads: {
    name: 'Threads',
    color: '#101010',
    bg: 'bg-neutral-900',
    border: 'border-neutral-700',
    charLimit: 500,
    iconColor: 'text-neutral-200',
    description: 'Conversational community updates',
  },
  instagram: {
    name: 'Instagram',
    color: '#E1306C',
    bg: 'bg-pink-950/60',
    border: 'border-pink-600/60',
    charLimit: 2200,
    iconColor: 'text-pink-400',
    description: 'Visual stories, reels, & carousels',
  },
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    bg: 'bg-blue-950/50',
    border: 'border-blue-600/50',
    charLimit: 63206,
    iconColor: 'text-blue-400',
    description: 'Pages, community groups, & events',
  },
  tiktok: {
    name: 'TikTok',
    color: '#000000',
    bg: 'bg-neutral-900',
    border: 'border-neutral-700',
    charLimit: 2200,
    iconColor: 'text-teal-400',
    description: 'Short-form viral vertical video',
  },
  youtube: {
    name: 'YouTube',
    color: '#FF0000',
    bg: 'bg-red-950/60',
    border: 'border-red-700/60',
    charLimit: 5000,
    iconColor: 'text-red-400',
    description: 'Community posts & shorts automation',
  },
  pinterest: {
    name: 'Pinterest',
    color: '#E60023',
    bg: 'bg-rose-950/60',
    border: 'border-rose-700/60',
    charLimit: 500,
    iconColor: 'text-rose-400',
    description: 'Idea discovery & aesthetic pinboards',
  },
  reddit: {
    name: 'Reddit',
    color: '#FF4500',
    bg: 'bg-orange-950/60',
    border: 'border-orange-700/60',
    charLimit: 40000,
    iconColor: 'text-orange-400',
    description: 'Niche subreddits & AMA discussions',
  },
  mastodon: {
    name: 'Mastodon',
    color: '#6364FF',
    bg: 'bg-indigo-950/60',
    border: 'border-indigo-600/60',
    charLimit: 500,
    iconColor: 'text-indigo-400',
    description: 'Federated open-source Fediverse',
  },
};

export function PlatformIcon({ platform, className = 'w-4 h-4' }: { platform: SocialPlatform; className?: string }) {
  switch (platform) {
    case 'x':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      );
    case 'bluesky':
      return (
        <svg className={className} viewBox="0 0 568 501" fill="currentColor">
          <path d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.704 122.846-172.63-30.82-189.333-64.887-16.703 34.067-69.629 187.733-189.333 64.887-63.111-64.76-33.889-129.52 80.986-149.07-65.72 11.185-139.6-7.295-159.875-79.748C8.945 203.66 0 75.293 0 57.947 0-28.906 76.134-1.612 123.121 33.664Z" />
        </svg>
      );
    case 'threads':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 5.522 4.477 10 10 10 3.738 0 6.994-2.05 8.7-5.086l-1.745-.989C17.485 18.528 14.928 20 12 20c-4.411 0-8-3.589-8-8s3.589-8 8-8c4.321 0 7.842 3.42 7.994 7.708l.006.292v1.5c0 1.378-1.122 2.5-2.5 2.5s-2.5-1.122-2.5-2.5V11c0-2.206-1.794-4-4-4s-4 1.794-4 4 1.794 4 4 4c1.17 0 2.227-.506 2.961-1.311.666 1.348 2.057 2.311 3.539 2.311 2.481 0 4.5-2.019 4.5-4.5v-1.5C22 5.617 17.523 2 12 2zm0 11c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.7 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.16 1.19 2.09 2.34 2.3 1.15.22 2.37-.2 3.12-1.06.49-.55.77-1.27.8-2.01.03-3.64.01-7.28.01-10.92V.02z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case 'pinterest':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.373-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      );
    case 'reddit':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.56 12 8 12.56 8 13.25c0 .688.56 1.25 1.25 1.25.688 0 1.25-.562 1.25-1.25 0-.69-.562-1.25-1.25-1.25zm5.5 0c-.688 0-1.25.56-1.25 1.25 0 .688.562 1.25 1.25 1.25.69 0 1.25-.562 1.25-1.25 0-.69-.56-1.25-1.25-1.25zm-5.465 4.41c-.09 0-.17.03-.23.09-.12.12-.12.31 0 .43 1.15 1.15 3.32 1.15 4.47 0 .12-.12.12-.31 0-.43-.12-.12-.31-.12-.43 0-.91.91-2.7.91-3.61 0-.06-.06-.14-.09-.2-.09z" />
        </svg>
      );
    case 'mastodon':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.244 15.748.2 12.001.2c-3.748 0-5.51.044-5.964.109C3.35.703 1.083 2.735.733 5.313.366 8.016.333 11.232.333 11.232s.033 3.216.4 5.92c.35 2.577 2.617 4.61 5.304 5.003.856.126 2.052.19 3.593.204 1.83.017 3.38-.28 3.38-.28l-.078-1.748s-1.428.432-3.03.432c-1.637 0-2.072-.68-2.18-.89a3.89 3.89 0 0 1-.225-1.04c1.173.284 2.378.43 3.59.434 2.213 0 4.354-.257 6.467-.841 1.764-.488 3.097-1.71 3.528-3.498.497-2.062.585-4.887.585-4.887s.033-3.216-.4-5.92zM19.124 14.5h-2.61v-6.32c0-1.378-.584-2.077-1.753-2.077-1.294 0-1.942.836-1.942 2.508V11.8h-2.164V8.611c0-1.672-.648-2.508-1.942-2.508-1.169 0-1.753.699-1.753 2.077V14.5H4.35V8.188c0-1.379.35-2.477 1.05-3.294.721-.837 1.666-1.266 2.835-1.266 1.353 0 2.392.52 3.118 1.56L12 6.223l.647-1.035c.726-1.04 1.765-1.56 3.118-1.56 1.169 0 2.114.429 2.835 1.266.7.817 1.05 1.915 1.05 3.294V14.5z" />
        </svg>
      );
    default:
      return null;
  }
}

export function PlatformBadge({ platform, size = 'md', showLabel = true }: PlatformBadgeProps) {
  const conf = PLATFORM_CONFIG[platform];
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5 font-medium',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-4.5 h-4.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg border transition-all ${conf.bg} ${conf.border} ${conf.iconColor} ${sizeClasses[size]}`}
    >
      <PlatformIcon platform={platform} className={iconSizes[size]} />
      {showLabel && <span className="font-medium text-slate-200">{conf.name}</span>}
    </span>
  );
}
