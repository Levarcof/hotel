"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Loader2 } from "lucide-react";

export default function OrderProductCard({ 
  item, 
  isPending, 
  onRemove, 
  removingId 
}) {
  const isRemoving = removingId === item.productId?._id;

  return (
    <div className={`group relative p-4 md:p-5 bg-white dark:bg-[#1C1C1E] border border-zinc-100 dark:border-zinc-800 rounded-2xl flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center shadow-sm hover:shadow-md transition-all duration-300 ${isRemoving ? 'opacity-50 pointer-events-none' : ''}`}>
       
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
            
            {/* Conditional Remove Button */}
            {isPending && (
              <button 
                onClick={() => onRemove(item.productId?._id)}
                disabled={isRemoving}
                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all flex-shrink-0"
                aria-label="Remove Item"
                title="Remove Item from Order"
              >
                {isRemoving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
              </button>
            )}
         </div>
         
         {item.productId?.description && (
           <p className="text-sm text-zinc-500 line-clamp-1 mt-1">{item.productId.description}</p>
         )}

         <div className="flex items-center justify-between mt-3 sm:mt-4">
            
            {/* Unit Price & Quantity */}
            <div className="flex flex-col gap-0.5 sm:gap-1">
               <span className="text-xs sm:text-sm font-medium text-zinc-500">
                 ${(item.price || 0).toFixed(2)} <span className="text-[10px] sm:text-xs uppercase opacity-70">x {item.quantity}</span>
               </span>
            </div>

            {/* Total Item Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg md:text-xl font-black text-amber-600 tracking-tight">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
         </div>
       </div>
    </div>
  );
}
