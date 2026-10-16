import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Circle, Loader2, ArrowRight } from 'lucide-react';
import api from '../api';

export default function WorkflowPage() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [workflowDone, setWorkflowDone] = useState(false);

  const steps = [
    { title: 'Application Submitted', detail: 'Application # ' + appId },
    { title: 'Authentication', detail: 'Verifying identity via API Gateway' },
    { title: 'Consent Verified', detail: 'User consent confirmed' },
    { title: 'Education Verification', detail: 'Connecting to Education Department...' },
    { title: 'Income Verification', detail: 'Connecting to Income Department...' },
    { title: 'Welfare Verification', detail: 'Connecting to Welfare Department...' },
    { title: 'Eligibility Decision', detail: 'Evaluating common data model' },
    { title: 'Final Status', detail: 'Generating result' },
  ];

  useEffect(() => {
    let active = true;
    
    const startWorkflow = async () => {
      try {
        await api.post(`/workflows/${appId}/start`);
        
        // Simulate step progression
        for (let i = 0; i <= steps.length; i++) {
          if (!active) break;
          setCurrentStep(i);
          if (i < steps.length) {
            await new Promise(r => setTimeout(r, 800)); // 800ms delay per step
          }
        }
        
        if (active) {
          setWorkflowDone(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    startWorkflow();
    return () => { active = false; };
  }, [appId]);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-800">RAAHA Verification Engine</h1>
        <p className="text-slate-500 mt-2">Processing your application in real-time.</p>
        <div className="mt-4 inline-block bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-sm font-mono border border-slate-200">
          ID: {appId}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
        <div className="space-y-6">
          {steps.map((step, index) => {
            const isCompleted = currentStep > index;
            const isActive = currentStep === index;
            const isPending = currentStep < index;
            
            return (
              <div key={index} className="flex items-start gap-4">
                <div className="mt-0.5 relative z-10 bg-white">
                  {isCompleted ? (
                    <CheckCircle2 className="text-teal-500" size={24} />
                  ) : isActive ? (
                    <div className="relative">
                      <Circle className="text-blue-500 animate-pulse" size={24} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-dot"></div>
                      </div>
                    </div>
                  ) : (
                    <Circle className="text-slate-200" size={24} />
                  )}
                </div>
                
                <div className={`flex-1 pb-6 ${index !== steps.length - 1 ? 'border-l-2' : ''} ${isCompleted ? 'border-teal-200' : isActive ? 'border-blue-200' : 'border-slate-100'} -ml-[23px] pl-10`}>
                  <h3 className={`font-semibold ${isCompleted ? 'text-slate-800' : isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm mt-1 ${isActive ? 'text-slate-600' : 'text-slate-400'}`}>
                    {isActive ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin-slow" /> {step.detail}
                      </span>
                    ) : isCompleted ? (
                      <span className="text-teal-600">✓ Completed</span>
                    ) : (
                      'Pending'
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {workflowDone && (
        <div className="flex justify-end animate-slide-up">
          <button 
            onClick={() => navigate(`/interop/${appId}`)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            View Verification Details <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
