import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // NEW: State for the popup message
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("name", data.user.name);
        navigate("/dashboard");
      } else {
        // Set the error message (e.g., "Your account is pending approval")
        setErrorMessage(data.message);
      }
    } catch (err) {
      setErrorMessage("Connection error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-[420px] p-8 sm:p-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200 mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09m15.44 2.04l-.054-.09m-2.744-10.03L20.52 9M15.52 9l-3.33 3.33m0 0l-3.33-3.33m3.33 3.33V4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 text-sm mt-1">Please enter your details to sign in.</p>
        </div>

        {/* ✅ POPUP ERROR MESSAGE */}
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
          {/* Email Input */}
          <div className="space-y-1.5 pb-2">
            <label htmlFor="email" className="block text-[13px] font-bold text-slate-700 ml-1">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              placeholder="name@example.com"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5 pb-2">
            <label htmlFor="password" className="block text-[13px] font-bold text-slate-700 ml-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
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

        <p className="mt-8 text-center text-[13px] text-slate-500">
          Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}