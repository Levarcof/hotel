"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
   Hotel, Layers, Clock, CreditCard, Loader2, Zap,
   ArrowRight, CheckCircle2, AlertCircle, Banknote, QrCode, X, Info
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "react-hot-toast";

export default function MyRoomPage() {
   const [bookings, setBookings] = useState([]);
   const [loading, setLoading] = useState(true);
   const [selectedBooking, setSelectedBooking] = useState(null);
   const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
   const [checkoutLoading, setCheckoutLoading] = useState(false);

   const fetchMyBookings = async () => {
      try {
         const res = await fetch("/api/room-bookings");
         const data = await res.json();
         if (data.success) setBookings(data.bookings);
      } catch (err) {
         toast.error("Sync failed");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchMyBookings();
      const interval = setInterval(() => setBookings(prev => [...prev]), 60000);
      return () => clearInterval(interval);
   }, []);

   const calculateDueAmount = (startTime, basePrice) => {
      const start = new Date(startTime).getTime();
      const now = new Date().getTime();
      const elapsedMs = now - start;
      const baseDurationMs = 24 * 60 * 60 * 1000;
      if (elapsedMs <= baseDurationMs) return basePrice;
      const extraMs = elapsedMs - baseDurationMs;
      const tenMinIntervals = Math.floor(extraMs / (10 * 60 * 1000));
      return parseFloat((basePrice + (tenMinIntervals * (basePrice / 144))).toFixed(2));
   };

   const executeCheckout = async (method) => {
      setCheckoutLoading(true);
      const finalAmount = calculateDueAmount(selectedBooking.bookingStartTime, selectedBooking.roomId.price);
      try {
         if (method === "Online") {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);
            script.onload = async () => {
               const createOrderRes = await fetch("/api/payment/create-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ amount: finalAmount })
               });
               const orderData = await createOrderRes.json();
               const options = {
                  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                  amount: Math.round(finalAmount * 100),
                  currency: "INR",
                  name: "Luxe Suites",
                  order_id: orderData.razorpayOrderId,
                  handler: async (response) => {
                     const verifyRes = await fetch("/api/room-bookings/verify-checkout", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ bookingId: selectedBooking._id, paymentId: response.razorpay_payment_id, orderId: response.razorpay_order_id, signature: response.razorpay_signature, amount: finalAmount })
                     });
                     const vData = await verifyRes.json();
                     if (vData.success) {
                        toast.success("Residency Closed");
                        setCheckoutModalOpen(false);
                        fetchMyBookings();
                     }
                  },
                  theme: { color: "#f59e0b" }
               };
               new window.Razorpay(options).open();
            };
         } else {
            const res = await fetch(`/api/room-bookings/${selectedBooking._id}/checkout`, {
               method: "PATCH",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ method: "Cash", amount: finalAmount })
            });
            if ((await res.json()).success) {
               toast.success("Checkout Initiated");
               setCheckoutModalOpen(false);
               fetchMyBookings();
            }
         }
      } catch (err) { toast.error("Operation failed"); }
      finally { setCheckoutLoading(false); }
   };

   if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
         <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
   );

   return (
      <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 font-sans">
         <Navbar />

         <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-8">

            {/* REFINED COMPACT HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
               <Link href="/rooms" className="text-xs font-bold text-amber-600 text-center py-4 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-xl border border-amber-100 dark:border-amber-800 transition-all hover:scale-105">
                  Book Another Room
               </Link>
            </div>

            {bookings.length === 0 ? (
               <div className="py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                  <Hotel className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No active stays</h3>
                  <p className="text-sm text-zinc-500 mt-1">Your reservation history is empty.</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bookings.map((booking) => {
                     const currentPrice = calculateDueAmount(booking.bookingStartTime, booking.roomId.price);
                     const isOvertime = (new Date().getTime() - new Date(booking.bookingStartTime).getTime()) > (24 * 60 * 60 * 1000);
                     const isActive = booking.status === "booked";
                     const isPending = booking.status === "pending_checkout";

                     return (
                        <div key={booking._id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                           <div className="relative h-48 sm:h-56 w-full">
                              <Image src={booking.roomId.images[0]} alt="Room" fill className="object-cover" />
                              <div className="absolute top-3 right-3">
                                 <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase backdrop-blur-md border ${isActive ? "bg-emerald-500/90 text-white border-emerald-400" :
                                    isPending ? "bg-amber-500/90 text-white border-amber-400" :
                                       "bg-zinc-500/90 text-white border-zinc-400"
                                    }`}>
                                    {isActive ? "Active Stay" : isPending ? "Checking Out" : "Closed"}
                                 </span>
                              </div>
                           </div>

                           <div className="p-5 sm:p-6 space-y-6">
                              <div className="flex justify-between items-end">
                                 <div>
                                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-tighter">Suite Unit</p>
                                    <h3 className="text-2xl font-bold dark:text-white">#{booking.roomId.roomNumber}</h3>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Current Due</p>
                                    <p className={`text-2xl font-black tabular-nums ${isOvertime ? 'text-red-500' : 'text-zinc-900 dark:text-white'}`}>₹{currentPrice}</p>
                                 </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 py-4 border-y border-zinc-50 dark:border-zinc-800/50">
                                 <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-zinc-400 uppercase flex items-center gap-1.5"><Clock size={12} /> Check-In</span>
                                    <p className="text-[11px] font-medium leading-tight">{new Date(booking.bookingStartTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                 </div>
                                 <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-zinc-400 uppercase flex items-center gap-1.5"><Layers size={12} /> Level</span>
                                    <p className="text-[11px] font-medium leading-tight">Floor {booking.roomId.floorNumber}</p>
                                 </div>
                              </div>

                              {isActive && (
                                 <div className="space-y-4 pt-2">
                                    {isOvertime && (
                                       <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl">
                                          <AlertCircle className="w-4 h-4 text-red-500" />
                                          <p className="text-[10px] font-bold text-red-600 uppercase tracking-tight">Cycle exceeded. Dynamic rates applied.</p>
                                       </div>
                                    )}
                                    <button
                                       onClick={() => { setSelectedBooking(booking); setCheckoutModalOpen(true); }}
                                       className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold uppercase text-[11px] tracking-widest transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                       Clear Dues & Checkout <ArrowRight size={14} />
                                    </button>
                                 </div>
                              )}

                              {isPending && (
                                 <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/20">
                                    <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                                    <p className="text-[10px] font-bold text-amber-600 uppercase">Awaiting Admin Confirmation...</p>
                                 </div>
                              )}
                           </div>
                        </div>
                     );
                  })}
               </div>
            )}
         </main>

         {/* MODERN SETTLEMENT MODAL */}
         {checkoutModalOpen && selectedBooking && (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-all">
               <div className="bg-white dark:bg-zinc-950 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                  <div className="p-6 sm:p-8 space-y-6">
                     <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold dark:text-white">Residency Settlement</h2>
                        <button onClick={() => setCheckoutModalOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400"><X size={20} /></button>
                     </div>

                     <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Final Amount Due</p>
                        <p className="text-4xl font-black text-zinc-900 dark:text-white tabular-nums">₹{calculateDueAmount(selectedBooking.bookingStartTime, selectedBooking.roomId.price)}</p>
                     </div>

                     <div className="space-y-3">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Payment Method</p>
                        <div className="grid grid-cols-2 gap-3">
                           <button onClick={() => executeCheckout("Cash")} disabled={checkoutLoading} className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all">
                              <Banknote className="text-zinc-400" />
                              <span className="text-[10px] font-bold uppercase">Manual Cash</span>
                           </button>
                           <button onClick={() => executeCheckout("Online")} disabled={checkoutLoading} className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all">
                              <QrCode className="text-zinc-400" />
                              <span className="text-[10px] font-bold uppercase">Online UPI</span>
                           </button>
                        </div>
                     </div>

                     <div className="flex items-start gap-2 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
                        <Info size={14} className="text-zinc-400 mt-0.5" />
                        <p className="text-[9px] text-zinc-400 font-medium leading-relaxed uppercase">Official closing of residency requires admin verification after payment initiation.</p>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}