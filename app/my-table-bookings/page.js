"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { 
  Calendar, Clock, Hash, Armchair, CreditCard, 
  CheckCircle2, ChevronRight, Loader2, Utensils, 
  MapPin, Sparkles, Filter, MoreVertical, ArrowRight 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyTableBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await fetch("/api/bookings/my-bookings");
        const data = await res.json();
        if (data.success) {
          setBookings(data.bookings);
        } else if (res.status === 401) {
          router.push("/login?redirect=/my-table-bookings");
        }
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Syncing Reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 font-sans pb-20 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 md:pt-8">
        
        {/* --- REFINED HEADER --- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-4">
         
          
          <Link href="/tables" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-zinc-900/10">
            Secure New Table <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* --- BOOKINGS CONTENT --- */}
        {bookings.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center gap-6">
            <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-300 dark:text-zinc-700">
              <Utensils className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold">No Active Bookings</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-[250px] mx-auto">Your dining schedule is currently open. Experience our world-class layout today.</p>
            </div>
            <Link href="/tables" className="text-amber-600 text-xs font-bold uppercase tracking-widest hover:underline">
              View Floor Plan →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {bookings.map((booking) => (
              <div 
                key={booking._id} 
                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                {/* Status Badge Top Right */}
                <div className="absolute top-4 right-4">
                  <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-tight border ${
                    booking.status === "Confirmed" 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/20" 
                      : "bg-zinc-50 text-zinc-500 border-zinc-100 dark:bg-zinc-800"
                  }`}>
                    {booking.status}
                  </span>
                </div>

                {/* Table & Time Info */}
                <div className="flex items-center gap-4 mb-6 pt-2">
                  <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex flex-col items-center justify-center shadow-md shadow-amber-500/20">
                    <span className="text-[8px] font-bold opacity-70 leading-none">TAB</span>
                    <span className="text-xl font-black leading-none">{booking.tableNumber}</span>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-tight">{booking.date}</p>
                    <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-amber-500" /> {booking.time} Slot
                    </p>
                  </div>
                </div>

                {/* Seats Details */}
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 mb-4 border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                      <Armchair className="w-3.5 h-3.5" /> Seats Reserved
                    </span>
                    <span className="text-[10px] font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-700 px-2 py-0.5 rounded shadow-sm border border-zinc-100 dark:border-zinc-600">
                      {booking.seatNumbers?.length || 0} Total
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {booking.seatNumbers?.map((sn, sIdx) => (
                      <span key={`${sn}-${sIdx}`} className="px-2 py-1 bg-white dark:bg-zinc-900 text-[10px] font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                        S-{sn}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Payment Detail Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                      {booking.paymentMethod === "COD" ? "On-Site" : "Digital"} • <span className="text-zinc-900 dark:text-zinc-300">{booking.paymentStatus}</span>
                    </p>
                  </div>
                  <MoreVertical className="w-4 h-4 text-zinc-300 hover:text-zinc-900 cursor-pointer transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}