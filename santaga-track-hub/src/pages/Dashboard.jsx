import React from "react";
import { 
  Truck, 
  Users, 
  Syringe, 
  CheckCircle, 
  QrCode 
} from "lucide-react";
import LiveTrackingMap from "../components/LiveTrackingMap";

export default function Dashboard() {
  const stats = [
    { 
      label: "Active Vehicles", 
      value: "12", 
      subtext: "↑ 3 on missions", 
      icon: <Truck className="text-blue-600" />, 
      bg: "bg-blue-100" 
    },
    { 
      label: "Total Patients", 
      value: "1,240", 
      subtext: "↑ 28 this month", 
      icon: <Users className="text-emerald-600" />, 
      bg: "bg-emerald-100" 
    },
    { 
      label: "Vaccinations", 
      value: "892", 
      subtext: "↑ 45 completed", 
      icon: <Syringe className="text-amber-600" />, 
      bg: "bg-amber-100" 
    },
    { 
      label: "System Status", 
      value: "99.8%", 
      subtext: "✓ Operational", 
      icon: <CheckCircle className="text-slate-600" />, 
      bg: "bg-slate-100" 
    },
  ];

  const vehicles = [
    { id: "001", driver: "Juan Dela Cruz", status: "Active" },
    { id: "002", driver: "Maria Santos", status: "Active" },
    { id: "003", driver: "Pedro Reyes", status: "Idle" },
  ];

  const activities = [
    { title: "Vehicle Check-out", details: "Vehicle #005 - Juan Dela Cruz", time: "2 minutes ago" },
    { title: "Patient Registered", details: "Maria Gonzales - New record", time: "15 minutes ago" },
    { title: "Vaccination Completed", details: "Carlos Reyes - COVID-19 Booster", time: "32 minutes ago" },
  ];

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
              <p className="text-3xl font-semibold text-slate-900 mt-2">{stat.value}</p>
              <p className={`text-xs mt-2 ${stat.label === "System Status" ? "text-emerald-600" : "text-emerald-600"}`}>
                {stat.subtext}
              </p>
            </div>
            <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Map & List Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Live Tracking</h3>
          </div>
          <div className="bg-slate-100 flex items-center justify-center" style={{ height: "350px" }}>
            <LiveTrackingMap />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Vehicles</h3>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[350px]">
            <div className="divide-y divide-slate-200">
              {vehicles.map((v, i) => (
                <div key={i} className="p-4 hover:bg-slate-50 transition cursor-pointer">
                  <p className="font-medium text-slate-900 text-sm">Vehicle #{v.id}</p>
                  <p className="text-xs text-slate-500 mt-1">{v.driver}</p>
                  <span className={`mt-2 inline-block px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    v.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity & Patients Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-slate-200 max-h-64 overflow-y-auto">
            {activities.map((act, i) => (
              <div key={i} className="p-4 hover:bg-slate-50 transition">
                <p className="text-sm font-medium text-slate-900">{act.title}</p>
                <p className="text-xs text-slate-500 mt-1">{act.details}</p>
                <p className="text-xs text-slate-400 mt-2">{act.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Recent Patients</h3>
          </div>
          <div className="divide-y divide-slate-200 max-h-64 overflow-y-auto">
            {[
              { name: "Anna Reyes", id: "PAT-001", age: 35 },
              { name: "Juan Dela Cruz", id: "PAT-002", age: 42 }
            ].map((p, i) => (
              <div key={i} className="p-4 hover:bg-slate-50 transition cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-500 mt-1">Age: {p.age} | ID: {p.id}</p>
                  </div>
                  <QrCode className="text-slate-400 w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}