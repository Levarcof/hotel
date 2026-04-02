import React from "react";
import { Receipt } from "lucide-react";

export default function AdminOrderSummary({ order }) {
  const deliveryFee = 0;
  const taxes = 0;

  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-[2.5rem] p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm sticky top-28">
      <h3 className="text-xl font-black mb-6 tracking-tight flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
        <Receipt className="w-5 h-5 text-amber-500" /> Payment Receipt
      </h3>
      
      <div className="space-y-4 mb-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
         <div className="flex justify-between items-center">
            <span>Item Total ({order.products?.length || 0} items)</span>
            <span className="text-zinc-900 dark:text-zinc-100">Rs. {order.totalAmount?.toFixed(2)}</span>
         </div>
         <div className="flex justify-between items-center">
            <span>Delivery Fee</span>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">
               Complimentary
            </span>
         </div>
         <div className="flex justify-between items-center">
            <span>Taxes</span>
            <span className="text-zinc-900 dark:text-zinc-100">Rs. {taxes.toFixed(2)}</span>
         </div>
      </div>

      <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-baseline mb-4">
         <span className="text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Total Due</span>
         <span className="text-3xl font-black text-amber-600 tracking-tight">Rs. {(order.totalAmount || 0).toFixed(2)}</span>
      </div>
      
      <div className={`text-xs text-center font-bold uppercase tracking-widest py-2.5 rounded-xl border mb-3 ${
        order.paymentStatus === 'paid' 
          ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/50' 
          : 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/50'
      }`}>
        {order.paymentStatus === 'paid' ? 'Paid Successfully' : 'Payment Pending'}
      </div>

      <div className="flex justify-between items-center bg-zinc-50 dark:bg-[#151516] px-4 py-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
         <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Method</span>
         <span className="text-sm font-black text-zinc-900 dark:text-white uppercase">
            {order.paymentMethod || 'N/A'}
         </span>
      </div>
    </div>
  );
}
