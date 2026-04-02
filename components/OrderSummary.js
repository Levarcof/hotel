"use client";

import React, { useState } from "react";
import { Loader2, AlertCircle, Trash2 } from "lucide-react";
import CancelOrderModal from "./CancelOrderModal";

export default function OrderSummary({ 
  order, 
  onCancel,
  isPending
}) {
  const [showModal, setShowModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleConfirmCancel = async () => {
    setCancelling(true);
    await onCancel();
    setCancelling(false);
    setShowModal(false);
  };

  const deliveryFee = 0; // Configured statically for now
  const taxes = 0;

  return (
    <>
      <div className="w-full bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 sm:p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm sticky top-28">
        <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-4 tracking-tight">
          Receipt Breakdown
        </h2>
        
        <div className="space-y-4 text-sm mb-6">
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
            <span>Item Total ({order.products.length} {order.products.length === 1 ? 'item' : 'items'})</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">Rs. {order.totalAmount?.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-400">
            <span>Delivery Fee</span>
            <span className="text-emerald-600 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md text-xs tracking-wide uppercase">
               Complimentary
            </span>
          </div>

          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
            <span>Taxes</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">Rs. {taxes.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6 flex justify-between items-baseline mb-8">
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Total Paid</span>
          <span className="text-3xl font-black text-amber-600 tracking-tight">Rs. {order.totalAmount?.toFixed(2)}</span>
        </div>

        {/* Action Button Area */}
        {isPending && (
          <button 
            onClick={() => setShowModal(true)}
            className="w-full h-14 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-900 rounded-xl font-bold tracking-wide transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
             <Trash2 className="w-5 h-5" /> Cancel Entire Order
          </button>
        )}
      </div>

      {showModal && (
        <CancelOrderModal 
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmCancel}
          isProcessing={cancelling}
        />
      )}
    </>
  );
}
