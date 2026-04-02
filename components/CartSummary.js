"use client";

import React from "react";
import { Loader2, ArrowRight } from "lucide-react";

export default function CartSummary({ 
  totalItems, 
  subtotal, 
  onCheckout, 
  isCheckingOut 
}) {
  const deliveryFee = subtotal > 0 ? 0 : 0; // Configurable delivery logic
  const taxes = subtotal * 0.05; // 5% tax example
  const grandTotal = subtotal + deliveryFee + taxes;

  if (totalItems === 0) return null;

  return (
    <div className="w-full bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 sm:p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm sticky top-28">
      <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-4 tracking-tight">Bill Details</h2>
      
      <div className="space-y-4 text-sm mb-6">
        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
          <span>Item Total ({totalItems} items)</span>
          <span className="font-medium text-zinc-900 dark:text-zinc-100">Rs. {subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-400">
          <span>Delivery Fee</span>
          <span className="text-emerald-600 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md text-xs tracking-wide">
             FREE
          </span>
        </div>

        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
          <span>Taxes (5%)</span>
          <span className="font-medium text-zinc-900 dark:text-zinc-100">Rs. {taxes.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6 mb-8 flex justify-between items-baseline">
        <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">To Pay</span>
        <span className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Rs. {grandTotal.toFixed(2)}</span>
      </div>

      <button 
        onClick={onCheckout}
        disabled={isCheckingOut || subtotal === 0}
        className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold tracking-wide shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
      >
        {isCheckingOut ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            Proceed to Checkout <ArrowRight className="w-5 h-5 ml-1" />
          </>
        )}
      </button>

      <p className="text-xs text-center text-zinc-400 dark:text-zinc-500 mt-4">
        By placing an order, you agree to our terms and conditions.
      </p>
    </div>
  );
}
