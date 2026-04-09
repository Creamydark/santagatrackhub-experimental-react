import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { supabase } from '../utils/supabaseClient'; // Import your configured Supabase client

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      // 1. Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      // 2. Fetch the actual profile data from your MySQL backend
      // We use the Supabase UUID (data.user.id) to find the right record
      const profileRes = await fetch(`http://localhost:5000/api/auth/profile/${data.user.id}`);
      const profileData = await profileRes.json();

      if (profileRes.ok) {
        // Check if the account is approved before letting them in
        if (profileData.status === 'Pending') {
          setErrorMessage("Your account is still pending administrator approval.");
          await supabase.auth.signOut(); // Log them out of Supabase since they aren't approved yet
          return;
        }

        // 3. Bridge the MySQL data with your existing routing logic
        localStorage.setItem("token", data.session.access_token);
        localStorage.setItem("role", profileData.role.toLowerCase()); // Use database role
        localStorage.setItem("name", profileData.name);               // Use database name
        
        navigate("/dashboard");
      } else {
        setErrorMessage("Profile not found in system records.");
      }
    } catch (err) {
      setErrorMessage("Connection error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-[#f4f7fb] dark:bg-gray-900">
      
      {/* ================= LEFT SIDE: LANDING PAGE / HERO ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-700 overflow-hidden items-center justify-center p-12">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 to-indigo-900 z-0"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-1/2 -right-24 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        {/* Landing Content */}
        <div className="relative z-10 w-full max-w-lg text-white">
          <div className="mb-8 inline-flex items-center justify-center p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
             <svg className="w-8 h-8 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Welcome to <br/>
            <span className="text-blue-200">SantagaTrackHub</span>
          </h1>
          
          <p className="text-lg text-blue-100/90 mb-10 leading-relaxed">
            The automated management and tracking system designed to streamline operational logistics and digitize health records for Barangay Santiago.
          </p>

          {/* Feature List */}
          <div className="space-y-5">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/30 p-2 rounded-lg backdrop-blur-sm border border-blue-400/30">
                <svg className="w-5 h-5 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="text-blue-50 font-medium">Real-time IoT Vehicle Tracking</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/30 p-2 rounded-lg backdrop-blur-sm border border-blue-400/30">
                <svg className="w-5 h-5 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="text-blue-50 font-medium">QR-based Dispatch Logging</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/30 p-2 rounded-lg backdrop-blur-sm border border-blue-400/30">
                <svg className="w-5 h-5 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="text-blue-50 font-medium">Centralized Health Management</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE: LOGIN FORM ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[420px] bg-white dark:bg-gray-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] lg:shadow-none lg:bg-transparent lg:dark:bg-transparent p-8 sm:p-10">
          
          {/* Mobile Header */}
          <div className="lg:hidden flex flex-col items-center mb-8">
             <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200 mb-4">
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
             </div>
             <h1 className="text-2xl font-bold text-slate-800 dark:text-gray-100 tracking-tight">SantagaTrackHub</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100 tracking-tight">Log In</h2>
            <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">Please enter your credentials to access your dashboard.</p>
          </div>

          {/* POPUP ERROR MESSAGE */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-amber-100 p-1 rounded-full mt-0.5">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-[13px] font-medium text-amber-800 leading-relaxed">
                {errorMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5 pb-2">
              <label htmlFor="email" className="block text-[13px] font-bold text-slate-700 dark:text-gray-300 ml-1">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-gray-100 bg-white dark:bg-gray-700"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="space-y-1.5 pb-2">
              <label htmlFor="password" className="block text-[13px] font-bold text-slate-700 dark:text-gray-300 ml-1">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-gray-100 bg-white dark:bg-gray-700"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-100 transition-all duration-200 text-sm active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-[13px] text-slate-500 dark:text-gray-400">
            Don't have an account? <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}