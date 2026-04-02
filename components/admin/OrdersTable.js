import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Clock, ChefHat, Bike, CheckCircle, Ban, Package } from "lucide-react";

export const getStatusColor = (status) => {
  switch (status) {
    case "Delivered": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
    case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 border-yellow-200 dark:border-yellow-800";
    case "Preparing": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    case "Out for Delivery": return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800";
    case "Cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
    default: return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-600 border-zinc-200 dark:border-zinc-700";
  }
};

export const getStatusIcon = (status) => {
  switch (status) {
    case "Delivered": return <CheckCircle className="w-3.5 h-3.5 mr-1" />;
    case "Pending": return <Clock className="w-3.5 h-3.5 mr-1" />;
    case "Preparing": return <ChefHat className="w-3.5 h-3.5 mr-1" />;
    case "Out for Delivery": return <Bike className="w-3.5 h-3.5 mr-1" />;
    case "Cancelled": return <Ban className="w-3.5 h-3.5 mr-1" />;
    default: return <Package className="w-3.5 h-3.5 mr-1" />;
  }
};

export default function OrdersTable({ orders }) {
  if (orders.length === 0) {
    return (
      <div className="py-20 text-center bg-white dark:bg-[#1C1C1E] border border-zinc-100 dark:border-zinc-800 rounded-3xl mt-6">
        <Package className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">No Orders Found</h3>
        <p className="text-zinc-500 text-sm mt-1">Try adjusting your filters or wait for new orders to arrive.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1C1C1E] border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm mt-6 hidden md:block select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
             <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-bold">
              <th className="px-6 py-5 rounded-tl-3xl">Order ID</th>
              <th className="px-6 py-5">Customer & Address</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Payment</th>
              <th className="px-6 py-5 text-right">Total</th>
              <th className="px-6 py-5 text-center rounded-tr-3xl">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {orders.map((order) => {
               const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                 month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
               });

               return (
                  <tr key={order._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors group">
                     {/* ID & Date */}
                     <td className="px-6 py-5 align-top">
                       <Link href={`/admin/orders/${order._id}`} className="flex flex-col gap-1 focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded-lg p-1 -m-1">
                          <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white tracking-widest">
                            {order._id.slice(-8).toUpperCase()}
                          </span>
                          <span className="text-xs text-zinc-500">{orderDate}</span>
                       </Link>
                     </td>

                     {/* Customer & Address Details */}
                     <td className="px-6 py-5 align-top">
                       <div className="flex flex-col gap-1">
                         <div className="flex flex-col min-w-0">
                           <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                             {order.address?.fullName || order.userId?.name || "Guest User"}
                           </span>
                           <span className="text-xs text-zinc-500">{order.address?.phone || "No phone"}</span>
                         </div>
                         {order.address && (
                           <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-[200px] truncate" title={`${order.address.addressLine}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`}>
                             {order.address.addressLine}, {order.address.city}
                           </p>
                         )}
                       </div>
                     </td>

                     {/* Status Badge */}
                     <td className="px-6 py-5 align-top">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase border shadow-sm ${getStatusColor(order.status)}`}>
                           {getStatusIcon(order.status)}
                           {order.status}
                        </span>
                     </td>

                     {/* Payment Details */}
                     <td className="px-6 py-5 align-top">
                        <div className="flex flex-col gap-1.5 items-start">
                          <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded uppercase">
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
                     </td>

                     {/* Total */}
                     <td className="px-6 py-5 text-right align-top">
                        <div className="font-black text-amber-600 text-base">
                          ${order.totalAmount?.toFixed(2)}
                        </div>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {order.products.length} {order.products.length === 1 ? 'item' : 'items'}
                        </div>
                     </td>

                     {/* Action */}
                     <td className="px-6 py-5 text-center align-top">
                       <Link 
                         href={`/admin/orders/${order._id}`}
                         className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-all active:scale-95 mt-1"
                       >
                         <ChevronRight className="w-4 h-4 ml-0.5" />
                       </Link>
                     </td>
                  </tr>
               );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
