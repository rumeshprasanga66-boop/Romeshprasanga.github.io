import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Post, SocialAccount, TeamMember } from '../types';

const STORAGE_KEYS = {
  SUPABASE_URL: 'postiz_supabase_url',
  SUPABASE_KEY: 'postiz_supabase_key',
  POSTS: 'postiz_posts_cache',
  ACCOUNTS: 'postiz_accounts_cache',
  TEAM: 'postiz_team_cache',
};

// Default mock initial accounts like in Postiz
export const INITIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: 'acc-x-1',
    platform: 'x',
    username: '@alexdeveloper',
    displayName: 'Alex Rivers ⚡',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    followerCount: 28400,
    connectedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    isActive: true,
    tier: 'creator',
  },
  {
    id: 'acc-li-1',
    platform: 'linkedin',
    username: 'alex-rivers-tech',
    displayName: 'Alex Rivers',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    followerCount: 14200,
    connectedAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    isActive: true,
    tier: 'organization',
  },
  {
    id: 'acc-bs-1',
    platform: 'bluesky',
    username: 'alexrivers.bsky.social',
    displayName: 'Alex Rivers (Bluesky)',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    followerCount: 6890,
    connectedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    isActive: true,
  },
  {
    id: 'acc-th-1',
    platform: 'threads',
    username: '@alex_builds',
    displayName: 'Alex 🛠️ Build in Public',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    followerCount: 11200,
    connectedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    isActive: true,
  },
  {
    id: 'acc-yt-1',
    platform: 'youtube',
    username: '@AlexTechStudio',
    displayName: 'Alex Rivers Code',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    followerCount: 45000,
    connectedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    isActive: true,
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    content: 'Excited to announce our open-source release! 🚀 Everything you need to schedule, analyze, and automate cross-platform social media posts with AI copilots.\n\nCheck out the demo and star the repo! #buildinpublic #opensource #nextjs',
    platforms: ['x', 'linkedin', 'bluesky'],
    media: [
      {
        id: 'med-1',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        name: 'architecture_diagram.png',
        aspectRatio: '16:9',
      }
    ],
    scheduledAt: new Date(Date.now() + 2 * 3600000).toISOString(),
    status: 'scheduled',
    authorId: 'u-1',
    authorName: 'Alex Rivers',
    tags: ['announcement', 'launch', 'tech'],
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
    aiGenerated: true,
    aiPrompt: 'Announce launch of open-source project with enthusiasm and tech hashtags',
  },
  {
    id: 'post-2',
    content: 'Why we decided to rebuild Postiz with Next.js and Supabase:\n\n1. Lightning fast serverless edge execution\n2. Real-time subscriptions for multi-user collaboration\n3. PostgreSQL row-level security out of the box\n4. Zero hassle deployment on modern clouds\n\nWhat is your stack of choice in 2026? 💬',
    platforms: ['linkedin', 'threads'],
    media: [],
    scheduledAt: new Date(Date.now() + 26 * 3600000).toISOString(),
    status: 'scheduled',
    authorId: 'u-1',
    authorName: 'Alex Rivers',
    tags: ['engineering', 'supabase', 'nextjs'],
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'post-3',
    content: '5 Lessons learned from managing 100k+ scheduled posts each month without dropping a single webhook:\n\n1. Idempotency keys are non-negotiable\n2. Exponential backoff on rate limits\n3. Circuit breakers for 3rd party APIs\n4. Real-time health monitoring\n5. Graceful fallback on token expiration',
    platforms: ['x', 'linkedin', 'threads'],
    media: [],
    scheduledAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    publishedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    status: 'published',
    authorId: 'u-1',
    authorName: 'Alex Rivers',
    tags: ['devops', 'tips'],
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    stats: {
      views: 14200,
      likes: 842,
      comments: 67,
      shares: 118,
      clicks: 430
    }
  },
  {
    id: 'post-4',
    content: 'Drafting an in-depth tutorial on building social media analytics dashboards. Covering metrics aggregation, churn prediction, and best posting times.',
    platforms: ['x'],
    media: [],
    scheduledAt: new Date(Date.now() + 72 * 3600000).toISOString(),
    status: 'draft',
    authorId: 'u-1',
    authorName: 'Alex Rivers',
    tags: ['draft', 'analytics'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'u-1',
    name: 'Alex Rivers',
    email: 'alex@postiz-demo.dev',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'active'
  },
  {
    id: 'u-2',
    name: 'Sarah Chen',
    email: 'sarah@postiz-demo.dev',
    role: 'editor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'active'
  },
  {
    id: 'u-3',
    name: 'Marcus Vance',
    email: 'marcus@postiz-demo.dev',
    role: 'viewer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'invited'
  }
];

