import React from 'react';
import { PPbb, SOPB, Supplier } from '../types';
import { ShoppingCart, CheckCircle, ArrowRight, FileText } from 'lucide-react';

interface PurchasingViewProps {
  ppbbs: PPbb[];
  sopbs: SOPB[];
  suppliers: Supplier[];
  onCreateSOPB: (ppbbId: string, supplierId: string) => void;
}

const PurchasingView: React.FC<PurchasingViewProps> = ({ ppbbs, sopbs, suppliers, onCreateSOPB }) => {
  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 p-6 space-y-8">
      
      {/* Pending Requests Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <FileText className="w-6 h-6 text-primary-600" />
          Permintaan Pembelian (PPbb) Masuk
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ppbbs.filter(p => p.status === 'Diajukan').length === 0 && (
              <p className="text-slate-400 text-sm col-span-3">Tidak ada permintaan baru.</p>
          )}
          {ppbbs.filter(p => p.status === 'Diajukan').map(ppbb => (
            <div key={ppbb.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{ppbb.id}</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">New</span>
              </div>
              <div className="flex-1 mb-4">
                <p className="font-bold text-slate-800">{ppbb.items[0].itemName}</p>
                <p className="text-sm text-slate-600">Qty: {ppbb.items[0].qty}</p>
                <p className="text-xs text-slate-400 mt-1">Req by: {ppbb.requestedBy}</p>
              </div>
              
              <div className="mt-auto pt-3 border-t border-slate-100">
                <label className="text-xs text-slate-500 mb-1 block">Pilih Supplier:</label>
                <div className="flex gap-2">
                  <select 
                    id={`sup-${ppbb.id}`}
                    className="flex-1 text-xs border border-slate-300 rounded px-2 py-1.5 outline-none"
                  >
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <button 
                    onClick={() => {
                        const select = document.getElementById(`sup-${ppbb.id}`) as HTMLSelectElement;
                        onCreateSOPB(ppbb.id, select.value);
                    }}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded text-xs font-medium"
                  >
                    Buat SOPB
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 my-6"></div>

      {/* SOPB List */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <ShoppingCart className="w-6 h-6 text-orange-600" />
          Daftar Surat Order Pembelian (SOPB)
        </h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium text-slate-500">No. SOPB</th>
                <th className="px-6 py-3 font-medium text-slate-500">Tanggal</th>
                <th className="px-6 py-3 font-medium text-slate-500">Supplier</th>
                <th className="px-6 py-3 font-medium text-slate-500">Barang</th>
                <th className="px-6 py-3 font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sopbs.map(sopb => (
                <tr key={sopb.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-mono text-slate-500">{sopb.id}</td>
                  <td className="px-6 py-3 text-slate-600">{sopb.date}</td>
                  <td className="px-6 py-3 font-medium text-slate-800">{sopb.supplierName}</td>
                  <td className="px-6 py-3 text-slate-600">
                    {sopb.items[0].itemName} ({sopb.items[0].qty})
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      sopb.status === 'Ordered' ? 'bg-orange-100 text-orange-700' :
                      sopb.status === 'Received' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {sopb.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchasingView;
