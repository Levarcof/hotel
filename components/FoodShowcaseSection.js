"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FoodCircleLayout from "./FoodCircleLayout";

export default function FoodShowcaseSection() {
  return (
    <section className="py-20 md:py-32 bg-[#FAFAFA] dark:bg-black font-sans overflow-hidden border-t border-zinc-100 dark:border-zinc-900 border-b">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
        
        {/* Left Side: Visuals (Food Circle Layout) */}
        <div className="order-1 lg:order-1 flex justify-center w-full">
          <FoodCircleLayout />
        </div>

        {/* Right Side: Content */}
        <div className="order-2 lg:order-2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000">
          
          <h2 className="font-serif text-3xl sm:text-5xl md:text-[3.5rem] font-black text-zinc-900 dark:text-white tracking-tight leading-[1.05]">
            Our Delicious <br className="hidden md:block"/> Menu
          </h2>
          
          <p className="text-sm sm:text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed font-light text-balance transition-all">
            We offer incredibly fresh and tasty dishes made from the highest quality ingredients. 
            From local favorites to gourmet meals, satisfying your cravings has never been easier.
          </p>

          <Link 
            href="/food"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 sm:px-8 sm:py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:shadow-none active:scale-95 group mt-2 sm:mt-4"
          >
            View Menu
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

        </div>

      </div>
    </section>
  );
}
