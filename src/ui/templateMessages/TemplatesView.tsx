import React, { useState } from 'react';
import { MessageSquare, PlusCircle, Send, Copy, Check, X } from 'lucide-react';
import { db } from '../../core/cache/db/GymCacheDatabase';
import { MessageTemplate } from '../../types';
import { WhatsAppService } from '../../services/WhatsAppService';

export const TemplatesView: React.FC = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>(db.getTemplates());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MessageTemplate['type']>('Payment Reminder');
  const [body, setBody] = useState('');

  const reload = () => setTemplates(db.getTemplates());

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const newTpl: MessageTemplate = {
      templateId: `tpl_${Date.now()}`,
      title: title.trim(),
      type,
      body: body.trim()
    };

    db.saveTemplate(newTpl);
    setTitle('');
    setBody('');
    setIsAddOpen(false);
    reload();
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-nav">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-emerald-500" />
            <span>WhatsApp & SMS Messaging Templates</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automate personalized payment reminders, renewals, welcome notes & birthday greetings
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Message Template</span>
        </button>
      </div>

      {/* Available Variables Guide */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex flex-wrap items-center gap-2">
        <span className="font-bold">Dynamic Variables:</span>
        <code className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 font-mono text-[11px] font-bold">{"{{name}}"}</code>
        <code className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 font-mono text-[11px] font-bold">{"{{amount}}"}</code>
        <code className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 font-mono text-[11px] font-bold">{"{{gym_name}}"}</code>
        <code className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 font-mono text-[11px] font-bold">{"{{expiry_date}}"}</code>
        <code className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 font-mono text-[11px] font-bold">{"{{reg_code}}"}</code>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map(tpl => (
          <div
            key={tpl.templateId}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{tpl.title}</h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {tpl.type}
                </span>
              </div>
              <p className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {tpl.body}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => handleCopy(tpl.templateId, tpl.body)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                {copiedId === tpl.templateId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === tpl.templateId ? 'Copied' : 'Copy Template'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Template Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-500" /> New Message Template
              </h2>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Template Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Festival Offer Broadcast"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Category Type
                </label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Payment Reminder">Payment Reminder</option>
                  <option value="Membership Expiry">Membership Expiry</option>
                  <option value="Welcome">Welcome Message</option>
                  <option value="Birthday">Birthday Wishes</option>
                  <option value="Special Offer">Special Offer</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Message Body (include {"{{name}}"}, {"{{amount}}"}, etc.) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder="Hi {{name}}, your fee of ₹{{amount}} is due..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

