"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Calendar, Clock, Hash, Home, PartyPopper, ChevronLeft, MapPin, ReceiptText } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function BookedSuccessPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
       try {
         const res = await fetch("/api/bookings");
         const data = await res.json();
         if (data.success && data.bookings.length > 0) {
            // Group by same date/time as the latest
            const latest = data.bookings[0];
            const related = data.bookings.filter(b => b.date === latest.date && b.time === latest.time);
            setBookings(related);
         }
       } catch (err) {
         console.error(err);
       } finally {
         setLoading(false);
       }
    };
    fetchLatest();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center animate-pulse text-zinc-500 font-black uppercase text-xs">Processing...</div>;

  // Group by table
  const grouped = bookings.reduce((acc, curr) => {
    if (!acc[curr.tableNumber]) acc[curr.tableNumber] = [];
    acc[curr.tableNumber].push(curr.seatNumber);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black font-sans pb-20">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 mt-16 md:mt-24 text-center animate-in zoom-in-95 duration-500">
        
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-10 shadow-2xl animate-bounce">
           <CheckCircle2 className="w-12 h-12" />
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter font-serif mb-4 italic">
           Booking <br /> <span className="text-emerald-500 font-sans not-italic">Confirmed!</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-12">Your seats are waiting for you</p>

        {bookings.length > 0 ? (
          <div className="bg-white dark:bg-[#111] p-8 md:p-12 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-2xl relative overflow-hidden text-left space-y-10">
             <div className="flex items-center justify-between border-b border-zinc-50 dark:border-zinc-800 pb-8">
                <div>
                   <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-2">Reservation Hub</p>
                   <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Luxe Gourmet Kitchen</h3>
                </div>
                <ReceiptText className="w-12 h-12 text-amber-500 rotate-12" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   {Object.entries(grouped).map(([tableNo, seats]) => (
                      <div key={tableNo} className="space-y-2">
                         <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-1.5 leading-none mb-2"><Hash className="w-3 h-3 text-amber-500" /> Table #{tableNo}</p>
                         <div className="flex flex-wrap gap-2">
                            {seats.sort((a,b)=>a-b).map(s => (
                               <span key={s} className="px-3 py-1 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-black rounded-lg">Seat {s}</span>
                            ))}
                         </div>
                      </div>
                   ))}
                </div>

                <div className="space-y-6 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                    <div className="flex justify-between items-center">
                       <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-1.5"><Clock className="w-3 h-3 text-amber-500" /> Time Slot</p>
                       <p className="font-black text-sm text-zinc-900 dark:text-white uppercase">{bookings[0].time}</p>
                    </div>
                    <div className="flex justify-between items-center">
                       <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-1.5"><Calendar className="w-3 h-3 text-amber-500" /> Date</p>
                       <p className="font-black text-sm text-zinc-900 dark:text-white uppercase">{bookings[0].date}</p>
                    </div>
                    <div className="flex justify-between items-center">
                       <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Total People</p>
                       <p className="font-black text-sm text-amber-500 uppercase">{bookings.length} Guests</p>
                    </div>
                </div>
             </div>

             <div className="pt-8 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-zinc-400">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   Status: {bookings[0].status}
                </div>
                <span className="opacity-50 tracking-tighter">REF: {bookings[0]._id.substring(0,12)}</span>
             </div>

             <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
          </div>
        ) : (
          <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-xl">
             <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No active booking found.</p>
          </div>
        )}

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
           <Link href="/" className="w-full sm:w-auto px-10 py-5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black uppercase text-xs tracking-widest rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 shadow-2xl">
              <Home className="w-4 h-4" /> Go Home
           </Link>
           <Link href="/food" className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white font-black uppercase text-xs tracking-widest rounded-2xl active:scale-95 transition-all text-center">
              Order Food Now
           </Link>
        </div>

      </div>
    </main>
  );
}
