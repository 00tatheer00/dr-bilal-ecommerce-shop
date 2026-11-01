import React from 'react';
import { getAdminCategories } from '@/actions/admin-categories';
import CategoriesClient from './CategoriesClient';

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="max-w-7xl">
      <CategoriesClient initialCategories={categories} />
    </div>
  );
}

