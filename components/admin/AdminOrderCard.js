import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { getStatusColor, getStatusIcon } from "./OrdersTable";

export default function AdminOrderCard({ order }) {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="bg-white dark:bg-[#1C1C1E] border border-zinc-100 dark:border-zinc-800 rounded-3xl p-5 mb-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      
      {/* Top Meta */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-1">
           <span className="font-mono text-xs font-black text-zinc-900 dark:text-white tracking-widest bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md w-max">
             {order._id.slice(-8).toUpperCase()}
           </span>
           <span className="text-xs font-medium text-zinc-500">{orderDate}</span>
        </div>
        
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shadow-sm ${getStatusColor(order.status)}`}>
           {getStatusIcon(order.status)}
           {order.status}
        </span>
      </div>

      {/* Center Details (User & Price) */}
      <div className="flex flex-col border-t border-b border-zinc-50 dark:border-zinc-800/50 py-4 my-2 gap-4">
        {/* User and Total row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden flex-shrink-0 shadow-inner">
               {order.userId?.profileImage ? (
                  <Image src={order.userId.profileImage} alt="profile" fill className="object-cover" />
               ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-black uppercase text-zinc-400">
                    {order.userId?.name?.substring(0,2) || "??"}
                  </div>
               )}
            </div>
            <div className="flex flex-col min-w-0">
               <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[120px]">
                 {order.address?.fullName || order.userId?.name || "Guest"}
               </span>
               <span className="text-[11px] font-medium text-zinc-500 truncate">
                 {order.products.length} {order.products.length === 1 ? 'item' : 'items'}
               </span>
            </div>
          </div>
          
          <div className="text-right flex flex-col items-end">
             <span className="text-xl font-black text-amber-600 tracking-tight block">
                ${order.totalAmount?.toFixed(2)}
             </span>
          </div>
        </div>

        {/* Address & Payment Info */}
        <div className="flex flex-col gap-2 bg-zinc-50/50 dark:bg-[#151516] p-3 rounded-xl">
           {order.address && (
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                <span className="font-bold text-zinc-900 dark:text-zinc-300">Delivery: </span>
                {order.address.addressLine}, {order.address.city}, {order.address.state} - {order.address.pincode}
                <br/>
                <span className="font-bold text-zinc-900 dark:text-zinc-300">Phone: </span> {order.address.phone}
              </div>
           )}
           <div className="flex gap-2 items-center mt-1">
              <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded uppercase">
                {order.paymentMethod || "N/A"}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                order.paymentStatus === "paid" 
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              }`}>
                {order.paymentStatus === "paid" ? "Paid" : "Not Paid"}
              </span>
           </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex justify-end">
         <Link 
           href={`/admin/orders/${order._id}`}
           className="w-full h-10 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold uppercase tracking-wider text-[11px] flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-sm shadow-amber-500/20"
         >
           View Details <ChevronRight className="w-4 h-4 -mr-1" />
         </Link>
      </div>
    </div>
  );
}
