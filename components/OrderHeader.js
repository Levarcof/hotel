"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, ChefHat, Bike, CheckCircle, Ban, Package } from "lucide-react";

const getStatusColor = (status) => {
  switch (status) {
    case "Delivered": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
    case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 border-yellow-200 dark:border-yellow-800";
    case "Preparing": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    case "Out for Delivery": return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800";
    case "Cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
    default: return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Delivered": return <CheckCircle className="w-4 h-4 mr-1.5" />;
    case "Pending": return <Clock className="w-4 h-4 mr-1.5" />;
    case "Preparing": return <ChefHat className="w-4 h-4 mr-1.5" />;
    case "Out for Delivery": return <Bike className="w-4 h-4 mr-1.5" />;
    case "Cancelled": return <Ban className="w-4 h-4 mr-1.5" />;
    default: return <Package className="w-4 h-4 mr-1.5" />;
  }
};

export default function OrderHeader({ order }) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  
  const shortId = order._id.substring(order._id.length - 8).toUpperCase();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-[#1C1C1E] border border-zinc-100 dark:border-zinc-800 p-6 md:p-8 rounded-[2rem] shadow-sm">
      <div className="flex gap-4">
        <Link 
          href="/orders" 
          className="w-12 h-12 flex-shrink-0 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-full flex items-center justify-center transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col justify-center">
          <h1 className="text-lg sm:text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
            Order <span className="text-amber-600">#{shortId}</span>
          </h1>
          <p className="text-xs sm:text-sm font-medium text-zinc-500 mt-1">{formattedDate}</p>
        </div>
      </div>
      
      <div className="flex sm:justify-end border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800 pt-4 sm:pt-0">
        <span className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold tracking-wide flex items-center border ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
          {order.status}
        </span>
      </div>
    </div>
  );
}