class SupabaseSyncService {
  private client: SupabaseClient | null = null;
  private url: string = '';
  private key: string = '';
  private isConfigured: boolean = false;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedUrl = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL);
      const savedKey = localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY);
      if (savedUrl && savedKey) {
        this.configure(savedUrl, savedKey);
      }
    } catch {
      // In case localStorage is blocked
    }
  }

  public configure(url: string, key: string): boolean {
    try {
      this.url = url.trim();
      this.key = key.trim();
      if (!this.url || !this.key) {
        this.client = null;
        this.isConfigured = false;
        return false;
      }
      this.client = createClient(this.url, this.key);
      this.isConfigured = true;
      localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, this.url);
      localStorage.setItem(STORAGE_KEYS.SUPABASE_KEY, this.key);
      return true;
    } catch (err) {
      console.error('Failed to configure Supabase:', err);
      this.isConfigured = false;
      return false;
    }
  }

  public disconnect() {
    this.client = null;
    this.isConfigured = false;
    this.url = '';
    this.key = '';
    localStorage.removeItem(STORAGE_KEYS.SUPABASE_URL);
    localStorage.removeItem(STORAGE_KEYS.SUPABASE_KEY);
  }

  public getStatus() {
    return {
      isConnected: this.isConfigured,
      url: this.url,
      anonKey: this.key,
      maskedKey: this.key ? `${this.key.slice(0, 6)}...${this.key.slice(-4)}` : '',
    };
  }

  public async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.client || !this.isConfigured) {
      return { success: false, message: 'Supabase credentials not configured' };
    }
    try {
      // Check auth/health endpoint or posts table
      const { data, error } = await this.client.from('posts').select('id').limit(1);
      if (error && error.code === '42P01') {
        // Table does not exist yet, but client connects fine
        return { 
          success: true, 
          message: 'Connected to Supabase! (Table "posts" not yet migrated, using SQL migration snippet)' 
        };
      }
      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true, message: `Connected to Supabase successfully! Found ${data?.length ?? 0} post record(s).` };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Connection failed' };
    }
  }

  // Get all posts (combines Supabase remote if active, else localStorage)
  public async getPosts(): Promise<Post[]> {
    if (this.isConfigured && this.client) {
      try {
        const { data, error } = await this.client
          .from('posts')
          .select('*')
          .order('scheduled_at', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            content: d.content,
            platforms: d.platforms || [],
            media: d.media || [],
            scheduledAt: d.scheduled_at,
            publishedAt: d.published_at,
            status: d.status,
            authorId: d.author_id,
            authorName: d.author_name,
            platformConfigs: d.platform_configs,
            tags: d.tags || [],
            stats: d.stats,
            createdAt: d.created_at,
            updatedAt: d.updated_at,
            aiGenerated: d.ai_generated,
            aiPrompt: d.ai_prompt,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local store:', err);
      }
    }

    // Local fallback
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.POSTS);
      if (stored) return JSON.parse(stored);
    } catch {}
    
    // Seed initial posts
    this.saveLocalPosts(INITIAL_POSTS);
    return INITIAL_POSTS;
  }

  public async savePost(post: Post): Promise<Post> {
    const existing = await this.getPosts();
    const idx = existing.findIndex(p => p.id === post.id);
    let updated: Post[];
    if (idx >= 0) {
      updated = [...existing];
      updated[idx] = post;
    } else {
      updated = [post, ...existing];
    }
    this.saveLocalPosts(updated);

    if (this.isConfigured && this.client) {
      try {
        await this.client.from('posts').upsert({
          id: post.id,
          content: post.content,
          platforms: post.platforms,
          media: post.media,
          scheduled_at: post.scheduledAt,
          published_at: post.publishedAt,
          status: post.status,
          author_id: post.authorId,
          author_name: post.authorName,
          platform_configs: post.platformConfigs,
          tags: post.tags,
          stats: post.stats,
          ai_generated: post.aiGenerated,
          ai_prompt: post.aiPrompt,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Supabase upsert failed:', err);
      }
    }

    return post;
  }

  public async deletePost(id: string): Promise<boolean> {
    const existing = await this.getPosts();
    const updated = existing.filter(p => p.id !== id);
    this.saveLocalPosts(updated);

    if (this.isConfigured && this.client) {
      try {
        await this.client.from('posts').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete failed:', err);
      }
    }
    return true;
  }

  private saveLocalPosts(posts: Post[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    } catch {}
  }

  public getAccounts(): SocialAccount[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (stored) return JSON.parse(stored);
    } catch {}
    this.saveAccounts(INITIAL_ACCOUNTS);
    return INITIAL_ACCOUNTS;
  }

  public saveAccounts(accounts: SocialAccount[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    } catch {}
  }

  public getTeam(): TeamMember[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TEAM);
      if (stored) return JSON.parse(stored);
    } catch {}
    this.saveTeam(INITIAL_TEAM);
    return INITIAL_TEAM;
  }

  public saveTeam(team: TeamMember[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(team));
    } catch {}
  }
}

export const supabaseSync = new SupabaseSyncService();
