import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../api';

export default function AuditPage() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadAudit = async () => {
      try {
        const res = await api.get(`/applications/${appId}/audit`);
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadAudit();
  }, [appId]);

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">System Audit Trail</h1>
          <p className="text-slate-500 mt-2">Immutable log of all interactions and data requests.</p>
        </div>
        <button 
          onClick={() => navigate(`/result/${appId}`)}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors border border-slate-300 shadow-sm"
        >
          <ArrowLeft size={16} /> Back to Result
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="mb-6 pb-4 border-b border-slate-100 flex items-center gap-3 text-slate-600">
          <ShieldCheck className="text-teal-500" /> 
          <span className="font-semibold text-sm tracking-wide uppercase">Cryptographically verifiable log</span>
        </div>

        <div className="relative border-l-2 border-slate-200 ml-4 pl-8 space-y-8 py-2">
          {events.map((event, index) => (
            <div key={index} className="relative">
              <div className={`absolute -left-[41px] top-1 rounded-full p-1.5 border-4 border-white ${event.status === 'SUCCESS' ? 'bg-teal-500' : 'bg-red-500'}`}>
                {event.status === 'SUCCESS' ? (
                  <CheckIcon className="w-3 h-3 text-white" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-white" />
                )}
              </div>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-slate-800">{event.event_type}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${event.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {event.status}
                  </span>
                </div>
                
                <p className="text-slate-600 mb-3">{event.details}</p>
                
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <Clock size={12} />
                  <span>{formatDate(event.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="text-slate-400 italic">No audit events found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
