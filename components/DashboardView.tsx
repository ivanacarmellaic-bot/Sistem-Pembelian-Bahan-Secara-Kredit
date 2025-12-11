import React from 'react';
import { InventoryItem, Invoice, PPbb, SOPB } from '../types';
import { AlertTriangle, DollarSign, Package, ShoppingCart, Activity } from 'lucide-react';

interface DashboardProps {
  inventory: InventoryItem[];
  ppbbs: PPbb[];
  sopbs: SOPB[];
  invoices: Invoice[];
}

const StatCard = ({ title, value, icon, color, description }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      {description && <p className="text-xs text-slate-400 mt-2">{description}</p>}
    </div>
    <div className={`p-3 rounded-lg ${color} text-white`}>
      {icon}
    </div>
  </div>
);

const DashboardView: React.FC<DashboardProps> = ({ inventory, ppbbs, sopbs, invoices }) => {
  const lowStockCount = inventory.filter(i => i.qty <= i.safetyStock).length;
  const pendingRequests = ppbbs.filter(p => p.status === 'Diajukan').length;
  const activeOrders = sopbs.filter(s => s.status === 'Ordered').length;
  const pendingPayments = invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-500">Real-time snapshot of system activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Low Stock Alerts" 
          value={lowStockCount} 
          icon={<AlertTriangle className="w-6 h-6" />} 
          color="bg-red-500"
          description="Items below safety stock"
        />
        <StatCard 
          title="Pending Requests" 
          value={pendingRequests} 
          icon={<Activity className="w-6 h-6" />} 
          color="bg-blue-500"
          description="PPbb awaiting approval"
        />
        <StatCard 
          title="Active Orders" 
          value={activeOrders} 
          icon={<ShoppingCart className="w-6 h-6" />} 
          color="bg-orange-500"
          description="SOPB sent to suppliers"
        />
        <StatCard 
          title="Pending Payments" 
          value={`Rp ${(pendingPayments / 1000000).toFixed(1)}M`} 
          icon={<DollarSign className="w-6 h-6" />} 
          color="bg-green-600"
          description="Invoices to be paid"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary-600" />
                Critical Inventory
            </h3>
            <div className="space-y-3">
                {inventory.filter(i => i.qty <= i.safetyStock).map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                        <div>
                            <p className="font-medium text-red-900">{item.name}</p>
                            <p className="text-xs text-red-700">Code: {item.code}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-red-800">{item.qty} {item.unit}</p>
                            <p className="text-xs text-red-600">Target: {item.safetyStock}</p>
                        </div>
                    </div>
                ))}
                {lowStockCount === 0 && <p className="text-slate-400 text-sm italic">No critical items.</p>}
            </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-600" />
                Recent Orders
            </h3>
             <div className="space-y-3">
                {sopbs.slice(-5).reverse().map(sopb => (
                    <div key={sopb.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div>
                            <p className="font-medium text-slate-800">{sopb.id}</p>
                            <p className="text-xs text-slate-500">{sopb.supplierName}</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            sopb.status === 'Ordered' ? 'bg-orange-100 text-orange-700' : 
                            sopb.status === 'Received' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                            {sopb.status}
                        </span>
                    </div>
                ))}
                 {sopbs.length === 0 && <p className="text-slate-400 text-sm italic">No orders yet.</p>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
