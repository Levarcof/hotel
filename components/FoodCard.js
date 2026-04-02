"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Plus, Loader2, Check } from "lucide-react";

export default function FoodCard({ product }) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation since card is wrapped in Link or has a Link inside
    if (added || adding) return;
    
    setAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      } else {
        alert(data.message || "Please login to add items to cart");
        if(data.message?.toLowerCase().includes("unauthorized") || data.message?.toLowerCase().includes("login")) {
          window.location.href = "/login";
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add item to cart.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-none border border-zinc-100 dark:border-zinc-800 overflow-hidden transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1">
      
      {/* Image Section */}
      <Link href={`/product/${product._id}`} className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        <Image
          src={product.images?.[0] || "/placeholder-food.jpg"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm text-[10px] font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-200">
            {product.category}
          </div>
        )}
      </Link>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-3 sm:p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:gap-2 mb-1 sm:mb-2">
          <Link href={`/product/${product._id}`} className="flex-1">
            <h3 className="font-bold text-sm sm:text-lg md:text-xl text-zinc-900 dark:text-white leading-tight group-hover:text-amber-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-sm sm:rounded-md mt-1 sm:mt-0">
            <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-current" />
            <span className="text-[9px] sm:text-[11px] font-bold">4.8</span>
          </div>
        </div>
        
        <p className="text-[11px] sm:text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1 sm:line-clamp-2 mb-2 sm:mb-4 flex-1">
          {product.description}
        </p>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between mt-auto pt-2 sm:pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
          <div className="flex flex-col">
            <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-400">Price</span>
            <span className="text-xs sm:text-xl font-black text-zinc-900 dark:text-white leading-none mt-0.5 sm:mt-0">
              ${product.price?.toFixed(2)}
            </span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={adding}
            className={`relative w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-all duration-300 shadow-sm ${
              added 
                ? "bg-emerald-500 text-white shadow-emerald-500/30" 
                : "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30 hover:shadow-amber-500/50 active:scale-95"
            }`}
            aria-label="Add to cart"
          >
            {adding ? (
              <Loader2 className="w-3 h-3 sm:w-5 sm:h-5 animate-spin" />
            ) : added ? (
              <Check className="w-3 h-3 sm:w-5 sm:h-5" />
            ) : (
              <Plus className="w-3 h-3 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
