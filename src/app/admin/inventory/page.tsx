import React from 'react';
import { getAdminInventory } from '@/actions/admin-inventory';
import InventoryTableClient from './InventoryTableClient';

export default async function AdminInventoryPage() {
  const items = await getAdminInventory();

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="border-b border-border pb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
          Inventory & Stock Matrix
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Monitor variant stock balances and record audited adjustments to the inventory ledger.
        </p>
      </div>

      <InventoryTableClient initialItems={items} />
    </div>
  );
}

