"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import CartItem from "@/components/CartItem";
import CartSummary from "@/components/CartSummary";
import CheckoutModal from "@/components/CheckoutModal";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cart");
      const data = await res.json();
      
      if (data.success) {
        setCartItems(data.cartItems);
      } else {
        if(data.message.includes("Unauthorized")) {
           window.location.href = "/login";
        }
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to load cart");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdatingId(cartId);
    try {
      const res = await fetch(`/api/cart`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, quantity: newQuantity }),
      });
      const data = await res.json();
      if (data.success) {
        setCartItems(prev => prev.map(item => item._id === cartId ? { ...item, quantity: newQuantity } : item));
      } else {
        alert(data.message || "Failed to update quantity");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (cartId) => {
    setDeletingId(cartId);
    try {
      const res = await fetch(`/api/cart/${cartId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCartItems(prev => prev.filter(item => item._id !== cartId));
      } else {
        alert(data.message || "Failed to remove item");
      }
    } catch (err) {
      console.error(err);
      alert("Error removing item");
    } finally {
      setDeletingId(null);
    }
  };

  const handlePlaceOrderClick = () => {
    if (cartItems.length > 0) setIsModalOpen(true);
  };

  const handleOrderSuccess = () => {
    setIsModalOpen(false);
    setOrderSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCartItems([]);
  };

  const itemsToOrder = cartItems.map(item => ({
      cartId: item._id,
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price
  }));

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + ((item.productId?.price || 0) * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-amber-100 pb-32">
      <Navbar />

      <main className="max-w-6xl mx-auto pt-4 md:pt-8 px-4 md:px-8">
        
        {/* Success State */}
        {orderSuccess && (
          <div className="mb-8 p-6 sm:p-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-100 dark:border-emerald-900/50 flex flex-col items-center justify-center text-center space-y-4 shadow-sm animate-in fade-in zoom-in duration-500">
             <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-emerald-900 dark:text-emerald-100 tracking-tight">Order Placed Successfully!</h2>
            <p className="text-sm sm:text-base text-emerald-700 dark:text-emerald-400 font-medium max-w-sm">We've received your order and are preparing it fresh for you.</p>
            <div className="flex gap-3 sm:gap-4 mt-4">
               <Link href="/orders" className="px-5 py-2.5 sm:px-6 sm:py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-emerald-500 shadow-md transition-all active:scale-95">
                 Track Order
               </Link>
               <button onClick={() => setOrderSuccess(false)} className="px-5 py-2.5 sm:px-6 sm:py-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl font-bold text-xs sm:text-sm border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all active:scale-95">
                 Dismiss
               </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-3 sm:p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-center font-medium text-sm">
            {error}
          </div>
        )}

        <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight mb-4 md:mb-6">Secure Checkout</h1>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
             <div className="lg:col-span-8 space-y-4">
                {[1, 2].map(n => (
                  <div key={n} className="w-full h-32 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
                ))}
             </div>
             <div className="lg:col-span-4">
                <div className="w-full h-80 bg-zinc-200 dark:bg-zinc-800 rounded-3xl animate-pulse" />
             </div>
          </div>
        ) : !cartItems.length && !orderSuccess ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-32 h-32 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
               <ShoppingBag className="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-2">Your cart is empty</h2>
            <p className="text-zinc-500 text-sm md:text-base max-w-sm">You can go to home page to view more restaurants and dishes.</p>
            <Link href="/food" className="mt-8 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-colors shadow-lg shadow-amber-500/20 active:scale-95">
              See Restaurants Near You
            </Link>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4 md:space-y-5">
              {cartItems.map((item) => (
                <div key={item._id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <CartItem 
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onDelete={handleDelete}
                    updatingId={updatingId}
                    deletingId={deletingId}
                  />
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
               <CartSummary 
                 totalItems={cartItems.length}
                 subtotal={calculateSubtotal()}
                 onCheckout={handlePlaceOrderClick}
                 isCheckingOut={placingOrder}
               />
            </div>
          </div>
        ) : null}
      </main>

      <CheckoutModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleOrderSuccess}
        amount={calculateSubtotal()}
        itemsToOrder={itemsToOrder}
      />
    </div>
  );
}
