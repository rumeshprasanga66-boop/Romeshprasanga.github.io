export type SocialPlatform = 
  | 'x' 
  | 'linkedin' 
  | 'bluesky' 
  | 'threads' 
  | 'instagram' 
  | 'facebook' 
  | 'tiktok' 
  | 'youtube' 
  | 'pinterest' 
  | 'reddit' 
  | 'mastodon';

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed' | 'queued';

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  username: string;
  displayName: string;
  avatarUrl: string;
  followerCount: number;
  connectedAt: string;
  isActive: boolean;
  tier?: 'personal' | 'creator' | 'organization';
}

export interface PostMedia {
  id: string;
  url: string;
  type: 'image' | 'video' | 'gif';
  name: string;
  size?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:5';
}

export interface PlatformConfig {
  firstComment?: string;
  redditSubreddit?: string;
  redditTitle?: string;
  pinterestBoard?: string;
  pinterestLink?: string;
  youtubePrivacy?: 'public' | 'unlisted' | 'private';
  youtubeTitle?: string;
  threadsReplySettings?: 'everyone' | 'accounts_you_follow' | 'mentioned_only';
  tags?: string[];
}

export interface Post {
  id: string;
  content: string;
  platforms: SocialPlatform[];
  media: PostMedia[];
  scheduledAt: string; // ISO string
  publishedAt?: string;
  status: PostStatus;
  authorId: string;
  authorName: string;
  platformConfigs?: Record<SocialPlatform, PlatformConfig>;
  stats?: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    clicks?: number;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
  aiGenerated?: boolean;
  aiPrompt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatar: string;
  status: 'active' | 'invited';
}

export interface AnalyticsMetric {
  date: string;
  impressions: number;
  engagements: number;
  clicks: number;
  followersGained: number;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  tablePrefix?: string;
}
