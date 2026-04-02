"use client";

import React, { useEffect } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

export default function CancelOrderModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isProcessing 
}) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={!isProcessing ? onClose : undefined}
      />
      
      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-[#1C1C1E] rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-zinc-100 dark:border-zinc-800">
        
        {/* Close Icon */}
        <button 
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
           <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-500 shadow-inner">
             <AlertTriangle className="w-8 h-8" strokeWidth={2.5} />
           </div>
           
           <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 mb-2">Cancel Order?</h3>
           <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
             Are you sure you want to cancel this order? This action cannot be undone.
           </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
           <button 
             onClick={onConfirm}
             disabled={isProcessing}
             className="w-full h-12 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-red-600/20 active:scale-95 flex items-center justify-center disabled:opacity-50"
           >
             {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Yes, Cancel Order"}
           </button>
           
           <button 
             onClick={onClose}
             disabled={isProcessing}
             className="w-full h-12 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl font-bold tracking-wide transition-all active:scale-95 disabled:opacity-50"
           >
             No, Keep Order
           </button>
        </div>
        
      </div>
    </div>
  );
}
