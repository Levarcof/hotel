"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, Loader2 } from "lucide-react";

export default function CartItem({ 
  item, 
  onUpdateQuantity, 
  onDelete, 
  updatingId, 
  deletingId 
}) {
  const isUpdating = updatingId === item._id;
  const isDeleting = deletingId === item._id;

  return (
    <div className={`group relative p-3 md:p-5 bg-white dark:bg-[#1C1C1E] border border-zinc-100 dark:border-zinc-800 rounded-2xl flex flex-row gap-3 sm:gap-6 items-center shadow-sm hover:shadow-md transition-all duration-300 ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
       
       {/* Image */}
       <Link href={`/product/${item.productId?._id}`} className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900 flex-shrink-0 group/img focus:outline-none focus:ring-4 focus:ring-amber-500/20">
         <Image 
           src={item.productId?.images?.[0] || "/placeholder-food.jpg"} 
           alt={item.productId?.name || "Product"} 
           fill 
           className="object-cover group-hover/img:scale-105 transition-transform duration-500 ease-out"
         />
       </Link>

       {/* Details */}
       <div className="flex-1 flex flex-col justify-center min-w-0 w-full">
         <div className="flex justify-between items-start gap-2">
            <Link href={`/product/${item.productId?._id}`} className="group/title focus:outline-none w-max max-w-[120px] sm:max-w-full truncate">
              <h3 className="text-sm sm:text-lg font-bold truncate group-hover/title:text-amber-600 transition-colors text-zinc-900 dark:text-zinc-100">
                {item.productId?.name}
              </h3>
            </Link>
            <button 
              onClick={() => onDelete(item._id)}
              disabled={isDeleting}
              className="p-1 sm:p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all flex-shrink-0"
              aria-label="Remove Item"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
         </div>
         
         {item.productId?.description && (
           <p className="text-xs sm:text-sm text-zinc-500 line-clamp-1 sm:mt-1">{item.productId.description}</p>
         )}

         <div className="flex items-center justify-between mt-2 sm:mt-4">
            
            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-lg font-black text-zinc-900 dark:text-zinc-100">Rs. {(item.productId?.price || 0).toFixed(2)}</span>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center bg-zinc-50 dark:bg-zinc-900 rounded-xl p-0.5 sm:p-1 border border-zinc-200 dark:border-zinc-800">
              <button 
                disabled={isUpdating || item.quantity <= 1}
                onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-50 transition-all active:scale-95 shadow-sm"
              >
                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              
              <div className="w-6 sm:w-10 flex justify-center items-center">
                 {isUpdating ? (
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500 animate-spin" />
                 ) : (
                    <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">{item.quantity}</span>
                 )}
              </div>

              <button 
                disabled={isUpdating}
                onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 transition-all active:scale-95 shadow-sm"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
         </div>
       </div>
    </div>
  );
}
