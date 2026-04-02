"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, CheckCircle, Clock, ChefHat, Bike, Ban, Package } from "lucide-react";

const getStatusColor = (status) => {
  switch (status) {
    case "Delivered": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500";
    case "Preparing": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "Out for Delivery": return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400";
    case "Cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default: return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Delivered": return <CheckCircle className="w-4 h-4 mr-1" />;
    case "Pending": return <Clock className="w-4 h-4 mr-1" />;
    case "Preparing": return <ChefHat className="w-4 h-4 mr-1" />;
    case "Out for Delivery": return <Bike className="w-4 h-4 mr-1" />;
    case "Cancelled": return <Ban className="w-4 h-4 mr-1" />;
    default: return <Package className="w-4 h-4 mr-1" />;
  }
};

export default function OrderCard({ order }) {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <Link 
      href={`/order/${order._id}`}
      className="block group bg-white dark:bg-[#1C1C1E] border border-zinc-100 dark:border-zinc-800 rounded-3xl p-5 md:p-6 mb-4 shadow-sm hover:shadow-[0_20px_50px_rgba(245,158,11,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div className="flex flex-col space-y-2 w-full sm:w-auto">
          <div className="flex justify-between items-center sm:hidden w-full mb-1">
             <span className="text-zinc-500 text-sm font-mono tracking-tighter">
               ID: {order._id.substring(order._id.length - 8).toUpperCase()}
             </span>
          </div>

          <div className="flex items-center gap-3">
             <span className={`px-3 py-1 rounded-md text-xs font-bold tracking-wide flex items-center ${getStatusColor(order.status)}`}>
               {getStatusIcon(order.status)}
               {order.status}
             </span>
             <span className="text-zinc-500 text-sm font-medium">
               {orderDate}
             </span>
          </div>
          
          <div className="hidden sm:block text-zinc-400 text-sm font-mono tracking-tighter mt-1 group-hover:text-zinc-500 transition-colors">
             Order #{order._id.substring(order._id.length - 8).toUpperCase()}
          </div>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8 border-t sm:border-0 border-zinc-100 dark:border-zinc-800 pt-4 sm:pt-0">
          <div className="text-left sm:text-right">
             <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Total</p>
             <p className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
               Rs. {order.totalAmount?.toFixed(2)}
             </p>
          </div>
          
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20 group-hover:text-amber-600 transition-colors duration-300">
             <ChevronDown className="w-5 h-5 text-zinc-500 group-hover:text-amber-600 -rotate-90" />
          </div>
        </div>
      </div>

      {/* Minimal Items Preview */}
      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-4 relative z-10">
         <div className="flex -space-x-3 sm:-space-x-4">
           {order.products.slice(0, 3).map((item, idx) => (
             <div key={idx} className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-white dark:border-[#1C1C1E] relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-sm z-10">
               <Image 
                 src={item.productId?.images?.[0] || "/placeholder-food.jpg"} 
                 alt="item" fill className="object-cover"
               />
             </div>
           ))}
           {order.products.length > 3 && (
             <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-white dark:border-[#1C1C1E] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] sm:text-xs font-bold text-zinc-600 dark:text-zinc-400 z-0">
               +{order.products.length - 3}
             </div>
           )}
         </div>
         <p className="text-sm font-medium text-zinc-500 flex-1 truncate">
           <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {order.products[0]?.productId?.name || "Multiple Items"}
           </span>
           {order.products.length > 1 && ` + ${order.products.length - 1} more`}
         </p>
      </div>
    </Link>
  );
}
