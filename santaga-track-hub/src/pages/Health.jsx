import React, { useState } from 'react';
import { 
  Search, Plus, ShieldCheck, Syringe, Calendar, FileText, 
  X, User, Activity, AlertCircle, Clock, ChevronRight,
  ScanLine, QrCode, Printer, Package, TrendingDown, 
  CheckCircle2, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

// --- INITIAL MOCK DATA ---
const INITIAL_PATIENTS = [
  { 
    id: '1', 
    name: 'Maria Santos', 
    age: 45, 
    gender: 'Female', 
    bloodType: 'O+', 
    allergies: 'None', 
    address: 'Purok 1, Santiago', 
    immunizations: [ 
      { id: 'v1', vaccineType: 'Pneumococcal', dose: 'Single Dose', dateGiven: '2026-04-20', administeredBy: 'HW. Elena', status: 'Completed', remarks: 'Patient advised to rest.', nextSchedule: '' }, 
      { id: 'v2', vaccineType: 'Flu Vaccine', dose: 'Annual', dateGiven: '-', administeredBy: '-', status: 'Scheduled', remarks: 'Awaiting stock.', nextSchedule: '2026-05-15' } 
    ] 
  },
  { 
    id: '2', 
    name: 'Arturo Macapagal', 
    age: 2, 
    gender: 'Male', 
    bloodType: 'B-', 
    allergies: 'Penicillin', 
    address: 'Purok 5, Santiago', 
    immunizations: [ 
      { id: 'v3', vaccineType: 'Polio (OPV)', dose: '1st Dose', dateGiven: '2026-04-12', administeredBy: 'HW. Jose', status: 'Completed', remarks: 'No fever.', nextSchedule: '' } 
    ] 
  }
];

const INITIAL_STOCKS = [
  { id: 'vac1', name: 'Polio (OPV)', doses: 45, minThreshold: 10, category: 'Infant', lastRestock: '2026-05-10' },
  { id: 'vac2', name: 'BCG', doses: 8, minThreshold: 15, category: 'Infant', lastRestock: '2026-04-25' },
  { id: 'vac3', name: 'COVID-19 Booster', doses: 120, minThreshold: 50, category: 'Adult', lastRestock: '2026-05-12' },
  { id: 'vac4', name: 'Pneumococcal', doses: 14, minThreshold: 10, category: 'Senior', lastRestock: '2026-05-01' },
];

export default function Health() {
  // --- STATE ---
  const [activeMenuTab, setActiveMenuTab] = useState('patients'); // 'patients' or 'inventory'
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [stocks, setStocks] = useState(INITIAL_STOCKS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals & Sub-Navigation
  const [selectedPatient, setSelectedPatient] = useState(null); 
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isAddVaccineOpen, setIsAddVaccineOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [showQR, setShowQR] = useState(false); 

  // Form States
  const [patientForm, setPatientForm] = useState({ name: '', age: '', gender: 'Female', bloodType: 'O+', allergies: 'None', address: '' });
  const [vaccineForm, setVaccineForm] = useState({ vaccineType: 'Flu Vaccine', dose: '1st Dose', administeredBy: 'HW. Elena', status: 'Completed', nextSchedule: '', remarks: '' });

  // --- METRICS ---
  const totalPatients = patients.length;
  const totalDoses = patients.reduce((acc, p) => acc + p.immunizations.filter(v => v.status === 'Completed').length, 0);
  const totalScheduled = patients.reduce((acc, p) => acc + p.immunizations.filter(v => v.status === 'Scheduled').length, 0);

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // --- HANDLERS ---
  const handleMockScan = () => {
    setIsScannerOpen(true);
    setTimeout(() => {
      setIsScannerOpen(false);
      const foundPatient = patients.find(p => p.id === '1') || patients[0];
      if (foundPatient) {
        setSelectedPatient(foundPatient);
        setShowQR(false);
      }
    }, 2000);
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    const newPatient = { id: Math.random().toString(36).substr(2, 9), ...patientForm, immunizations: [] };
    setPatients([newPatient, ...patients]);
    setIsAddPatientOpen(false);
    setPatientForm({ name: '', age: '', gender: 'Female', bloodType: 'O+', allergies: 'None', address: '' });
  };

  const handleAddVaccine = (e) => {
    e.preventDefault();
    const newVaccine = { 
      id: Math.random().toString(36).substr(2, 9), 
      ...vaccineForm, 
      dateGiven: vaccineForm.status === 'Completed' ? new Date().toISOString().split('T')[0] : '-' 
    };
    
    // Update patient record
    const updatedPatients = patients.map(p => {
      if (p.id === selectedPatient.id) {
        const updatedPatient = { ...p, immunizations: [newVaccine, ...p.immunizations] };
        setSelectedPatient(updatedPatient); 
        return updatedPatient;
      }
      return p;
    });
    setPatients(updatedPatients);

    // REAL-TIME INVENTORY DEDUCTION (If vaccine status is completed)
    if (vaccineForm.status === 'Completed') {
      setStocks(prevStocks => prevStocks.map(item => {
        // Handle variations in name strings (e.g., Flu Vaccine vs COVID-19)
        if (item.name.toLowerCase().includes(vaccineForm.vaccineType.toLowerCase()) || 
            vaccineForm.vaccineType.toLowerCase().includes(item.name.toLowerCase())) {
          return { ...item, doses: Math.max(item.doses - 1, 0) };
        }
        return item;
      }));
    }

    setIsAddVaccineOpen(false);
    setVaccineForm({ vaccineType: 'Flu Vaccine', dose: '1st Dose', administeredBy: 'HW. Elena', status: 'Completed', nextSchedule: '', remarks: '' });
  };

  const getStockStatus = (doses, threshold) => {
    if (doses === 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30', icon: AlertTriangle };
    if (doses <= threshold) return { label: 'Low Stock', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30', icon: TrendingDown };
    return { label: 'Good Standing', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30', icon: CheckCircle2 };
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-gray-100 flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={28} /> Health & Immunization
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Manage localized clinical registries and vaccine deployment logistics</p>
        </div>
        {activeMenuTab === 'patients' && (
          <button 
            onClick={() => setIsAddPatientOpen(true)} 
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-emerald-200 dark:shadow-none transition-all active:scale-95"
          >
            <User size={18} /><span>New Patient Record</span>
          </button>
        )}
        {activeMenuTab === 'inventory' && (
          <a 
            href="/vaccine-stocks"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95"
          >
            <Package size={18} /><span>Manage Vaccine Stocks</span>
          </a>
        )}
      </div>

      {/* SUB-MENU TABS */}
      <div className="flex space-x-2 mb-6 bg-slate-200/50 dark:bg-gray-800 p-1 rounded-xl w-fit shrink-0">
        <button 
          onClick={() => { setActiveMenuTab('patients'); setSearchTerm(''); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeMenuTab === 'patients' ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700'}`}
        >
          <User size={16} /> Patient Directory
        </button>
        <button 
          onClick={() => { setActiveMenuTab('inventory'); setSearchTerm(''); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeMenuTab === 'inventory' ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700'}`}
        >
          <Package size={16} /> Vaccine Inventory
        </button>
      </div>

      {/* --- CONTENT LAYER 1: PATIENTS WORKSPACE --- */}
      {activeMenuTab === 'patients' && (
        <>
          {/* METRICS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl"><FileText size={24} /></div>
              <div><p className="text-sm text-slate-500 dark:text-gray-400 font-medium">Registered Patients</p><h3 className="text-2xl font-bold text-slate-800 dark:text-white">{totalPatients}</h3></div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl"><Syringe size={24} /></div>
              <div><p className="text-sm text-slate-500 dark:text-gray-400 font-medium">Doses Administered</p><h3 className="text-2xl font-bold text-slate-800 dark:text-white">{totalDoses}</h3></div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl"><Calendar size={24} /></div>
              <div><p className="text-sm text-slate-500 dark:text-gray-400 font-medium">Upcoming Schedules</p><h3 className="text-2xl font-bold text-slate-800 dark:text-white">{totalScheduled}</h3></div>
            </div>
          </div>

          {/* SEARCH & SCAN BAR */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-slate-200 dark:border-gray-700 flex items-center gap-3">
              <Search className="text-slate-400" size={20} />
              <input type="text" placeholder="Search patient directory..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-transparent border-none outline-none text-slate-700 dark:text-gray-200 placeholder:text-slate-400" />
            </div>
            <button onClick={handleMockScan} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all shrink-0 active:scale-95">
              <ScanLine size={20} /><span className="hidden md:inline">Scan QR ID</span>
            </button>
          </div>

          {/* PATIENT LIST TABLE */}
          <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-gray-900/50 border-b border-slate-100 dark:border-gray-700 text-slate-500 dark:text-gray-400 text-[11px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Patient Name</th><th className="px-6 py-4">Address</th><th className="px-6 py-4">Blood</th><th className="px-6 py-4">Immunization Status</th><th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-700">
                {filteredPatients.map((patient) => {
                  const latestVaccine = patient.immunizations[0];
                  return (
                    <tr key={patient.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800 dark:text-gray-200 block">{patient.name}</span>
                        <span className="text-xs text-slate-500 dark:text-gray-400">{patient.age} yrs • {patient.gender}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-gray-300">{patient.address}</td>
                      <td className="px-6 py-4 font-bold text-red-500">{patient.bloodType}</td>
                      <td className="px-6 py-4">
                        {latestVaccine ? (
                          <div><span className="text-sm font-semibold text-slate-700 dark:text-gray-200 block">{latestVaccine.vaccineType}</span><span className="text-xs text-slate-500 dark:text-gray-400">Last updated: {latestVaccine.dateGiven !== '-' ? latestVaccine.dateGiven : 'Scheduled'}</span></div>
                        ) : (<span className="text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full">No records</span>)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => { setSelectedPatient(patient); setShowQR(false); }} className="flex items-center justify-center gap-1 mx-auto text-emerald-600 dark:text-emerald-400 font-bold text-[11px] uppercase hover:underline">
                          Open Dossier <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* --- CONTENT LAYER 2: INVENTORY LOGISTICS WORKSPACE --- */}
      {activeMenuTab === 'inventory' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stocks.map((item) => {
              const status = getStockStatus(item.doses, item.minThreshold);
              const StatusIcon = status.icon;
              const percentage = Math.min((item.doses / 150) * 100, 100);

              return (
                <div key={item.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg ${status.color.split(' ')[1]}`}>
                      <StatusIcon size={20} className={status.color.split(' ')[0]} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 dark:text-white truncate">{item.name}</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-3">{item.category}</p>

                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-black text-slate-800 dark:text-white">{item.doses}</span>
                    <span className="text-sm text-slate-400 font-bold mb-1">Doses Left</span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${item.doses <= item.minThreshold ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center text-[10px] text-slate-400 dark:text-gray-500 font-bold">
                    <span>Last Restock</span>
                    <span>{item.lastRestock}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MOCK HISTORICAL LOGS */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-gray-700">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Stock Dispositions Feed</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-gray-700">
              <div className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400"><ArrowUpRight size={14}/></div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-gray-200">Restock Received: COVID-19 Booster</p>
                    <p className="text-[10px] text-slate-400 dark:text-gray-500">Source: City Health Office • 2 days ago</p>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">+50 Doses</span>
              </div>
              <div className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-lg text-red-600 dark:text-red-400"><ArrowDownRight size={14}/></div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-gray-200">System Inventory Deduction: Immunization Event</p>
                    <p className="text-[10px] text-slate-400 dark:text-gray-500">Dose automatically subtracted upon successful patient dispatch log</p>
                  </div>
                </div>
                <span className="text-xs font-black text-red-600 dark:text-red-400">-1 Dose</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL: SCANNER VIEW
          ========================================= */}
      {isScannerOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-sm flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Scan Patient ID</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400 mb-8">Align the resident health card matrix.</p>
            <div className="relative w-56 h-56 border-4 border-indigo-500/30 rounded-2xl overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-gray-900 shadow-inner">
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_20px_#6366f1] animate-[bounce_2s_infinite]" />
              <QrCode size={80} className="text-slate-300 dark:text-gray-700 animate-pulse" />
            </div>
            <button onClick={() => setIsScannerOpen(false)} className="mt-6 w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:text-white rounded-xl font-bold">Cancel</button>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL: REGISTER RESIDENT RECORD
          ========================================= */}
      {isAddPatientOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md border border-slate-100 dark:border-gray-700 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center bg-slate-50 dark:bg-gray-900/50">
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Register Patient</h2>
                <p className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-0.5">New Health Record</p>
              </div>
              <button onClick={() => setIsAddPatientOpen(false)} className="p-2 bg-white dark:bg-gray-700 rounded-full text-slate-400"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddPatient} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase ml-1">Full Name</label>
                <input required type="text" placeholder="e.g. Juan Dela Cruz" value={patientForm.name} onChange={e => setPatientForm({...patientForm, name: e.target.value})} className="w-full border p-3 rounded-xl bg-slate-50 dark:bg-gray-900 dark:text-white dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Age</label>
                  <input required type="number" value={patientForm.age} onChange={e => setPatientForm({...patientForm, age: e.target.value})} className="w-full border p-3 rounded-xl bg-slate-50 dark:bg-gray-900 dark:text-white dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Gender</label>
                  <select value={patientForm.gender} onChange={e => setPatientForm({...patientForm, gender: e.target.value})} className="w-full border p-3 rounded-xl bg-slate-50 dark:bg-gray-900 dark:text-white dark:border-gray-700 outline-none"><option>Female</option><option>Male</option></select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Blood</label>
                  <select value={patientForm.bloodType} onChange={e => setPatientForm({...patientForm, bloodType: e.target.value})} className="w-full border p-3 rounded-xl bg-slate-50 dark:bg-gray-900 dark:text-white dark:border-gray-700 outline-none"><option>O+</option><option>O-</option><option>A+</option><option>B+</option><option>AB+</option><option>Unknown</option></select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Known Allergies</label>
                <input type="text" placeholder="None" value={patientForm.allergies} onChange={e => setPatientForm({...patientForm, allergies: e.target.value})} className="w-full border p-3 rounded-xl bg-slate-50 dark:bg-gray-900 dark:text-white dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Resident Address</label>
                <input required type="text" placeholder="Purok / Street" value={patientForm.address} onChange={e => setPatientForm({...patientForm, address: e.target.value})} className="w-full border p-3 rounded-xl bg-slate-50 dark:bg-gray-900 dark:text-white dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddPatientOpen(false)} className="flex-1 py-3 border dark:border-gray-600 rounded-xl text-slate-600 dark:text-gray-300 font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL: PATIENT DOSSIER (DETAIL VIEW)
          ========================================= */}
      {selectedPatient && !isAddVaccineOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[90] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-slate-100 dark:border-gray-700 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="p-6 bg-slate-50 dark:bg-gray-900/80 border-b border-slate-100 dark:border-gray-700 flex justify-between items-start shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-600 rounded-full flex items-center justify-center"><User size={32} /></div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedPatient.name}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <p className="text-slate-500 dark:text-gray-400 text-sm">{selectedPatient.address} • System ID: {selectedPatient.id}</p>
                    <button onClick={() => setShowQR(!showQR)} className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-400 px-2.5 py-1 rounded-md border dark:border-indigo-800"><QrCode size={14} /> {showQR ? 'Hide ID Card' : 'View ID Card'}</button>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">✕</button>
            </div>

            <div className="p-6 overflow-y-auto bg-white dark:bg-gray-800 flex-1">
              {showQR ? (
                <div className="flex flex-col items-center justify-center py-8 animate-in fade-in duration-300">
                  <div className="bg-emerald-600 w-full max-w-sm rounded-t-2xl p-4 text-center">
                    <h3 className="text-white font-bold text-lg">Barangay Santiago</h3>
                    <p className="text-emerald-100 text-xs uppercase tracking-widest">Resident Health Pass</p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 border-x border-b border-slate-200 dark:border-gray-600 w-full max-w-sm rounded-b-2xl p-8 flex flex-col items-center shadow-lg">
                    <div className="p-2 border-4 border-slate-50 dark:border-gray-800 rounded-2xl mb-4 bg-white">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify({ id: selectedPatient.id, type: 'Resident' }))}&margin=10`} alt="Patient QR" className="w-48 h-48 mix-blend-multiply" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">{selectedPatient.name}</h2>
                    <p className="text-sm text-slate-500 dark:text-gray-400">{selectedPatient.id}</p>
                    <button className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-900 text-slate-700 dark:text-gray-100 rounded-xl font-bold"><Printer size={18} /> Print ID Card</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm"><span className="text-[10px] uppercase font-bold text-slate-400 block">Age & Gender</span><span className="font-semibold text-slate-800 dark:text-gray-200">{selectedPatient.age} yrs • {selectedPatient.gender}</span></div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm"><span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Type</span><span className="font-bold text-red-500">{selectedPatient.bloodType}</span></div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-800/30 col-span-2 flex items-center gap-2 shadow-sm"><AlertCircle size={16} className="text-red-500 shrink-0" /><div><span className="text-[10px] uppercase font-bold text-red-400 block">Known Allergies</span><span className="font-semibold text-red-700 dark:text-red-300">{selectedPatient.allergies}</span></div></div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><Syringe className="text-emerald-500" /> Vaccine History</h3>
                    <button onClick={() => setIsAddVaccineOpen(true)} className="flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"><Plus size={16} /> Add Vaccine</button>
                  </div>

                  {selectedPatient.immunizations.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">No vaccines recorded yet.</div>
                  ) : (
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-slate-200 dark:before:bg-gray-700">
                      {selectedPatient.immunizations.map((vac) => (
                        <div key={vac.id} className="relative flex items-center">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-gray-800 shrink-0 shadow z-10 ${vac.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-400'}`}><Syringe size={16} className="text-white" /></div>
                          <div className="ml-4 w-full bg-slate-50 dark:bg-gray-900/50 p-4 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-slate-800 dark:text-white">{vac.vaccineType}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${vac.status === 'Completed' ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40' : 'text-blue-600 bg-blue-100 dark:bg-blue-900/40'}`}>{vac.status}</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-gray-400 mb-2">{vac.dose} • By: {vac.administeredBy}</p>
                            <div className="flex flex-wrap justify-between items-end">
                              <div className="flex flex-col gap-1 text-xs text-slate-400">
                                {vac.dateGiven !== '-' && <span><strong>Given:</strong> {vac.dateGiven}</span>}
                                {vac.nextSchedule && <span className="text-blue-500"><strong>Due:</strong> {vac.nextSchedule}</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL: SAVE IMMUNIZATION RECORD
          ========================================= */}
      {isAddVaccineOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md border border-slate-100 dark:border-gray-700 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50 dark:bg-gray-900/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><Syringe className="text-emerald-500" size={18} /> Log for {selectedPatient?.name.split(' ')[0]}</h2>
              <button onClick={() => setIsAddVaccineOpen(false)} className="text-slate-400">✕</button>
            </div>
            <form onSubmit={handleAddVaccine} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Vaccine Type</label>
                  <select value={vaccineForm.vaccineType} onChange={e => setVaccineForm({...vaccineForm, vaccineType: e.target.value})} className="w-full border p-2.5 rounded-xl mt-1 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                    <option>Polio (OPV)</option><option>BCG</option><option>COVID-19 Booster</option><option>Pneumococcal</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Dose</label>
                  <select value={vaccineForm.dose} onChange={e => setVaccineForm({...vaccineForm, dose: e.target.value})} className="w-full border p-2.5 rounded-xl mt-1 dark:bg-gray-900 dark:border-gray-700 dark:text-white"><option>1st Dose</option><option>2nd Dose</option><option>Booster</option><option>Annual</option></select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
                  <select value={vaccineForm.status} onChange={e => setVaccineForm({...vaccineForm, status: e.target.value})} className="w-full border p-2.5 rounded-xl mt-1 dark:bg-gray-900 dark:border-gray-700 dark:text-white"><option>Completed</option><option>Scheduled</option></select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Administered By</label>
                  <input type="text" value={vaccineForm.administeredBy} onChange={e => setVaccineForm({...vaccineForm, administeredBy: e.target.value})} className="w-full border p-2.5 rounded-xl mt-1 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Next Schedule (Optional)</label>
                <input type="date" value={vaccineForm.nextSchedule} onChange={e => setVaccineForm({...vaccineForm, nextSchedule: e.target.value})} className="w-full border p-2.5 rounded-xl mt-1 dark:bg-gray-900 dark:text-white text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Remarks</label>
                <input type="text" placeholder="Any side effects?" value={vaccineForm.remarks} onChange={e => setVaccineForm({...vaccineForm, remarks: e.target.value})} className="w-full border p-2.5 rounded-xl mt-1 dark:bg-gray-900 dark:text-white" />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsAddVaccineOpen(false)} className="flex-1 py-2.5 border rounded-xl dark:text-white">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl font-bold">Save Vaccine</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}