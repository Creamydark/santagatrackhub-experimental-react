import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Search } from 'lucide-react';

export default function VaccineStocks() {
  const { theme } = useTheme();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [stockToDelete, setStockToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    vaccineName: '',
    batchNumber: '',
    quantity: '',
    expiryDate: '',
    receivedDate: new Date().toISOString().split('T')[0]
  });

  const API_URL = 'http://localhost:5000/api/inventory';

  const fetchStocks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStocks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStocks(); }, []);

  const openEditModal = (stock) => {
    setEditingStock(stock);
    setFormData({
      vaccineName: stock.vaccineName,
      batchNumber: stock.batchNumber,
      quantity: stock.quantity,
      expiryDate: stock.expiryDate,
      receivedDate: stock.receivedDate
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingStock ? `${API_URL}/${editingStock.id}` : API_URL;
    try {
      const response = await fetch(url, {
        method: editingStock ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEditingStock(null);
        fetchStocks();
        setFormData({ 
          vaccineName: '', 
          batchNumber: '', 
          quantity: '', 
          expiryDate: '', 
          receivedDate: new Date().toISOString().split('T')[0] 
        });
      } else {
        const errorData = await response.json();
        alert(`Failed: ${errorData.error || 'Check backend logs'}`);
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Network error. Is your Node.js server running?");
    }
  };

  const confirmDelete = async () => {
    if (!stockToDelete) return;
    try {
      const response = await fetch(`${API_URL}/${stockToDelete.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setStocks(stocks.filter(s => s.id !== stockToDelete.id));
        setIsDeleteModalOpen(false);
        setStockToDelete(null);
      } else {
        alert("Failed to delete stock entry.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredStocks = stocks.filter(stock => 
    stock.vaccineName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    stock.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="p-10 text-center text-slate-500 dark:text-gray-400 font-medium bg-slate-50 dark:bg-gray-900 min-h-screen">
      Loading SantagaTrackHub Inventory...
    </div>
  );

  return (
    <div className="p-6 bg-slate-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-gray-100">Vaccine Inventory</h1>
          <p className="text-sm text-slate-500 dark:text-gray-400">Track and audit vaccine stock levels</p>
        </div>
        <button 
          onClick={() => {
            setEditingStock(null);
            setFormData({ 
              vaccineName: '', 
              batchNumber: '', 
              quantity: '', 
              expiryDate: '', 
              receivedDate: new Date().toISOString().split('T')[0] 
            });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-blue-200 dark:shadow-none transition-all"
        >
          + Add Stock Entry
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6 flex bg-white dark:bg-gray-800 p-3 rounded-2xl border border-slate-200 dark:border-gray-700 items-center gap-3 shadow-sm">
        <Search className="text-slate-400 ml-2" size={20} />
        <input 
          type="text" 
          placeholder="Search by vaccine name or batch number..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="w-full bg-transparent border-none outline-none text-slate-700 dark:text-gray-200 placeholder:text-slate-400" 
        />
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Delete</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">
              Are you sure you want to remove <span className="font-bold">{stockToDelete?.vaccineName} (Batch: {stockToDelete?.batchNumber})</span>? This action cannot be undone.
            </p>
            <div className="flex space-x-3 mt-6">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2 border rounded-xl dark:border-gray-600 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD STOCK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[90] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">{editingStock ? 'Edit Stock Entry' : 'New Stock Entry'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white dark:bg-gray-800">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Vaccine Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.vaccineName} 
                  onChange={(e) => setFormData({...formData, vaccineName: e.target.value})} 
                  className="w-full border border-slate-200 dark:border-gray-600 p-2.5 rounded-xl bg-white dark:bg-gray-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Batch Number</label>
                  <input 
                    type="text" 
                    required
                    value={formData.batchNumber} 
                    onChange={(e) => setFormData({...formData, batchNumber: e.target.value})} 
                    className="w-full border border-slate-200 dark:border-gray-600 p-2.5 rounded-xl bg-white dark:bg-gray-700 text-slate-900 dark:text-white outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Quantity</label>
                  <input 
                    type="number" 
                    required
                    value={formData.quantity} 
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})} 
                    className="w-full border border-slate-200 dark:border-gray-600 p-2.5 rounded-xl bg-white dark:bg-gray-700 text-slate-900 dark:text-white outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Expiry Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.expiryDate} 
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} 
                    className="w-full border border-slate-200 dark:border-gray-600 p-2.5 rounded-xl bg-white dark:bg-gray-700 text-slate-900 dark:text-white outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Date Received</label>
                  <input 
                    type="date" 
                    required
                    value={formData.receivedDate} 
                    onChange={(e) => setFormData({...formData, receivedDate: e.target.value})} 
                    className="w-full border border-slate-200 dark:border-gray-600 p-2.5 rounded-xl bg-white dark:bg-gray-700 text-slate-900 dark:text-white outline-none" 
                  />
                </div>
              </div>

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
                  {editingStock ? 'Update Inventory' : 'Save to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INVENTORY TABLE / AUDIT LOG */}
      <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm transition-colors">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 dark:bg-gray-900/50 border-b border-slate-100 dark:border-gray-700 text-slate-500 dark:text-gray-400 text-[11px] uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Vaccine</th>
              <th className="px-6 py-4">Batch ID</th>
              <th className="px-6 py-4">Current Stock</th>
              <th className="px-6 py-4">Expiry</th>
              <th className="px-6 py-4">Audit Date</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-700">
            {filteredStocks.map((item) => (
              <tr key={item.id} className="text-sm hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-800 dark:text-gray-200">{item.vaccineName}</td>
                <td className="px-6 py-4 text-slate-500 dark:text-gray-400 font-mono text-xs">{item.batchNumber}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-[12px] font-bold ${
                    item.quantity < 10 
                    ? 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400' 
                    : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400'
                  }`}>
                    {item.quantity} units
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-gray-400">{item.expiryDate}</td>
                <td className="px-6 py-4 text-slate-400 dark:text-gray-500 italic text-xs">{item.receivedDate}</td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => openEditModal(item)} 
                    className="text-blue-600 dark:text-blue-400 font-bold text-[11px] uppercase hover:underline"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => { setStockToDelete(item); setIsDeleteModalOpen(true); }} 
                    className="text-red-500 dark:text-red-400 font-bold text-[11px] uppercase hover:underline ml-3"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredStocks.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-400 dark:text-gray-500 font-medium">
                  {stocks.length === 0 
                    ? "No inventory records found. Add your first stock entry to begin auditing." 
                    : "No inventory records match your search criteria."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}