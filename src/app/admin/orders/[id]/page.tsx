import React from 'react';
import { notFound } from 'next/navigation';
import { getAdminOrderById } from '@/actions/admin-orders';
import OrderDetailClient from './OrderDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) {
    notFound();
  }

  return <OrderDetailClient initialOrder={order} />;
}

