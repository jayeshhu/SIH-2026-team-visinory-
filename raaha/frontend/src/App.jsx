import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ApplicationPage from './pages/ApplicationPage';
import ConsentPage from './pages/ConsentPage';
import WorkflowPage from './pages/WorkflowPage';
import InteropPage from './pages/InteropPage';
import ResultPage from './pages/ResultPage';
import StatusPage from './pages/StatusPage';
import AuditPage from './pages/AuditPage';
import { ShieldCheck } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <ShieldCheck className="h-8 w-8 text-teal-400" />
            <span className="font-bold text-xl tracking-tight">RAAHA</span>
          </Link>
          <div className="bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-1 rounded-full border border-teal-500/30 uppercase tracking-wider">
            Demo Environment
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/apply" element={<ApplicationPage />} />
          <Route path="/consent/:appId" element={<ConsentPage />} />
          <Route path="/workflow/:appId" element={<WorkflowPage />} />
          <Route path="/interop/:appId" element={<InteropPage />} />
          <Route path="/result/:appId" element={<ResultPage />} />
          <Route path="/status/:appId" element={<StatusPage />} />
          <Route path="/audit/:appId" element={<AuditPage />} />
        </Routes>
      </main>
      
      <footer className="bg-slate-100 py-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          RAAHA Government Interoperability Platform &copy; 2026
        </div>
      </footer>
    </div>
  );
}

export default App;
