import React, { useState, useEffect } from 'react';
import { Post, SocialAccount, TeamMember } from './types';
import { supabaseSync } from './services/supabaseService';
import { ContentCalendarView } from './components/ContentCalendarView';
import { PostsListView } from './components/PostsListView';
import { AnalyticsDashboardView } from './components/AnalyticsDashboardView';
import { AccountsManagerView } from './components/AccountsManagerView';
import { TeamWorkspacesView } from './components/TeamWorkspacesView';
import { PostComposerModal } from './components/PostComposerModal';
import { SupabaseSettingsModal } from './components/SupabaseSettingsModal';
import { 
  Calendar as CalendarIcon, 
  ListFilter, 
  BarChart3, 
  Share2, 
  Users, 
  Database, 
  Plus, 
  Sparkles, 
  Radio, 
  Layers, 
  Github,
  Bell,
  Search,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'posts' | 'analytics' | 'accounts' | 'team'>('calendar');
  const [posts, setPosts] = useState<Post[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState(supabaseSync.getStatus());
  const [isLoading, setIsLoading] = useState(true);

  // Load state on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const loadedPosts = await supabaseSync.getPosts();
      const loadedAccounts = supabaseSync.getAccounts();
      const loadedTeam = supabaseSync.getTeam();
      setPosts(loadedPosts);
      setAccounts(loadedAccounts);
      setTeam(loadedTeam);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const refreshSupabaseStatus = async () => {
    setSupabaseStatus(supabaseSync.getStatus());
    const loadedPosts = await supabaseSync.getPosts();
    setPosts(loadedPosts);
  };

  const handleSavePost = async (post: Post) => {
    const saved = await supabaseSync.savePost(post);
    setPosts((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    setEditingPost(null);
  };

  const handleDeletePost = async (id: string) => {
    await supabaseSync.deletePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleOpenComposerForNew = (dateIso?: string) => {
    setEditingPost(dateIso ? {
      id: '',
      content: '',
      platforms: ['x', 'linkedin', 'bluesky'],
      media: [],
      scheduledAt: dateIso,
      status: 'scheduled',
      authorId: 'u-1',
      authorName: 'Alex Rivers',
      tags: ['buildinpublic'],
      createdAt: '',
      updatedAt: '',
    } : null);
    setIsComposerOpen(true);
  };

  const handleOpenComposerForEdit = (post: Post) => {
    setEditingPost(post);
    setIsComposerOpen(true);
  };

  // Account handlers
  const handleAddAccount = (newAcc: SocialAccount) => {
    const updated = [...accounts, newAcc];
    setAccounts(updated);
    supabaseSync.saveAccounts(updated);
  };

  const handleRemoveAccount = (id: string) => {
    const updated = accounts.filter(a => a.id !== id);
    setAccounts(updated);
    supabaseSync.saveAccounts(updated);
  };

  const handleToggleAccountActive = (id: string) => {
    const updated = accounts.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a);
    setAccounts(updated);
    supabaseSync.saveAccounts(updated);
  };

  // Team handlers
  const handleInviteMember = (newMem: TeamMember) => {
    const updated = [...team, newMem];
    setTeam(updated);
    supabaseSync.saveTeam(updated);
  };

  const handleRemoveMember = (id: string) => {
    const updated = team.filter(t => t.id !== id);
    setTeam(updated);
    supabaseSync.saveTeam(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white tracking-tight">Postiz Studio</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Next.js + Supabase Rebuild
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Open-source AI social media automation & multi-channel scheduler
              </p>
            </div>
          </div>

          {/* Action Center: Supabase Status & New Post Button */}
          <div className="flex items-center gap-3">
            
            {/* Supabase Status Pill */}
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                supabaseStatus.isConnected
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/70 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
              title="Configure Supabase Database"
            >
              <Database className={`w-3.5 h-3.5 ${supabaseStatus.isConnected ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="hidden md:inline">
                {supabaseStatus.isConnected ? 'Supabase Sync Active' : 'Supabase (Configure)'}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  supabaseStatus.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
            </button>

            {/* Create Post Main Button */}
            <button
              onClick={() => handleOpenComposerForNew()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Post</span>
            </button>

          </div>
        </div>

        {/* Sub Navigation Bar Tabs */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-1 overflow-x-auto scrollbar-none border-t border-slate-900 pt-2">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'calendar'
                ? 'bg-slate-850 text-white shadow-inner border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <CalendarIcon className="w-4 h-4 text-indigo-400" />
            <span>Calendar Scheduler</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
              {posts.filter(p => p.status === 'scheduled').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'posts'
                ? 'bg-slate-850 text-white shadow-inner border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ListFilter className="w-4 h-4 text-sky-400" />
            <span>All Posts & Drafts</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
              {posts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'analytics'
                ? 'bg-slate-850 text-white shadow-inner border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-pink-400" />
            <span>Cross-Platform Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'accounts'
                ? 'bg-slate-850 text-white shadow-inner border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>Connected Channels</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
              {accounts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'team'
                ? 'bg-slate-850 text-white shadow-inner border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>Team & Workspaces</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
              {team.length}
            </span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        
        {/* Content Views */}
        {activeTab === 'calendar' && (
          <ContentCalendarView
            posts={posts}
            onSelectPost={handleOpenComposerForEdit}
            onNewPostAtDate={handleOpenComposerForNew}
          />
        )}

        {activeTab === 'posts' && (
          <PostsListView
            posts={posts}
            accounts={accounts}
            onSelectPost={handleOpenComposerForEdit}
            onDeletePost={handleDeletePost}
            onNewPost={() => handleOpenComposerForNew()}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboardView
            posts={posts}
            accounts={accounts}
          />
        )}

        {activeTab === 'accounts' && (
          <AccountsManagerView
            accounts={accounts}
            onAddAccount={handleAddAccount}
            onRemoveAccount={handleRemoveAccount}
            onToggleAccountActive={handleToggleAccountActive}
          />
        )}

        {activeTab === 'team' && (
          <TeamWorkspacesView
            team={team}
            onInviteMember={handleInviteMember}
            onRemoveMember={handleRemoveMember}
          />
        )}
      </main>

      {/* Footer Info */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-4 px-4 sm:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>Rebuilt with Next.js (React 19), Supabase PostgreSQL, and Gemini AI.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supabase Schema & SQL</span>
            </button>

            <a
              href="https://github.com/gitroomhq/postiz-app"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Gitroom Postiz Upstream</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Composer Modal */}
      <PostComposerModal
        isOpen={isComposerOpen}
        onClose={() => {
          setIsComposerOpen(false);
          setEditingPost(null);
        }}
        onSavePost={handleSavePost}
        initialPost={editingPost}
        accounts={accounts}
      />

      {/* Supabase Settings Modal */}
      <SupabaseSettingsModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigChanged={refreshSupabaseStatus}
      />

    </div>
  );
}
