"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Hotel, ShieldCheck, BedDouble, Wind, Maximize } from "lucide-react";

export default function RoomShowcaseSection() {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-zinc-950 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* --- SECTION HEADER --- */}
        <div className="flex flex-col items-start mb-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-[1px] bg-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600 dark:text-amber-500">
              Accommodation
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Elite Residency Rooms
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* --- LEFT SIDE: IMAGE SHOWCASE --- */}
          <div className="relative group">
            {/* Elegant Border Frame */}
            <div className="absolute -inset-3 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] -z-10 transition-transform group-hover:scale-[1.02]" />
            
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-xl">
              <Image 
                src="/room1.png" 
                alt="Executive Suite" 
                fill 
                className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                priority
              />
              
              {/* Subtle Status Badge */}
              <div className="absolute top-6 left-6">
                <div className="px-3 py-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-lg border border-white/20 flex items-center gap-2 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-200">
                    Premium Inventory
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: CONTENT & FEATURES --- */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-5">
              <h3 className="text-2xl md:text-3xl font-semibold text-zinc-900 dark:text-white leading-snug">
                Architectural excellence meeting <br className="hidden md:block" />
                <span className="text-amber-600 dark:text-amber-500">modern tranquility.</span>
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-lg">
                Our suites are more than just rooms; they are meticulously curated environments. 
                Experience a blend of high-end bespoke interiors and smart-living technology 
                designed for the uncompromising guest.
              </p>
            </div>

            {/* Feature Icon Grid */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-amber-600">
                  <BedDouble size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold dark:text-zinc-200">King Bed</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-tighter">Bespoke Comfort</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-amber-600">
                  <Wind size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold dark:text-zinc-200">Climate Control</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-tighter">Pure Air System</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-amber-600">
                  <Maximize size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold dark:text-zinc-200">550 Sq Ft</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-tighter">Expansive Layout</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-amber-600">
                  <Hotel size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold dark:text-zinc-200">24/7 Butler</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-tighter">Concierge Service</p>
                </div>
              </div>
            </div>

            {/* Action Area */}
            <div className="pt-6 flex flex-col sm:flex-row items-center gap-6">
              <Link 
                href="/rooms" 
                className="w-full sm:w-auto px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-amber-600 hover:dark:bg-amber-500 hover:text-white active:scale-95 shadow-lg flex items-center justify-center gap-2"
              >
                Secure Your Suite <ArrowRight size={14} />
              </Link>
              
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Live Availability
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}