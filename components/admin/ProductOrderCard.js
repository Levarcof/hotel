import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";

export default function ProductOrderCard({ productItem }) {
  if (!productItem || !productItem.productId) return null;
  const product = productItem.productId;

  return (
    <div className="bg-white dark:bg-[#1C1C1E] border border-zinc-100 dark:border-zinc-800 p-4 md:p-5 rounded-3xl flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-shadow group">
       <Link href={`/product/${product._id}`} className="relative w-full sm:w-28 h-32 sm:h-28 rounded-[1.5rem] overflow-hidden bg-zinc-50 dark:bg-zinc-900 flex-shrink-0 group-hover:shadow-md transition-all shadow-sm">
          <Image 
             src={product.images?.[0] || "/placeholder-food.jpg"} 
             alt={product.name || "Product"} 
             fill 
             className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
       </Link>
       
       <div className="flex-1 w-full min-w-0 flex flex-col justify-center">
          <div className="flex justify-between items-start gap-4 mb-1">
             <Link href={`/product/${product._id}`} className="text-lg font-black text-zinc-900 dark:text-zinc-100 hover:text-amber-600 dark:hover:text-amber-500 transition-colors truncate">
                {product.name}
             </Link>
          </div>
          <p className="text-sm font-medium text-zinc-500 line-clamp-1 mb-3">
             {product.description || "No description provided."}
          </p>
          
          <div className="flex justify-between items-baseline mt-auto">
             <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">Rs. {(productItem.price || 0).toFixed(2)}</span>
                <span className="text-xs uppercase text-zinc-400 font-bold tracking-widest px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800">
                  x {productItem.quantity}
                </span>
             </div>
             
             <div className="text-xl font-black text-amber-600 tracking-tight">
                Rs. {((productItem.price || 0) * productItem.quantity).toFixed(2)}
             </div>
          </div>
       </div>
    </div>
  );
}
