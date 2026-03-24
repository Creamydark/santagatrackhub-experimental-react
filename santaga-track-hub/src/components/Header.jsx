import { useState, useEffect } from "react";
import { Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function Header() {
  const [user, setUser] = useState({ name: "Loading...", role: "" });
  const { theme, toggleTheme } = useTheme();

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
    <header className="flex items-center justify-end px-8 py-3 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
      {/* Search box removed - items now justified to the right */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <div className="relative cursor-pointer group">
          <Bell className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3 border-l pl-6 border-gray-100 dark:border-gray-700">
          <div className="flex flex-col text-right">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">
              {user.name}
            </span>
            <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 capitalize tracking-wide">
              {user.role || "User"}
            </span>
          </div>
          <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-bold text-sm border border-blue-200 dark:border-blue-700">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}