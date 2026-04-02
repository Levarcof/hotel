"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col md:flex-row items-center justify-start md:justify-center lg:justify-start bg-white dark:bg-black font-sans overflow-hidden">
      
      {/* Mobile-only Image Container (Stacked top with premium fade) */}
      <div className="relative w-full aspect-[4/5] max-h-[55vh] md:hidden">
        <Image
          src="/hero.jpg"
          alt="Fresh Food Made With Love"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Aggressive gradient to smoothly transition into background color */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent dark:from-black dark:via-black/40 z-10" />
      </div>

      {/* Desktop-only Background Image (Full overlay) */}
      <div className="hidden md:block absolute inset-0 w-full h-full z-0">
        <Image
          src="/hero.jpg"
          alt="Fresh Food Made With Love"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col items-center md:items-start text-center md:text-left animate-in fade-in slide-in-from-bottom-8 duration-1000 -mt-20 sm:-mt-28 md:mt-0 pt-6 md:pt-0">
        
        <h1 className="font-serif text-2xl sm:text-5xl md:text-6xl font-black text-zinc-900 dark:text-white md:text-white mb-4 drop-shadow-sm md:drop-shadow-md tracking-tight">
          Fresh Food <br className="hidden sm:block" />
          Made With Love
        </h1>
        
        <p className="text-sm sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-300 md:text-zinc-200 font-light max-w-md md:max-w-lg mb-8 leading-relaxed md:drop-shadow-sm text-balance">
          Experience the authentic taste of gourmet meals crafted with the finest ingredients, delivered piping hot to your door.
        </p>

        <Link 
          href="/food"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95 group"
        >
          Explore Menu
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        
      </div>
    </section>
  );
}
