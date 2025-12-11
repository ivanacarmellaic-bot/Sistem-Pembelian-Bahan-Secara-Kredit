import React from 'react';
import { PROCESS_DATA } from '../data';
import { ArrowRight, ArrowDown, FileText, CheckCircle, AlertCircle, PlayCircle, StopCircle } from 'lucide-react';

const StepIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'start': return <PlayCircle className="w-6 h-6 text-green-600" />;
    case 'end': return <StopCircle className="w-6 h-6 text-red-600" />;
    case 'decision': return <AlertCircle className="w-6 h-6 text-orange-500" />;
    case 'note': return <FileText className="w-5 h-5 text-slate-400" />;
    default: return <ArrowDown className="w-5 h-5 text-primary-600" />;
  }
};

const SwimlaneView: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      <div className="bg-slate-100 p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-primary-600" />
          Process Flow: Credit Purchase System
        </h2>
        <p className="text-sm text-slate-500">Visual representation of cross-departmental workflow.</p>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-[1000px] h-full grid grid-cols-5 divide-x divide-slate-200 bg-white">
          {PROCESS_DATA.map((lane, idx) => (
            <div key={idx} className="flex flex-col relative group">
              {/* Lane Header */}
              <div className="bg-slate-50 p-3 border-b border-slate-200 sticky top-0 z-10 text-center font-bold text-slate-700 uppercase text-sm tracking-wider shadow-sm">
                {lane.actor}
              </div>

              {/* Lane Content */}
              <div className="flex-1 p-4 flex flex-col gap-6 items-center py-8">
                {lane.steps.map((step, sIdx) => (
                  <div key={step.id} className="relative flex flex-col items-center w-full">
                    
                    {/* Connection Line (Visual Only) */}
                    {sIdx > 0 && (
                      <div className="h-6 w-0.5 bg-slate-300 absolute -top-6"></div>
                    )}

                    {/* Step Card */}
                    <div className={`
                      relative p-3 rounded-lg border w-full text-center transition-all hover:shadow-md
                      ${step.type === 'start' || step.type === 'end' ? 'bg-slate-100 border-slate-300' : 'bg-white border-slate-200 shadow-sm'}
                      ${step.type === 'decision' ? 'border-orange-200 bg-orange-50' : ''}
                      ${step.type === 'note' ? 'border-dashed border-slate-300 bg-transparent shadow-none' : ''}
                    `}>
                      <div className="flex justify-center mb-2">
                        <StepIcon type={step.type} />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{step.label}</span>
                      
                      {step.targetActor && (
                         <div className="mt-2 text-xs inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100">
                           <span>To: {step.targetActor}</span>
                           <ArrowRight className="w-3 h-3" />
                         </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
              
              {/* Hover effect for lane focus */}
              <div className="absolute inset-0 bg-primary-50 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SwimlaneView;
