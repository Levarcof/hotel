"use client";

import React from 'react';
import Image from 'next/image';

export default function FoodShowcaseItem({ src, alt, className = "", sizeClass = "w-40 h-40" }) {
  return (
    <div className={`relative flex items-center justify-center p-1.5 sm:p-2 rounded-full bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-white/60 dark:border-zinc-800 shadow-[0_10px_30px_rgba(0,0,0,0.08)] group transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:bg-white/70 dark:hover:bg-zinc-800/70 ${className}`}>
      <div className={`relative ${sizeClass} rounded-full overflow-hidden bg-zinc-50 dark:bg-zinc-950`}>
        <Image 
          src={src} 
          alt={alt} 
          fill 
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-3" 
        />
      </div>
    </div>
  );
}
