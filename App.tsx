import React, { useState } from 'react';
import { 
    LayoutDashboard, Truck, Package, ShoppingCart, 
    Warehouse, DollarSign, BookOpen
} from 'lucide-react';

// New Functional Components
import DashboardView from './components/DashboardView';
import SupplierView from './components/SupplierView';
import ProductionView from './components/ProductionView';
import PurchasingView from './components/PurchasingView';
import WarehouseView from './components/WarehouseView';
import FinanceView from './components/FinanceView';
import AccountingView from './components/AccountingView';

import { 
    INITIAL_INVENTORY, INITIAL_PPBB, INITIAL_SOPB, 
    INITIAL_SUPPLIERS, INITIAL_INVOICES 
} from './data';
import { Supplier } from './types';

enum Tab {
  DASHBOARD = 'Dashboard',
  SUPPLIER = 'Supplier',
  PRODUCTION = 'Produksi',
  PURCHASING = 'Pembelian',
  WAREHOUSE = 'Gudang',
  FINANCE = 'Keuangan',
  ACCOUNTING = 'Akuntansi'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);

  // --- Central State Store ---
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [ppbbs, setPpbbs] = useState(INITIAL_PPBB);
  const [sopbs, setSopbs] = useState(INITIAL_SOPB);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);

  // --- Actions ---

  const handleAddSupplier = (s: Supplier) => {
    setSuppliers([...suppliers, s]);
  };

  const handleRequestPurchase = (itemId: string, qty: number) => {
    const item = inventory.find(i => i.id === itemId);
    const newPPbb = {
      id: `PP-2023-${100 + ppbbs.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      items: [{ itemId, itemName: item?.name || 'Unknown', qty }],
      status: 'Diajukan' as const,
      requestedBy: 'Prod. Staff'
    };
    setPpbbs([...ppbbs, newPPbb]);
  };

  const handleCreateSOPB = (ppbbId: string, supplierId: string) => {
    // 1. Update PPbb status
    setPpbbs(ppbbs.map(p => p.id === ppbbId ? { ...p, status: 'Diproses' } : p));
    
    // 2. Create SOPB
    const ppbb = ppbbs.find(p => p.id === ppbbId);
    const supplier = suppliers.find(s => s.id === supplierId);
    const item = inventory.find(i => i.id === ppbb?.items[0].itemId);
    
    if (ppbb && supplier && item) {
        const newSOPB = {
            id: `SOPB-2023-${200 + sopbs.length + 1}`,
            ppbbId,
            date: new Date().toISOString().split('T')[0],
            supplierId,
            supplierName: supplier.name,
            items: [{ 
                itemId: item.id, 
                itemName: item.name, 
                qty: ppbb.items[0].qty, 
                price: item.price 
            }],
            status: 'Ordered' as const
        };
        setSopbs([...sopbs, newSOPB]);
    }
  };

  const handleReceiveGoods = (sopbId: string) => {
    // 1. Update SOPB status
    setSopbs(sopbs.map(s => s.id === sopbId ? { ...s, status: 'Received' } : s));

    // 2. Update Inventory (Add Stock)
    const sopb = sopbs.find(s => s.id === sopbId);
    if (sopb) {
        const itemQty = sopb.items[0].qty;
        const itemId = sopb.items[0].itemId;
        setInventory(inventory.map(i => i.id === itemId ? { ...i, qty: i.qty + itemQty } : i));
        
        // 3. Create Invoice (Mocking the supplier sending it immediately upon receipt)
        const newInvoice = {
            id: `INV-${sopb.id.split('-')[2]}`,
            sopbId,
            date: new Date().toISOString().split('T')[0],
            dueDate: '2023-12-31',
            amount: sopb.items[0].qty * sopb.items[0].price,
            status: 'Pending' as const
        };
        setInvoices([...invoices, newInvoice]);
    }
  };

  const handlePayInvoice = (invoiceId: string) => {
    setInvoices(invoices.map(i => i.id === invoiceId ? { ...i, status: 'Paid' } : i));
  };

  const renderContent = () => {
    switch (activeTab) {
      // Functional App
      case Tab.DASHBOARD: return <DashboardView inventory={inventory} ppbbs={ppbbs} sopbs={sopbs} invoices={invoices} />;
      case Tab.SUPPLIER: return <SupplierView suppliers={suppliers} onAddSupplier={handleAddSupplier} />;
      case Tab.PRODUCTION: return <ProductionView inventory={inventory} onRequestPurchase={handleRequestPurchase} />;
      case Tab.PURCHASING: return <PurchasingView ppbbs={ppbbs} sopbs={sopbs} suppliers={suppliers} onCreateSOPB={handleCreateSOPB} />;
      case Tab.WAREHOUSE: return <WarehouseView sopbs={sopbs} onReceiveGoods={handleReceiveGoods} />;
      case Tab.FINANCE: return <FinanceView invoices={invoices} onPayInvoice={handlePayInvoice} />;
      case Tab.ACCOUNTING: return <AccountingView invoices={invoices} />;
      default: return <DashboardView inventory={inventory} ppbbs={ppbbs} sopbs={sopbs} invoices={invoices} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-primary-600 p-2 rounded-lg text-white">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sistem Pembelian Kredit</h1>
            <p className="text-xs text-slate-500 font-medium">Enterprise Resource Planning Prototype</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold">
                Prototype Mode
            </span>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="w-20 md:w-64 bg-slate-50 border-r border-slate-200 flex flex-col pt-6 flex-shrink-0 overflow-y-auto scrollbar-hide">
          <div className="space-y-1 px-3 mb-6">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Modules</p>
            <NavButton active={activeTab === Tab.DASHBOARD} onClick={() => setActiveTab(Tab.DASHBOARD)} icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
            <NavButton active={activeTab === Tab.SUPPLIER} onClick={() => setActiveTab(Tab.SUPPLIER)} icon={<Truck className="w-5 h-5" />} label="Supplier" />
            <NavButton active={activeTab === Tab.PRODUCTION} onClick={() => setActiveTab(Tab.PRODUCTION)} icon={<Package className="w-5 h-5" />} label="Produksi" />
            <NavButton active={activeTab === Tab.PURCHASING} onClick={() => setActiveTab(Tab.PURCHASING)} icon={<ShoppingCart className="w-5 h-5" />} label="Pembelian" />
            <NavButton active={activeTab === Tab.WAREHOUSE} onClick={() => setActiveTab(Tab.WAREHOUSE)} icon={<Warehouse className="w-5 h-5" />} label="Gudang" />
            <NavButton active={activeTab === Tab.FINANCE} onClick={() => setActiveTab(Tab.FINANCE)} icon={<DollarSign className="w-5 h-5" />} label="Keuangan" />
            <NavButton active={activeTab === Tab.ACCOUNTING} onClick={() => setActiveTab(Tab.ACCOUNTING)} icon={<BookOpen className="w-5 h-5" />} label="Akuntansi" />
          </div>
        </nav>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden bg-slate-50/50 relative">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
      ${active 
        ? 'bg-white text-primary-700 shadow-sm ring-1 ring-slate-200' 
        : 'text-slate-500 hover:bg-white hover:text-slate-700 hover:shadow-sm'}
    `}
  >
    <div className={`
      ${active ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}
    `}>
      {icon}
    </div>
    <span className="text-sm font-medium hidden md:block">{label}</span>
  </button>
);

export default App;