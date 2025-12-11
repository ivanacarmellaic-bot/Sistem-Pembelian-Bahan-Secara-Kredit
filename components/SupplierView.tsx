import React, { useState } from 'react';
import { Supplier } from '../types';
import { Truck, Plus, Search } from 'lucide-react';

interface SupplierViewProps {
  suppliers: Supplier[];
  onAddSupplier: (s: Supplier) => void;
}

const SupplierView: React.FC<SupplierViewProps> = ({ suppliers, onAddSupplier }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: '', address: '', phone: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSupplier({
      id: `S00${suppliers.length + 1}`,
      ...newSupplier
    });
    setIsAdding(false);
    setNewSupplier({ name: '', address: '', phone: '' });
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Truck className="w-6 h-6 text-primary-600" />
            Manajemen Supplier
          </h2>
          <p className="text-slate-500">Database rekanan penyedia barang.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Supplier
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-4 rounded-lg border border-primary-200 shadow-sm mb-6 animate-in slide-in-from-top-2">
          <h3 className="font-bold text-slate-700 mb-3">Form Supplier Baru</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              required
              placeholder="Nama Perusahaan" 
              className="px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 outline-none text-sm"
              value={newSupplier.name}
              onChange={e => setNewSupplier({...newSupplier, name: e.target.value})}
            />
            <input 
              required
              placeholder="Alamat Lengkap" 
              className="px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 outline-none text-sm"
              value={newSupplier.address}
              onChange={e => setNewSupplier({...newSupplier, address: e.target.value})}
            />
            <div className="flex gap-2">
              <input 
                required
                placeholder="No. Telepon" 
                className="flex-1 px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                value={newSupplier.phone}
                onChange={e => setNewSupplier({...newSupplier, phone: e.target.value})}
              />
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium">Simpan</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-medium text-slate-500">Kode</th>
              <th className="px-6 py-3 font-medium text-slate-500">Nama Supplier</th>
              <th className="px-6 py-3 font-medium text-slate-500">Alamat</th>
              <th className="px-6 py-3 font-medium text-slate-500">Telepon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {suppliers.map(s => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 font-mono text-slate-500">{s.id}</td>
                <td className="px-6 py-3 font-medium text-slate-800">{s.name}</td>
                <td className="px-6 py-3 text-slate-600 truncate max-w-xs">{s.address}</td>
                <td className="px-6 py-3 text-slate-600">{s.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierView;
