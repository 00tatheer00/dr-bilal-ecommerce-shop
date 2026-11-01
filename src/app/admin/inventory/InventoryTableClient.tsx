'use client';

import React, { useState } from 'react';
import { adjustVariantStock, type AdminInventoryItem } from '@/actions/admin-inventory';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { Search, AlertTriangle, Plus, Minus, X } from 'lucide-react';

interface Props {
  initialItems: AdminInventoryItem[];
}

export default function InventoryTableClient({ initialItems }: Props) {
  const [items, setItems] = useState<AdminInventoryItem[]>(initialItems);
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Modal State for stock adjustment
  const [activeItem, setActiveItem] = useState<AdminInventoryItem | null>(null);
  const [adjustmentDelta, setAdjustmentDelta] = useState<number>(5);
  const [reason, setReason] = useState<'restock' | 'manual_adjustment' | 'audit'>('restock');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesLow = lowStockOnly ? item.isLowStock || item.isOutOfStock : true;
    return matchesSearch && matchesLow;
  });

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;
    setLoading(true);
    setMessage(null);

    try {
      const res = await adjustVariantStock(activeItem.variantId, adjustmentDelta, reason);
      if (res.success && res.newBalance !== undefined) {
        setItems((prev) =>
          prev.map((i) =>
            i.variantId === activeItem.variantId
              ? {
                  ...i,
                  stockQuantity: res.newBalance!,
                  isLowStock: res.newBalance! <= i.lowStockThreshold && res.newBalance! > 0,
                  isOutOfStock: res.newBalance! <= 0,
                }
              : i
          )
        );
        setMessage(`Stock updated successfully. New balance: ${res.newBalance}`);
        setTimeout(() => {
          setActiveItem(null);
          setMessage(null);
        }, 1200);
      } else {
        setMessage(res.error || 'Failed to adjust stock.');
      }
    } catch {
      setMessage('An error occurred during adjustment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="rounded-xl border border-border bg-bg-primary p-4 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between text-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full rounded-lg border border-border bg-bg-surface px-3 py-2 pl-9 text-text-primary focus:border-brand focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-text-primary">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
              className="h-4 w-4 rounded border-border text-brand focus:ring-brand"
            />
            <span className="flex items-center gap-1 text-amber-700">
              <AlertTriangle className="h-3.5 w-3.5" />
              Show Low / Out of Stock Only
            </span>
          </label>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-xl border border-border bg-bg-primary shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg-secondary text-text-secondary uppercase tracking-wider font-semibold border-b border-border">
              <tr>
                <th className="p-3.5">Product Title</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">Size / Spec</th>
                <th className="p-3.5">Unit Price</th>
                <th className="p-3.5">Current Stock</th>
                <th className="p-3.5">Stock Level</th>
                <th className="p-3.5 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-text-primary">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-secondary">
                    No inventory items found matching your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.variantId} className="hover:bg-bg-surface/40 transition-colors">
                    <td className="p-3.5 font-medium">{item.productName}</td>
                    <td className="p-3.5 font-mono text-[11px] text-brand font-semibold">
                      {item.sku}
                    </td>
                    <td className="p-3.5 text-text-secondary">
                      {item.size ? `Size ${item.size}` : 'Standard'}
                      {item.color ? ` • ${item.color}` : ''}
                    </td>
                    <td className="p-3.5 font-medium">{formatPrice(item.priceMinor)}</td>
                    <td className="p-3.5 font-mono font-bold text-sm">
                      {item.stockQuantity}
                    </td>
                    <td className="p-3.5">
                      {item.isOutOfStock ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700">
                          Out of Stock
                        </span>
                      ) : item.isLowStock ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-700">
                          Low Stock (Threshold: {item.lowStockThreshold})
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-100 text-emerald-700">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setActiveItem(item);
                          setAdjustmentDelta(10);
                          setReason('restock');
                          setMessage(null);
                        }}
                        className="h-8 text-xs px-3"
                      >
                        Adjust Stock
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Dialog Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-bg-primary p-6 shadow-xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-heading font-bold text-base text-text-primary">
                  Adjust Inventory Stock
                </h3>
                <span className="font-mono text-xs text-brand font-semibold">
                  SKU: {activeItem.sku}
                </span>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="p-1 rounded-full text-text-secondary hover:bg-bg-surface"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-text-secondary">
              Product: <strong>{activeItem.productName}</strong> ({activeItem.size ? `Size ${activeItem.size}` : 'Standard'})
              <br />
              Current Available Stock: <strong className="text-brand">{activeItem.stockQuantity}</strong>
            </p>

            {message && (
              <div className="rounded-lg bg-bg-secondary border border-border p-3 text-xs text-text-primary">
                {message}
              </div>
            )}

            <form onSubmit={handleAdjustStock} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-text-primary mb-1">
                  Quantity Change (+ to Add, - to Deduct)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentDelta((d) => d - 1)}
                    className="p-2 rounded border border-border bg-bg-surface hover:bg-bg-secondary"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    required
                    value={adjustmentDelta}
                    onChange={(e) => setAdjustmentDelta(parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded border border-border bg-bg-surface px-3 py-2 text-center font-bold text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setAdjustmentDelta((d) => d + 1)}
                    className="p-2 rounded border border-border bg-bg-surface hover:bg-bg-secondary"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-[11px] text-text-secondary mt-1">
                  New stock will be: <strong>{activeItem.stockQuantity + adjustmentDelta}</strong>
                </p>
              </div>

              <div>
                <label className="block font-semibold uppercase text-text-primary mb-1">
                  Required Reason (Recorded to Inventory Ledger)
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as any)}
                  className="w-full rounded border border-border bg-bg-surface px-3 py-2 text-xs"
                >
                  <option value="restock">Workshop Restock (New Artisan Batch)</option>
                  <option value="manual_adjustment">Manual Adjustment / Inspection</option>
                  <option value="audit">Warehouse Physical Inventory Audit</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button variant="ghost" size="sm" type="button" onClick={() => setActiveItem(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" loading={loading}>
                  Save Stock Adjustment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

