"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ShoppingBag, Star, Clock, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function FoodMenu() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/product");
        const data = await res.json();
        
        if (data.success) {
          setProducts(data.products);
        } else {
          throw new Error(data.message || "Failed to load menu");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add items to cart");
      router.push(`/login?redirect=${window.location.pathname}`);
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Added to cart!");
        // Refresh Navbar cart count
        window.dispatchEvent(new Event("auth-change"));
      } else {
        toast.error(data.message || "Failed to add to cart");
        if (data.message.toLowerCase().includes("unauthorized")) {
           router.push(`/login?redirect=${window.location.pathname}`);
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  // Derived state for categories
  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];
  
  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      {/* Sticky Premium Filter Bar */}
      <div className="sticky top-[64px] z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4 overflow-x-auto py-2  scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-4 sm:px-6 py-2 mt-2 sm:mt-4 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-xl scale-105"
                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-48">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            <p className="mt-6 text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
              Initializing Kitchen
            </p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center py-24 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
            <h3 className="text-lg font-medium mb-2">Service Update</h3>
            <p className="text-zinc-500 text-sm mb-6 px-10">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-xs font-bold uppercase tracking-widest text-amber-600 hover:text-amber-500 transition-colors"
            >
              Refresh Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-x-8 sm:gap-y-12">
            {filteredProducts.map((product) => (
              <div key={product._id} className="group flex flex-col">
                <Link 
                  href={`/product/${product._id}`} 
                  className="relative aspect-[4/3] sm:aspect-[1/1] overflow-hidden rounded-2xl sm:rounded-3xl bg-zinc-100 dark:bg-zinc-900 shadow-sm transition-all duration-700 hover:shadow-2xl hover:shadow-black/5"
                >
                  <Image
                    src={product.images?.[0] || "/placeholder-food.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  
                  {/* Glassmorphism Quick-Action */}
                  <div 
                    onClick={(e) => handleAddToCart(e, product._id)}
                    className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer z-10"
                  >
                    <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md p-2 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-2xl text-zinc-900 dark:text-white hover:bg-amber-500 hover:text-white transition-colors">
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>

                  {/* Elegant Low Stock Tag */}
                  {product.stock > 0 && product.stock < 5 && (
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                      <span className="bg-amber-500/90 backdrop-blur-sm text-white text-[8px] sm:text-[9px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg uppercase tracking-widest">
                        Rare
                      </span>
                    </div>
                  )}
                </Link>

                <div className="mt-3 sm:mt-6 flex flex-col gap-1 sm:gap-1.5 px-0.5 sm:px-1">
                  <div className="flex flex-row justify-between items-center gap-2">
                    <h3 className="font-medium text-xs sm:text-lg leading-tight text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 transition-colors truncate flex-1">
                      {product.name}
                    </h3>
                    <p className="font-bold text-xs sm:text-lg text-zinc-900 dark:text-zinc-100 shrink-0">
                      Rs. {product.price?.toFixed(2)}
                    </p>
                  </div>

                  <p className="text-[11px] sm:text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1 font-light">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-2 sm:gap-4 mt-1 sm:mt-3">
                    <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
                      <span>4.9</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                      <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span className="truncate">15-25 MIN</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-48">
            <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
               <ShoppingBag className="w-6 h-6 text-zinc-300" />
            </div>
            <p className="text-sm font-medium tracking-[0.2em] text-zinc-400 uppercase">
              No items discovered here.
            </p>
          </div>
        )}
      </main>

      {/* Spacing for mobile nav if applicable */}
      <div className="h-20" />
    </div>
  );
}