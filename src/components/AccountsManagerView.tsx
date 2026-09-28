import React, { useState } from 'react';
import { SocialAccount, SocialPlatform } from '../types';
import { PLATFORM_CONFIG, PlatformIcon } from './PlatformBadge';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  RefreshCw, 
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';

interface AccountsManagerViewProps {
  accounts: SocialAccount[];
  onAddAccount: (account: SocialAccount) => void;
  onRemoveAccount: (id: string) => void;
  onToggleAccountActive: (id: string) => void;
}

export function AccountsManagerView({
  accounts,
  onAddAccount,
  onRemoveAccount,
  onToggleAccountActive
}: AccountsManagerViewProps) {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('x');
  const [usernameInput, setUsernameInput] = useState('');
  const [displayNameInput, setDisplayNameInput] = useState('');

  const allSupportedPlatforms: SocialPlatform[] = [
    'x', 'linkedin', 'bluesky', 'threads', 'instagram', 'facebook', 'tiktok', 'youtube', 'pinterest', 'reddit', 'mastodon'
  ];

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    const newAccount: SocialAccount = {
      id: `acc-${selectedPlatform}-${Date.now()}`,
      platform: selectedPlatform,
      username: usernameInput.startsWith('@') ? usernameInput : `@${usernameInput}`,
      displayName: displayNameInput.trim() || usernameInput,
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 5000)}?w=150&auto=format&fit=crop&q=80`,
      followerCount: Math.floor(Math.random() * 15000) + 1200,
      connectedAt: new Date().toISOString(),
      isActive: true,
      tier: 'creator',
    };

    onAddAccount(newAccount);
    setShowConnectModal(false);
    setUsernameInput('');
    setDisplayNameInput('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-slate-900 to-purple-900/30 border border-indigo-500/20 rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Social Media Channels & Integrations
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              OAuth 2.0 Ready
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Connect your profiles to publish concurrently to X, LinkedIn, Bluesky, Threads, YouTube, Instagram, and more without rate-limit headaches.
          </p>
        </div>

        <button
          onClick={() => setShowConnectModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          Connect New Profile
        </button>
      </div>

      {/* Connected Accounts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => {
          const conf = PLATFORM_CONFIG[acc.platform];

          return (
            <div
              key={acc.id}
              className={`bg-slate-900 border rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between ${
                acc.isActive ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/40 opacity-60'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${conf.bg} ${conf.border} border text-white`}>
                      <PlatformIcon platform={acc.platform} className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-200 block">{conf.name}</span>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Token Active
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleAccountActive(acc.id)}
                    className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                      acc.isActive
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {acc.isActive ? 'Active' : 'Paused'}
                  </button>
                </div>

                {/* Profile info */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={acc.avatarUrl}
                    alt={acc.displayName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-800"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-bold text-white truncate">{acc.displayName}</h4>
                    <p className="text-xs text-slate-400 font-mono truncate">{acc.username}</p>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {acc.followerCount.toLocaleString()} followers
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Card Bottom Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[10px]">
                  Connected {new Date(acc.connectedAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onRemoveAccount(acc.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Disconnect Account"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connect Account Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-indigo-400" />
                Connect Social Account
              </h3>
              <button
                onClick={() => setShowConnectModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Select Social Platform
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {allSupportedPlatforms.slice(0, 9).map((p) => {
                    const conf = PLATFORM_CONFIG[p];
                    const isSelected = selectedPlatform === p;
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setSelectedPlatform(p)}
                        className={`p-2 rounded-xl border text-xs flex flex-col items-center gap-1 transition-all ${
                          isSelected
                            ? `${conf.bg} ${conf.border} text-white ring-2 ring-indigo-500`
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <PlatformIcon platform={p} className="w-4 h-4" />
                        <span className="text-[11px] truncate w-full text-center">{conf.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Handle / Username</label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="@handle or profile id"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  placeholder="e.g. Acme Tech Studio"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl text-[11px] text-slate-300">
                In local developer mode, accounts are linked instantly with simulated OAuth tokens and ready for scheduler dispatch.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md"
                >
                  Confirm & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
