"use client";

import React, { useEffect, useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import FoodCard from "./FoodCard";
import CategoryTabs from "./CategoryTabs";
import Link from "next/link";

export default function FoodSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/product");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];
  
  const filteredProducts = (activeCategory === "All" 
    ? products 
    : products.filter((p) => p.category === activeCategory)).slice(0, 8); // only show top 8

  return (
    <section className="py-20 md:py-32 bg-[#FDFDFD] dark:bg-black font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="max-w-2xl">
            <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs mb-3 block">
              Our Menu
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white tracking-tight mb-3 md:mb-4">
              Popular Dishes
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base md:text-lg">
              Discover the most loved dishes by our customers. From savory mains to delectable desserts, taste the perfection.
            </p>
          </div>
          <Link href="/food" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-white hover:text-amber-500 dark:hover:text-amber-500 transition-colors group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Filter */}
        {!loading && products.length > 0 && (
          <div className="mb-10">
             <CategoryTabs 
               categories={categories} 
               activeCategory={activeCategory} 
               setActiveCategory={setActiveCategory} 
             />
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="w-full flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <FoodCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-zinc-500">
            No dishes found.
          </div>
        )}
        
        {/* Mobile View All Button */}
        <div className="mt-12 flex justify-center md:hidden">
          <Link href="/food" className="flex items-center justify-center gap-2 w-full max-w-sm px-6 py-4 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
            View Full Menu <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
