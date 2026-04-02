"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import OrderCard from "@/components/OrderCard";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      
      if (data.success) {
        setOrders(data.orders);
      } else {
        if(data.message.includes("Unauthorized")) {
           window.location.href = "/login";
        }
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to load orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-amber-100 pb-32">
      <Navbar />

      <main className="max-w-4xl mx-auto pt-4 md:pt-8 px-4 md:px-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight mb-4 md:mb-6">Past Orders</h1>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
             {[1, 2, 3].map(n => (
               <div key={n} className="w-full h-32 md:h-24 bg-zinc-200 dark:bg-zinc-800 rounded-3xl animate-pulse" />
             ))}
          </div>
        ) : !orders.length ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-32 h-32 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
               <Package className="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-2">No orders yet</h2>
            <p className="text-zinc-500 text-sm md:text-base max-w-sm">Looks like you haven't made your menu selection yet.</p>
            <Link href="/food" className="mt-8 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-colors shadow-lg shadow-amber-500/20 active:scale-95">
              Explore Our Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((order, index) => (
              <div 
                key={order._id} 
                className="animate-in fade-in slide-in-from-bottom-2 duration-500" 
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <OrderCard order={order} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
