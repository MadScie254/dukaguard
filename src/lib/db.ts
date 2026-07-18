import Dexie, { type Table } from 'dexie';
import type {
  Tenant, Outlet, User, Product, StockMovement, SalesTransaction,
  Shift, MpesaStatementEntry, StocktakeCount, AnomalyAlert, SyncQueueItem
} from '../types';

export class DukaGuardDB extends Dexie {
  tenants!: Table<Tenant>;
  outlets!: Table<Outlet>;
  users!: Table<User>;
  products!: Table<Product>;
  stockMovements!: Table<StockMovement>;
  salesTransactions!: Table<SalesTransaction>;
  shifts!: Table<Shift>;
  mpesaEntries!: Table<MpesaStatementEntry>;
  stocktakes!: Table<StocktakeCount>;
  alerts!: Table<AnomalyAlert>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super('DukaGuardDB');
    this.version(1).stores({
      tenants: 'id',
      outlets: 'id, tenantId',
      users: 'id, tenantId, email',
      products: 'id, tenantId, sku, name',
      stockMovements: 'id, productId, outletId, timestamp, synced',
      salesTransactions: 'id, outletId, shiftId, timestamp, synced',
      shifts: 'id, outletId, attendantId, status, openedAt',
      mpesaEntries: 'id, outletId, timestamp, matchedTransactionId, synced',
      stocktakes: 'id, productId, outletId, timestamp, synced',
      alerts: 'id, outletId, type, status, generatedAt',
      syncQueue: 'id, table, timestamp',
    });
  }
}

export const db = new DukaGuardDB();

// Sync queue operations
export async function addToSyncQueue(
  table: string,
  operation: 'create' | 'update' | 'delete',
  data: unknown
): Promise<void> {
  await db.syncQueue.add({
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    table,
    operation,
    data,
    timestamp: new Date().toISOString(),
    retries: 0,
  });
}

export async function getPendingSyncItems(): Promise<SyncQueueItem[]> {
  return db.syncQueue.toArray();
}

export async function removeSyncItem(id: string): Promise<void> {
  await db.syncQueue.delete(id);
}

export async function clearSyncQueue(): Promise<void> {
  await db.syncQueue.clear();
}

