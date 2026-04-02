"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, Loader2, Minus, Plus, 
  ShoppingBag, Check, Star, Clock, 
  Zap, Heart, Share2
} from "lucide-react";
import CheckoutModal from "@/components/CheckoutModal";

export default function ProductDetails() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/product/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
        } else {
          throw new Error(data.message || "Failed to load product details");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    if (added) return;
    
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, quantity }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      } else {
        alert(data.message || "Please login to add items to cart");
        if(data.message.toLowerCase().includes("unauthorized") || data.message.toLowerCase().includes("login")) {
          window.location.href = "/login";
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const handleOrderNowClick = () => {
    setIsModalOpen(true);
  };

  const handleOrderSuccess = () => {
    setIsModalOpen(false);
    setOrderSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#F9F9F9] dark:bg-zinc-950">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-amber-100">
      
      {/* Premium Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-10 py-5 flex justify-between items-center bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50">
        <Link href={isAdmin ? "/admin" : "/food"} className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex gap-2">
           <button className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-all"><Share2 className="w-5 h-5" /></button>
           <button className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-all"><Heart className="w-5 h-5" /></button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto pt-24 pb-32 px-4 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {orderSuccess && (
            <div className="lg:col-span-2 mb-2 p-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/50 flex flex-col items-center justify-center text-center space-y-4 shadow-sm animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-emerald-900 dark:text-emerald-100 tracking-tight">Order Placed Successfully!</h2>
              <p className="text-emerald-700 dark:text-emerald-400 font-medium max-w-sm">We've received your order and are preparing it fresh for you.</p>
              <div className="flex gap-4 mt-4">
                 <Link href="/orders" className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-500 shadow-md transition-all active:scale-95">
                   Track Order
                 </Link>
                 <button onClick={() => setOrderSuccess(false)} className="px-6 py-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl font-bold text-sm border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all active:scale-95">
                   Buy More
                 </button>
              </div>
            </div>
          )}

          {/* Left Side: Product Visuals */}
          <div className="space-y-6">
            <div className="relative aspect-square w-full flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(251,191,36,0.08)_0%,transparent_70%)]" />
              
              <Image
                src={product.images[activeImage] || "/placeholder-food.jpg"}
                alt={product.name}
                fill
                priority
                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] mix-blend-multiply dark:mix-blend-normal p-4"
              />
            </div>

            {/* Premium Thumbnail Selector */}
            {product.images?.length > 1 && (
              <div className="flex gap-4 justify-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden transition-all duration-300 border-2 
                      ${activeImage === idx ? "border-amber-500 scale-105 shadow-xl" : "border-transparent opacity-60 grayscale hover:grayscale-0"}`}
                  >
                    <Image src={img} alt="thumb" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Product Details */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center text-sm font-bold text-zinc-500">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1" />
                  4.9 <span className="ml-1 font-medium opacity-60">(1.2k Reviews)</span>
                </div>
              </div>

              {/* MODIFIED: Name and Price on the same line */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-4">
                <h1 className="text-xl sm:text-3xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-white flex-1">
                  {product.name}
                </h1>
                <span className="text-xl sm:text-3xl md:text-4xl font-bold text-amber-600 tabular-nums">
                  Rs. {product.price?.toFixed(2)}
                </span>
                {product.stock > 0 ? (
                  <div className="flex items-center gap-1.5 mt-0.5 sm:mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">Currently Available</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 mt-0.5 sm:mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span className="text-[10px] sm:text-sm font-bold text-red-600 dark:text-red-400">Currently Unavailable</span>
                  </div>
                )}
              </div>

              <p className="text-sm sm:text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg mt-2 sm:mt-0">
                {product.description}
              </p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800 flex flex-col items-center gap-1 shadow-sm">
                <Clock className="w-5 h-5 text-amber-600" />
                <span className="text-[10px] font-bold uppercase text-zinc-400">Time</span>
                <span className="text-xs font-bold">20 min</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800 flex flex-col items-center gap-1 shadow-sm">
                <Zap className="w-5 h-5 text-amber-600" />
                <span className="text-[10px] font-bold uppercase text-zinc-400">Calories</span>
                <span className="text-xs font-bold">450 kcal</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800 flex flex-col items-center gap-1 shadow-sm">
                <ShoppingBag className="w-5 h-5 text-amber-600" />
                <span className="text-[10px] font-bold uppercase text-zinc-400">Weight</span>
                <span className="text-xs font-bold">350g</span>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="space-y-6 pt-4 hidden md:block">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-6">
                  <div className={`flex items-center bg-zinc-200/50 dark:bg-zinc-900 rounded-2xl p-1.5 border border-zinc-200 dark:border-zinc-800 ${product.stock === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
                    <button disabled={product.stock === 0} onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white dark:hover:bg-zinc-800 transition-all active:scale-90 disabled:opacity-50"><Minus className="w-4 h-4" /></button>
                    <span className="w-12 text-center font-bold text-lg">{product.stock === 0 ? 0 : quantity}</span>
                    <button disabled={product.stock === 0} onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white dark:hover:bg-zinc-800 transition-all active:scale-90 disabled:opacity-50"><Plus className="w-4 h-4" /></button>
                  </div>
                  <button disabled={product.stock === 0} onClick={handleAddToCart} className="flex-1 h-14 bg-white dark:bg-zinc-900  dark:border-zinc-100 text-zinc-950 dark:text-white rounded-2xl font-bold uppercase tracking-widest hover:text-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    {added ? "Added!" : "Add to Cart"}
                  </button>
                </div>
                <button disabled={product.stock === 0} onClick={handleOrderNowClick} className="w-full h-14 bg-zinc-950 dark:bg-white text-white dark:text-black rounded-2xl font-bold uppercase tracking-widest shadow-2xl shadow-amber-500/10 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Zap className="w-4 h-4 fill-current" /> Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE PREMIUM FLOATING BAR */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
        <div className={`bg-zinc-950 dark:bg-white p-3 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-3 ${product.stock === 0 ? 'opacity-90' : ''}`}>
          <div className="flex items-center bg-zinc-800 dark:bg-zinc-100 rounded-full p-1 ml-1">
             <button disabled={product.stock === 0} onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 rounded-full bg-zinc-700 dark:bg-zinc-200 text-white dark:text-zinc-900 flex items-center justify-center active:scale-75 transition-all disabled:opacity-50"><Minus className="w-4 h-4" /></button>
             <span className="w-8 text-center font-bold text-white dark:text-black text-sm">{product.stock === 0 ? 0 : quantity}</span>
             <button disabled={product.stock === 0} onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-9 h-9 rounded-full bg-zinc-700 dark:bg-zinc-200 text-white dark:text-zinc-900 flex items-center justify-center active:scale-75 transition-all disabled:opacity-50"><Plus className="w-4 h-4" /></button>
          </div>
          
          <div className="flex-1 flex gap-2">
             <button disabled={product.stock === 0} onClick={handleAddToCart} className="flex-1 h-11 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 rounded-full font-bold text-[11px] uppercase tracking-tighter active:scale-95 transition-all disabled:opacity-50">
               {added ? "Added" : "Cart"}
             </button>
             <button disabled={product.stock === 0} onClick={handleOrderNowClick} className="flex-[1.5] h-11 bg-amber-500 text-white rounded-full font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50">
               Order • Rs. {(product.price * (product.stock === 0 ? 0 : quantity)).toFixed(2)}
             </button>
          </div>
        </div>
      </div>

      {product && (
        <CheckoutModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleOrderSuccess}
          amount={product.price * quantity}
          itemsToOrder={[{
             productId: product._id,
             quantity: quantity,
             price: product.price
          }]}
        />
      )}
    </div>
  );
}