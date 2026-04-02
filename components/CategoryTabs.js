"use client";

import React from "react";

export default function CategoryTabs({ categories, activeCategory, setActiveCategory }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="flex items-center gap-3 overflow-x-auto py-4 scrollbar-hide snap-x">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`flex-shrink-0 snap-start px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
            activeCategory === category
              ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-md transform scale-105"
              : "bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
