import { useState, useEffect } from "react";
import { Search, Bell } from "lucide-react";

export default function Header() {
  const [user, setUser] = useState({ name: "Loading...", role: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Or however you store your JWT
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
    <header className="flex items-center justify-between px-8 py-3 bg-white border-b border-gray-100">
      <div className="relative w-72">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="w-5 h-5 text-gray-400" />
        </span>
        <input
          type="text"
          placeholder="Search..."
          className="block w-full py-2 pl-10 pr-3 bg-gray-50 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative cursor-pointer">
          <Bell className="w-6 h-6 text-gray-500" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800 leading-tight">
              {user.name}
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {user.role}
            </span>
          </div>
          <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white font-bold rounded-xl shadow-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          
        </div>
      </div>
    </header>
  );
}