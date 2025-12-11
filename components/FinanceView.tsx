import React from 'react';
import { Invoice } from '../types';
import { DollarSign, CreditCard, FileCheck } from 'lucide-react';

interface FinanceViewProps {
  invoices: Invoice[];
  onPayInvoice: (invoiceId: string) => void;
}

const FinanceView: React.FC<FinanceViewProps> = ({ invoices, onPayInvoice }) => {
  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 p-6">
       <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-primary-600" />
          Keuangan & Pembayaran
        </h2>
        <p className="text-slate-500">Kelola Faktur supplier dan pembayaran hutang.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium text-slate-500">No. Faktur</th>
                <th className="px-6 py-3 font-medium text-slate-500">Tanggal</th>
                <th className="px-6 py-3 font-medium text-slate-500">Jatuh Tempo</th>
                <th className="px-6 py-3 font-medium text-slate-500 text-right">Total Tagihan</th>
                <th className="px-6 py-3 font-medium text-slate-500 text-center">Status</th>
                <th className="px-6 py-3 font-medium text-slate-500 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.length === 0 && (
                <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">Belum ada tagihan masuk.</td>
                </tr>
              )}
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-mono text-slate-500">{inv.id}</td>
                  <td className="px-6 py-3 text-slate-600">{inv.date}</td>
                  <td className="px-6 py-3 text-slate-600">{inv.dueDate}</td>
                  <td className="px-6 py-3 text-right font-medium text-slate-800">
                    Rp {inv.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    {inv.status === 'Pending' && (
                        <button 
                            onClick={() => onPayInvoice(inv.id)}
                            className="text-xs bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1"
                        >
                            <CreditCard className="w-3 h-3" /> Bayar
                        </button>
                    )}
                    {inv.status === 'Paid' && (
                        <span className="text-xs text-green-600 flex items-center justify-end gap-1">
                            <FileCheck className="w-3 h-3" /> Lunas
                        </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
};

export default FinanceView;
