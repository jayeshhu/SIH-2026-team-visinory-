import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, XCircle, FileSearch, Activity, Home } from 'lucide-react';
import api from '../api';

export default function ResultPage() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [verification, setVerification] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resApp, resVer] = await Promise.all([
          api.get(`/applications/${appId}`),
          api.get(`/applications/${appId}/verification`)
        ]);
        setApp(resApp.data);
        setVerification(resVer.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [appId]);

  if (!app || !verification) return <div className="text-center py-20 text-slate-500">Loading result...</div>;

  const isEligible = verification.overall_eligible;

  return (
    <div className="max-w-3xl mx-auto animate-slide-up">
      <div className={`bg-white rounded-3xl shadow-xl overflow-hidden border ${isEligible ? 'border-green-200' : 'border-red-200'}`}>
        
        {/* Header Section */}
        <div className={`p-10 text-center ${isEligible ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex justify-center mb-6">
            {isEligible ? (
              <CheckCircle size={80} className="text-green-500" />
            ) : (
              <XCircle size={80} className="text-red-500" />
            )}
          </div>
          <h1 className={`text-4xl font-extrabold mb-2 ${isEligible ? 'text-green-700' : 'text-red-700'}`}>
            {isEligible ? 'APPLICATION VERIFIED' : 'APPLICATION NOT ELIGIBLE'}
          </h1>
          <p className="text-slate-600 text-lg">{app.service} (ID: {appId})</p>
          
          <div className="mt-6 inline-block">
            <div className={`px-6 py-2 rounded-full font-bold text-sm tracking-wider uppercase ${isEligible ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
              Final Decision: {isEligible ? 'APPROVED' : 'NOT ELIGIBLE'}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-10">
          <h3 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wider text-center border-b border-slate-100 pb-4">
            Department Verification Results
          </h3>
          
          <div className="space-y-4 max-w-lg mx-auto">
            <div className={`flex items-center justify-between p-4 rounded-xl border ${verification.education_verified ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              <span className="font-semibold text-slate-700">Education Department</span>
              <div className={`flex items-center gap-2 font-bold ${verification.education_verified ? 'text-green-600' : 'text-red-600'}`}>
                {verification.education_verified ? <CheckCircle size={20}/> : <XCircle size={20}/>}
                {verification.education_verified ? 'VERIFIED' : 'FAILED'}
              </div>
            </div>

            <div className={`flex items-center justify-between p-4 rounded-xl border ${verification.income_eligible ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              <span className="font-semibold text-slate-700">Income Department</span>
              <div className={`flex items-center gap-2 font-bold ${verification.income_eligible ? 'text-green-600' : 'text-red-600'}`}>
                {verification.income_eligible ? <CheckCircle size={20}/> : <XCircle size={20}/>}
                {verification.income_eligible ? 'ELIGIBLE' : 'FAILED'}
              </div>
            </div>

            <div className={`flex items-center justify-between p-4 rounded-xl border ${verification.welfare_eligible ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              <span className="font-semibold text-slate-700">Welfare Department</span>
              <div className={`flex items-center gap-2 font-bold ${verification.welfare_eligible ? 'text-green-600' : 'text-red-600'}`}>
                {verification.welfare_eligible ? <CheckCircle size={20}/> : <XCircle size={20}/>}
                {verification.welfare_eligible ? 'ELIGIBLE' : 'FAILED'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-6 border-t border-slate-200 flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => navigate(`/audit/${appId}`)}
            className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors"
          >
            <FileSearch size={18} /> View Audit Trail
          </button>
          
          <button 
            onClick={() => navigate(`/status/${appId}`)}
            className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors"
          >
            <Activity size={18} /> View Status
          </button>

          <button 
            onClick={() => navigate('/')}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors"
          >
            <Home size={18} /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
