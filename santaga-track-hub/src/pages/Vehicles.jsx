import React, { useState } from 'react';
import { 
  Truck, Search, Filter, MoreVertical, 
  Map as MapIcon, List, Fuel, Gauge, AlertCircle 
} from 'lucide-react';

// Mock data for the fleet
const vehicles = [
  { id: 'STR-001', name: 'Heavy Hauler 01', status: 'Moving', fuel: '82%', speed: '65 km/h', location: 'Manila' },
  { id: 'STR-002', name: 'Delivery Van 04', status: 'Idle', fuel: '45%', speed: '0 km/h', location: 'Quezon City' },
  { id: 'STR-003', name: 'Service Truck 09', status: 'Alert', fuel: '12%', speed: '40 km/h', location: 'Makati' },
];

export default function Vehicles() {
  const [viewMode, setViewMode] = useState('split'); // 'list', 'map', or 'split'

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header Area */}
      <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Vehicle Management</h1>
          <p className="text-xs text-slate-500">Real-time fleet tracking and status</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setViewMode('split')}
            className={`p-2 rounded-md transition ${viewMode === 'split' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`p-2 rounded-md transition ${viewMode === 'map' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
          >
            <MapIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Vehicle List */}
        <div className={`${viewMode === 'map' ? 'hidden' : 'w-full lg:w-1/3'} border-r border-slate-200 bg-white overflow-y-auto`}>
          <div className="p-4 sticky top-0 bg-white border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Plate or ID..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {vehicles.map((v) => (
              <div key={v.id} className="p-4 hover:bg-blue-50 cursor-pointer transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${v.status === 'Alert' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">{v.name}</h3>
                      <span className="text-xs text-slate-400">{v.id}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    v.status === 'Moving' ? 'bg-green-100 text-green-700' : 
                    v.status === 'Alert' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {v.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="flex items-center text-xs text-slate-500">
                    <Fuel className="w-3 h-3 mr-1 text-slate-400" /> {v.fuel}
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <Gauge className="w-3 h-3 mr-1 text-slate-400" /> {v.speed}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Interactive Map Placeholder */}
        <div className={`${viewMode === 'list' ? 'hidden' : 'flex-1'} bg-slate-200 relative`}>
          {/* Map Simulation UI */}
          <div className="absolute inset-0 bg-[#e5e7eb] flex items-center justify-center">
             <div className="text-center text-slate-500">
                <MapIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p className="font-medium">Interactive Map View</p>
                <p className="text-xs">Integrating Google Maps / Leaflet API...</p>
             </div>
          </div>

          {/* Floating Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="bg-white p-2 rounded shadow-md hover:bg-slate-50"><Filter className="w-4 h-4 text-slate-600" /></button>
            <button className="bg-white p-2 rounded shadow-md hover:bg-slate-50 text-blue-600 font-bold">+</button>
            <button className="bg-white p-2 rounded shadow-md hover:bg-slate-50 text-blue-600 font-bold">-</button>
          </div>
        </div>
      </div>
    </div>
  );
}