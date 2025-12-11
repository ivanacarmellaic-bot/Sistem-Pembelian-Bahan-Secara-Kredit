import { ActivityLane, DatabaseTable, ApiEndpoint, Supplier, InventoryItem, PPbb, SOPB, Invoice } from './types';

// Existing Architecture Data
export const PROCESS_DATA: ActivityLane[] = [
  {
    actor: 'PEMBELIAN',
    steps: [
      { id: 'start', label: 'Mulai', type: 'start' },
      { id: 'p1', label: 'Membuat PPbb (#1, #2, #3)', type: 'process' },
      { id: 'p1_note', label: 'PPbb #1 diarsipkan', type: 'note' },
      { id: 'p2', label: 'Kirim PPbb #2 & #3', type: 'process', targetActor: 'AKUNTANSI' },
      { id: 'p3', label: 'Terima PPbb #2 (Approved)', type: 'process' },
      { id: 'p4', label: 'Membuat SOPB (#1, #2, #3)', type: 'process' },
      { id: 'p5', label: 'Distribusi SOPB', type: 'process', targetActor: 'SUPPLIER' },
    ]
  },
  {
    actor: 'AKUNTANSI',
    steps: [
      { id: 'a1', label: 'Cek PPbb (#2 & #3)', type: 'process' },
      { id: 'a2', label: 'Validasi & Kirim PPbb #2', type: 'process', targetActor: 'PEMBELIAN' },
      { id: 'a3', label: 'Terima SOPB #2', type: 'process' },
      { id: 'a4', label: 'Terima Faktur #2 & SJ #2', type: 'process' },
      { id: 'a5', label: 'Mencatat Jurnal', type: 'process' },
      { id: 'a_end', label: 'Laporan Pembelian', type: 'end' }
    ]
  },
  {
    actor: 'SUPPLIER',
    steps: [
      { id: 's1', label: 'Terima SOPB #1', type: 'process' },
      { id: 's2', label: 'Siapkan Barang', type: 'process' },
      { id: 's3', label: 'Buat SJ (#1, #2, #3)', type: 'process' },
      { id: 's4', label: 'Kirim Barang + SJ', type: 'process', targetActor: 'GUDANG' },
      { id: 's5', label: 'Buat Faktur', type: 'process' },
      { id: 's6', label: 'Penagihan', type: 'process' },
      { id: 's_end', label: 'Terima Pembayaran', type: 'end' }
    ]
  },
  {
    actor: 'GUDANG',
    steps: [
      { id: 'g1', label: 'Terima Barang & SJ', type: 'process' },
      { id: 'g2', label: 'Cek Fisik & Validasi', type: 'decision' },
      { id: 'g3', label: 'Stempel SJ #2, #3', type: 'process' },
      { id: 'g4', label: 'Serahkan ke Keuangan', type: 'process', targetActor: 'KEUANGAN' }
    ]
  },
  {
    actor: 'KEUANGAN',
    steps: [
      { id: 'k1', label: 'Terima Dokumen Tagihan', type: 'process' },
      { id: 'k2', label: 'Bayar & Tanda Tangan', type: 'process' },
      { id: 'k3', label: 'Kirim Faktur #1', type: 'process', targetActor: 'SUPPLIER' },
      { id: 'k4', label: 'Arsip & Distribusi Internal', type: 'end' }
    ]
  }
];

export const DB_SCHEMA: DatabaseTable[] = [
  {
    name: 'Supplier',
    description: 'Master data for product suppliers',
    fields: [
      { name: 'KodeSupplier', type: 'CHAR(4)', isPK: true },
      { name: 'NamaSupplier', type: 'VARCHAR(100)' },
      { name: 'Alamat', type: 'VARCHAR(255)' },
      { name: 'Telp', type: 'VARCHAR(15)' }
    ]
  },
  {
    name: 'SOPB',
    description: 'Surat Order Pembelian (Purchase Order)',
    fields: [
      { name: 'NoSOPB', type: 'CHAR(10)', isPK: true },
      { name: 'TglSOPB', type: 'DATE' },
      { name: 'KodeSupplier', type: 'CHAR(4)', isFK: true, notes: 'Ref Supplier' },
      { name: 'KodePegawai', type: 'CHAR(5)' }
    ]
  },
  {
    name: 'Detail_Order',
    description: 'Junction table for Order Items',
    fields: [
      { name: 'NoSOPB', type: 'CHAR(10)', isPK: true, isFK: true },
      { name: 'KodeBarang', type: 'CHAR(5)', isPK: true, isFK: true },
      { name: 'QtyDipesan', type: 'INT' }
    ]
  },
  {
    name: 'Penerimaan_Barang',
    description: 'Surat Jalan / Goods Receipt',
    fields: [
      { name: 'NoSuratJalan', type: 'CHAR(10)', isPK: true },
      { name: 'NoSOPB', type: 'CHAR(10)', isFK: true },
      { name: 'TglTerima', type: 'DATE' },
      { name: 'StatusCek', type: "ENUM('Cocok', 'Tidak')" }
    ]
  },
  {
    name: 'Faktur',
    description: 'Invoice and payment status',
    fields: [
      { name: 'NoFaktur', type: 'CHAR(10)', isPK: true },
      { name: 'NoSOPB', type: 'CHAR(10)', isFK: true },
      { name: 'TotalBayar', type: 'DECIMAL(10, 2)' },
      { name: 'StatusBayar', type: "ENUM('Pending', 'Paid')" }
    ]
  },
  {
    name: 'Akuntansi_Jurnal',
    description: 'General Ledger entries',
    fields: [
      { name: 'NoJurnal', type: 'CHAR(10)', isPK: true },
      { name: 'NoFaktur', type: 'CHAR(10)', isFK: true },
      { name: 'TglJurnal', type: 'DATE' },
      { name: 'Keterangan', type: 'TEXT' }
    ]
  }
];

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    method: 'POST',
    path: '/api/pembelian/request',
    description: 'Initiate Purchase Request (PPbb)',
    logic: [
      "Create SOPB_Header with StatusOrder = 'Diajukan'",
      "Generate temporary ID"
    ]
  },
  {
    method: 'PUT',
    path: '/api/akuntansi/ppbb/{id}/approve',
    description: 'Approve Purchase Request',
    logic: [
      "Validate user permissions (Accounting Dept)",
      "Update StatusOrder = 'Disetujui'",
      "Trigger notification to Purchasing"
    ]
  },
  {
    method: 'POST',
    path: '/api/gudang/receive',
    description: 'Process Incoming Goods (Receiving)',
    logic: [
      "Match NoSuratJalan with NoSOPB",
      "IF QtyReceived == QtyOrdered THEN Status = 'Cocok'",
      "ELSE Status = 'Tidak Cocok' (Trigger Return Workflow)"
    ]
  },
  {
    method: 'PUT',
    path: '/api/keuangan/faktur/{id}/pay',
    description: 'Process Payment',
    logic: [
      "Check 3-Way Match (PO, Receipt, Invoice)",
      "Update Faktur.StatusBayar = 'Paid'",
      "Record transaction timestamp"
    ]
  },
  {
    method: 'POST', // Internal trigger, modeled as POST
    path: 'INTERNAL: Journal Posting',
    description: 'Automated Accounting Entry',
    logic: [
      "Triggered by Payment Success event",
      "INSERT INTO Akuntansi_Jurnal SELECT * FROM Faktur WHERE ID = {id}"
    ]
  }
];

