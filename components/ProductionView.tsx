import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { Package, AlertTriangle, FilePlus } from 'lucide-react';

interface ProductionViewProps {
  inventory: InventoryItem[];
  onRequestPurchase: (itemId: string, qty: number) => void;
}

const ProductionView: React.FC<ProductionViewProps> = ({ inventory, onRequestPurchase }) => {
  const [selectedItem, setSelectedItem] = useState('');
  const [qty, setQty] = useState(0);
  const [message, setMessage] = useState('');

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem && qty > 0) {
      onRequestPurchase(selectedItem, qty);
      setMessage('Permintaan Pembelian (PPbb) berhasil dibuat!');
      setTimeout(() => setMessage(''), 3000);
      setQty(0);
      setSelectedItem('');
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Inventory List */}
        <div className="flex-1">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Package className="w-6 h-6 text-primary-600" />
              Stock Bahan Baku
            </h2>
            <p className="text-slate-500">Monitoring inventory dan Safety Stock.</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-500">Kode</th>
                  <th className="px-4 py-3 font-medium text-slate-500">Nama Barang</th>
                  <th className="px-4 py-3 font-medium text-slate-500 text-right">Stock</th>
                  <th className="px-4 py-3 font-medium text-slate-500 text-right">Safety</th>
                  <th className="px-4 py-3 font-medium text-slate-500 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory.map(item => {
                  const isLow = item.qty <= item.safetyStock;
                  return (
                    <tr key={item.id} className={isLow ? 'bg-red-50' : 'hover:bg-slate-50'}>
                      <td className="px-4 py-3 font-mono text-slate-500">{item.code}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                      <td className="px-4 py-3 text-right font-bold">{item.qty} {item.unit}</td>
                      <td className="px-4 py-3 text-right text-slate-500">{item.safetyStock}</td>
                      <td className="px-4 py-3 text-center">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                            <AlertTriangle className="w-3 h-3" /> Low
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">OK</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Request Form */}
        <div className="w-full md:w-80">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm sticky top-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FilePlus className="w-5 h-5 text-blue-600" />
              Buat PPbb Baru
            </h3>
            <form onSubmit={handleRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Pilih Barang</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-sm outline-none focus:ring-2 focus:ring-primary-500"
                  value={selectedItem}
                  onChange={e => setSelectedItem(e.target.value)}
                  required
                >
                  <option value="">-- Pilih --</option>
                  {inventory.map(i => (
                    <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Jumlah Diminta</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:ring-2 focus:ring-primary-500"
                  value={qty}
                  onChange={e => setQty(Number(e.target.value))}
                  min="1"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Kirim Permintaan
              </button>
            </form>
            {message && (
              <div className="mt-3 p-3 bg-green-50 text-green-700 text-xs rounded border border-green-200">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionView;
