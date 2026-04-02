import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getStatusIcon, getStatusColor } from "./OrdersTable";

export default function OrderDetailsHeader({ order }) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  
  const shortId = order._id.substring(order._id.length - 8).toUpperCase();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-[#1C1C1E] border border-zinc-100 dark:border-zinc-800 p-6 md:p-8 rounded-[2rem] shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-10 w-96 h-96 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none -z-0" />
      
      <div className="flex gap-4 relative z-10">
        <Link 
          href="/admin/orders" 
          className="w-12 h-12 flex-shrink-0 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-full flex items-center justify-center transition-all active:scale-95 border border-zinc-200 dark:border-zinc-800 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col justify-center">
          <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
             Order <span className="text-amber-600 font-mono tracking-widest">{shortId}</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500 mt-1">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
}
