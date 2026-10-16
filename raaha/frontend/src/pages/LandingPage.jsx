import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, IndianRupee, Heart, ArrowRight, Activity, ArrowDown } from 'lucide-react';
import api from '../api';

export default function LandingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDemo = async (citizenId, name) => {
    try {
      setLoading(true);
      
      // Reset first
      await api.post('/demo/reset');
      
      // Create app
      const res = await api.post('/applications', {
        citizen_id: citizenId,
        name: name,
        service: 'Scholarship Verification'
      });
      const appId = res.data.id;
      
      // Grant consent
      await api.post(`/applications/${appId}/consent`, { granted: true });
      
      // Navigate to workflow
      navigate(`/workflow/${appId}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-12 animate-fade-in">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-10 md:p-16 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Activity size={200} />
        </div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            One Application.<br/>
            <span className="text-teal-400">Multiple Departments.</span><br/>
            One Unified Result.
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
            RAAHA is a secure interoperability layer that connects siloed government departments, 
            verifying citizen eligibility seamlessly without redundant paperwork.
          </p>
          <button 
            onClick={() => navigate('/apply')}
            className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-4 px-8 rounded-xl flex items-center gap-3 transition-all hover:gap-4 hover:shadow-lg hover:shadow-teal-500/30"
          >
            Start Application <ArrowRight />
          </button>
        </div>
      </section>

      {/* Connected Departments */}
      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          Connected Departments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
              <GraduationCap size={28} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Education</h3>
              <p className="text-slate-500 text-sm mt-1">Student & enrollment verification data.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="bg-green-100 text-green-600 p-3 rounded-xl">
              <IndianRupee size={28} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Income</h3>
              <p className="text-slate-500 text-sm mt-1">Tax and income bracket verification.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="bg-rose-100 text-rose-600 p-3 rounded-xl">
              <Heart size={28} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Welfare</h3>
              <p className="text-slate-500 text-sm mt-1">Existing benefits and welfare status.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">How It Works</h2>
        
        <div className="flex flex-col items-center max-w-4xl mx-auto space-y-4">
          <div className="bg-slate-100 border border-slate-300 px-6 py-3 rounded-lg font-bold text-slate-700 w-48 text-center">
            CITIZEN
          </div>
          
          <ArrowDown className="text-slate-400" />
          
          <div className="bg-teal-50 border border-teal-200 px-8 py-4 rounded-xl font-bold text-teal-800 w-64 text-center shadow-sm">
            RAAHA API GATEWAY & WORKFLOW ENGINE
          </div>
          
          <div className="flex gap-4 w-full justify-center mt-4">
             <div className="w-px h-8 bg-slate-300"></div>
             <div className="w-px h-8 bg-slate-300"></div>
             <div className="w-px h-8 bg-slate-300"></div>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center w-full">
            <div className="bg-blue-50 border border-blue-200 px-6 py-3 rounded-lg font-bold text-blue-800 flex-1 min-w-[150px] text-center">
              EDUCATION
            </div>
            <div className="bg-green-50 border border-green-200 px-6 py-3 rounded-lg font-bold text-green-800 flex-1 min-w-[150px] text-center">
              INCOME
            </div>
            <div className="bg-rose-50 border border-rose-200 px-6 py-3 rounded-lg font-bold text-rose-800 flex-1 min-w-[150px] text-center">
              WELFARE
            </div>
          </div>
          
          <div className="flex gap-4 w-full justify-center">
             <div className="w-px h-8 bg-slate-300"></div>
             <div className="w-px h-8 bg-slate-300"></div>
             <div className="w-px h-8 bg-slate-300"></div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 px-8 py-4 rounded-xl font-bold text-purple-800 w-64 text-center shadow-sm">
            COMMON DATA MODEL
          </div>
          
          <ArrowDown className="text-slate-400" />
          
          <div className="bg-slate-800 border border-slate-900 px-8 py-4 rounded-xl font-bold text-white w-64 text-center shadow-md">
            ELIGIBILITY ENGINE & UNIFIED STATUS
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="bg-slate-100 rounded-2xl p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Fast-Track Demo Mode</h2>
        <p className="text-slate-600 mb-6">Skip the forms and instantly see how the system processes different citizen profiles.</p>
        
        <div className="flex flex-wrap gap-4">
          <button 
            disabled={loading}
            onClick={() => handleDemo('CIT001', 'Rahul Sharma')}
            className="bg-white border border-slate-300 hover:border-teal-500 hover:text-teal-600 px-6 py-3 rounded-xl font-medium shadow-sm transition-colors flex items-center gap-2"
          >
            <Activity size={18} /> CIT001: Rahul Sharma (Success)
          </button>
          <button 
            disabled={loading}
            onClick={() => handleDemo('CIT002', 'Amit Patel')}
            className="bg-white border border-slate-300 hover:border-red-500 hover:text-red-600 px-6 py-3 rounded-xl font-medium shadow-sm transition-colors flex items-center gap-2"
          >
            <Activity size={18} /> CIT002: Amit Patel (Failure)
          </button>
        </div>
      </section>
    </div>
  );
}
