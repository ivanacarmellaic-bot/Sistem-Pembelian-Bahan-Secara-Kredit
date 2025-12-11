import React, { useState } from 'react';
import { RAW_SQL, RAW_MERMAID } from '../data';
import { FileCode, Copy, Check } from 'lucide-react';

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shadow-lg my-4">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-xs font-mono text-slate-400">{language}</span>
        <button 
          onClick={handleCopy}
          className="text-slate-400 hover:text-white transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-slate-300 leading-relaxed whitespace-pre">
          {code}
        </pre>
      </div>
    </div>
  );
};

const CodeArtifacts: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6">
       <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FileCode className="w-6 h-6 text-primary-600" />
          Source Artifacts
        </h2>
        <p className="text-slate-500">Raw definitions for Database (DDL) and Diagrams.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold text-slate-700 mb-2">SQL DDL (MySQL)</h3>
          <p className="text-sm text-slate-500 mb-2">Use this script to initialize the database structure.</p>
          <CodeBlock code={RAW_SQL} language="sql" />
        </div>
        
        <div>
          <h3 className="font-semibold text-slate-700 mb-2">Mermaid Diagram Source</h3>
          <p className="text-sm text-slate-500 mb-2">Source code for the Activity Diagram visualization.</p>
          <CodeBlock code={RAW_MERMAID} language="mermaid" />
        </div>
      </div>
    </div>
  );
};

export default CodeArtifacts;
