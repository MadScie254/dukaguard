import React, { useState, useMemo } from 'react';
import { Search, Package } from 'lucide-react';
import type { Product } from '../types';
import { db } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

interface ProductSelectorProps {
  onSelect: (product: Product, quantity: number) => void;
  selectedItems: { productId: string; quantity: number }[];
}

export default function ProductSelector({ onSelect, selectedItems }: ProductSelectorProps) {
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const products = useLiveQuery(() => db.products.toArray(), []);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [products, search]);

  const getQuantity = (productId: string) => {
    const item = selectedItems.find((i) => i.productId === productId);
    return item?.quantity || 0;
  };

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleAdd = () => {
    if (selectedProduct && quantity > 0) {
      onSelect(selectedProduct, quantity);
      setSelectedProduct(null);
      setQuantity(1);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
        />
      </div>

      <div className="product-grid max-h-64 overflow-y-auto no-scrollbar">
        {filteredProducts.map((product) => {
          const qty = getQuantity(product.id);
          return (
            <button
              key={product.id}
              onClick={() => handleSelect(product)}
              className={`product-card ${selectedProduct?.id === product.id ? 'selected' : ''}`}
            >
              <Package className="h-8 w-8 text-slate-400" />
              <div className="text-sm font-medium text-slate-900">{product.name}</div>
              <div className="text-xs text-slate-500">KES {product.salePrice}</div>
              {qty > 0 && (
                <div className="badge badge-info">Qty: {qty}</div>
              )}
            </button>
          );
        })}
      </div>

      {selectedProduct && (
        <div className="card bg-slate-50">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-slate-900">{selectedProduct.name}</span>
            <span className="text-sm text-slate-500">KES {selectedProduct.salePrice} each</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-lg font-bold"
            >
              -
            </button>
            <span className="flex-1 text-center text-xl font-bold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-lg font-bold"
            >
              +
            </button>
          </div>
          <div className="mt-3 text-center text-sm text-slate-500">
            Total: KES {(selectedProduct.salePrice * quantity).toLocaleString()}
          </div>
          <button onClick={handleAdd} className="btn-primary w-full mt-3">
            Add to Sale
          </button>
        </div>
      )}
    </div>
  );
}
