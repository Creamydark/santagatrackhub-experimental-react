import React, { useState } from 'react';
import { 
  Search, Plus, ShieldCheck, Syringe, Calendar, FileText, 
  X, User, Activity, AlertCircle, Clock, ChevronRight,
  ScanLine, QrCode, Printer 
} from 'lucide-react';

// --- COMPLEX MOCK DATA: Patients with nested Immunizations ---
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

export default function Health() {
  // --- STATE MANAGEMENT ---
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals & Navigation
  const [selectedPatient, setSelectedPatient] = useState(null); 
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isAddVaccineOpen, setIsAddVaccineOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [showQR, setShowQR] = useState(false); // Controls the QR ID Card view

  // Form States
  const [patientForm, setPatientForm] = useState({ name: '', age: '', gender: 'Female', bloodType: 'O+', allergies: 'None', address: '' });
  const [vaccineForm, setVaccineForm] = useState({ vaccineType: 'Flu Vaccine', dose: '1st Dose', administeredBy: 'HW. Elena', status: 'Completed', nextSchedule: '', remarks: '' });

  // --- DERIVED METRICS ---
  const totalPatients = patients.length;
  const totalDoses = patients.reduce((acc, p) => acc + p.immunizations.filter(v => v.status === 'Completed').length, 0);
  const totalScheduled = patients.reduce((acc, p) => acc + p.immunizations.filter(v => v.status === 'Scheduled').length, 0);

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // --- HANDLERS ---
  const handleMockScan = () => {
    setIsScannerOpen(true);
    
    // Simulate a 2-second camera reading delay, then auto-open Maria Santos
    setTimeout(() => {
      setIsScannerOpen(false);
      const foundPatient = patients.find(p => p.id === '1') || patients[0];
      if (foundPatient) {
        setSelectedPatient(foundPatient);
        setShowQR(false); // Ensure we start on the dossier view, not the QR view
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
    
    const updatedPatients = patients.map(p => {
      if (p.id === selectedPatient.id) {
        const updatedPatient = { ...p, immunizations: [newVaccine, ...p.immunizations] };
        setSelectedPatient(updatedPatient); 
        return updatedPatient;
      }
      return p;
    });
    
    setPatients(updatedPatients);
    setIsAddVaccineOpen(false);
    setVaccineForm({ vaccineType: 'Flu Vaccine', dose: '1st Dose', administeredBy: 'HW. Elena', status: 'Completed', nextSchedule: '', remarks: '' });
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-gray-100 flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={28} /> Health & Immunization
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Patient directory and vaccination tracking</p>
        </div>
        <button 
          onClick={() => setIsAddPatientOpen(true)} 
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-emerald-200 dark:shadow-none transition-all"
        >
          <User size={18} /><span>New Patient Record</span>
        </button>
      </div>

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

      {/* SEARCH & SCAN BUTTON */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-slate-200 dark:border-gray-700 flex items-center gap-3">
          <Search className="text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search patient directory..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-transparent border-none outline-none text-slate-700 dark:text-gray-200 placeholder:text-slate-400" 
          />
        </div>
        <button 
          onClick={handleMockScan} 
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all shrink-0"
        >
          <ScanLine size={20} /><span className="hidden md:inline">Scan QR ID</span>
        </button>
      </div>

      {/* MASTER LIST (TABLE) */}
      <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-gray-900/50 border-b border-slate-100 dark:border-gray-700 text-slate-500 dark:text-gray-400 text-[11px] uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Patient Name</th>
              <th className="px-6 py-4">Address</th>
              <th className="px-6 py-4">Blood</th>
              <th className="px-6 py-4">Immunization Status</th>
              <th className="px-6 py-4 text-center">Action</th>
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
                      <div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-gray-200 block">{latestVaccine.vaccineType}</span>
                        <span className="text-xs text-slate-500 dark:text-gray-400">Last updated: {latestVaccine.dateGiven !== '-' ? latestVaccine.dateGiven : 'Scheduled'}</span>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full">No records</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => { setSelectedPatient(patient); setShowQR(false); }} 
                      className="flex items-center justify-center gap-1 mx-auto text-emerald-600 dark:text-emerald-400 font-bold text-[11px] uppercase hover:underline"
                    >
                      Open Dossier <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredPatients.length === 0 && (
              <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">No patients found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =========================================
          MODAL: MOCK QR SCANNER VIEWFINDER
          ========================================= */}
      {isScannerOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-sm flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Scan Patient ID</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400 mb-8">Align the QR code within the frame.</p>
            
            <div className="relative w-56 h-56 border-4 border-indigo-500/30 rounded-2xl overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-gray-900 shadow-inner">
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_20px_#6366f1] animate-[bounce_2s_infinite]" />
              <QrCode size={80} className="text-slate-300 dark:text-gray-700 animate-pulse" />
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
              <span className="text-sm font-bold uppercase tracking-widest">Scanning...</span>
            </div>

            <button onClick={() => setIsScannerOpen(false)} className="mt-6 w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-700 dark:text-white rounded-xl font-bold transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL: ADD NEW PATIENT
          ========================================= */}
      {isAddPatientOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md border border-slate-100 dark:border-gray-700 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center bg-slate-50 dark:bg-gray-900/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Register Patient</h2>
              <button onClick={() => setIsAddPatientOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAddPatient} className="p-6 space-y-4">
              <input required type="text" placeholder="Full Name" value={patientForm.name} onChange={e => setPatientForm({...patientForm, name: e.target.value})} className="w-full border p-2.5 rounded-xl dark:bg-gray-900 dark:text-white dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500" />
              <div className="grid grid-cols-3 gap-3">
                <input required type="number" placeholder="Age" value={patientForm.age} onChange={e => setPatientForm({...patientForm, age: e.target.value})} className="w-full border p-2.5 rounded-xl dark:bg-gray-900 dark:text-white dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500" />
                <select value={patientForm.gender} onChange={e => setPatientForm({...patientForm, gender: e.target.value})} className="w-full border p-2.5 rounded-xl dark:bg-gray-900 dark:text-white dark:border-gray-700 outline-none">
                  <option>Female</option><option>Male</option>
                </select>
                <select value={patientForm.bloodType} onChange={e => setPatientForm({...patientForm, bloodType: e.target.value})} className="w-full border p-2.5 rounded-xl dark:bg-gray-900 dark:text-white dark:border-gray-700 outline-none">
                  <option>O+</option><option>O-</option><option>A+</option><option>B+</option><option>AB+</option><option>Unknown</option>
                </select>
              </div>
              <input type="text" placeholder="Allergies (e.g., Penicillin, None)" value={patientForm.allergies} onChange={e => setPatientForm({...patientForm, allergies: e.target.value})} className="w-full border p-2.5 rounded-xl dark:bg-gray-900 dark:text-white dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500" />
              <input required type="text" placeholder="Address / Purok" value={patientForm.address} onChange={e => setPatientForm({...patientForm, address: e.target.value})} className="w-full border p-2.5 rounded-xl dark:bg-gray-900 dark:text-white dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500" />
              <button type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 mt-2 transition-all shadow-md active:scale-95">Register Patient</button>
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
            
            {/* Header */}
            <div className="p-6 bg-slate-50 dark:bg-gray-900/80 border-b border-slate-100 dark:border-gray-700 flex justify-between items-start shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-600 rounded-full flex items-center justify-center">
                  <User size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedPatient.name}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <p className="text-slate-500 dark:text-gray-400 text-sm">{selectedPatient.address} • System ID: {selectedPatient.id}</p>
                    {/* Toggle QR Button */}
                    <button 
                      onClick={() => setShowQR(!showQR)}
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-400 px-2.5 py-1 rounded-md transition-colors border border-transparent dark:border-indigo-800"
                    >
                      <QrCode size={14} /> {showQR ? 'Hide ID Card' : 'View ID Card'}
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">✕</button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto bg-white dark:bg-gray-800 flex-1">
              
              {showQR ? (
                // --- QR CODE ID VIEW ---
                <div className="flex flex-col items-center justify-center py-8 animate-in fade-in duration-300">
                  <div className="bg-emerald-600 w-full max-w-sm rounded-t-2xl p-4 text-center">
                    <h3 className="text-white font-bold text-lg">Barangay Santiago</h3>
                    <p className="text-emerald-100 text-xs uppercase tracking-widest">Resident Health Pass</p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 border-x border-b border-slate-200 dark:border-gray-600 w-full max-w-sm rounded-b-2xl p-8 flex flex-col items-center shadow-lg">
                    <div className="p-2 border-4 border-slate-50 dark:border-gray-800 rounded-2xl mb-4 bg-white">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify({ id: selectedPatient.id, type: 'Resident' }))}&margin=10`} 
                        alt="Patient QR" 
                        className="w-48 h-48 mix-blend-multiply" 
                      />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">{selectedPatient.name}</h2>
                    <p className="text-sm text-slate-500 dark:text-gray-400">{selectedPatient.id}</p>
                    <button className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-900 text-slate-700 dark:text-gray-100 rounded-xl font-bold transition-colors">
                      <Printer size={18} /> Print ID Card
                    </button>
                  </div>
                </div>
              ) : (
                // --- DOSSIER TIMELINE VIEW ---
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Age & Gender</span>
                      <span className="font-semibold text-slate-800 dark:text-gray-200">{selectedPatient.age} yrs • {selectedPatient.gender}</span>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Type</span>
                      <span className="font-bold text-red-500">{selectedPatient.bloodType}</span>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-800/30 col-span-2 flex items-center gap-2 shadow-sm">
                      <AlertCircle size={16} className="text-red-500 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-red-400 block">Known Allergies</span>
                        <span className="font-semibold text-red-700 dark:text-red-300">{selectedPatient.allergies}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <Syringe className="text-emerald-500" /> Vaccine History
                    </h3>
                    <button 
                      onClick={() => setIsAddVaccineOpen(true)} 
                      className="flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                    >
                      <Plus size={16} /> Add Vaccine
                    </button>
                  </div>

                  {selectedPatient.immunizations.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">No vaccines recorded yet.</div>
                  ) : (
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-slate-200 dark:before:bg-gray-700">
                      {selectedPatient.immunizations.map((vac) => (
                        <div key={vac.id} className="relative flex items-center">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-gray-800 shrink-0 shadow z-10 ${vac.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-400'}`}>
                            {vac.status === 'Completed' ? <Syringe size={16} className="text-white" /> : <Clock size={16} className="text-white" />}
                          </div>
                          <div className="ml-4 w-full bg-slate-50 dark:bg-gray-900/50 p-4 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-slate-800 dark:text-white">{vac.vaccineType}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${vac.status === 'Completed' ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40' : 'text-blue-600 bg-blue-100 dark:bg-blue-900/40'}`}>
                                {vac.status}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-gray-400 mb-2">{vac.dose} • By: {vac.administeredBy}</p>
                            <div className="flex flex-wrap justify-between items-end">
                              <div className="flex flex-col gap-1 text-xs text-slate-400">
                                {vac.dateGiven !== '-' && <span><strong className="text-slate-500 dark:text-gray-300">Given:</strong> {vac.dateGiven}</span>}
                                {vac.nextSchedule && <span className="text-blue-500"><strong className="text-blue-600 dark:text-blue-400">Due:</strong> {vac.nextSchedule}</span>}
                              </div>
                              {vac.remarks && <span className="text-xs italic text-slate-400 mt-2 md:mt-0">"{vac.remarks}"</span>}
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
          MODAL: LOG VACCINE FOR SPECIFIC PATIENT
          ========================================= */}
      {isAddVaccineOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md border border-slate-100 dark:border-gray-700 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center bg-slate-50 dark:bg-gray-900/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Syringe className="text-emerald-500" size={18} /> Log for {selectedPatient?.name.split(' ')[0]}
              </h2>
              <button onClick={() => setIsAddVaccineOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAddVaccine} className="p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Vaccine Type</label>
                  <select value={vaccineForm.vaccineType} onChange={e => setVaccineForm({...vaccineForm, vaccineType: e.target.value})} className="w-full border p-2.5 rounded-xl mt-1 dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Flu Vaccine</option><option>Polio (OPV)</option><option>BCG</option><option>COVID-19</option><option>Pneumococcal</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Dose</label>
                  <select value={vaccineForm.dose} onChange={e => setVaccineForm({...vaccineForm, dose: e.target.value})} className="w-full border p-2.5 rounded-xl mt-1 dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>1st Dose</option><option>2nd Dose</option><option>Booster</option><option>Annual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
                  <select value={vaccineForm.status} onChange={e => setVaccineForm({...vaccineForm, status: e.target.value})} className="w-full border p-2.5 rounded-xl mt-1 dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Completed</option><option>Scheduled</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Administered By</label>
                  <input type="text" value={vaccineForm.administeredBy} onChange={e => setVaccineForm({...vaccineForm, administeredBy: e.target.value})} className="w-full border p-2.5 rounded-xl mt-1 dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Next Schedule (Optional)</label>
                <input type="date" value={vaccineForm.nextSchedule} onChange={e => setVaccineForm({...vaccineForm, nextSchedule: e.target.value})} className="w-full border p-2.5 rounded-xl mt-1 dark:bg-gray-900 dark:border-gray-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Remarks</label>
                <input type="text" placeholder="Any side effects?" value={vaccineForm.remarks} onChange={e => setVaccineForm({...vaccineForm, remarks: e.target.value})} className="w-full border p-2.5 rounded-xl mt-1 dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsAddVaccineOpen(false)} className="flex-1 py-3 border border-slate-200 dark:border-gray-600 rounded-xl dark:text-white hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors font-medium">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-md">Save Vaccine</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}