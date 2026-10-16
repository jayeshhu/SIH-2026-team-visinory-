import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import api from '../api';

export default function StatusPage() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [app, setApp] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resStatus, resApp] = await Promise.all([
          api.get(`/applications/${appId}/status`),
          api.get(`/applications/${appId}`)
        ]);
        setStatus(resStatus.data);
        setApp(resApp.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [appId]);

  if (!status || !app) return <div className="text-center py-20 text-slate-500">Loading status...</div>;

  const isComplete = status.status === 'COMPLETED';

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 rounded-full text-slate-600">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Unified Application Status</h1>
          <p className="text-slate-500 mt-1">Real-time status view for citizen portal.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
        <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-100">
          <div>
            <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-1">Application ID</p>
            <p className="font-mono font-medium text-slate-800">{appId}</p>
            <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold mt-4 mb-1">Service</p>
            <p className="font-medium text-slate-800">{app.service}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-2">Overall Status</p>
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase ${isComplete ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
              {status.status}
            </span>
          </div>
        </div>

        <h3 className="font-bold text-slate-800 mb-6">Verification Timeline</h3>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 bg-green-100 text-green-600 p-1.5 rounded-full"><Check size={16} /></div>
            <div>
              <p className="font-semibold text-slate-800">Application Submitted</p>
              <p className="text-sm text-slate-500">Identity established.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="mt-0.5 bg-green-100 text-green-600 p-1.5 rounded-full"><Check size={16} /></div>
            <div>
              <p className="font-semibold text-slate-800">Consent Granted</p>
              <p className="text-sm text-slate-500">Data sharing authorized.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className={`mt-0.5 p-1.5 rounded-full ${status.education_status === 'VERIFIED' ? 'bg-green-100 text-green-600' : status.education_status === 'FAILED' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
              {status.education_status === 'VERIFIED' ? <Check size={16}/> : status.education_status === 'FAILED' ? <X size={16}/> : <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>}
            </div>
            <div>
              <p className={`font-semibold ${status.education_status === 'FAILED' ? 'text-red-700' : 'text-slate-800'}`}>Education Verification</p>
              <p className="text-sm text-slate-500">Status: {status.education_status}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className={`mt-0.5 p-1.5 rounded-full ${status.income_status === 'VERIFIED' ? 'bg-green-100 text-green-600' : status.income_status === 'FAILED' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
              {status.income_status === 'VERIFIED' ? <Check size={16}/> : status.income_status === 'FAILED' ? <X size={16}/> : <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>}
            </div>
            <div>
              <p className={`font-semibold ${status.income_status === 'FAILED' ? 'text-red-700' : 'text-slate-800'}`}>Income Verification</p>
              <p className="text-sm text-slate-500">Status: {status.income_status}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className={`mt-0.5 p-1.5 rounded-full ${status.welfare_status === 'VERIFIED' ? 'bg-green-100 text-green-600' : status.welfare_status === 'FAILED' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
              {status.welfare_status === 'VERIFIED' ? <Check size={16}/> : status.welfare_status === 'FAILED' ? <X size={16}/> : <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>}
            </div>
            <div>
              <p className={`font-semibold ${status.welfare_status === 'FAILED' ? 'text-red-700' : 'text-slate-800'}`}>Welfare Verification</p>
              <p className="text-sm text-slate-500">Status: {status.welfare_status}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className={`mt-0.5 p-1.5 rounded-full ${isComplete ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
              {isComplete ? <Check size={16}/> : <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>}
            </div>
            <div>
              <p className="font-semibold text-slate-800">Eligibility Calculated</p>
              <p className="text-sm text-slate-500">{isComplete ? 'Calculation complete.' : 'Pending calculation.'}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className={`mt-0.5 p-1.5 rounded-full ${isComplete ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
              {isComplete ? <Check size={16}/> : <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>}
            </div>
            <div>
              <p className="font-semibold text-slate-800">Application Completed</p>
              <p className="text-sm text-slate-500">Process finished.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
