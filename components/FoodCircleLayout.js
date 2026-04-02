"use client";

import React from 'react';
import FoodShowcaseItem from './FoodShowcaseItem';

export default function FoodCircleLayout() {
  return (
    <div className="relative w-full flex items-center justify-center min-h-[350px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[600px] overflow-visible animate-in fade-in zoom-in-95 duration-1000">
      
      {/* Dynamic CSS for Floating Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes custom-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float-1 { animation: custom-float 6s ease-in-out infinite; }
        .animate-float-2 { animation: custom-float 5s ease-in-out infinite 1s; }
        .animate-float-3 { animation: custom-float 7s ease-in-out infinite 0.5s; }
      `}} />

      {/* Decorative Background Rings */}
      <div className="absolute inset-0 m-auto w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[450px] lg:h-[450px] border border-amber-500/10 dark:border-amber-500/5 rounded-full z-0" />
      <div className="absolute inset-0 m-auto w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] lg:w-[300px] lg:h-[300px] bg-amber-500/5 dark:bg-amber-500/5 rounded-full z-0 animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
      
      {/* Center Image (Main) */}
      <div className="absolute z-30 animate-float-1">
        <FoodShowcaseItem 
          src="/food1.png" 
          alt="Signature Dish" 
          sizeClass="w-40 h-40 sm:w-56 sm:h-56 lg:w-[18rem] lg:h-[18rem]" 
          className="shadow-2xl shadow-amber-500/15 border-white/60 dark:border-zinc-700/50"
        />
      </div>
      
      {/* Top Left Image */}
      <div className="absolute z-20 
        -translate-x-[90px] -translate-y-[100px] 
        sm:-translate-x-[120px] sm:-translate-y-[130px] 
        lg:-translate-x-[180px] lg:-translate-y-[160px] 
        animate-float-2">
        <FoodShowcaseItem 
          src="/food2.png" 
          alt="Side Dish 1" 
          sizeClass="w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48" 
        />
      </div>
      
      {/* Bottom Right Image */}
      <div className="absolute z-20 
        translate-x-[90px] translate-y-[100px] 
        sm:translate-x-[120px] sm:translate-y-[130px] 
        lg:translate-x-[180px] lg:translate-y-[160px] 
        animate-float-3">
        <FoodShowcaseItem 
          src="/food3.png" 
          alt="Side Dish 2" 
          sizeClass="w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48" 
        />
      </div>

    </div>
  );
}
