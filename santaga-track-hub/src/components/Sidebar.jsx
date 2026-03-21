import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Truck, 
  Heart, 
  QrCode, 
  Users, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Vehicles", icon: Truck, path: "/vehicles" },
  { name: "Health", icon: Heart, path: "/health" },
  { name: "QR Codes", icon: QrCode, path: "/qrcodes" },
  { name: "Users", icon: Users, path: "/users", role: "admin" },
  { name: "Settings", icon: Settings, path: "/settings", role: "admin" },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false); // For mobile menu toggle
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = (localStorage.getItem("role") || "").toLowerCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const filteredMenu = menuItems.filter(item => {
    if (item.role === "admin") return userRole === "admin";
    return true;
  });

  return (
    <>
      {/* Mobile Toggle Button (Only visible on small screens) */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          ${isCollapsed ? "lg:w-20" : "lg:w-64"} 
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-white border-r flex flex-col h-screen transition-all duration-300 ease-in-out
        `}
      >
        {/* Header Section */}
        <div className="h-20 flex items-center px-4 border-b border-slate-100 shrink-0 relative">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="bg-blue-600 p-2 rounded-xl shrink-0">
              <LayoutDashboard className="text-white" size={24} />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col whitespace-nowrap opacity-100 transition-opacity">
                <span className="text-[17px] font-bold text-slate-900 leading-tight">SantagaHub</span>
                <span className="text-[11px] font-medium text-slate-500 leading-tight">Santiago Tracking</span>
              </div>
            )}
          </div>
          
          {/* Collapse Toggle (Desktop only) */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-7 bg-white border rounded-full p-1 hover:bg-slate-50"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-3 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-blue-50 text-blue-600 font-semibold" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium"
                }`}
              >
                <Icon size={22} className={`shrink-0 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                {!isCollapsed && (
                  <span className="ml-3 text-sm whitespace-nowrap transition-opacity">
                    {item.name}
                  </span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                   <span className="absolute left-16 scale-0 group-hover:scale-100 transition-all bg-slate-800 text-white text-xs p-2 rounded ml-4 pointer-events-none">
                     {item.name}
                   </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            <LogOut size={22} className="shrink-0" />
            {!isCollapsed && <span className="ml-3 text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}