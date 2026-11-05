import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAdminSession, logoutAdmin } from '@/actions/admin-auth';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingBag,
  Users,
  Settings,
  ExternalLink,
  LogOut,
  Shield,
} from 'lucide-react';

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // If unauthenticated, allow only /admin/login to render
  // (In Next.js, subroutes inherit layout, but children can be /admin/login)
  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col md:flex-row text-text-primary">
      {session.isAuthenticated ? (
        <>
          {/* Desktop Sidebar */}
          <aside className="w-full md:w-64 bg-[#2C2C2C] text-[#D1CBC3] flex flex-col shrink-0 border-r border-black/20">
            {/* Sidebar Brand Header */}
            <div className="h-20 flex items-center px-6 border-b border-white/10">
              <Link href="/admin" className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0">
                  <Image
                    src="/images/logo-icon.png"
                    alt="GULNAAR"
                    fill
                    sizes="40px"
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-lg font-bold tracking-widest text-[#FAF7F2] leading-none">
                    GULNAAR
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#F6D365] font-semibold mt-1">
                    Management Console
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 py-6 space-y-1 text-xs font-medium">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4 text-[#B8976A]" />
                <span>Dashboard Overview</span>
              </Link>

              <Link
                href="/admin/products"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <Package className="h-4 w-4 text-[#B8976A]" />
                <span>Product Management</span>
              </Link>

              <Link
                href="/admin/categories"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <Layers className="h-4 w-4 text-[#B8976A]" />
                <span>Categories</span>
              </Link>

              <Link
                href="/admin/inventory"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <Boxes className="h-4 w-4 text-[#B8976A]" />
                <span>Inventory Matrix</span>
              </Link>

              <Link
                href="/admin/orders"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <ShoppingBag className="h-4 w-4 text-[#B8976A]" />
                <span>Order Processing</span>
              </Link>

              <Link
                href="/admin/customers"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <Users className="h-4 w-4 text-[#B8976A]" />
                <span>Customers</span>
              </Link>

              <Link
                href="/admin/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <Settings className="h-4 w-4 text-[#B8976A]" />
                <span>Store Settings</span>
              </Link>
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-white/10 text-xs space-y-2">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#FAF7F2] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="h-3.5 w-3.5 text-[#B8976A]" />
                  <span>View Live Store</span>
                </span>
                <span className="text-[10px] text-[#B8976A]">&rarr;</span>
              </Link>

              <form action={logoutAdmin}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-300 hover:bg-red-950/30 transition-colors text-left"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </form>
            </div>
          </aside>

          {/* Main Admin Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top Admin Header Bar */}
            <header className="h-20 bg-bg-primary border-b border-border flex items-center justify-between px-6 sm:px-8">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-brand" />
                <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Authorized Console
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="rounded-full bg-brand-light text-brand px-3 py-1 font-semibold capitalize">
                  {session.role || 'Admin'}
                </span>
                <span className="text-text-secondary hidden sm:inline">{session.email}</span>
              </div>
            </header>

            {/* Page Body */}
            <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
          </div>
        </>
      ) : (
        <div className="flex-1">{children}</div>
      )}
    </div>
  );
}
