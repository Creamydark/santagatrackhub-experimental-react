import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Health Worker' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Point this to your public registration endpoint
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData) // Status should default to 'Pending' on the backend
      });

      if (response.ok) {
        setMessage('Registration successful! Please wait for an administrator to approve your account.');
        setTimeout(() => navigate('/login'), 5000);
      } else {
        setMessage('Registration failed. Please try again.');
      }
    } catch (err) {
      setMessage('Network error. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Create an Account</h2>
        <p className="text-slate-500 mb-6 text-sm">Sign up for SantagaTrackHub access.</p>
        
        {message && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
            <input 
              type="text" required
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="w-full border border-slate-200 p-2.5 rounded-xl outline-none focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
            <input 
              type="email" required
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              className="w-full border border-slate-200 p-2.5 rounded-xl outline-none focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
            <input 
              type="password" required minLength="6"
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              className="w-full border border-slate-200 p-2.5 rounded-xl outline-none focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Requested Role</label>
            <select 
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value})} 
              className="w-full border border-slate-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="Health Worker">Health Worker</option>
              <option value="Driver">Driver</option>
              <option value="Official">Official</option>
            </select>
          </div>

          <button type="submit" className="w-full py-2.5 mt-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-md transition-colors">
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}