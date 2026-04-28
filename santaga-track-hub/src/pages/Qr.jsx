import React, { useState } from 'react';
import { 
  QrCode, ScanLine, History, User, Truck, 
  Download, Printer, CheckCircle, Search, Activity
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_RESIDENTS = [
  { id: 'RES-001', name: 'Maria Santos', type: 'Resident', address: 'Purok 1' },
  { id: 'RES-002', name: 'Arturo Macapagal', type: 'Resident', address: 'Purok 5' },
  { id: 'RES-003', name: 'Luzviminda Reyes', type: 'Resident', address: 'Purok 2' },
];

const MOCK_VEHICLES = [
  { id: 'VEH-001', name: 'Barangay Ambulance 1', type: 'Vehicle', plate: 'SAB-1234' },
  { id: 'VEH-002', name: 'Patrol Car Alpha', type: 'Vehicle', plate: 'PNP-567' },
  { id: 'VEH-003', name: 'Garbage Truck 1', type: 'Vehicle', plate: 'GT-889' },
];

const INITIAL_LOGS = [
  { id: 'log1', entityName: 'Maria Santos', entityType: 'Resident', action: 'Health Check-in', time: '10:42 AM, Today', location: 'Barangay Hall' },
  { id: 'log2', entityName: 'Barangay Ambulance 1', entityType: 'Vehicle', action: 'Dispatched', time: '09:15 AM, Today', location: 'Purok 3' },
];

export default function QRCodes() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' or 'history'
  
  // Generator State
  const [entityCategory, setEntityCategory] = useState('Resident');
  const [selectedEntityId, setSelectedEntityId] = useState('');
  const [generatedQR, setGeneratedQR] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // History State
  const [scanLogs, setScanLogs] = useState(INITIAL_LOGS);

  // --- HANDLERS ---
  const handleGenerate = (e) => {
    e.preventDefault();
    if (!selectedEntityId) return;

    setIsGenerating(true);
    setGeneratedQR(null);

    // Simulate network delay for realistic UX
    setTimeout(() => {
      const collection = entityCategory === 'Resident' ? MOCK_RESIDENTS : MOCK_VEHICLES;
      const entity = collection.find(e => e.id === selectedEntityId);
      
      // We use a free public API to generate a real QR code image based on the ID
      const qrData = JSON.stringify({ id: entity.id, type: entity.type });
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}&margin=10`;

      setGeneratedQR({ ...entity, qrUrl: qrImageUrl });
      setIsGenerating(false);
    }, 800);
  };

  const handleSimulateScan = () => {
    if (!generatedQR) return;

    // Add to history log to show functional mocking
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      entityName: generatedQR.name,
      entityType: generatedQR.type,
      action: 'ID Verification (Simulated)',
      time: 'Just now',
      location: 'Admin Dashboard'
    };

    setScanLogs([newLog, ...scanLogs]);
    setActiveTab('history'); // Switch to history to show it worked
  };

  const activeCollection = entityCategory === 'Resident' ? MOCK_RESIDENTS : MOCK_VEHICLES;

  return (
    <div className="p-6 bg-slate-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-gray-100 flex items-center gap-2">
            <QrCode className="text-indigo-500" size={28} />
            QR Code Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Generate and track digital IDs for residents and vehicles</p>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-gray-700 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <QrCode size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">Active QR Codes</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">1,402</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-gray-700 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <ScanLine size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">Scans Today</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{scanLogs.length + 42}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-gray-700 flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">System Health</p>
            <h3 className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">Online</h3>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex space-x-2 mb-6 bg-slate-200/50 dark:bg-gray-800 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('generator')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'generator' 
              ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
              : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
          }`}
        >
          <QrCode size={18} /> Generator
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'history' 
              ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
              : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
          }`}
        >
          <History size={18} /> Scan Logs
        </button>
      </div>

      {/* --- TAB CONTENT: GENERATOR --- */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Form Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Create New QR Code</h3>
            
            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Entity Type</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button 
                    type="button"
                    onClick={() => { setEntityCategory('Resident'); setSelectedEntityId(''); setGeneratedQR(null); }}
                    className={`flex items-center justify-center gap-2 py-3 border rounded-xl font-medium transition-all ${
                      entityCategory === 'Resident' 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400 ring-2 ring-indigo-500/20' 
                        : 'bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <User size={18} /> Resident
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setEntityCategory('Vehicle'); setSelectedEntityId(''); setGeneratedQR(null); }}
                    className={`flex items-center justify-center gap-2 py-3 border rounded-xl font-medium transition-all ${
                      entityCategory === 'Vehicle' 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400 ring-2 ring-indigo-500/20' 
                        : 'bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Truck size={18} /> Vehicle
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Select Record</label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select 
                    value={selectedEntityId}
                    onChange={(e) => setSelectedEntityId(e.target.value)}
                    required
                    className="w-full border border-slate-200 dark:border-gray-700 p-3 pl-10 rounded-xl bg-slate-50 dark:bg-gray-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                  >
                    <option value="" disabled>Choose a {entityCategory}...</option>
                    {activeCollection.map(entity => (
                      <option key={entity.id} value={entity.id}>
                        {entity.name} {entity.plate ? `(${entity.plate})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={!selectedEntityId || isGenerating}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <span className="animate-pulse">Generating Matrix...</span>
                  ) : (
                    <>
                      <QrCode size={20} /> Generate QR Pass
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Result Section */}
          <div className="bg-slate-100 dark:bg-gray-800/50 rounded-2xl border border-slate-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center min-h-[400px]">
            {!generatedQR && !isGenerating && (
              <div className="text-center opacity-50 flex flex-col items-center">
                <ScanLine size={64} className="text-slate-400 dark:text-gray-500 mb-4" />
                <p className="text-slate-500 dark:text-gray-400 font-medium">Select an entity and generate<br/>to preview QR Code here.</p>
              </div>
            )}

            {isGenerating && (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            )}

            {generatedQR && !isGenerating && (
              <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-gray-700 animate-in zoom-in-95 duration-300">
                <div className="bg-indigo-600 p-4 text-center">
                  <h4 className="text-white font-bold text-lg">{generatedQR.type} Pass</h4>
                  <p className="text-indigo-200 text-xs uppercase tracking-widest">{generatedQR.id}</p>
                </div>
                
                <div className="p-8 flex justify-center bg-white">
                  <div className="p-2 border-4 border-indigo-50 rounded-2xl">
                    {/* Live QR Generation from API */}
                    <img 
                      src={generatedQR.qrUrl} 
                      alt="Generated QR" 
                      className="w-48 h-48 mix-blend-multiply"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-gray-900 border-t border-slate-100 dark:border-gray-700 text-center">
                  <p className="font-bold text-slate-800 dark:text-white text-lg">{generatedQR.name}</p>
                  <p className="text-sm text-slate-500 dark:text-gray-400">{generatedQR.address || generatedQR.plate}</p>
                  <div className="flex items-center justify-center gap-1 mt-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 w-fit mx-auto px-2 py-1 rounded-full">
                    <CheckCircle size={14} /> Validated Identity
                  </div>
                </div>

                {/* Actions */}
                <div className="flex border-t border-slate-200 dark:border-gray-700">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors">
                    <Download size={16} /> Save
                  </button>
                  <div className="w-px bg-slate-200 dark:bg-gray-700"></div>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors">
                    <Printer size={16} /> Print
                  </button>
                </div>
              </div>
            )}

            {/* Simulation Button for Defense */}
            {generatedQR && !isGenerating && (
              <button 
                onClick={handleSimulateScan}
                className="mt-6 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline text-sm"
              >
                <ScanLine size={16} /> Simulate Scanner Action (For Demo)
              </button>
            )}
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: SCAN HISTORY --- */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-300">
          <div className="p-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white">Recent Activity</h3>
            <span className="text-xs font-bold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full">Live Feed</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white dark:bg-gray-800 border-b border-slate-100 dark:border-gray-700 text-slate-500 dark:text-gray-400 text-[11px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Scanned Entity</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Action Logged</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-700">
                {scanLogs.map((log) => (
                  <tr key={log.id} className="text-sm hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-gray-200">
                      {log.entityName}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 w-fit px-2 py-1 rounded-md text-[11px] font-bold ${
                        log.entityType === 'Resident' 
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {log.entityType === 'Resident' ? <User size={12} /> : <Truck size={12} />}
                        {log.entityType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-gray-300 font-medium">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-gray-400">
                      {log.location}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-gray-400 text-xs">
                      {log.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}