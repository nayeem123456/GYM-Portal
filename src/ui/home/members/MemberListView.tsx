import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  CreditCard,
  Edit2,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  MessageCircle,
  FileText,
  UserPlus,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  ArrowUpDown
} from 'lucide-react';
import { db } from '../../../core/cache/db/GymCacheDatabase';
import { CachedMember } from '../../../types';
import { WhatsAppService } from '../../../services/WhatsAppService';

interface MemberListViewProps {
  onOpenAddMember: () => void;
  onEditMember: (member: CachedMember) => void;
  onOpenIdCard: (member: CachedMember) => void;
  onOpenBill: (member: CachedMember) => void;
}

export const MemberListView: React.FC<MemberListViewProps> = ({
  onOpenAddMember,
  onEditMember,
  onOpenIdCard,
  onOpenBill
}) => {
  const [members, setMembers] = useState<CachedMember[]>(db.getMembers());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'EXPIRING' | 'EXPIRED' | 'DUES' | 'BLOCKED'>('ALL');

  const settings = db.getSettings();
  const today = new Date();

  const reloadMembers = () => {
    setMembers(db.getMembers());
  };

  const handleToggleBlock = (memberId: string) => {
    db.toggleMemberBlock(memberId);
    reloadMembers();
  };

  const handleDelete = (memberId: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete member record for "${name}"?`)) {
      db.deleteMember(memberId);
      reloadMembers();
    }
  };

  // Filtering
  const filtered = members.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery) ||
      m.regCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.packageName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const expDate = new Date(m.edate);
    const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const hasDues = parseFloat(m.damount) > 0;

    if (statusFilter === 'ACTIVE') return m.isBlocked === 0 && diffDays >= 0;
    if (statusFilter === 'EXPIRING') return m.isBlocked === 0 && diffDays >= 0 && diffDays <= 5;
    if (statusFilter === 'EXPIRED') return diffDays < 0;
    if (statusFilter === 'DUES') return hasDues;
    if (statusFilter === 'BLOCKED') return m.isBlocked === 1;

    return true;
  });

  return (
    <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-nav relative">
      {/* Top Header & Search Bar */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
            <span>Members Directory</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            {members.length} registered members in total
          </p>
        </div>

        <button
          onClick={onOpenAddMember}
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search member by name, phone, Reg Code..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Filter Chips Scrollable */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
          {[
            { id: 'ALL', label: 'All', count: members.length },
            {
              id: 'ACTIVE',
              label: 'Active',
              count: members.filter(m => m.isBlocked === 0 && new Date(m.edate) >= today).length
            },
            {
              id: 'DUES',
              label: 'Has Dues',
              count: members.filter(m => parseFloat(m.damount) > 0).length
            },
            {
              id: 'EXPIRING',
              label: 'Expiring',
              count: members.filter(m => {
                const diff = Math.ceil((new Date(m.edate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                return m.isBlocked === 0 && diff >= 0 && diff <= 5;
              }).length
            },
            {
              id: 'EXPIRED',
              label: 'Expired',
              count: members.filter(m => new Date(m.edate) < today).length
            },
            {
              id: 'BLOCKED',
              label: 'Blocked',
              count: members.filter(m => m.isBlocked === 1).length
            }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap text-xs flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-emerald-500 text-white font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-2">
            <Users className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No matching members found</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          filtered.map(member => {
            const expDate = new Date(member.edate);
            const isExpired = expDate < today;
            const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            const hasDue = parseFloat(member.damount) > 0;

            const reminderMsg = WhatsAppService.formatMessage(
              'Hi {{name}}, greeting from {{gym_name}}. Your package {{package_name}} is active. Current due: ₹{{amount}}. Expiry date: {{expiry_date}}.',
              {
                name: member.name,
                gym_name: settings.gymName,
                package_name: member.packageName,
                amount: member.damount,
                expiry_date: member.edate
              }
            );
            const waUrl = WhatsAppService.createWhatsAppUrl(member.phone, reminderMsg);

            return (
              <div
                key={member.memberId}
                className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${
                  member.isBlocked === 1
                    ? 'border-red-300 dark:border-red-900/60 opacity-80'
                    : hasDue
                    ? 'border-amber-300 dark:border-amber-900/60'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  {/* Card Header: Avatar, Name, Reg Code, Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-base flex-shrink-0">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                          {member.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            {member.regCode}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {member.gender}, {member.age}y
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Pill */}
                    {member.isBlocked === 1 ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                        Blocked
                      </span>
                    ) : isExpired ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                        Expired
                      </span>
                    ) : diffDays <= 5 ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                        {diffDays}d left
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Plan & Batch & Financials */}
                  <div className="mt-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/40 text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[11px]">Plan:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">{member.packageName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[11px]">Valid Till:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">{member.edate}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-[11px] text-slate-400">Paid: <strong className="text-emerald-500">₹{member.pamount}</strong></span>
                      <span className={`text-[11px] font-bold ${hasDue ? 'text-amber-500' : 'text-slate-400'}`}>
                        {hasDue ? `Due: ₹${member.damount}` : 'No Dues'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Phone & WhatsApp */}
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <a
                      href={`tel:${member.phone}`}
                      className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-emerald-500"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{member.phone}</span>
                    </a>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenIdCard(member)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                      title="Print Pass ID Card"
                    >
                      <CreditCard className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onOpenBill(member)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                      title="View Tax Invoice"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleBlock(member.memberId)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                      title={member.isBlocked === 1 ? 'Unblock Member' : 'Block Member'}
                    >
                      {member.isBlocked === 1 ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-red-500" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditMember(member)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(member.memberId, member.name)}
                      className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Mobile Floating Action Button (FAB) for adding new members */}
      <button
        onClick={onOpenAddMember}
        className="sm:hidden fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-emerald-500 text-white shadow-xl flex items-center justify-center hover:bg-emerald-600 active:scale-95 transition-all"
        title="Add New Member"
      >
        <UserPlus className="w-6 h-6" />
      </button>
    </div>
  );
};
