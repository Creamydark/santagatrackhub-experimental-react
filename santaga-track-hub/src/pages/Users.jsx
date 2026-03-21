import React, { useState, useEffect } from 'react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Data States
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'User', status: 'Active'
  });

  // Sorting State
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const token = localStorage.getItem('token');
  const API_URL = 'http://localhost:5000/api/users';

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // --- SORTING LOGIC ---
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    const valA = a[sortConfig.key]?.toString().toLowerCase() || '';
    const valB = b[sortConfig.key]?.toString().toLowerCase() || '';
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // --- CRUD HANDLERS ---
  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role, status: user.status });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'User', status: 'Active' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingUser ? 'PUT' : 'POST';
    const url = editingUser ? `${API_URL}/${editingUser.id}` : API_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsModalOpen(false);
        fetchUsers();
      }
    } catch (err) {
      alert("Error saving user");
    }
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/${userToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userToDelete.id));
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (user) => {
    try {
      const response = await fetch(`${API_URL}/${user.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        // Keep user data the same but flip status to 'Active'
        body: JSON.stringify({ ...user, status: 'Active' })
      });

      if (response.ok) {
        fetchUsers(); // Refresh the table
      }
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Loading SantagaTrackHub Users...</div>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Staff Management</h1>
          <p className="text-sm text-slate-500">Manage officials, health workers, and drivers</p>
        </div>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow-sm">
          + Add User
        </button>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center border border-slate-100">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <span className="text-3xl font-bold">!</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Are you sure?</h2>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">
              You are about to delete <span className="font-bold text-slate-700">{userToDelete?.name}</span>. This action is permanent.
            </p>
            <div className="flex space-x-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold transition-all">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 font-semibold shadow-md shadow-red-200 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[90] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">{editingUser ? 'Edit System User' : 'Register New User'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                // Simple validation logic
                const newErrors = {};
                if (formData.name.trim().length < 2) newErrors.name = "Please enter a valid full name";
                if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address";
                if (!editingUser && formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

                if (Object.keys(newErrors).length > 0) {
                  setErrors(newErrors);
                } else {
                  setErrors({});
                  handleSubmit(e);
                }
              }} 
              className="p-6 space-y-4"
            >
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={formData.name} 
                  onChange={(e) => {
                      setFormData({...formData, name: e.target.value});
                      if(errors.name) setErrors({...errors, name: null});
                  }} 
                  className={`w-full border p-2.5 rounded-xl outline-none transition-all ${
                    errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                  }`} 
                />
                {errors.name && <p className="text-xs text-red-500 ml-1 font-medium">{errors.name}</p>}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  value={formData.email} 
                  onChange={(e) => {
                      setFormData({...formData, email: e.target.value});
                      if(errors.email) setErrors({...errors, email: null});
                  }} 
                  className={`w-full border p-2.5 rounded-xl outline-none transition-all ${
                    errors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                  }`} 
                />
                {errors.email && <p className="text-xs text-red-500 ml-1 font-medium">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                <input 
                  type="password" 
                  placeholder={editingUser ? "Leave blank to keep current" : "••••••••"} 
                  value={formData.password} 
                  onChange={(e) => {
                      setFormData({...formData, password: e.target.value});
                      if(errors.password) setErrors({...errors, password: null});
                  }} 
                  className={`w-full border p-2.5 rounded-xl outline-none transition-all ${
                    errors.password ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                  }`} 
                />
                {errors.password && <p className="text-xs text-red-500 ml-1 font-medium">{errors.password}</p>}
              </div>

              {/* Row for Role & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Role</label>
                  <select 
                    value={formData.role} 
                    onChange={(e) => setFormData({...formData, role: e.target.value})} 
                    className="w-full border border-slate-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Official">Official</option>
                    <option value="Health Worker">Health Worker</option>
                    <option value="Driver">Driver</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Status</label>
                  <select 
                    value={formData.status} 
                    onChange={(e) => setFormData({...formData, status: e.target.value})} 
                    className="w-full border border-slate-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => { setErrors({}); setIsModalOpen(false); }} 
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors"
                >
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MAIN TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
            <tr>
              <th onClick={() => handleSort('name')} className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors">Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}</th>
              <th className="px-6 py-4">Email</th>
              <th onClick={() => handleSort('role')} className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors">Role {sortConfig.key === 'role' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}</th>
              <th onClick={() => handleSort('status')} className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors">Status {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedUsers.map((user) => (
              <tr key={user.id} className="text-sm hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4 font-semibold text-slate-700">{user.name}</td>
                <td className="px-6 py-4 text-slate-500">{user.email}</td>
                <td className="px-6 py-4"><span className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-md text-[12px]">{user.role}</span></td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[12px] font-bold border ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {user.status}
                  </span>
                  {/* Show Approve button ONLY if user is Pending */}
                  {user.status.toLowerCase() === 'pending' && (
                    <button 
                      onClick={() => handleApprove(user)} 
                      className="text-emerald-600 hover:text-emerald-800 font-bold text-[12px] uppercase tracking-wider"
                    >
                      Approve
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 text-center space-x-5">
                  <button onClick={() => openEditModal(user)} className="text-blue-600 hover:text-blue-800 font-bold text-[12px] uppercase tracking-wider">Edit</button>
                  <button onClick={() => { setUserToDelete(user); setIsDeleteModalOpen(true); }} className="text-red-500 hover:text-red-700 font-bold text-[12px] uppercase tracking-wider">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && !loading && <div className="p-20 text-center text-slate-400 italic">No staff members found in the database.</div>}
      </div>
    </div>
  );
}