// Seed demo data
export async function seedDemoData(): Promise<void> {
  const count = await db.outlets.count();
  if (count > 0) return;

  const tenant: Tenant = {
    id: 'tenant-1',
    name: 'Mama Duka Enterprises',
    email: 'owner@mamaduka.co.ke',
    phone: '+254712345678',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const outlets: Outlet[] = [
    {
      id: 'outlet-1',
      tenantId: 'tenant-1',
      name: 'Mama Duka - Main Shop',
      address: 'Kibera Market, Nairobi',
      phone: '+254712345678',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'outlet-2',
      tenantId: 'tenant-1',
      name: 'Mama Duka - Branch 2',
      address: 'Kawangware, Nairobi',
      phone: '+254712345679',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const users: User[] = [
    {
      id: 'user-1',
      tenantId: 'tenant-1',
      outletIds: ['outlet-1', 'outlet-2'],
      name: 'Jane Wanjiku',
      email: 'owner@mamaduka.co.ke',
      phone: '+254712345678',
      role: 'owner',
      pin: '1234',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user-2',
      tenantId: 'tenant-1',
      outletIds: ['outlet-1'],
      name: 'Peter Ochieng',
      email: 'peter@mamaduka.co.ke',
      phone: '+254723456789',
      role: 'manager',
      pin: '5678',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user-3',
      tenantId: 'tenant-1',
      outletIds: ['outlet-1'],
      name: 'Mary Akinyi',
      email: 'mary@mamaduka.co.ke',
      phone: '+254734567890',
      role: 'attendant',
      pin: '9012',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const products: Product[] = [
    { id: 'prod-1', tenantId: 'tenant-1', sku: 'SUG001', name: 'Sugar 1kg', category: 'Food', costPrice: 120, salePrice: 150, unit: 'kg', reorderLevel: 10, isActive: true, createdAt: new Date().toISOString() },
    { id: 'prod-2', tenantId: 'tenant-1', sku: 'FLO001', name: 'Maize Flour 2kg', category: 'Food', costPrice: 180, salePrice: 220, unit: 'pkt', reorderLevel: 15, isActive: true, createdAt: new Date().toISOString() },
    { id: 'prod-3', tenantId: 'tenant-1', sku: 'OIL001', name: 'Cooking Oil 2L', category: 'Food', costPrice: 350, salePrice: 420, unit: 'btl', reorderLevel: 8, isActive: true, createdAt: new Date().toISOString() },
    { id: 'prod-4', tenantId: 'tenant-1', sku: 'SOP001', name: 'Washing Soap', category: 'Household', costPrice: 45, salePrice: 60, unit: 'bar', reorderLevel: 20, isActive: true, createdAt: new Date().toISOString() },
    { id: 'prod-5', tenantId: 'tenant-1', sku: 'BREAD001', name: 'Bread', category: 'Bakery', costPrice: 50, salePrice: 65, unit: 'loaf', reorderLevel: 12, isActive: true, createdAt: new Date().toISOString() },
    { id: 'prod-6', tenantId: 'tenant-1', sku: 'MILK001', name: 'Milk 500ml', category: 'Dairy', costPrice: 55, salePrice: 70, unit: 'pkt', reorderLevel: 15, isActive: true, createdAt: new Date().toISOString() },
    { id: 'prod-7', tenantId: 'tenant-1', sku: 'TEA001', name: 'Tea Leaves 100g', category: 'Beverages', costPrice: 80, salePrice: 100, unit: 'pkt', reorderLevel: 10, isActive: true, createdAt: new Date().toISOString() },
    { id: 'prod-8', tenantId: 'tenant-1', sku: 'RICE001', name: 'Rice 5kg', category: 'Food', costPrice: 450, salePrice: 550, unit: 'pkt', reorderLevel: 5, isActive: true, createdAt: new Date().toISOString() },
  ];

  await db.tenants.add(tenant);
  await db.outlets.bulkAdd(outlets);
  await db.users.bulkAdd(users);
  await db.products.bulkAdd(products);

  // Seed some historical sales data
  const sales: SalesTransaction[] = [];
  const shifts: Shift[] = [];
  const today = new Date();

  for (let day = 6; day >= 0; day--) {
    const date = new Date(today);
    date.setDate(date.getDate() - day);
    const dateStr = date.toISOString().split('T')[0];

    const shift: Shift = {
      id: `shift-${dateStr}-1`,
      outletId: 'outlet-1',
      attendantId: 'user-3',
      attendantName: 'Mary Akinyi',
      openedAt: `${dateStr}T07:00:00Z`,
      closedAt: `${dateStr}T19:00:00Z`,
      openingCash: 2000,
      closingCashExpected: 8500 + Math.random() * 3000,
      closingCashActual: 8500 + Math.random() * 3000 + (Math.random() > 0.7 ? -Math.random() * 500 : 0),
      status: 'closed',
      synced: true,
    };

    if (shift.closingCashActual && shift.closingCashExpected) {
      shift.cashVariance = shift.closingCashActual - shift.closingCashExpected;
    }

    shifts.push(shift);

    // Generate 15-30 sales per day
    const numSales = 15 + Math.floor(Math.random() * 15);
    for (let i = 0; i < numSales; i++) {
      const hour = 7 + Math.floor(Math.random() * 12);
      const minute = Math.floor(Math.random() * 60);
      const product = products[Math.floor(Math.random() * products.length)];
      const qty = 1 + Math.floor(Math.random() * 3);
      const isMpesa = Math.random() > 0.4;

      sales.push({
        id: `sale-${dateStr}-${i}`,
        outletId: 'outlet-1',
        items: [{
          productId: product.id,
          productName: product.name,
          quantity: qty,
          unitPrice: product.salePrice,
          total: qty * product.salePrice,
        }],
        paymentMethod: isMpesa ? 'mpesa' : 'cash',
        cashAmount: isMpesa ? 0 : qty * product.salePrice,
        mpesaAmount: isMpesa ? qty * product.salePrice : 0,
        totalAmount: qty * product.salePrice,
        shiftId: shift.id,
        loggedBy: 'user-3',
        timestamp: `${dateStr}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`,
        synced: true,
      });
    }
  }

  await db.shifts.bulkAdd(shifts);
  await db.salesTransactions.bulkAdd(sales);

  // Seed stock movements
  const movements: StockMovement[] = [];
  for (const product of products) {
    movements.push({
      id: `sm-${product.id}-init`,
      productId: product.id,
      outletId: 'outlet-1',
      quantity: 50 + Math.floor(Math.random() * 50),
      type: 'restock',
      reason: 'Initial stock',
      loggedBy: 'user-1',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      synced: true,
    });
  }
  await db.stockMovements.bulkAdd(movements);

  // Seed an alert
  await db.alerts.add({
    id: 'alert-1',
    outletId: 'outlet-1',
    type: 'till_variance',
    title: 'Cash Variance Alert',
    description: 'Evening shift till #2 consistently short on Fridays. Variance: -KES 450.',
    score: 0.78,
    generatedAt: new Date().toISOString(),
    status: 'open',
  });
}
