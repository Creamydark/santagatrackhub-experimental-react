import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useTheme } from '../contexts/ThemeContext'; // Import your theme hook

export default function Users() {
  const { theme } = useTheme(); // Access the current theme
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', role: 'Health Worker', status: 'Pending'
  });

  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const API_URL = 'http://localhost:5000/api/auth/profiles';

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // --- CRUD HANDLERS ---
  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, status: user.status });
    setIsModalOpen(true);
  };

  // 1. FIXED SUBMIT: Added validation and better error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // We target auth_id because that is our primary bridge to Supabase
    const url = editingUser 
      ? `${API_URL}/${editingUser.auth_id}` 
      : API_URL;

    try {
      const response = await fetch(url, {
        method: editingUser ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          status: formData.status
          // email is excluded as it should not be changed after creation
        })
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchUsers(); // Refresh the table
        setEditingUser(null);
      } else {
        const errorData = await response.json();
        alert(`Failed: ${errorData.error || 'Check backend logs'}`);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Network error. Is your Node.js server running?");
    }
  };

  // 2. NEW DELETE HANDLER: This was missing in your previous code
  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`${API_URL}/${userToDelete.auth_id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setUsers(users.filter(u => u.auth_id !== userToDelete.auth_id));
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      } else {
        alert("Failed to delete user from database.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handlePasswordReset = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/reset-password',
    });
    if (error) alert(error.message);
    else alert("Password reset link sent to " + email);
  };

  const sortedUsers = [...users].sort((a, b) => {
    const valA = a[sortConfig.key]?.toString().toLowerCase() || '';
    const valB = b[sortConfig.key]?.toString().toLowerCase() || '';
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading) return (
    <div className="p-10 text-center text-slate-500 dark:text-gray-400 font-medium bg-slate-50 dark:bg-gray-900 min-h-screen">
      Loading SantagaTrackHub Staff...
    </div>
  );

  return (
    <div className="p-6 bg-slate-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-gray-100">Staff Management</h1>
          <p className="text-sm text-slate-500 dark:text-gray-400">Manage officials and approved workers</p>
        </div>
      </div>


      {/* DELETE CONFIRMATION MODAL (Add this to your JSX) */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Delete</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">
              Are you sure you want to remove <span className="font-bold">{userToDelete?.name}</span>? This action cannot be undone.
            </p>
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2 border rounded-xl dark:border-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[90] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                {editingUser ? 'Edit Staff Profile' : 'Add Staff Record'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white dark:bg-gray-800">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full border border-slate-200 dark:border-gray-600 p-2.5 rounded-xl bg-white dark:bg-gray-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Email (View Only)</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  disabled 
                  className="w-full border border-slate-200 dark:border-gray-600 p-2.5 rounded-xl bg-slate-50 dark:bg-gray-900 text-slate-500 dark:text-gray-400 cursor-not-allowed" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Role</label>
                  <select 
                    value={formData.role} 
                    onChange={(e) => setFormData({...formData, role: e.target.value})} 
                    className="w-full border border-slate-200 dark:border-gray-600 p-2.5 rounded-xl bg-white dark:bg-gray-700 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Official">Official</option>
                    <option value="Health Worker">Health Worker</option>
                    <option value="Driver">Driver</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Status</label>
                  <select 
                    value={formData.status} 
                    onChange={(e) => setFormData({...formData, status: e.target.value})} 
                    className="w-full border border-slate-200 dark:border-gray-600 p-2.5 rounded-xl bg-white dark:bg-gray-700 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {editingUser && (
                <div className="pt-2">
                   <button 
                    type="button"
                    onClick={() => handlePasswordReset(formData.email)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                   >
                     Send Password Reset Email to User
                   </button>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-2.5 border border-slate-200 dark:border-gray-600 rounded-xl text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 dark:shadow-none transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm transition-colors">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 dark:bg-gray-900/50 border-b border-slate-100 dark:border-gray-700 text-slate-500 dark:text-gray-400 text-[11px] uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-700">
            {sortedUsers.map((user) => (
              <tr key={user.auth_id} className="text-sm hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-800 dark:text-gray-200">{user.name}</td>
                <td className="px-6 py-4">
                  <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-lg text-[12px] font-medium border border-blue-100 dark:border-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[12px] font-bold ${
                    user.status === 'Approved' 
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' 
                    : user.status === 'Pending'
                    ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400'
                    : 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center space-x-4">
                  <button onClick={() => openEditModal(user)} className="text-blue-600 dark:text-blue-400 font-bold text-[11px] uppercase hover:underline">Edit</button>
                  <button onClick={() => { setUserToDelete(user); setIsDeleteModalOpen(true); }} className="text-red-500 dark:text-red-400 font-bold text-[11px] uppercase hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}