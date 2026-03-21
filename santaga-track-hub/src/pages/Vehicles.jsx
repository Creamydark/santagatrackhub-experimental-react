import React, { useState, useEffect } from 'react';
import LivetrackMap from '../components/LiveTrackingMap';
import { 
  Truck, Search, Map as MapIcon, List, Fuel, Gauge, Plus, 
  X, Trash2, Edit2, Activity, Wrench, CheckCircle, Navigation, Eye 
} from 'lucide-react';

export default function Vehicles() {
  const [viewMode, setViewMode] = useState('split'); 
  const [vehicles, setVehicles] = useState([]);
  const [driversList, setDriversList] = useState([]);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchingVehicle, setDispatchingVehicle] = useState(null);

  // NEW: State for the View Details modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingVehicle, setViewingVehicle] = useState(null);

  const [formData, setFormData] = useState({ name: '', id: '', model: '', type: 'Truck', fuel: '100%' });
  const [dispatchData, setDispatchData] = useState({ status: 'Idle', currentUser: '' });

  const API_URL = "http://localhost:5000/api/vehicles";

  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
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

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem("token"); 
      const res = await fetch("http://localhost:5000/api/users", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });

      if (res.ok) {
        const allUsers = await res.json();
        const driversOnly = allUsers.filter(user => user.role === 'Driver' && user.status === 'Active');
        setDriversList(driversOnly);
      }
    } catch (err) {
      console.error("Failed to fetch drivers:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingVehicle ? 'PUT' : 'POST';
    const url = editingVehicle ? `${API_URL}/${editingVehicle._id}` : API_URL;
    const currentUserName = localStorage.getItem("name") || "Admin";

    const payload = { ...formData, speed: '0 km/h', status: 'Idle', creator: currentUserName };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchVehicles();
        closeModal();
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleDispatchSubmit = async (e) => {
    e.preventDefault();
    if (!dispatchingVehicle) return;

    try {
      const res = await fetch(`${API_URL}/${dispatchingVehicle._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dispatchData)
      });
      
      if (res.ok) {
        fetchVehicles();
        closeDispatchModal();
      }
    } catch (err) {
      console.error("Dispatch error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this vehicle from the system?")) {
      setVehicles(prevVehicles => prevVehicles.filter(v => v._id !== id));
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) fetchVehicles(); 
      } catch (err) {
        fetchVehicles(); 
      }
    }
  };

  // Modal Handlers
  const openModal = (v = null) => {
    setEditingVehicle(v);
    setFormData(v ? { name: v.name, id: v.id, model: v.model, type: v.type, fuel: v.fuel } 
                  : { name: '', id: '', model: '', type: 'Truck', fuel: '100%' });
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setEditingVehicle(null); };

  const openDispatchModal = (v) => {
    setDispatchingVehicle(v);
    setDispatchData({ status: v.status || 'Idle', currentUser: v.currentUser || '' });
    setIsDispatchModalOpen(true);
  };
  const closeDispatchModal = () => { setIsDispatchModalOpen(false); setDispatchingVehicle(null); };

  // NEW: View Details Modal Handlers
  const openViewModal = (v) => {
    setViewingVehicle(v);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingVehicle(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'On the run': return "bg-green-100 text-green-700 border-green-200";
      case 'Maintenance': return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200"; 
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden text-slate-900">
      <header className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shrink-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Vehicle Management</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Fleet Systems</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => openModal()} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 transition-all active:scale-95">
            <Plus size={18} className="mr-2" /> Add Vehicle
          </button>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}><List size={18} /></button>
            <button 
              onClick={() => setViewMode('split')} 
              className={`flex items-center justify-center p-1.5 rounded-lg ${viewMode === 'split' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
            >
              {/* Replaced the border-r hack with a solid, centered line to match the 18px size of your other icons */}
              <div className="w-[2px] h-[18px] bg-current rounded-sm" />
            </button>
            <button onClick={() => setViewMode('map')} className={`p-1.5 rounded-lg ${viewMode === 'map' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}><MapIcon size={18} /></button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <aside className={`${viewMode === 'map' ? 'w-0 opacity-0 invisible' : viewMode === 'list' ? 'w-full' : 'w-[400px]'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300`}>
          <div className="p-4 space-y-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
              <input type="text" placeholder="Search plates..." className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-0">
            {vehicles.map((v) => (
              <div key={v._id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-blue-300 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <Truck className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm capitalize">{v.name}</h3>
                      
                      {/* NEW: Added the model right next to the plate number */}
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{v.id}</span>
                        {v.model && (
                          <>
                            <span className="text-[10px] text-slate-300">•</span>
                            <span className="text-[10px] text-slate-500 font-medium capitalize truncate max-w-[120px]">{v.model}</span>
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

                <div className="grid grid-cols-2 gap-2 mb-3 bg-slate-50 p-2.5 rounded-xl">
                  <div className="flex items-center text-[11px] font-bold text-slate-600">
                    <Fuel className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {v.fuel}
                  </div>
                  <div className="flex items-center text-[11px] font-bold text-slate-600">
                    <Gauge className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {v.speed}
                  </div>
                  {v.status === 'On the run' && v.currentUser && (
                    <div className="col-span-2 flex items-center text-[11px] font-bold text-blue-700 mt-1">
                      <Activity className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Driven by: {v.currentUser}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button 
                    onClick={() => openDispatchModal(v)}
                    className="text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center"
                  >
                    Update Status
                  </button>
                  <div className="flex items-center space-x-1">
                    <button onClick={() => openViewModal(v)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors" title="View Details"><Eye size={14} /></button>
                    <button onClick={() => openModal(v)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors" title="Edit Vehicle"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(v._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className={`${viewMode === 'list' ? 'hidden' : 'flex-1'} relative z-0 bg-slate-200`}>
          <LivetrackMap vehicles={vehicles} />
        </main>
      </div>

      {/* REGISTRATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  {editingVehicle ? 'Edit Vehicle Info' : 'Register New Vehicle'}
                </h2>
                <p className="text-sm text-slate-500">Enter the vehicle details below</p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-white rounded-full transition-all text-slate-400">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 ml-1">Vehicle Label</label>
                <input 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 placeholder:text-slate-400" 
                  placeholder="e.g. Truck 01" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 ml-1">Plate Number</label>
                <input 
                  required 
                  value={formData.id} 
                  onChange={(e) => setFormData({...formData, id: e.target.value})} 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 placeholder:text-slate-400 uppercase" 
                  placeholder="e.g. ABC-1234" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 ml-1">Model / Brand</label>
                  <input 
                    value={formData.model} 
                    onChange={(e) => setFormData({...formData, model: e.target.value})} 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 placeholder:text-slate-400" 
                    placeholder="e.g. Isuzu" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 ml-1">Initial Fuel Level</label>
                  <input 
                    value={formData.fuel} 
                    onChange={(e) => setFormData({...formData, fuel: e.target.value})} 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 placeholder:text-slate-400" 
                    placeholder="e.g. 100%" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 ml-1">Vehicle Category</label>
                <select 
                  value={formData.type} 
                  onChange={(e) => setFormData({...formData, type: e.target.value})} 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-medium text-slate-700 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                  <option value="Motorcycle">Motorcycle</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md active:scale-95 mt-2"
              >
                {editingVehicle ? 'Update Vehicle' : 'Save Details'}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* DISPATCH MODAL */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b flex justify-between items-center bg-blue-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Dispatch Update</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase">{dispatchingVehicle?.name} ({dispatchingVehicle?.id})</p>
              </div>
              <button onClick={closeDispatchModal} className="p-2 hover:bg-white rounded-full transition-all text-slate-400"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleDispatchSubmit} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Current Status</label>
                <select 
                  value={dispatchData.status} 
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setDispatchData({
                      ...dispatchData, 
                      status: newStatus,
                      currentUser: newStatus === 'On the run' ? dispatchData.currentUser : ''
                    });
                  }} 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold text-slate-700"
                >
                  <option value="Idle">Idle (Parked)</option>
                  <option value="On the run">On the run (Moving)</option>
                  <option value="Maintenance">Under Maintenance</option>
                </select>
              </div>

              {dispatchData.status === 'On the run' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Assign Driver</label>
                  <select 
                    required 
                    value={dispatchData.currentUser} 
                    onChange={(e) => setDispatchData({...dispatchData, currentUser: e.target.value})} 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                  >
                    <option value="" disabled>Select a driver...</option>
                    {driversList.map((driver) => (
                      <option key={driver.id} value={driver.name}>{driver.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95">
                Confirm Update
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NEW: VIEW DETAILS MODAL */}
      {isViewModalOpen && viewingVehicle && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Vehicle Profile</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Database Record</p>
                </div>
              </div>
              <button onClick={closeViewModal} className="p-2 hover:bg-white rounded-full transition-all text-slate-400"><X size={20} /></button>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Vehicle Name</p>
                  <p className="font-semibold text-slate-800 mt-1">{viewingVehicle.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Plate Number</p>
                  <p className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block mt-1">{viewingVehicle.id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Model / Brand</p>
                  <p className="font-medium text-slate-700 mt-1">{viewingVehicle.model || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Category</p>
                  <p className="font-medium text-slate-700 mt-1">{viewingVehicle.type}</p>
                </div>
                <div className="col-span-2 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Current Status</p>
                    <div className={`mt-1.5 px-2.5 py-1 rounded-md border text-[11px] font-bold inline-flex items-center space-x-1 uppercase tracking-wide ${getStatusBadge(viewingVehicle.status)}`}>
                      {viewingVehicle.status}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Current Driver</p>
                    <p className="font-semibold text-slate-800 mt-1.5">{viewingVehicle.currentUser || 'None'}</p>
                  </div>
                </div>
                <div className="col-span-2 pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Added By</p>
                    <p className="font-medium text-slate-600 text-xs mt-0.5">{viewingVehicle.createdBy || 'System'}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Fuel Level</p>
                     <p className="font-bold text-slate-700 text-xs mt-0.5">{viewingVehicle.fuel}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}