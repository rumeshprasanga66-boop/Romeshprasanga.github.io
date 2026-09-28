import React, { useState } from 'react';
import { SocialPlatform, Post, PostMedia, SocialAccount } from '../types';
import { PLATFORM_CONFIG, PlatformIcon } from './PlatformBadge';
import { PostPreviewCard } from './PostPreviewCard';
import { generateSocialPost, improvePostContent, generateHashtags } from '../services/aiService';
import { 
  Sparkles, 
  Send, 
  Calendar, 
  Image as ImageIcon, 
  Trash2, 
  Wand2, 
  X, 
  Clock, 
  Tag, 
  Layers,
  ChevronDown,
  Loader2,
  Check,
  Flame,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PostComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePost: (post: Post) => void;
  initialPost?: Post | null;
  accounts: SocialAccount[];
}

const STOCK_IMAGES: Array<{ url: string; label: string }> = [
  {
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    label: 'Modern Tech Abstract'
  },
  {
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    label: 'Analytics Dashboard'
  },
  {
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    label: 'Engineering Team Collab'
  },
  {
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    label: 'Product Growth Metrics'
  }
];

export function PostComposerModal({
  isOpen,
  onClose,
  onSavePost,
  initialPost,
  accounts,
}: PostComposerModalProps) {
  if (!isOpen) return null;

  const [content, setContent] = useState(initialPost?.content || '');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(
    initialPost?.platforms || ['x', 'linkedin', 'bluesky']
  );
  const [media, setMedia] = useState<PostMedia[]>(initialPost?.media || []);
  const [scheduledAt, setScheduledAt] = useState<string>(
    initialPost?.scheduledAt || new Date(Date.now() + 2 * 3600000).toISOString().slice(0, 16)
  );
  const [tags, setTags] = useState<string[]>(initialPost?.tags || ['growth', 'tech']);
  const [newTagInput, setNewTagInput] = useState('');
  
  // AI Copilot state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTone, setAiTone] = useState<'engaging' | 'professional' | 'casual' | 'storytelling'>('engaging');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<SocialPlatform>(selectedPlatforms[0] || 'x');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePlatform = (p: SocialPlatform) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length === 1) return; // Keep at least one
      const updated = selectedPlatforms.filter((item) => item !== p);
      setSelectedPlatforms(updated);
      if (activePreviewTab === p && updated.length > 0) {
        setActivePreviewTab(updated[0]);
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleGenerateWithAi = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);
    try {
      const generated = await generateSocialPost({
        prompt: aiPrompt,
        platforms: selectedPlatforms,
        tone: aiTone,
        includeHashtags: true,
        includeEmoji: true,
      });
      setContent(generated);
      setShowAiPanel(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleAiPolish = async (instruction: 'hook' | 'shorten' | 'expand' | 'fix_grammar' | 'viral') => {
    if (!content.trim()) return;
    setIsGeneratingAi(true);
    try {
      const improved = await improvePostContent(content, instruction);
      setContent(improved);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleAddHashtags = async () => {
    if (!content.trim()) return;
    setIsGeneratingAi(true);
    try {
      const suggestions = await generateHashtags(content, selectedPlatforms[0] || 'x');
      const uniqueNew = suggestions.filter(s => !tags.includes(s.replace('#', '')));
      setTags([...tags, ...uniqueNew.map(s => s.replace('#', ''))]);
      setContent(prev => `${prev}\n\n${suggestions.join(' ')}`);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      const clean = newTagInput.trim().replace(/^#/, '');
      if (!tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setNewTagInput('');
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter(tag => tag !== t));
  };

  const handleAttachStockImage = (img: { url: string; label: string }) => {
    const newMedia: PostMedia = {
      id: `med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      url: img.url,
      type: 'image',
      name: img.label,
      aspectRatio: '16:9'
    };
    setMedia([...media, newMedia]);
    setShowMediaPicker(false);
  };

  const handleRemoveMedia = (id: string) => {
    setMedia(media.filter(m => m.id !== id));
  };

  const handleSave = (status: 'scheduled' | 'draft' | 'published') => {
    if (!content.trim()) return;
    setIsSubmitting(true);

    const postData: Post = {
      id: initialPost?.id || `post-${Date.now()}`,
      content: content.trim(),
      platforms: selectedPlatforms,
      media,
      scheduledAt: new Date(scheduledAt).toISOString(),
      publishedAt: status === 'published' ? new Date().toISOString() : undefined,
      status: status,
      authorId: 'u-1',
      authorName: 'Alex Rivers',
      tags,
      createdAt: initialPost?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiGenerated: !!aiPrompt,
      aiPrompt: aiPrompt || undefined,
    };

    onSavePost(postData);

    if (status === 'published' || status === 'scheduled') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }

    setIsSubmitting(false);
    onClose();
  };

  const allAvailablePlatforms: SocialPlatform[] = [
    'x', 'linkedin', 'bluesky', 'threads', 'instagram', 'facebook', 'tiktok', 'youtube', 'pinterest', 'reddit', 'mastodon'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {initialPost ? 'Edit Scheduled Post' : 'Postiz AI Multi-Channel Composer'}
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Next.js + Supabase Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Draft once, adapt natively, schedule everywhere with AI superpowers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          
          {/* LEFT COLUMN: Post Composer & Controls (7 cols) */}
          <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col gap-5 overflow-y-auto">
            
            {/* Target Platforms Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  Target Platforms ({selectedPlatforms.length})
                </label>
                <span className="text-[11px] text-slate-400">Click to toggle channels</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {allAvailablePlatforms.map((p) => {
                  const isSelected = selectedPlatforms.includes(p);
                  const conf = PLATFORM_CONFIG[p];
                  return (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                        isSelected
                          ? `${conf.bg} ${conf.border} text-white ring-2 ring-indigo-500/50 shadow-md`
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <PlatformIcon platform={p} className="w-3.5 h-3.5" />
                      <span>{conf.name.split(' ')[0]}</span>
                      {isSelected && <Check className="w-3 h-3 text-emerald-400 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Generator Trigger Toggle */}
            <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/40 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-indigo-200">AI Social Media Copilot</h4>
                    <p className="text-xs text-indigo-300/70">Generate tailored viral copy from any idea or prompt</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAiPanel(!showAiPanel)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-md flex items-center gap-1.5"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  {showAiPanel ? 'Hide Copilot' : 'Open Copilot'}
                </button>
              </div>

              {/* Collapsible Copilot Box */}
              {showAiPanel && (
                <div className="mt-4 pt-4 border-t border-indigo-500/20 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div>
                    <label className="text-xs text-indigo-300 font-medium block mb-1">
                      What is your post about?
                    </label>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g., We rebuilt Gitroom Postiz using Next.js, Supabase, and Gemini AI. Highlight the real-time social sync and 10x developer performance..."
                      rows={2}
                      className="w-full bg-slate-950 border border-indigo-500/40 rounded-xl p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-400">Tone:</span>
                      {(['engaging', 'professional', 'storytelling', 'casual'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setAiTone(t)}
                          className={`px-2.5 py-1 rounded-lg capitalize text-xs ${
                            aiTone === t
                              ? 'bg-indigo-600 text-white font-medium'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleGenerateWithAi}
                      disabled={isGeneratingAi || !aiPrompt.trim()}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 flex items-center gap-2 shadow-lg"
                    >
                      {isGeneratingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      Generate Copy
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Main Text Editor */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Post Content
                </label>
                
                {/* AI Quick Polish Pills */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAiPolish('hook')}
                    disabled={isGeneratingAi || !content}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 flex items-center gap-1"
                    title="Enhance opening hook"
                  >
                    <Flame className="w-3 h-3 text-amber-400" /> +Hook
                  </button>
                  <button
                    onClick={() => handleAiPolish('viral')}
                    disabled={isGeneratingAi || !content}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 flex items-center gap-1"
                    title="Structure for virality"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-400" /> Make Viral
                  </button>
                  <button
                    onClick={handleAddHashtags}
                    disabled={isGeneratingAi || !content}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3 text-sky-400" /> +Tags
                  </button>
                </div>
              </div>

              <div className="relative flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What would you like to share with the world? Type here or let Postiz AI draft it..."
                  rows={8}
                  className="w-full h-full min-h-[180px] bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all leading-relaxed"
                />
                {isGeneratingAi && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-2 text-indigo-400 text-sm font-medium">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Gemini AI optimizing your copy...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Attached Media List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                  Media Attachments ({media.length})
                </label>
                <button
                  type="button"
                  onClick={() => setShowMediaPicker(!showMediaPicker)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <ImageIcon className="w-3.5 h-3.5" /> + Add Media Asset
                </button>
              </div>

              {/* Quick Stock Gallery Picker */}
              {showMediaPicker && (
                <div className="mb-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 block font-medium">Choose an asset from royalty-free library:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {STOCK_IMAGES.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => handleAttachStockImage(img)}
                        className="cursor-pointer group relative rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500 transition-all aspect-video"
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover group-hover:scale-105 transition duration-200" />
                        <span className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent flex items-end p-1.5 text-[10px] text-white">
                          {img.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {media.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {media.map((m) => (
                    <div
                      key={m.id}
                      className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 w-24 h-24 flex items-center justify-center"
                    >
                      <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleRemoveMedia(m.id)}
                        className="absolute inset-0 bg-red-950/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 text-red-300" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic py-1">No media attached yet.</div>
              )}
            </div>

            {/* Post Metadata: Tags & Scheduling Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
              {/* Tags */}
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Workspace Tags
                </label>
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-950/70 border border-slate-800 rounded-xl min-h-[42px]">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 flex items-center gap-1 border border-slate-700/60"
                    >
                      #{t}
                      <button onClick={() => removeTag(t)} className="hover:text-red-400">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Add tag + Enter"
                    className="text-xs bg-transparent text-slate-200 placeholder:text-slate-600 focus:outline-none min-w-[80px] flex-1"
                  />
                </div>
              </div>

              {/* Schedule time */}
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Schedule Release Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Live Multi-Platform Simulator Previews (5 cols) */}
          <div className="lg:col-span-5 p-6 bg-slate-950/50 flex flex-col gap-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Live Social Previews
                </h3>
                <p className="text-[11px] text-slate-400">Accurate layout rendering per network</p>
              </div>

              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Synchronized
              </span>
            </div>

            {/* Platform tab switcher */}
            <div className="flex overflow-x-auto gap-1 pb-1 border-b border-slate-800 scrollbar-none">
              {selectedPlatforms.map((p) => {
                const conf = PLATFORM_CONFIG[p];
                const isActive = activePreviewTab === p;
                return (
                  <button
                    key={p}
                    onClick={() => setActivePreviewTab(p)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-slate-800 text-white shadow-inner border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <PlatformIcon platform={p} className="w-3.5 h-3.5" />
                    <span>{conf.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Preview Card */}
            <div className="flex-1">
              <PostPreviewCard
                platform={activePreviewTab}
                content={content}
                media={media}
                accounts={accounts}
                scheduledAt={scheduledAt}
              />
            </div>

            {/* Postiz Supabase Edge Sync Info notice */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <span className="text-indigo-400">⚡</span>
              <span>
                <strong>Next.js + Supabase Ready:</strong> Saving publishes changes into Postgres with Row-Level Security and initiates the background worker dispatcher.
              </span>
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-20">
          <button
            onClick={() => handleSave('draft')}
            disabled={!content.trim() || isSubmitting}
            className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave('published')}
              disabled={!content.trim() || isSubmitting}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Publish Now
            </button>

            <button
              onClick={() => handleSave('scheduled')}
              disabled={!content.trim() || isSubmitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              Schedule Post
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
