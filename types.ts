export interface TableField {
  name: string;
  type: string;
  isPK?: boolean;
  isFK?: boolean;
  notes?: string;
}

export interface DatabaseTable {
  name: string;
  description: string;
  fields: TableField[];
  relationships?: string[]; 
}

export interface ActivityStep {
  id: string;
  label: string;
  type: 'start' | 'process' | 'decision' | 'end' | 'note';
  target?: string;
  targetActor?: string;
}

export interface ActivityLane {
  actor: string;
  steps: ActivityStep[];
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  logic: string[];
}

// --- Functional App Types ---

export interface Supplier {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  qty: number;
  unit: string;
  safetyStock: number;
  price: number;
}

export interface PPbb {
  id: string;
  date: string;
  items: { itemId: string; itemName: string; qty: number }[];
  status: 'Diajukan' | 'Disetujui' | 'Ditolak' | 'Diproses';
  requestedBy: string; // Production Dept
}

export interface SOPB {
  id: string;
  ppbbId: string;
  date: string;
  supplierId: string;
  supplierName: string;
  items: { itemId: string; itemName: string; qty: number; price: number }[];
  status: 'Ordered' | 'Received' | 'Completed';
}

export interface ReceivingReport {
  id: string;
  sopbId: string;
  date: string;
  checkedBy: string;
  status: 'Cocok' | 'Tidak Cocok';
  notes?: string;
}

export interface Invoice {
  id: string;
  sopbId: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'Pending' | 'Paid';
}

export interface JournalEntry {
  id: string;
  date: string;
  invoiceId: string;
  description: string;
  debit: number;
  credit: number;
}
