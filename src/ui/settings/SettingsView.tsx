import React, { useState } from 'react';
import { Settings, Save, Download, Upload, PlusCircle, Building2, ShieldCheck, Check } from 'lucide-react';
import { db } from '../../core/cache/db/GymCacheDatabase';
import { GymSettings } from '../../types';
import { ExportImportService } from '../../services/ExportImportService';

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<GymSettings>(db.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchLoc, setNewBranchLoc] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('');
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim()) return;

    const updated = {
      ...settings,
      branches: [
        ...settings.branches,
        {
          branchId: `b_${Date.now()}`,
          branchName: newBranchName.trim(),
          location: newBranchLoc.trim(),
          phone: newBranchPhone.trim()
        }
      ]
    };
    setSettings(updated);
    db.saveSettings(updated);
    setNewBranchName('');
    setNewBranchLoc('');
    setNewBranchPhone('');
    setIsAddBranchOpen(false);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const content = ev.target?.result as string;
      if (ExportImportService.importDatabaseFromJson(content)) {
        alert('Database restored successfully! Reloading software.');
        window.location.reload();
      } else {
        alert('Failed to import backup file. Invalid format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 max-w-5xl mx-auto pb-nav">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-emerald-500" />
          <span>Gym Profile & System Settings</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Business branding, invoice tax configuration, multi-branch network and data backups
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-500" /> Settings updated successfully!
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Gym Organization Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Gym Brand Name *
              </label>
              <input
                type="text"
                required
                value={settings.gymName}
                onChange={e => setSettings({ ...settings, gymName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Slogan / Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={e => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Headquarters Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                GSTIN / Tax ID
              </label>
              <input
                type="text"
                value={settings.gstin || ''}
                onChange={e => setSettings({ ...settings, gstin: e.target.value })}
                placeholder="07AAAAA0000A1Z5"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Razorpay Live Key ID (found in APK)
              </label>
              <input
                type="text"
                value={settings.razorpayKeyId || ''}
                onChange={e => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </form>

      {/* Branches Network Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-500" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              Branches & Multi-Gym Network ({settings.branches.length})
            </h2>
          </div>
          <button
            onClick={() => setIsAddBranchOpen(!isAddBranchOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Branch</span>
          </button>
        </div>

        {/* Add Branch Inline Form */}
        {isAddBranchOpen && (
          <form onSubmit={handleAddBranch} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <input
              type="text"
              required
              value={newBranchName}
              onChange={e => setNewBranchName(e.target.value)}
              placeholder="Branch Name (e.g. North Hub)"
              className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl"
            />
            <input
              type="text"
              value={newBranchLoc}
              onChange={e => setNewBranchLoc(e.target.value)}
              placeholder="Location / Area"
              className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newBranchPhone}
                onChange={e => setNewBranchPhone(e.target.value)}
                placeholder="Branch Phone"
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-xs"
              >
                Save
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {settings.branches.map(b => (
            <div
              key={b.branchId}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1"
            >
              <p className="font-bold text-sm text-slate-900 dark:text-white">{b.branchName}</p>
              <p className="text-slate-500 dark:text-slate-400">{b.location}</p>
              <p className="text-slate-400 text-[11px]">Phone: {b.phone}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Backup, Export & Restore Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Data Safety, Backup & Offline Migration
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          All member records, invoices, workouts, diets, and expenses are stored locally in your browser. You can export a full JSON snapshot anytime.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => ExportImportService.downloadBackupFile()}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 border border-slate-700"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download Full Backup (JSON)</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-all border border-slate-300 dark:border-slate-700">
            <Upload className="w-4 h-4 text-blue-500" />
            <span>Restore From Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

