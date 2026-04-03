"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
   User, Calendar, Clock, Hash, CheckCircle2, XCircle,
   Trash2, ShieldCheck, Search, ListFilter, TrendingUp, CreditCard, X
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function AdminBookedTables() {
   const [bookings, setBookings] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState("");
   const [activeFilter, setActiveFilter] = useState("all");
   const [showFilterModal, setShowFilterModal] = useState(false);
   const [customFilter, setCustomFilter] = useState({ date: "", time: "" });

   const fetchBookings = async () => {
      try {
         const res = await fetch("/api/admin/bookings");
         const data = await res.json();
         if (data.success) setBookings(data.bookings);
      } catch (err) {
         console.error(err);
         toast.error("Failed to load bookings");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchBookings();
   }, []);

   // --- Search & Filter Logic ---
   const filteredBookings = useMemo(() => {
      return bookings.filter((b) => {
         const matchesSearch =
            b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.tableNumber?.toString().includes(searchQuery);

         let matchesFilter = true;
         const todayDate = new Date().toISOString().split('T')[0];

         if (activeFilter === "today") {
            matchesFilter = b.date === todayDate;
         } else if (activeFilter === "custom") {
            if (customFilter.date && customFilter.time) {
               matchesFilter = b.date === customFilter.date && b.time === customFilter.time;
            } else if (customFilter.date) {
               matchesFilter = b.date === customFilter.date;
            } else if (customFilter.time) {
               matchesFilter = b.time === customFilter.time;
            }
         }
         return matchesSearch && matchesFilter;
      });
   }, [bookings, searchQuery, activeFilter, customFilter]);

   const updateStatus = async (id, status) => {
      try {
         const res = await fetch(`/api/admin/bookings/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
         });
         const data = await res.json();
         if (data.success) {
            toast.success(`Booking ${status}`);
            fetchBookings();
         }
      } catch (err) {
         toast.error("Failed to update status");
      }
   };

   const deleteBooking = async (id) => {
      if (!confirm("Are you sure?")) return;
      try {
         const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
         const data = await res.json();
         if (data.success) {
            toast.success("Removed");
            fetchBookings();
         }
      } catch (err) {
         toast.error("Error deleting");
      }
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-black">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 pb-10">

         {/* --- HEADER --- */}
         <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
            <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
                     <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-sm font-bold tracking-tight uppercase">Management</h1>
               </div>
               <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2">
                     <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                     <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Live</p>
                  </div>
               </div>
            </div>
         </header>

         <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">

            {/* --- SEARCH & QUICK FILTERS --- */}
            <div className="space-y-4">
               <div className="flex gap-2">
                  <div className="relative flex-1">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                     <input
                        type="text"
                        placeholder="Search name or table..."
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                     />
                  </div>
                  <button
                     onClick={() => setShowFilterModal(true)}
                     className={`p-2.5 rounded-xl border transition-all ${activeFilter !== 'all' ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'}`}
                  >
                     <ListFilter className="w-5 h-5" />
                  </button>
               </div>

               <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {['all', 'today'].map((f) => (
                     <button
                        key={f}
                        onClick={() => { setActiveFilter(f); setCustomFilter({ date: "", time: "" }) }}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${activeFilter === f ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-transparent' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500'}`}
                     >
                        {f}
                     </button>
                  ))}
               </div>
            </div>

            {/* --- BOOKINGS LIST --- */}
            <div className="grid gap-4">
               {filteredBookings.length === 0 ? (
                  <div className="py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800">
                     <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No matching results</p>
                  </div>
               ) : (
                  filteredBookings.map((booking) => (
                     <div key={booking._id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden transition-all hover:border-amber-500/40 group">
                        <div className="p-4 sm:p-5">

                           <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                 <div className="relative w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200 dark:border-zinc-700">
                                    {booking.userId?.profileImage ? (
                                       <Image src={booking.userId.profileImage} alt="User" fill className="object-cover" />
                                    ) : (
                                       <User className="w-full h-full p-2 text-zinc-400" />
                                    )}
                                 </div>
                                 <div>
                                    <h3 className="text-sm font-bold leading-none">{booking.name || "Guest"}</h3>
                                    <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase tracking-tight">{booking.date} • {booking.time}</p>
                                 </div>
                              </div>

                              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-black uppercase border ${booking.paymentStatus === "paid"
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20"
                                    : "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20"
                                 }`}>
                                 <CreditCard className="w-3 h-3" /> {booking.paymentStatus || 'pending'}
                              </div>
                           </div>

                           <div className="grid grid-cols-2 gap-3 py-4 border-y border-zinc-50 dark:border-zinc-800/50">
                              <div className="space-y-1">
                                 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Table Unit</p>
                                 <p className="text-sm font-bold flex items-center gap-1">
                                    <Hash className="w-3.5 h-3.5 text-amber-500" /> {booking.tableNumber}
                                 </p>
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Seat Numbers</p>
                                 <div className="flex flex-wrap gap-1">
                                    {/* FIX: Using index 'idx' in key to avoid duplicate key error */}
                                    {booking.seatNumbers?.map((s, idx) => (
                                       <span key={`${booking._id}-seat-${idx}`} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[9px] font-black">S{s}</span>
                                    ))}
                                 </div>
                              </div>
                           </div>

                           {/* Actions Section */}
                           <div className="mt-4 flex gap-2">
                              {booking.status === "Confirmed" && (
                                 <>
                                    <button
                                       onClick={() => updateStatus(booking._id, "Completed")}
                                       className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 active:scale-95 transition-all"
                                    >
                                       <CheckCircle2 className="w-4 h-4" /> <span>Finish</span>
                                    </button>
                                    <button
                                       onClick={() => updateStatus(booking._id, "Cancelled")}
                                       className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white active:scale-95 transition-all"
                                    >
                                       <XCircle className="w-4 h-4" /> <span>Cancel</span>
                                    </button>
                                 </>
                              )}
                              <button
                                 onClick={() => deleteBooking(booking._id)}
                                 className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 rounded-xl hover:bg-zinc-950 dark:hover:bg-white dark:hover:text-black transition-all flex items-center justify-center"
                              >
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </div>

                        </div>
                     </div>
                  ))
               )}
            </div>

            {/* Analytics Section */}
            <div className="bg-zinc-900 rounded-2xl p-4 flex items-center justify-between border border-white/5 shadow-xl">
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                     <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-zinc-500 uppercase">System Status</p>
                     <p className="text-[11px] font-bold text-white uppercase tracking-tight">Active & Synced</p>
                  </div>
               </div>
               <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-none">v2.4.0</p>
            </div>
         </main>

         {/* --- FILTER MODAL --- */}
         {showFilterModal && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
               <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[2rem] p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                     <h2 className="text-sm font-black uppercase tracking-widest">Filters</h2>
                     <button onClick={() => setShowFilterModal(false)} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full"><X className="w-4 h-4" /></button>
                  </div>

                  <div className="space-y-4">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Date</label>
                        <input
                           type="date"
                           className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl text-sm focus:ring-1 focus:ring-amber-500 outline-none"
                           value={customFilter.date}
                           onChange={(e) => setCustomFilter({ ...customFilter, date: e.target.value })}
                        />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Time Session</label>
                        <input
                           type="time"
                           className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl text-sm focus:ring-1 focus:ring-amber-500 outline-none"
                           value={customFilter.time}
                           onChange={(e) => setCustomFilter({ ...customFilter, time: e.target.value })}
                        />
                     </div>

                     <button
                        onClick={() => { setActiveFilter('custom'); setShowFilterModal(false) }}
                        className="w-full py-3 bg-amber-500 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-amber-500/20 active:scale-95 transition-all mt-4"
                     >
                        Apply Custom Filter
                     </button>

                     <button
                        onClick={() => { setActiveFilter('all'); setCustomFilter({ date: "", time: "" }); setShowFilterModal(false) }}
                        className="w-full py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
                     >
                        Reset All
                     </button>
                  </div>
               </div>
            </div>
         )}

      </div>
   );
}