"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Package } from "lucide-react";

import OrderDetailsHeader from "@/components/admin/OrderDetailsHeader";
import CustomerCard from "@/components/admin/CustomerCard";
import ProductOrderCard from "@/components/admin/ProductOrderCard";
import AdminOrderSummary from "@/components/admin/AdminOrderSummary";
import StatusUpdateControl from "@/components/admin/StatusUpdateControl";

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/orders/${orderId}`);
      const data = await res.json();
      
      if (data.success) {
        setOrder(data.order);
        console.log("DEBUG: Admin fetch - Order Location:", data.order.location);
      } else {
        setError(data.message || "Failed to load order");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching the order.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdated = (updatedOrder) => {
     setOrder(updatedOrder);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
         <div className="lg:col-span-8 space-y-4">
            <div className="w-full h-32 bg-zinc-200 dark:bg-zinc-800 rounded-3xl animate-pulse" />
            <div className="w-full h-48 bg-zinc-200 dark:bg-zinc-800 rounded-3xl animate-pulse delay-75" />
         </div>
         <div className="lg:col-span-4">
            <div className="w-full h-80 bg-zinc-200 dark:bg-zinc-800 rounded-3xl animate-pulse delay-100" />
         </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col justify-center items-center py-32 text-red-500 gap-4">
        <Package className="w-16 h-16 opacity-50 text-red-400" />
        <p className="text-xl font-black tracking-tight">{error || "Order not found"}</p>
        <Link href="/admin/orders" className="text-amber-600 underline font-medium">Back to Orders Feed</Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
         <OrderDetailsHeader order={order} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start">
         
         <div className="lg:col-span-8 flex flex-col gap-8 md:gap-10">
           <CustomerCard user={order.userId} address={order.address} location={order.location} />

           <div>
              <h3 className="text-xl font-black mb-6 tracking-tight flex items-center gap-2 text-zinc-900 dark:text-white">
                 <Package className="w-5 h-5 text-amber-500" /> Ordered Items ({order.products?.length || 0})
              </h3>
              
              <div className="space-y-4">
                {order.products?.map((item, idx) => (
                  <ProductOrderCard key={item._id || idx} productItem={item} />
                ))}
              </div>
           </div>
           
           <div className="lg:hidden mt-6">
              <StatusUpdateControl 
                 orderId={order._id} 
                 currentStatus={order.status} 
                 onStatusUpdated={handleStatusUpdated}
              />
           </div>
         </div>

         <div className="lg:col-span-4 flex flex-col gap-6 sticky top-28">
           <div className="hidden lg:block">
             <StatusUpdateControl 
                orderId={order._id} 
                currentStatus={order.status} 
                onStatusUpdated={handleStatusUpdated}
             />
           </div>

           <AdminOrderSummary order={order} />
         </div>

      </div>
    </>
  );
}
