"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Loader2, Package, Clock, ChefHat, Bike, CheckCircle2 
} from "lucide-react";

import Navbar from "@/components/Navbar";
import OrderHeader from "@/components/OrderHeader";
import OrderProductCard from "@/components/OrderProductCard";
import OrderSummary from "@/components/OrderSummary";

const TRACKING_STEPS = ["Pending", "Preparing", "Out for Delivery", "Delivered"];

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/order/${id}`);
      const data = await res.json();
      
      if (data.success) {
        setOrder(data.order);
      } else {
        if(data.message.includes("Unauthorized")) {
           window.location.href = "/login";
        }
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to load order details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    setRemovingId(productId);
    try {
      const res = await fetch(`/api/order/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove_item", productId })
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      } else {
        alert(data.message || "Failed to remove item");
      }
    } catch (err) {
      console.error(err);
      alert("Error removing item");
    } finally {
      setRemovingId(null);
    }
  };

  const handleCancelOrder = async () => {
    try {
      const res = await fetch(`/api/order/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" })
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      } else {
        alert(data.message || "Failed to cancel order");
      }
    } catch (err) {
      console.error(err);
      alert("Error cancelling order");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-black pb-32">
        <Navbar />
        <div className="max-w-5xl mx-auto pt-24 md:pt-32 px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
           <div className="lg:col-span-8 space-y-4">
              <div className="w-full h-32 bg-zinc-200 dark:bg-zinc-800 rounded-3xl animate-pulse" />
              <div className="w-full h-32 bg-zinc-200 dark:bg-zinc-800 rounded-3xl animate-pulse" />
           </div>
           <div className="lg:col-span-4">
              <div className="w-full h-80 bg-zinc-200 dark:bg-zinc-800 rounded-3xl animate-pulse" />
           </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8F9FA] dark:bg-black text-red-500 gap-4">
        <Package className="w-16 h-16 opacity-50" />
        <p className="text-xl font-bold">{error || "Order not found"}</p>
        <Link href="/orders" className="text-amber-600 underline font-medium">Back to Orders</Link>
      </div>
    );
  }

  const currentStepIndex = order.status === "Cancelled" ? -1 : TRACKING_STEPS.indexOf(order.status);
  
  const getStepIcon = (step) => {
    switch (step) {
      case "Pending": return Clock;
      case "Preparing": return ChefHat;
      case "Out for Delivery": return Bike;
      case "Delivered": return CheckCircle2;
      default: return Package;
    }
  };

  const isPending = order.status === "Pending";

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-amber-100 pb-32">
      <Navbar />

      <main className="max-w-5xl mx-auto pt-24 md:pt-32 px-4 md:px-8 relative z-10">
        
        {/* Ambient Display Glow */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="mb-8">
          <OrderHeader order={order} />
        </div>

        {order.status !== "Cancelled" && order.products.length > 0 && (
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-zinc-100 dark:border-zinc-800 shadow-sm mb-8 relative overflow-hidden">
             
             {/* Progress Trackers Container */}
             <div className="relative mx-auto max-w-3xl pt-2">
                {/* Background Line */}
                <div className="absolute top-[1.5rem] md:top-[1.75rem] left-0 right-0 h-1 md:h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                
                {/* Animated Foreground Line */}
                <div 
                   className="absolute top-[1.5rem] md:top-[1.75rem] left-0 h-1 md:h-1.5 bg-amber-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(245,158,11,0.5)]" 
                   style={{ width: `${Math.max(0, (currentStepIndex / (TRACKING_STEPS.length - 1)) * 100)}%` }} 
                />

                {/* Steps Mapping */}
                <div className="flex justify-between relative z-10 -mx-6 md:-mx-8">
                   {TRACKING_STEPS.map((step, index) => {
                      const Icon = getStepIcon(step);
                      const isCompleted = index <= currentStepIndex;
                      const isActive = index === currentStepIndex;

                      return (
                         <div key={step} className="flex flex-col items-center flex-1">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 sm:border-4 border-white dark:border-[#1C1C1E] transition-all duration-700 
                               ${isCompleted ? 'bg-amber-500 text-white shadow-[0_10px_30px_rgba(245,158,11,0.3)]' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}
                               ${isActive ? 'ring-[4px] ring-amber-500/30 scale-110 !border-amber-50 dark:!border-amber-900/30' : ''}
                            `}>
                               <Icon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 ${isActive && step !== 'Delivered' ? 'animate-pulse' : ''}`} strokeWidth={isCompleted ? 2.5 : 2} />
                            </div>
                            <p className={`mt-3 sm:mt-4 text-[9px] sm:text-[11px] md:text-sm font-bold tracking-tight md:tracking-wide text-center transition-colors ${isCompleted ? 'text-amber-600 dark:text-amber-500' : 'text-zinc-400'}`}>
                               {step}
                            </p>
                         </div>
                      )
                   })}
                </div>
             </div>
          </div>
        )}

        {order.products.length === 0 ? (
           <div className="py-16 text-center text-red-600 bg-red-50/50 dark:bg-red-950/20 backdrop-blur-md rounded-[2.5rem] border border-red-100 dark:border-red-900/50 flex flex-col items-center gap-4 shadow-sm">
             <div className="w-20 h-20 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
               <Package className="w-10 h-10 stroke-[2] text-red-500 dark:text-red-400" />
             </div>
             <h2 className="text-3xl font-black tracking-tight text-red-700 dark:text-red-500">Order Cancelled</h2>
             <p className="text-sm font-medium opacity-80 max-w-sm">
               All items have been removed from this order. It will not be delivered.
             </p>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
            
            {/* Products List (Left Column) */}
            <div className="lg:col-span-8 space-y-4">
               {order.products.map((item, idx) => (
                  <div key={idx} className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                    <OrderProductCard 
                      item={item} 
                      isPending={isPending}
                      onRemove={handleRemoveItem}
                      removingId={removingId}
                    />
                  </div>
               ))}
            </div>

            {/* Summary Panel (Right Column / Bottom Mobile) */}
            <div className="lg:col-span-4">
               <OrderSummary 
                 order={order}
                 onCancel={handleCancelOrder}
                 isPending={isPending}
               />
            </div>
            
          </div>
        )}
      </main>
    </div>
  );
}
