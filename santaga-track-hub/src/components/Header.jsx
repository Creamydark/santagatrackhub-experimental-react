import { useState, useEffect } from "react";
import { Bell } from "lucide-react";

export default function Header() {
  const [user, setUser] = useState({ name: "Loading...", role: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <header className="flex items-center justify-end px-8 py-3 bg-white border-b border-gray-100">
      {/* Search box removed - items now justified to the right */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <div className="relative cursor-pointer group">
          <Bell className="w-6 h-6 text-gray-500 group-hover:text-blue-600 transition-colors" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3 border-l pl-6 border-gray-100">
          <div className="flex flex-col text-right">
            <span className="text-sm font-semibold text-gray-800 leading-tight">
              {user.name}
            </span>
            <span className="text-[11px] font-medium text-gray-400 capitalize tracking-wide">
              {user.role || "User"}
            </span>
          </div>
          <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm border border-blue-200">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}