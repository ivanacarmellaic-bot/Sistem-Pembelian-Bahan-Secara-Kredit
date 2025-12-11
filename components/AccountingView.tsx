import React from 'react';
import { Invoice } from '../types';
import { BookOpen, FileText } from 'lucide-react';

interface AccountingViewProps {
  invoices: Invoice[];
}

const AccountingView: React.FC<AccountingViewProps> = ({ invoices }) => {
  // Simple journal derivation from paid invoices
  const paidInvoices = invoices.filter(i => i.status === 'Paid');

  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 p-6">
       <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary-600" />
          Laporan Akuntansi
        </h2>
        <p className="text-slate-500">Jurnal transaksi pembelian kredit dan pengeluaran kas.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <h3 className="font-bold text-slate-700 mb-4 border-b pb-2">Jurnal Umum</h3>
        
        {paidInvoices.length === 0 ? (
            <p className="text-slate-400 italic text-sm">Belum ada transaksi yang dicatat.</p>
        ) : (
            <div className="space-y-6">
                {paidInvoices.map((inv, idx) => (
                    <div key={idx} className="border border-slate-100 rounded-lg overflow-hidden text-sm">
                        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex justify-between">
                            <span className="font-mono text-slate-500">Ref: JRN-2023-{1000 + idx}</span>
                            <span className="text-slate-500">{inv.date}</span>
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr className="text-xs text-slate-400 border-b border-slate-50">
                                    <th className="text-left px-4 py-2">Keterangan</th>
                                    <th className="text-right px-4 py-2 w-32">Debit</th>
                                    <th className="text-right px-4 py-2 w-32">Kredit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="px-4 py-2 text-slate-700">Persediaan Barang Dagang</td>
                                    <td className="px-4 py-2 text-right font-mono">Rp {inv.amount.toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-2 text-right font-mono">-</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2 text-slate-700 pl-8">Utang Dagang</td>
                                    <td className="px-4 py-2 text-right font-mono">-</td>
                                    <td className="px-4 py-2 text-right font-mono">Rp {inv.amount.toLocaleString('id-ID')}</td>
                                </tr>
                                 <tr>
                                    <td className="px-4 py-2 text-slate-700 italic text-xs pt-1" colSpan={3}>
                                        (Mencatat pembelian kredit No. Faktur {inv.id})
                                    </td>
                                </tr>
                                <tr className="bg-green-50/50">
                                    <td className="px-4 py-2 text-slate-700">Utang Dagang</td>
                                    <td className="px-4 py-2 text-right font-mono">Rp {inv.amount.toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-2 text-right font-mono">-</td>
                                </tr>
                                <tr className="bg-green-50/50">
                                    <td className="px-4 py-2 text-slate-700 pl-8">Kas / Bank</td>
                                    <td className="px-4 py-2 text-right font-mono">-</td>
                                    <td className="px-4 py-2 text-right font-mono">Rp {inv.amount.toLocaleString('id-ID')}</td>
                                </tr>
                                 <tr className="bg-green-50/50">
                                    <td className="px-4 py-2 text-slate-700 italic text-xs pt-1" colSpan={3}>
                                        (Pelunasan faktur {inv.id})
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default AccountingView;
