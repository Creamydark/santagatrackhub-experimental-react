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
  // Updated roles to allow both admin and official to see these links
  { name: "Users", icon: Users, path: "/users", allowedRoles: ["admin", "official"] },
  { name: "Settings", icon: Settings, path: "/settings"},
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Standardize the role from localStorage
  const userRole = (localStorage.getItem("role") || "").toLowerCase();

  const handleLogout = async () => {
    try {
      // 1. Tell Supabase to invalidate the session on the server
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Supabase logout error:", error.message);
      }
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    } finally {
      // 2. Clear your local storage regardless of server success
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("name");

      // 3. Redirect the user to the login screen
      navigate("/login");
    }
  };

  // Logic to show/hide links based on the user's role
  const filteredMenu = menuItems.filter(item => {
    if (item.allowedRoles) {
      return item.allowedRoles.includes(userRole);
    }
    return true; // Show by default if no role is restricted
  });

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700"
      >
        <Menu size={24} className="text-gray-700 dark:text-gray-300" />
      </button>

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          ${isCollapsed ? "lg:w-20" : "lg:w-64"} 
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-white dark:bg-gray-800 border-r border-slate-100 dark:border-gray-700 flex flex-col h-screen transition-all duration-300 ease-in-out
        `}
      >
        {/* Header Section */}
        <div className="h-20 flex items-center px-4 border-b border-slate-100 dark:border-gray-700 shrink-0 relative">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="bg-blue-600 p-2 rounded-xl shrink-0 shadow-lg shadow-blue-200 dark:shadow-none">
              <LayoutDashboard className="text-white" size={24} />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-[17px] font-bold text-slate-900 dark:text-gray-100 leading-tight">SantagaTrackHub</span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-gray-400 leading-tight">Santiago Tracking</span>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-7 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600 rounded-full p-1 hover:bg-slate-50 dark:hover:bg-gray-700 shadow-sm"
          >
            {isCollapsed ? <ChevronRight size={14} className="text-gray-600 dark:text-gray-300" /> : <ChevronLeft size={14} className="text-gray-600 dark:text-gray-300" />}
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
                onClick={() => setIsMobileOpen(false)} // Close sidebar on mobile after clicking
                className={`group relative flex items-center px-3 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" 
                    : "text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-slate-700 dark:hover:text-gray-200 font-medium"
                }`}
              >
                <Icon size={22} className={`shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-gray-500 group-hover:text-slate-600 dark:group-hover:text-gray-300"}`} />
                {!isCollapsed && (
                  <span className="ml-3 text-sm whitespace-nowrap">
                    {item.name}
                  </span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                   <span className="absolute left-14 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 dark:bg-gray-700 text-white text-[10px] py-1 px-2 rounded shadow-xl pointer-events-none z-50">
                     {item.name}
                   </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-slate-100 dark:border-gray-700 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-3 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition-colors"
          >
            <LogOut size={22} className="shrink-0" />
            {!isCollapsed && <span className="ml-3 text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}