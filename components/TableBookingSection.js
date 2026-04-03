import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Users, ChevronRight, MapPin, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export default function TableBookingSection() {
  return (
    <section className="py-20 md:py-32 bg-white dark:bg-black overflow-hidden relative">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-full md:w-1/3 h-full bg-amber-500/[0.03] dark:bg-amber-500/[0.05] rounded-l-none md:rounded-l-[10rem] -z-10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Content Area - Left */}
          <div className="flex-1 space-y-8 md:space-y-12 order-2 lg:order-1">
            <div className="space-y-4 md:space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/10 rounded-full border border-amber-100 dark:border-amber-800/50">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span className="text-amber-600 dark:text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">Exquisite Dining</span>
              </div>

              <h2 className="text-2xl md:justify-start  flex justify-center gap-2 md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter leading-[0.95] font-serif uppercase italic">
                Secure your <br />
                <span className="text-amber-500 relative inline-block not-italic">
                  Table
                  <div className="absolute -bottom-1 left-0 w-full h-1 bg-amber-500/20 rounded-full" />
                </span>
              </h2>

              <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                Indulge in a curated culinary journey. Skip the wait and guarantee your spot at the most sought-after tables in the house.
              </p>
            </div>

            {/* Feature Cards Grid - 2 columns on mobile for better organization */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="group p-4 md:p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl md:rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 transition-all hover:bg-white dark:hover:bg-zinc-900 shadow-sm">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-amber-500 mb-3 transition-transform group-hover:scale-110">
                  <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h4 className="text-[11px] md:text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">Instant Confirmation</h4>
                <p className="text-[8px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Reserve in seconds</p>
              </div>

              <div className="group p-4 md:p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl md:rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 transition-all hover:bg-white dark:hover:bg-zinc-900 shadow-sm">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-emerald-500 mb-3 transition-transform group-hover:scale-110">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h4 className="text-[11px] md:text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">Prime Locations</h4>
                <p className="text-[8px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Select your view</p>
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-start gap-6">
              <Link
                href="/tables"
                className="group relative px-10 py-5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all overflow-hidden flex items-center gap-3 w-full sm:w-auto justify-center"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Launch Reservation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
              
              <div className="flex items-center gap-3 px-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white dark:border-black bg-zinc-200 dark:bg-zinc-800" />
                  ))}
                </div>
                <p className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-none">
                  <span className="text-zinc-950 dark:text-white">4.9/5 Rating</span> from 2k+ diners
                </p>
              </div>
            </div>
          </div>

          {/* Visual Showcase - Right */}
          <div className="flex-1 relative w-full h-[350px] md:h-[600px] order-1 lg:order-2">
            {/* Geometric Accents - Hidden on small mobile to avoid clutter */}
            <div className="absolute -inset-4 bg-amber-500/5 dark:bg-amber-500/10 rounded-[2.5rem] md:rounded-[4rem] -rotate-2 blur-2xl hidden md:block" />
            
            <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white dark:border-zinc-900 group">
              <Image
                src="/table1.jpg"
                alt="Premium Restaurant Table"
                fill
                priority
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />

              {/* Verified Badge */}
              <div className="absolute top-4 right-4 md:top-8 md:right-8">
                <div className="bg-black/20 backdrop-blur-md border border-white/20 p-2 md:p-3 rounded-2xl flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                  <div className="hidden sm:block">
                    <p className="text-[8px] font-black text-white uppercase tracking-widest leading-none">Secure Booking</p>
                  </div>
                </div>
              </div>

              {/* Bottom Label */}
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white drop-shadow-lg">
                <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter leading-none font-serif italic">
                  Premium <br /> 
                  <span className="text-amber-500 not-italic">Ambiance</span>
                </h3>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}