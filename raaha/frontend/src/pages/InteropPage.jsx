import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, ArrowDown, Code2 } from 'lucide-react';
import api from '../api';

export default function InteropPage() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [verification, setVerification] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resResults, resVer] = await Promise.all([
          api.get(`/applications/${appId}/department-results`),
          api.get(`/applications/${appId}/verification`)
        ]);
        setResults(resResults.data);
        setVerification(resVer.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [appId]);

  if (!results || !verification) return <div className="text-center py-20 text-slate-500">Loading interoperability data...</div>;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800">RAAHA Interoperability Layer</h1>
        <p className="text-slate-500 mt-2">Translating diverse department formats into a single standard.</p>
      </div>

      <div className="mb-6 flex items-center justify-center">
        <div className="bg-slate-800 text-white px-6 py-2 rounded-full font-semibold shadow-sm text-sm tracking-widest uppercase">
          Different Department Formats
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
          <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
            <span className="font-semibold text-blue-400 text-sm">Education (JSON)</span>
            <Code2 size={16} className="text-slate-400" />
          </div>
          <pre className="p-4 text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(results.education_result, null, 2)}
          </pre>
        </div>

        <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
          <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
            <span className="font-semibold text-teal-400 text-sm">Income (JSON)</span>
            <Code2 size={16} className="text-slate-400" />
          </div>
          <pre className="p-4 text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(results.income_result, null, 2)}
          </pre>
        </div>

        <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
          <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
            <span className="font-semibold text-rose-400 text-sm">Welfare (XML)</span>
            <Code2 size={16} className="text-slate-400" />
          </div>
          <pre className="p-4 text-xs text-orange-300 font-mono overflow-x-auto whitespace-pre-wrap">
            {results.welfare_result}
          </pre>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center my-10 space-y-4">
        <ArrowDown className="text-slate-300" size={32} />
        <div className="bg-teal-50 border border-teal-200 text-teal-800 px-8 py-3 rounded-xl font-bold shadow-sm">
          RAAHA DATA MAPPING
        </div>
        <ArrowDown className="text-slate-300" size={32} />
      </div>

      <div className="mb-6 flex items-center justify-center">
        <div className="bg-teal-600 text-white px-6 py-2 rounded-full font-semibold shadow-sm text-sm tracking-widest uppercase">
          Standardized RAAHA Format
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-lg mb-10">
        <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
          <span className="font-semibold text-white">Common Data Model (CitizenVerification)</span>
          <span className="bg-teal-500/20 text-teal-300 text-xs px-2 py-1 rounded">Unified JSON</span>
        </div>
        <pre className="p-6 text-sm text-blue-300 font-mono overflow-x-auto">
          {JSON.stringify(verification, null, 2)}
        </pre>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={() => navigate(`/result/${appId}`)}
          className="bg-teal-600 hover:bg-teal-500 text-white font-medium py-3 px-10 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
        >
          View Final Decision <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
