"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle,
  Menu, 
  X, 
  ChevronRight,
  LogOut,
  Hotel,
  Utensils,
  Settings
} from "lucide-react";

export default function AdminSidebar({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change for mobile
  useEffect(() => {
     setIsSidebarOpen(false);
  }, [pathname]);

  const navItems = [
    { id: "orders", label: "Orders", icon: Package, href: "/admin/orders" },
    { id: "products", label: "Products", icon: Utensils, href: "/admin/products" },
    { id: "add-product", label: "Add Product", icon: PlusCircle, href: "/admin/add-product" },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] dark:bg-black font-sans overflow-hidden">
      
      {/* Mobile Drawer Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Architecture */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 z-50 bg-white dark:bg-[#1C1C1E] border-r border-zinc-200 dark:border-zinc-800 w-[280px] h-screen transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Sidebar Header Brand */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-lg text-zinc-900 dark:text-zinc-100 tracking-tight leading-none">Admin Hub</h2>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Enterprise</span>
            </div>
          </Link>
          <button className="lg:hidden p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg transition-colors" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Core */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-1 custom-scrollbar">
          <div className="px-3 pb-2 pt-2 text-[11px] font-black uppercase tracking-widest text-zinc-400">Main Menu</div>
          {navItems.map((item) => {
            const isActive = item.href === "/admin" 
               ? pathname === "/admin" 
               : pathname.startsWith(item.href);

            return (
               <Link
                 href={item.href}
                 key={item.id}
                 className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 group relative ${
                   isActive 
                     ? "bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-500" 
                     : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100"
                 }`}
               >
                 <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-amber-600 dark:text-amber-500' : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'}`} />
                 <span className="font-bold text-sm">{item.label}</span>
                 {isActive && (
                   <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                 )}
               </Link>
            );
          })}
        </nav>

        {/* Global Control Footer */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex-shrink-0">
          <Link href="/" className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-red-500 group font-bold text-sm">
             <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Exit to App
          </Link>
        </div>
      </aside>

      {/* Fluid Main Content Engine */}
      <div className="flex-1 flex flex-col h-screen min-w-0 bg-[#F8F9FA] dark:bg-black transition-all">
        
        {/* Mobile Navbar App Header */}
        <div className="lg:hidden h-20 px-4 sm:px-6 flex items-center justify-between bg-white dark:bg-[#1C1C1E] border-b border-zinc-200 dark:border-zinc-800 z-30 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-black text-lg text-zinc-900 dark:text-white tracking-tight">Admin</h1>
          </div>
        </div>

        {/* Scrollable Layout Injector */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-10 mx-auto w-full max-w-7xl relative min-h-full">
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               {children}
             </div>
          </div>
        </main>

      </div>
    </div>
  );
}
