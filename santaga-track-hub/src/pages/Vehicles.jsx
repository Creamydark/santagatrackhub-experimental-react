import React, { useState, useEffect } from 'react';
import LivetrackMap from '../components/LiveTrackingMap';
import { 
  Truck, Search, Map as MapIcon, List, Fuel, Gauge, Plus, QrCode,
  X, Trash2, Edit2, Activity, Wrench, CheckCircle, Navigation, Eye,
  ScanLine, Printer
} from 'lucide-react';

export default function Vehicles() {
  const [viewMode, setViewMode] = useState('split'); 
  const [vehicles, setVehicles] = useState([]);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingVehicle, setViewingVehicle] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Form States
  const [formData, setFormData] = useState({ name: '', id: '', model: '', type: 'Truck', fuel: '100%' });
  const [dispatchData, setDispatchData] = useState({ status: 'Idle', currentUser: '' });

  const API_URL = "http://localhost:5000/api/vehicles";
  const currentUserName = localStorage.getItem("name") || "Admin";

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch vehicles");
      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleMockScan = () => {
    setIsScannerOpen(true);
    setTimeout(() => {
      setIsScannerOpen(false);
      const demoVehicle = vehicles.length > 0 ? vehicles[0] : {
        _id: 'demo-123', name: 'Barangay Ambulance 1', id: 'SAB-1234',
        model: 'Toyota Hiace', type: 'Van', fuel: '85%', speed: 0,
        status: 'Idle', createdBy: 'System Admin', currentUser: ''
      };
      openViewModal(demoVehicle);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingVehicle ? 'PUT' : 'POST';
    const url = editingVehicle ? `${API_URL}/${editingVehicle._id}` : API_URL;
    const payload = { 
      name: formData.name, id: formData.id, model: formData.model, type: formData.type,
      fuel: formData.fuel, speed: 0, status: 'Idle', creator: currentUserName 
    };

    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { fetchVehicles(); closeModal(); }
    } catch (err) { console.error("Submit error:", err); }
  };

  // INLINE DISPATCH SUBMIT
  const handleInlineDispatchSubmit = async (e) => {
    e.preventDefault();
    if (!viewingVehicle) return;
    try {
      const res = await fetch(`${API_URL}/${viewingVehicle._id}/status`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dispatchData)
      });
      if (res.ok) { 
        fetchVehicles(); 
        closeViewModal(); 
      }
    } catch (err) { console.error("Dispatch error:", err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this vehicle from the system?")) {
      setVehicles(prevVehicles => prevVehicles.filter(v => v._id !== id));
      try { await fetch(`${API_URL}/${id}`, { method: 'DELETE' }); } catch (err) {}
      fetchVehicles(); 
    }
  };

  const openModal = (v = null) => {
    setEditingVehicle(v);
    setFormData(v ? { name: v.name, id: v.id, model: v.model, type: v.type, fuel: v.fuel } : { name: '', id: '', model: '', type: 'Truck', fuel: '100%' });
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setEditingVehicle(null); };

  const openViewModal = (v) => {
    setViewingVehicle(v);
    // Initialize the dispatch form directly inside the view modal
    setDispatchData({ status: v.status || 'Idle', currentUser: v.currentUser || '' });
    setShowQR(false); 
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => { setIsViewModalOpen(false); setViewingVehicle(null); setShowQR(false); };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'On the run': return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700";
      case 'Maintenance': return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700";
      default: return "bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 border-slate-200 dark:border-gray-600"; 
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-gray-900 overflow-hidden text-slate-900 dark:text-gray-100">
      {/* HEADER */}
      <header className="p-4 bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 flex justify-between items-center shrink-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-gray-100">Vehicle Management</h1>
          <p className="text-[10px] text-slate-400 dark:text-gray-500 font-bold uppercase tracking-widest">Fleet Systems</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={handleMockScan} className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-95">
            <ScanLine size={18} className="mr-2" /> Scan QR Pass
          </button>
          <button onClick={() => openModal()} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-95">
            <Plus size={18} className="mr-2" /> Add Vehicle
          </button>
          <div className="flex bg-slate-100 dark:bg-gray-700 p-1 rounded-xl border border-slate-200 dark:border-gray-600">
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600' : 'text-slate-400 dark:text-gray-500'}`}><List size={18} /></button>
            <button onClick={() => setViewMode('split')} className={`flex items-center justify-center p-1.5 rounded-lg ${viewMode === 'split' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600' : 'text-slate-400 dark:text-gray-500'}`}>
              <div className="w-[2px] h-[18px] bg-current rounded-sm" />
            </button>
            <button onClick={() => setViewMode('map')} className={`p-1.5 rounded-lg ${viewMode === 'map' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600' : 'text-slate-400 dark:text-gray-500'}`}><MapIcon size={18} /></button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <aside className={`${viewMode === 'map' ? 'w-0 opacity-0 invisible' : viewMode === 'list' ? 'w-full' : 'w-[400px]'} bg-white dark:bg-gray-800 border-r border-slate-200 dark:border-gray-700 flex flex-col transition-all duration-300`}>
          <div className="p-4 space-y-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400 dark:text-gray-500 w-4 h-4" />
              <input type="text" placeholder="Search plates..." className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10 border border-slate-200 dark:border-gray-600 text-slate-900 dark:text-gray-100" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-0">
            {vehicles.map((v) => (
              <div key={v._id} className="p-4 rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-500 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-50 dark:bg-gray-700/50 rounded-xl">
                      <Truck className="w-5 h-5 text-slate-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-gray-100 text-sm capitalize">{v.name}</h3>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">{v.id}</span>
                        {v.model && (
                          <>
                            <span className="text-[10px] text-slate-300 dark:text-gray-600">•</span>
                            <span className="text-[10px] text-slate-500 dark:text-gray-400 font-medium capitalize truncate max-w-[120px]">{v.model}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full border text-[10px] font-bold flex items-center space-x-1 uppercase tracking-wide ${getStatusBadge(v.status)}`}>
                    {v.status === 'On the run' && <Navigation size={10} className="mr-1" />}
                    {v.status === 'Maintenance' && <Wrench size={10} className="mr-1" />}
                    {v.status === 'Idle' && <CheckCircle size={10} className="mr-1" />}
                    {v.status}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3 bg-slate-50 dark:bg-gray-900/40 p-2.5 rounded-xl border border-transparent dark:border-gray-700/50">
                  <div className="flex items-center text-[11px] font-bold text-slate-600 dark:text-gray-300">
                    <Fuel className="w-3.5 h-3.5 mr-1.5 text-slate-400 dark:text-gray-500" /> {v.fuel}
                  </div>
                  <div className="flex items-center text-[11px] font-bold text-slate-600 dark:text-gray-300">
                    <Gauge className="w-3.5 h-3.5 mr-1.5 text-slate-400 dark:text-gray-500" /> {v.speed}
                  </div>
                  {v.status === 'On the run' && v.currentUser && (
                    <div className="col-span-2 flex items-center text-[11px] font-bold text-blue-700 dark:text-blue-300 mt-1">
                      <Activity className="w-3.5 h-3.5 mr-1.5 text-blue-500 dark:text-blue-400" /> Driven by: {v.currentUser}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-gray-700">
                  <button onClick={() => openViewModal(v)} className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors border border-transparent">Update Status / View</button>
                  <div className="flex items-center space-x-1">
                    <button onClick={() => openModal(v)} className="p-1.5 text-slate-400 dark:text-gray-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-md"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(v._id)} className="p-1.5 text-slate-400 dark:text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
            {vehicles.length === 0 && (
              <div className="text-center py-10">
                <Truck className="w-10 h-10 text-slate-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500 dark:text-gray-400">No vehicles registered yet.</p>
              </div>
            )}
          </div>
        </aside>
        <main className={`${viewMode === 'list' ? 'hidden' : 'flex-1'} relative z-0 bg-slate-200 dark:bg-gray-700`}>
          <LivetrackMap vehicles={vehicles} />
        </main>
      </div>

      {/* SCANNER MODAL */}
      {isScannerOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-sm flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Scan Vehicle QR</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400 mb-8">Align the vehicle's QR pass within the frame.</p>
            <div className="relative w-56 h-56 border-4 border-indigo-500/30 rounded-2xl overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-gray-900">
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_20px_#6366f1] animate-[bounce_2s_infinite]" />
              <QrCode size={80} className="text-slate-300 dark:text-gray-700 animate-pulse" />
            </div>
            <button onClick={() => setIsScannerOpen(false)} className="mt-6 w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:text-white rounded-xl font-bold">Cancel</button>
          </div>
        </div>
      )}

      {/* VIEW DETAILS & INLINE DISPATCH MODAL */}
      {isViewModalOpen && viewingVehicle && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-start bg-slate-50/50 dark:bg-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-slate-100 dark:border-gray-600">
                  <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-gray-100">Vehicle Profile</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-[10px] text-slate-400 dark:text-gray-500 font-bold uppercase tracking-widest">Database Record</p>
                    <button 
                      onClick={() => setShowQR(!showQR)}
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-400 px-2.5 py-1 rounded-md transition-colors"
                    >
                      <QrCode size={14} /> {showQR ? 'Hide QR Pass' : 'View QR Pass'}
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={closeViewModal} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-full transition-all text-slate-400 dark:text-gray-500"><X size={20} /></button>
            </div>
            
            <div className="p-8">
              {!showQR ? (
                <>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Vehicle Name</p>
                      <p className="font-semibold text-slate-800 dark:text-gray-100 mt-1">{viewingVehicle.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Plate Number</p>
                      <p className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded inline-block mt-1">{viewingVehicle.id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Model / Brand</p>
                      <p className="font-medium text-slate-700 dark:text-gray-300 mt-1">{viewingVehicle.model || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Category</p>
                      <p className="font-medium text-slate-700 dark:text-gray-300 mt-1">{viewingVehicle.type}</p>
                    </div>
                  </div>
                  
                  {/* --- INLINE DISPATCH SECTION --- */}
                  <div className="mt-6 pt-5 border-t border-slate-100 dark:border-gray-600">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide mb-3">Quick Dispatch Update</p>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <button 
                        onClick={() => setDispatchData({ ...dispatchData, status: 'Idle', currentUser: '' })}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border ${dispatchData.status === 'Idle' ? 'bg-slate-800 text-white border-slate-800 dark:bg-gray-600 dark:border-gray-500 shadow-md' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'}`}
                      >
                        Idle
                      </button>
                      <button 
                        onClick={() => setDispatchData({ ...dispatchData, status: 'On the run', currentUser: currentUserName })}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border ${dispatchData.status === 'On the run' ? 'bg-green-600 text-white border-green-600 shadow-md dark:bg-green-600 dark:border-green-500' : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-500'}`}
                      >
                        On the run
                      </button>
                      <button 
                        onClick={() => setDispatchData({ ...dispatchData, status: 'Maintenance', currentUser: '' })}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border ${dispatchData.status === 'Maintenance' ? 'bg-red-600 text-white border-red-600 shadow-md dark:bg-red-600 dark:border-red-500' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-500'}`}
                      >
                        Maintenance
                      </button>
                    </div>

                    {/* Show a mini badge of the current driver when "On the run" is active */}
                    {dispatchData.status === 'On the run' && (
                      <div className="mb-4 text-xs font-medium text-slate-500 dark:text-gray-400 animate-in fade-in slide-in-from-top-2 duration-200">
                        Dispatching as: <span className="font-bold text-slate-700 dark:text-gray-200 bg-slate-100 dark:bg-gray-700 px-2 py-1 rounded ml-1">{currentUserName}</span>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button 
                        onClick={closeViewModal}
                        className="flex-1 py-2.5 border border-slate-200 dark:border-gray-600 rounded-xl text-slate-600 dark:text-gray-300 font-bold hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleInlineDispatchSubmit}
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors"
                      >
                        Save Status
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // --- QR VIEW ---
                <div className="flex flex-col items-center animate-in fade-in duration-300">
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 mb-4">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify({ id: viewingVehicle.id, type: viewingVehicle.type }))}&margin=10`} 
                      alt="Vehicle QR" 
                      className="w-48 h-48"
                    />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-gray-100 text-lg">{viewingVehicle.id}</h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400">{viewingVehicle.name}</p>
                  
                  <div className="mt-6 flex w-full gap-3">
                    <button onClick={() => setShowQR(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:text-white rounded-xl font-bold transition-colors">Back</button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors">
                      <Printer size={16} /> Print Sticker
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REGISTRATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 dark:border-gray-700">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50 dark:bg-gray-700/50">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-100">
                  {editingVehicle ? 'Edit Vehicle Info' : 'Register New Vehicle'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-gray-400">Enter the vehicle details below</p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-full transition-all text-slate-400 dark:text-gray-500"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-gray-400 ml-1">Vehicle Label</label>
                <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 dark:text-gray-100" placeholder="e.g. Truck 01" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-gray-400 ml-1">Plate Number</label>
                <input required value={formData.id} onChange={(e) => setFormData({...formData, id: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 dark:text-gray-100 uppercase" placeholder="e.g. ABC-1234" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-gray-400 ml-1">Model / Brand</label>
                  <input value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 dark:text-gray-100" placeholder="e.g. Isuzu" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-gray-400 ml-1">Initial Fuel Level</label>
                  <input value={formData.fuel} onChange={(e) => setFormData({...formData, fuel: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 dark:text-gray-100" placeholder="e.g. 100%" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-gray-400 ml-1">Vehicle Category</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl text-sm outline-none font-medium text-slate-700 dark:text-gray-100">
                  <option value="Truck">Truck</option><option value="Van">Van</option><option value="Motorcycle">Motorcycle</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md active:scale-95 mt-2">
                {editingVehicle ? 'Update Vehicle' : 'Save Details'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}