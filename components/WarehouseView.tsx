import React from 'react';
import { SOPB } from '../types';
import { Warehouse, CheckSquare, ClipboardCheck } from 'lucide-react';

interface WarehouseViewProps {
  sopbs: SOPB[];
  onReceiveGoods: (sopbId: string) => void;
}

const WarehouseView: React.FC<WarehouseViewProps> = ({ sopbs, onReceiveGoods }) => {
  const incoming = sopbs.filter(s => s.status === 'Ordered');

  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 p-6">
       <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Warehouse className="w-6 h-6 text-primary-600" />
          Penerimaan Barang (Gudang)
        </h2>
        <p className="text-slate-500">Validasi kedatangan barang dari supplier sesuai SOPB.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {incoming.length === 0 && (
             <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Tidak ada barang yang sedang ditunggu (Incoming).</p>
             </div>
        )}

        {incoming.map(sopb => (
          <div key={sopb.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
                    <ClipboardCheck className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">{sopb.supplierName}</h3>
                    <p className="text-sm text-slate-500 mb-1">Ref: {sopb.id} • {sopb.date}</p>
                    <div className="bg-slate-50 px-3 py-2 rounded border border-slate-100 mt-2">
                        <p className="text-sm font-medium text-slate-700">Item: {sopb.items[0].itemName}</p>
                        <p className="text-xs text-slate-500">Qty Order: {sopb.items[0].qty}</p>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-auto">
                <button 
                    onClick={() => onReceiveGoods(sopb.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg shadow-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <CheckSquare className="w-4 h-4" />
                    Terima & Validasi (SJ)
                </button>
                <p className="text-[10px] text-slate-400 text-center">Tindakan ini akan membuat SJ & Laporan Penerimaan.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WarehouseView;
