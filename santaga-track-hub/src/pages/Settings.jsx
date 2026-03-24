import React from "react";
import { useTheme } from "../contexts/ThemeContext.jsx";
import { 
  Sun, 
  Moon, 
  User, 
  Bell, 
  Shield, 
  Smartphone, 
  Globe, 
  LogOut,
  ChevronRight
} from "lucide-react";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  const SettingSection = ({ icon: Icon, title, children }) => (
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
          {title}
        </h2>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );

  const SettingRow = ({ label, description, action }) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 shadow-sm hover:border-blue-300 dark:hover:border-blue-500 transition-all group">
      <div>
        <p className="font-semibold text-slate-800 dark:text-gray-100">{label}</p>
        {description && (
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      <div>{action}</div>
    </div>
  );

  return (
    <div className="p-6 bg-slate-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Settings
          </h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1">
            Manage your account preferences and system configurations.
          </p>
        </header>

        {/* --- Profile Section --- */}
        <SettingSection icon={User} title="Account Profile">
          <div className="flex items-center p-4 rounded-xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
              JD
            </div>
            <div className="ml-4 flex-1">
              <p className="font-bold text-slate-800 dark:text-white text-base">John Doe</p>
              <p className="text-xs text-slate-500 dark:text-gray-400">fleet_manager@company.com</p>
            </div>
            <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Edit
            </button>
          </div>
        </SettingSection>

        {/* --- Appearance Section --- */}
        <SettingSection icon={Smartphone} title="Appearance">
          <SettingRow 
            label="Visual Theme"
            description="Switch between light and dark modes for better visibility."
            action={
              <button
                onClick={toggleTheme}
                className="relative flex items-center w-20 h-9 p-1 rounded-xl bg-slate-100 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 transition-colors focus:outline-none"
                aria-label="Toggle theme"
              >
                {/* The Sliding Background Pill */}
                <div 
                  className={`absolute h-7 w-9 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-transform duration-200 ease-in-out ${
                    theme === 'dark' ? 'translate-x-9' : 'translate-x-0'
                  }`} 
                />

                {/* The Icons */}
                <div className="flex justify-between items-center w-full px-2 z-10 pointer-events-none">
                  <Sun 
                    className={`w-4 h-4 transition-colors duration-200 ${
                      theme === 'light' ? 'text-amber-500' : 'text-slate-400'
                    }`} 
                  />
                  <Moon 
                    className={`w-4 h-4 transition-colors duration-200 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-slate-500'
                    }`} 
                  />
                </div>
              </button>
            }
          />
        </SettingSection>

        {/* --- Notifications Section --- */}
        <SettingSection icon={Bell} title="Notifications">
          <SettingRow 
            label="Email Alerts" 
            description="Receive daily summary of vehicle maintenance."
            action={
              <div className="w-10 h-5 bg-blue-600 rounded-full flex items-center px-1 cursor-pointer">
                <div className="w-3 h-3 bg-white rounded-full ml-auto" />
              </div>
            }
          />
          <SettingRow 
            label="Desktop Notifications" 
            description="Real-time alerts for vehicle status changes."
            action={
              <div className="w-10 h-5 bg-slate-300 dark:bg-gray-600 rounded-full flex items-center px-1 cursor-pointer">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            }
          />
        </SettingSection>

        {/* --- Security & System --- */}
        <SettingSection icon={Shield} title="Security">
          <SettingRow 
            label="Two-Factor Authentication" 
            description="Add an extra layer of security to your account."
            action={<ChevronRight className="text-slate-400" size={18} />}
          />
        </SettingSection>

        <footer className="mt-12 pt-6 border-t border-slate-200 dark:border-gray-800 flex justify-between items-center">
            <button className="flex items-center space-x-2 text-red-500 hover:text-red-600 font-bold text-sm transition-colors">
                <LogOut size={18} />
                <span>Log Out</span>
            </button>
            <span className="text-[10px] text-slate-400 font-medium">App Version 2.4.0-stable</span>
        </footer>
      </div>
    </div>
  );
}