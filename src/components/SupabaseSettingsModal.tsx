import React, { useState } from 'react';
import { supabaseSync } from '../services/supabaseService';
import { SUPABASE_SQL_SCHEMA } from '../services/supabaseSchema';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  RefreshCw, 
  Terminal, 
  ExternalLink,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

interface SupabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
}

export function SupabaseSettingsModal({ isOpen, onClose, onConfigChanged }: SupabaseSettingsModalProps) {
  if (!isOpen) return null;

  const currentStatus = supabaseSync.getStatus();
  const [url, setUrl] = useState(currentStatus.url || '');
  const [anonKey, setAnonKey] = useState(currentStatus.anonKey || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'schema' | 'architecture'>('config');

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) return;

    setIsTesting(true);
    setTestResult(null);

    const configured = supabaseSync.configure(url, anonKey);
    if (!configured) {
      setTestResult({ success: false, message: 'Invalid Supabase URL or Key format.' });
      setIsTesting(false);
      return;
    }

    const res = await supabaseSync.testConnection();
    setTestResult(res);
    setIsTesting(false);
    onConfigChanged();
  };

  const handleDisconnect = () => {
    supabaseSync.disconnect();
    setUrl('');
    setAnonKey('');
    setTestResult(null);
    onConfigChanged();
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Supabase & PostgreSQL Integration
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {currentStatus.isConnected ? 'Connected' : 'Offline / Local Store'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Connect your real Supabase project or use built-in reactive storage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 border-b border-slate-800 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'config'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Connection Settings
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'schema'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            SQL Migration Schema
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'architecture'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Next.js Stack Comparison
          </button>
        </div>

        {/* Modal Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-4">
          
          {activeTab === 'config' && (
            <form onSubmit={handleSaveAndTest} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  placeholder="https://your-project-id.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Found in your Supabase Dashboard under <strong>Project Settings → API</strong>
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Supabase Anon / Public Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Standard browser-safe anon key. Protected by PostgreSQL Row Level Security (RLS).
                </span>
              </div>

              {testResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    testResult.success
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-red-950/40 border-red-500/40 text-red-300'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-semibold block">
                      {testResult.success ? 'Supabase Synchronized' : 'Connection Error'}
                    </span>
                    <span className="opacity-90">{testResult.message}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                {currentStatus.isConnected ? (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="text-xs text-red-400 hover:text-red-300 font-medium"
                  >
                    Disconnect Supabase
                  </button>
                ) : (
                  <span className="text-xs text-slate-500">Currently using high-speed local cache</span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isTesting}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                  >
                    {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                    Save & Test Connection
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  1-Click PostgreSQL DDL for Supabase SQL Editor
                </span>
                <button
                  onClick={handleCopySchema}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSchema ? 'Copied to Clipboard!' : 'Copy SQL'}
                </button>
              </div>

              <div className="relative rounded-2xl bg-slate-950 p-4 border border-slate-800 max-h-[300px] overflow-y-auto">
                <pre className="text-[11px] font-mono text-emerald-300/90 leading-relaxed whitespace-pre">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Paste this into your Supabase Dashboard under <strong>SQL Editor</strong> and click <strong>Run</strong>. It initializes <code className="text-slate-300">posts</code>, <code className="text-slate-300">social_accounts</code>, and <code className="text-slate-300">team_members</code> with full Row Level Security (RLS) policies.
              </p>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Postiz Architecture Rebuilt for Next.js & Supabase
                </h4>
                <p className="text-slate-400">
                  The original Gitroom Postiz utilizes a NestJS monolithic backend, Redis, and Temporal. This modern rebuild shifts to a lean, cloud-native stack:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1">Original Postiz Stack</span>
                  <ul className="space-y-1 text-slate-400 list-disc list-inside">
                    <li>NestJS + TypeScript server</li>
                    <li>Prisma ORM + PostgreSQL</li>
                    <li>Temporal.io background workers</li>
                    <li>Redis session broker</li>
                  </ul>
                </div>
                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
                  <span className="text-indigo-300 font-semibold block mb-1">Rebuilt Modern Stack</span>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    <li>Next.js React 19 Frontend</li>
                    <li>Supabase PostgreSQL + RLS</li>
                    <li>Gemini AI Copilot Engine</li>
                    <li>Zero-latency edge synchronization</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
