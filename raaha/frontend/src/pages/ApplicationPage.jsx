import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, FileText, ArrowRight, ShieldAlert } from 'lucide-react';
import api from '../api';

export default function ApplicationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'Rahul Sharma',
    citizen_id: 'CIT001',
    service: 'Scholarship Verification'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/applications', formData);
      navigate(`/consent/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create application');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">New Application</h1>
        <p className="text-slate-500 mt-2">Submit a request for government services.</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 flex gap-4 items-start text-blue-800">
        <ShieldAlert className="shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold">Automated Verification</h3>
          <p className="text-sm mt-1 text-blue-700 opacity-90">
            RAAHA will verify your eligibility across connected departments automatically. 
            You do not need to upload physical documents.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Citizen ID (Aadhaar/SSN)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FileText size={18} />
                </div>
                <input
                  type="text"
                  value={formData.citizen_id}
                  onChange={e => setFormData({...formData, citizen_id: e.target.value})}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Service Requested</label>
              <select
                value={formData.service}
                onChange={e => setFormData({...formData, service: e.target.value})}
                className="block w-full px-3 py-3 border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              >
                <option value="Scholarship Verification">Scholarship Verification</option>
                <option value="Housing Subsidy">Housing Subsidy</option>
                <option value="Healthcare Benefits">Healthcare Benefits</option>
              </select>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-500 text-white font-medium py-3 px-8 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Continue'} <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