export const RAW_SQL = `CREATE DATABASE IF NOT EXISTS Pembelian_Kredit_DB;
USE Pembelian_Kredit_DB;

-- 1. Tabel Supplier
CREATE TABLE Supplier (
    KodeSupplier CHAR(4) NOT NULL,
    NamaSupplier VARCHAR(100) NOT NULL,
    Alamat VARCHAR(255),
    Telp VARCHAR(15),
    PRIMARY KEY (KodeSupplier)
);

-- 2. Tabel SOPB
CREATE TABLE SOPB (
    NoSOPB CHAR(10) NOT NULL,
    TglSOPB DATE NOT NULL,
    KodeSupplier CHAR(4) NOT NULL,
    KodePegawai_Pembelian CHAR(5),
    PRIMARY KEY (NoSOPB),
    FOREIGN KEY (KodeSupplier) REFERENCES Supplier(KodeSupplier)
);

-- ... (Full SQL from artifacts)
CREATE TABLE Akuntansi_Jurnal (
    NoJurnal CHAR(10) NOT NULL,
    NoFaktur CHAR(10) NOT NULL,
    TglJurnal DATE NOT NULL,
    Keterangan TEXT,
    PRIMARY KEY (NoJurnal),
    FOREIGN KEY (NoFaktur) REFERENCES Faktur(NoFaktur)
);`;

export const RAW_MERMAID = `activityDiagram
    partition PEMBELIAN {
        start
        :Mulai;
        :Membuat PPbb (PPbb #1, #2, #3);
        ...
    }
    partition AKUNTANSI {
        :Mengecek PPbb (#2 & #3);
        ...
    }`;

// --- Functional Mock Data ---

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'S001', name: 'PT. Baja Utama', address: 'Jl. Industri No. 1, Jakarta', phone: '021-5551234' },
  { id: 'S002', name: 'CV. Karya Sejahtera', address: 'Jl. Merdeka No. 45, Bandung', phone: '022-5556789' },
  { id: 'S003', name: 'Mitra Bangunan Abadi', address: 'Jl. Raya Bogor KM 30', phone: '021-8765432' },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'B001', code: 'MT-001', name: 'Besi Beton 10mm', qty: 50, unit: 'Batang', safetyStock: 100, price: 65000 },
  { id: 'B002', code: 'MT-002', name: 'Semen Portland', qty: 200, unit: 'Sak', safetyStock: 50, price: 55000 },
  { id: 'B003', code: 'MT-003', name: 'Pasir Beton', qty: 15, unit: 'Kubik', safetyStock: 20, price: 300000 },
  { id: 'B004', code: 'MT-004', name: 'Cat Tembok Putih', qty: 5, unit: 'Pail', safetyStock: 10, price: 850000 },
];

export const INITIAL_PPBB: PPbb[] = [
  {
    id: 'PP-2023-001',
    date: '2023-10-25',
    items: [{ itemId: 'B001', itemName: 'Besi Beton 10mm', qty: 100 }],
    status: 'Diproses',
    requestedBy: 'Prod. Staff A'
  }
];

export const INITIAL_SOPB: SOPB[] = [
  {
    id: 'SOPB-2023-001',
    ppbbId: 'PP-2023-001',
    date: '2023-10-26',
    supplierId: 'S001',
    supplierName: 'PT. Baja Utama',
    items: [{ itemId: 'B001', itemName: 'Besi Beton 10mm', qty: 100, price: 65000 }],
    status: 'Ordered'
  }
];

export const INITIAL_INVOICES: Invoice[] = [];
