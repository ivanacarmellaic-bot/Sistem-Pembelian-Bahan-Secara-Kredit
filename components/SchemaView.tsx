import React from 'react';
import { DB_SCHEMA } from '../data';
import { Database, Key, Link as LinkIcon } from 'lucide-react';

const SchemaView: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 p-6">
       <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Database className="w-6 h-6 text-primary-600" />
          Data Model (ERD)
        </h2>
        <p className="text-slate-500">Logical Record Structure & Schema Definitions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {DB_SCHEMA.map((table) => (
          <div key={table.name} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="bg-slate-50 p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg flex justify-between items-center">
                {table.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{table.description}</p>
            </div>
            
            <div className="flex-1 p-0">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                    <th className="px-4 py-2 font-medium">Field</th>
                    <th className="px-4 py-2 font-medium">Type</th>
                    <th className="px-4 py-2 font-medium text-right">Attr</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {table.fields.map((field) => (
                    <tr key={field.name} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-700 flex items-center gap-2">
                        {field.isPK && <Key className="w-3 h-3 text-yellow-500" />}
                        {field.isFK && <LinkIcon className="w-3 h-3 text-blue-400" />}
                        {field.name}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{field.type}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          {field.isPK && <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">PK</span>}
                          {field.isFK && <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">FK</span>}
                        </div>
                        {field.notes && <div className="text-[10px] text-slate-400 mt-1">{field.notes}</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemaView;
