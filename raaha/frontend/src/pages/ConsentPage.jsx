import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShieldCheck, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../api';

export default function ConsentPage() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [consented, setConsented] = useState(false);

  const handleConsent = async () => {
    if (!consented) return;
    
    setLoading(true);
    try {
      await api.post(`/applications/${appId}/consent`, { granted: true });
      navigate(`/workflow/${appId}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 text-teal-600 rounded-full mb-4">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Consent & Data Access</h1>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          To process your application, RAAHA requires permission to access your records across the following departments.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-700 uppercase text-sm tracking-wider">Required Permissions</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-4 items-start">
            <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><Check size={14} /></div>
            <div>
              <p className="font-medium text-slate-800">Identity Verification</p>
              <p className="text-sm text-slate-500">Verify basic demographic details and identity.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><Check size={14} /></div>
            <div>
              <p className="font-medium text-slate-800">Education Record Verification</p>
              <p className="text-sm text-slate-500">Access enrollment status from the Education Department.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><Check size={14} /></div>
            <div>
              <p className="font-medium text-slate-800">Income Eligibility Verification</p>
              <p className="text-sm text-slate-500">Verify income bracket with the Income Tax Department.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><Check size={14} /></div>
            <div>
              <p className="font-medium text-slate-800">Welfare Eligibility Verification</p>
              <p className="text-sm text-slate-500">Check existing benefits with the Welfare Department.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="mt-1">
            <input 
              type="checkbox" 
              checked={consented}
              onChange={(e) => setConsented(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
          </div>
          <span className="text-sm text-slate-700 leading-relaxed font-medium">
            I authorize RAAHA to request and process the required verification information from connected departments on my behalf for the sole purpose of determining eligibility for this application.
          </span>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <button 
          onClick={handleConsent}
          disabled={!consented || loading}
          className={`font-medium py-3 px-6 rounded-xl flex items-center gap-2 transition-all ${
            consented 
              ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-md' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {loading ? 'Processing...' : 'Give Consent & Continue'} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
