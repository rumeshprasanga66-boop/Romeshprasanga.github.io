import React, { useState } from 'react';
import { TeamMember } from '../types';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  CheckCircle2, 
  Trash2,
  Clock,
  Sparkles
} from 'lucide-react';

interface TeamWorkspacesViewProps {
  team: TeamMember[];
  onInviteMember: (member: TeamMember) => void;
  onRemoveMember: (id: string) => void;
}

export function TeamWorkspacesView({ team, onInviteMember, onRemoveMember }: TeamWorkspacesViewProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'editor' | 'viewer'>('editor');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newMember: TeamMember = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 2000)}?w=150&auto=format&fit=crop&q=80`,
      status: 'invited',
    };

    onInviteMember(newMember);
    setShowInviteModal(false);
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Team Workspaces & Role-Based Access Control
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Supabase RLS Enforced
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Invite marketing coordinators, copywriters, and client reviewers to collaborate on scheduled social calendars with granular permissions.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Invite Team Member
        </button>
      </div>

      {/* Team Members List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="divide-y divide-slate-800/80">
          {team.map((member) => (
            <div key={member.id} className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-850/40 transition-colors">
              <div className="flex items-center gap-3.5">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-800"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{member.name}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                        member.role === 'owner'
                          ? 'bg-purple-950/70 text-purple-300 border border-purple-600/40'
                          : member.role === 'admin'
                          ? 'bg-indigo-950/70 text-indigo-300 border border-indigo-600/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{member.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`text-xs flex items-center gap-1.5 ${
                    member.status === 'active' ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {member.status === 'active' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                  {member.status === 'active' ? 'Active Member' : 'Invitation Pending'}
                </span>

                {member.role !== 'owner' && (
                  <button
                    onClick={() => onRemoveMember(member.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Remove Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-400" />
              Invite Collaborator
            </h3>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Smith"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Role & Permissions</label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="editor">Editor (Can draft, edit & schedule posts)</option>
                  <option value="admin">Admin (Can manage integrations & team members)</option>
                  <option value="viewer">Viewer (Read-only access to calendar and analytics)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
