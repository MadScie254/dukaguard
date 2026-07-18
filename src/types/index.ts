export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Outlet {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

export type UserRole = 'owner' | 'manager' | 'attendant';

export interface User {
  id: string;
  tenantId: string;
  outletIds: string[];
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  pin: string;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  tenantId: string;
  sku: string;
  name: string;
  category: string;
  costPrice: number;
  salePrice: number;
  unit: string;
  reorderLevel: number;
  isActive: boolean;
  createdAt: string;
}

export type StockMovementType = 'restock' | 'sale' | 'adjustment' | 'waste' | 'return';

export interface StockMovement {
  id: string;
  productId: string;
  outletId: string;
  quantity: number;
  type: StockMovementType;
  reason?: string;
  loggedBy: string;
  timestamp: string;
  synced: boolean;
}

export type PaymentMethod = 'cash' | 'mpesa' | 'mixed';

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface SalesTransaction {
  id: string;
  outletId: string;
  items: SaleItem[];
  paymentMethod: PaymentMethod;
  cashAmount: number;
  mpesaAmount: number;
  totalAmount: number;
  shiftId: string;
  loggedBy: string;
  timestamp: string;
  synced: boolean;
}

export interface Shift {
  id: string;
  outletId: string;
  attendantId: string;
  attendantName: string;
  openedAt: string;
  closedAt?: string;
  openingCash: number;
  closingCashExpected: number;
  closingCashActual?: number;
  cashVariance?: number;
  status: 'open' | 'closed';
  synced: boolean;
}

export interface MpesaStatementEntry {
  id: string;
  outletId: string;
  transactionId: string;
  phoneNumber: string;
  amount: number;
  type: 'incoming' | 'outgoing';
  timestamp: string;
  description: string;
  matchedTransactionId?: string;
  synced: boolean;
}

export interface StocktakeCount {
  id: string;
  productId: string;
  outletId: string;
  countedQuantity: number;
  expectedQuantity: number;
  variance: number;
  loggedBy: string;
  timestamp: string;
  synced: boolean;
}

export type AnomalyType = 'till_variance' | 'stock_variance' | 'sku_pattern' | 'shift_pattern';

export interface AnomalyAlert {
  id: string;
  outletId: string;
  type: AnomalyType;
  title: string;
  description: string;
  score: number;
  generatedAt: string;
  status: 'open' | 'reviewed' | 'dismissed';
}

export interface DailySummary {
  date: string;
  outletId: string;
  totalSales: number;
  totalCash: number;
  totalMpesa: number;
  transactionCount: number;
  cashVariance: number;
  stockVariance: number;
}

export interface SyncQueueItem {
  id: string;
  table: string;
  operation: 'create' | 'update' | 'delete';
  data: unknown;
  timestamp: string;
  retries: number;
  lastError?: string;
}

export type Language = 'en' | 'sw';

export interface AppState {
  currentUser: User | null;
  currentTenant: Tenant | null;
  currentOutlet: Outlet | null;
  language: Language;
  isOnline: boolean;
  syncStatus: 'idle' | 'syncing' | 'error' | 'success';
}
