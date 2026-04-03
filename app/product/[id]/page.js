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
import { toast } from "react-hot-toast";

export default function ProductDetails() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
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
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProductDetails();
  }, [id]);

  // NATIVE SHARE FUNCTIONALITY
  const handleShare = async () => {
    const shareData = {
      title: product?.name,
      text: `Check out this delicious ${product?.name}!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

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
        toast.success("Added to cart!");
        setTimeout(() => setAdded(false), 2000);
      } else {
        toast.error(data.message || "Please login first");
        if(data.message.toLowerCase().includes("unauthorized")) window.location.href = "/login";
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-zinc-50 dark:bg-zinc-950">
      <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
    </div>
  );

  if (!product) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 px-4 md:px-10 py-4 flex justify-between items-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-100 dark:border-zinc-800">
        <Link href={isAdmin ? "/admin" : "/food"} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex gap-1">
          <button onClick={handleShare} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-10 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Visuals */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-[2rem] bg-zinc-50 dark:bg-zinc-900/50 overflow-hidden border border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
              <Image
                src={product.images[activeImage] || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-contain p-8 drop-shadow-2xl"
              />
            </div>
            <div className="flex gap-3 justify-center">
              {product.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? "border-amber-500 scale-105" : "border-transparent opacity-50"}`}
                >
                  <Image src={img} alt="thumb" width={64} height={64} className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {/* Header: Name and Price on same line */}
            <div className="flex justify-between items-start gap-4 mb-2">
              <h1 className="text-2xl md:text-5xl font-black tracking-tight dark:text-white">
                {product.name}
              </h1>
              <div className="text-xl md:text-4xl font-bold text-amber-600 whitespace-nowrap">
                ₹{product.price}
              </div>
            </div>

            {/* Availability Row */}
            <div className="flex items-center gap-3 mb-6">
              <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] font-bold uppercase rounded-md tracking-wider">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 py-1 px-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                <span className={`text-[10px] md:text-xs font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? 'Freshly Available' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Specs */}
            <div className="grid grid-cols-3 gap-3 mb-10">
              {[
                { icon: Clock, label: "Time", val: "20m" },
                { icon: Zap, label: "Energy", val: "450kcal" },
                { icon: ShoppingBag, label: "Weight", val: "350g" }
              ].map((spec, i) => (
                <div key={i} className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col items-center">
                  <spec.icon className="w-4 h-4 text-amber-500 mb-1" />
                  <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-tighter">{spec.label}</span>
                  <span className="text-xs font-bold dark:text-white">{spec.val}</span>
                </div>
              ))}
            </div>

            {/* Action Area - Natural Flow */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 border border-zinc-200 dark:border-zinc-700">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-colors"><Minus size={16} /></button>
                  <span className="w-10 text-center font-bold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-colors"><Plus size={16} /></button>
                </div>
                <button 
                  disabled={product.stock === 0}
                  onClick={handleAddToCart} 
                  className="flex-1 h-12 border-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all disabled:opacity-50"
                >
                  {added ? "Added!" : "Add to Cart"}
                </button>
              </div>
              <button 
                disabled={product.stock === 0}
                onClick={() => setIsModalOpen(true)}
                className="w-full h-14 bg-amber-500 text-white rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                Buy Now • ₹{product.price * quantity}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          setOrderSuccess(true);
          window.scrollTo(0, 0);
          toast.success("Order Placed!");
        }}
        amount={product.price * quantity}
        itemsToOrder={[{ productId: product._id, quantity, price: product.price }]}
      />
    </div>
  );
}