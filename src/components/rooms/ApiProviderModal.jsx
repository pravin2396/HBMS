import React, { useState } from 'react';
import {
  Globe,
  X,
  CheckCircle2,
  ExternalLink,
  Save,
  RotateCcw,
  Zap
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getApiConfig, saveApiConfig } from '../../api/roomsApi';
import { useRooms } from '../../context/useRooms';

const ApiProviderModal = ({ isOpen, onClose }) => {
  const { loadRooms } = useRooms();
  const [config, setConfig] = useState(getApiConfig());
  const [customUrl, setCustomUrl] = useState(config.customUrl || '');

  if (!isOpen) return null;

  const handleSave = (providerKey) => {
    const updated = saveApiConfig({
      provider: providerKey,
      customUrl: providerKey === 'custom_mockapi' ? customUrl : config.customUrl
    });
    setConfig(updated);
    toast.success(`Switched API Provider to ${providerKey.toUpperCase()}`);
    loadRooms();
    onClose();
  };

  const providers = [
    {
      id: 'local',
      name: 'Vite Backend API (/api/rooms)',
      description: 'Local development server API plugin with instant response and DevTools Network tab reflection.',
      badge: 'Recommended'
    },
    {
      id: 'dummyjson',
      name: 'DummyJSON API (https://dummyjson.com)',
      description: 'External third-party API that dispatches genuine HTTP calls to DummyJSON on all CRUD actions.',
      badge: 'Third-Party'
    },
    {
      id: 'jsonplaceholder',
      name: 'JSONPlaceholder (https://jsonplaceholder.typicode.com)',
      description: 'External third-party REST API that handles HTTP GET, POST, PUT, DELETE with realistic responses.',
      badge: 'Third-Party'
    },
    {
      id: 'custom_mockapi',
      name: 'Custom MockAPI.io / Custom Endpoint',
      description: 'Connect directly to your own MockAPI project URL (e.g., https://66...mockapi.io/api/v1/rooms).',
      badge: 'Custom URL'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Globe className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Third-Party API Integration</h3>
              <p className="text-xs text-slate-400">Configure active REST API endpoint for Room Management</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Providers Selection */}
        <div className="space-y-2.5">
          {providers.map((p) => {
            const isSelected = config.provider === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setConfig((prev) => ({ ...prev, provider: p.id }))}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{p.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-semibold border border-slate-700">
                      {p.badge}
                    </span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>

        {/* Custom URL Input if Custom MockAPI is selected */}
        {config.provider === 'custom_mockapi' && (
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              MockAPI Endpoint URL:
            </label>
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://66xxxx.mockapi.io/api/v1/rooms"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave(config.provider)}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-105 active:scale-[0.99] text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Apply API Provider</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ApiProviderModal;
