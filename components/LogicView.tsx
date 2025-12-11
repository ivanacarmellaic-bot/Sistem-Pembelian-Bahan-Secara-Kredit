import React from 'react';
import { API_ENDPOINTS } from '../data';
import { Server, Code, ShieldCheck } from 'lucide-react';

const MethodBadge = ({ method }: { method: string }) => {
  const colors: Record<string, string> = {
    GET: 'bg-blue-100 text-blue-700 border-blue-200',
    POST: 'bg-green-100 text-green-700 border-green-200',
    PUT: 'bg-orange-100 text-orange-700 border-orange-200',
    DELETE: 'bg-red-100 text-red-700 border-red-200',
    INTERNAL: 'bg-purple-100 text-purple-700 border-purple-200'
  };

  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded border ${colors[method] || 'bg-slate-100'}`}>
      {method}
    </span>
  );
};

const LogicView: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6">
       <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Server className="w-6 h-6 text-primary-600" />
          Business Logic & API Specs
        </h2>
        <p className="text-slate-500">Core system endpoints and validation rules logic.</p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {API_ENDPOINTS.map((endpoint, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3">
                <MethodBadge method={endpoint.method} />
                <code className="text-sm font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">{endpoint.path}</code>
              </div>
              <span className="text-sm font-medium text-slate-500">{endpoint.description}</span>
            </div>
            
            <div className="p-5 bg-slate-50/30">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Execution Logic
              </h4>
              <ul className="space-y-2">
                {endpoint.logic.map((rule, rIdx) => (
                  <li key={rIdx} className="text-sm text-slate-700 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0"></span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogicView;
