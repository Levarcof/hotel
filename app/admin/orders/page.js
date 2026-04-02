"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Search, Filter, Loader2, RefreshCcw } from "lucide-react";

import OrdersTable from "@/components/admin/OrdersTable";
import AdminOrderCard from "@/components/admin/AdminOrderCard";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.message || "Failed to load orders");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o._id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (o.userId?.name && o.userId.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="flex justify-between items-center gap-4 mb-6 md:mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6 md:pb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white sm:mb-2">Manage Orders</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm hidden sm:block">View, track, and update all platform orders.</p>
        </div>
        
        <button 
           onClick={fetchOrders}
           disabled={loading}
           className="flex items-center justify-center gap-2 px-3 py-2.5 sm:px-5 sm:py-2.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl font-bold text-sm transition-all active:scale-95 border border-zinc-200 dark:border-zinc-800"
        >
           {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
           <span className="hidden sm:inline">Refresh Data</span>
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-center font-bold">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
         {/* Search */}
         <div className="relative flex-1">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
           <input 
             type="text" 
             placeholder="Search by Order ID or Customer Name..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#1C1C1E] border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-sm font-medium"
           />
         </div>

         {/* Status Dropdown */}
         <div className="relative md:w-64 flex-shrink-0">
           <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
           <select 
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
             className="w-full appearance-none pl-12 pr-10 py-3.5 bg-white dark:bg-[#1C1C1E] border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-sm font-bold text-zinc-700 dark:text-zinc-200 cursor-pointer"
           >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Preparing">Preparing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
           </select>
         </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
           <div className="w-full h-16 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
           <div className="w-full h-16 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse delay-75" />
           <div className="w-full h-16 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse delay-150" />
           <div className="w-full h-16 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse delay-200" />
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <OrdersTable orders={filteredOrders} />

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 mt-6">
             {filteredOrders.length === 0 ? (
               <div className="py-20 text-center bg-white dark:bg-[#1C1C1E] border border-zinc-100 dark:border-zinc-800 rounded-3xl mt-6">
                 <Package className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-zinc-900 dark:text-white">No Orders Found</h3>
               </div>
             ) : (
               filteredOrders.map(order => (
                 <div key={order._id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                   <AdminOrderCard order={order} />
                 </div>
               ))
             )}
          </div>
        </>
      )}
    </>
  );
}
