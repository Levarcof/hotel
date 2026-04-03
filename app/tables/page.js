"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, ChevronRight, CheckCircle2, User, Info, Map as MapIcon, Loader2, Armchair } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import BookingCheckoutModal from "@/components/BookingCheckoutModal";

export default function RestaurantTableLayout() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [tables, setTables] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  const fetchInitialTables = async () => {
    try {
      const res = await fetch("/api/tables");
      const data = await res.json();
      if (data.success) setTables(data.tables);
    } catch (err) {
      console.error("Failed to fetch initial tables", err);
    }
  };

  const fetchAvailability = async () => {
    if (!date || !time) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/tables/availability?date=${date}&time=${time}`);
      const data = await res.json();
      if (data.success) {
        setTables(data.tables);
        setSelectedSeatIds([]); // Reset selection on date/time change
      }
    } catch (err) {
      console.error("Failed to fetch availability", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
    fetchInitialTables();
  }, []);

  useEffect(() => {
    if (date && time) {
      fetchAvailability();
    }
  }, [date, time]);

  const toggleSeat = (seatId) => {
    setSelectedSeatIds(prev =>
      prev.includes(seatId)
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleBooking = () => {
    if (!token) {
      toast.error("Please login to book seats.");
      router.push("/login?redirect=/tables");
      return;
    }
    if (selectedSeatIds.length === 0 || !date || !time) {
      toast.error("Please select at least one seat.");
      return;
    }

    // Set checkout data and open modal
    setBookingData({ seatIds: selectedSeatIds, date, time });
    setShowCheckout(true);
  };

  const handleBookingSuccess = (bookingId) => {
    setShowCheckout(false);
    setSelectedSeatIds([]);
    router.push("/my-table-bookings");
  };

  const getSeatColor = (seat) => {
    if (!date || !time) return "text-zinc-300 bg-zinc-100 dark:bg-zinc-800/10 border-zinc-200 dark:border-zinc-800 cursor-not-allowed opacity-50";
    if (seat.isBooked) return "text-red-500 bg-red-500/10 border-red-200 dark:border-red-500/20 cursor-not-allowed";
    if (selectedSeatIds.includes(seat._id)) return "text-amber-500 bg-amber-500/20 border-amber-400 scale-125 shadow-lg shadow-amber-500/20 z-20";
    return "text-emerald-500 bg-emerald-500/10 border-emerald-200 hover:scale-125 hover:bg-emerald-500/20 cursor-pointer hover:shadow-xl hover:shadow-emerald-500/10 z-10";
  };

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black font-sans pb-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-12 md:mt-16 space-y-12">

        {/* Header & Date-Time Selection (Top) */}
        <div className="space-y-10 animate-in slide-in-from-top-10 duration-700">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-2">
              <div className="w-8 h-px bg-amber-500" /> Interactive Dining Grid
            </span>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-bold leading-relaxed">
              Select your preferred date and time to view the live floor plan and pick individual seats.
            </p>
          </div>

          {/* Unified Console Bar */}
          <div className="bg-white dark:bg-[#0C0C0C] p-2 md:p-3 rounded-[2rem] md:rounded-[3.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl flex flex-col md:flex-row items-center gap-4 md:gap-3 w-full backdrop-blur-3xl sticky top-24 z-[50]">
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-3">
              <div className="relative group">
                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform z-10" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl md:rounded-full text-sm font-bold outline-none dark:text-white appearance-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/50 cursor-pointer"
                />
              </div>
              <div className="relative group">
                <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform z-10" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  step="1800"
                  className="w-full pl-14 pr-6 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl md:rounded-full text-sm font-bold outline-none dark:text-white appearance-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/50 cursor-pointer"
                />
              </div>
            </div>

            {/* Right Section: Logic & Status */}
            <div className="flex items-center gap-3 w-full md:w-auto px-1 md:px-2">
              <div className="flex-1 md:flex-none flex items-center gap-2 px-6 py-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl md:rounded-full border border-zinc-200 dark:border-zinc-800">
                <div className={`w-2.5 h-2.5 rounded-full ${selectedSeatIds.length > 0 ? "bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "bg-emerald-500"}`} />
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest whitespace-nowrap">
                  {selectedSeatIds.length > 0 ? `${selectedSeatIds.length} Selected` : "Pick Seats"}
                </span>
              </div>

              <button
                onClick={handleBooking}
                disabled={loading || selectedSeatIds.length === 0}
                className={`
                      flex-1 md:flex-none px-10 py-4 md:py-4 rounded-xl md:rounded-full font-black uppercase text-sm tracking-[0.3em] transition-all relative overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0
                      ${selectedSeatIds.length > 0
                    ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 active:scale-95 cursor-pointer hover:bg-zinc-800 dark:hover:bg-zinc-100"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"}
                    `}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-amber-500" /> : "Book"}
              </button>
            </div>
          </div>
        </div>

        {/* Full-Width Floor Plan Environment */}
        <div className="w-full relative animate-in slide-in-from-bottom-10 duration-1000 delay-200 mt-20">
          <div className="absolute inset-0 bg-white dark:bg-[#080808] rounded-[2rem] md:rounded-[4rem] border border-zinc-200 dark:border-zinc-800 shadow-[0_0_80px_rgba(0,0,0,0.05)] dark:shadow-none overflow-hidden flex flex-col relative p-4 md:p-12">

            {/* Dynamic Blueprint Grid */}
            <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="flex-1 w-full bg-zinc-50/10 dark:bg-zinc-900/10 rounded-[2rem] md:rounded-[3.5rem] p-4 md:p-12 border border-zinc-100 dark:border-zinc-800/30 backdrop-blur-xl relative overflow-x-auto md:overflow-auto scrollbar-hide">

              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <Loader2 className="w-16 h-16 text-amber-500 animate-spin" />
                </div>
              ) : (
                <div className="w-full h-full min-h-[500px] md:min-h-[1200px] relative">
                  <div className="md:scale-100 scale-[0.38] origin-top-left flex items-start justify-start w-full h-full transition-transform duration-500">
                    <div className="grid grid-cols-12 grid-rows-12 gap-8 w-full min-w-[1400px] h-full min-h-[1200px] p-12">
                      {tables.map(table => (
                        <div
                          key={table._id}
                          style={{ gridColumnStart: table.positionX, gridRowStart: table.positionY }}
                          className="relative flex items-center justify-center w-32 h-32 group"
                        >
                          {/* Central Table Icon */}
                          <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-full shadow-2xl border-4 border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center z-10 transition-all group-hover:scale-110 group-hover:border-amber-500/20 duration-500 cursor-default">
                            <span className="text-lg font-black text-zinc-950 dark:text-white font-serif tracking-tighter">{table.tableNumber}</span>
                            <div className="w-4 h-0.5 bg-amber-500 mt-0.5 rounded-full opacity-50" />
                          </div>

                          {/* Render Seats around Table */}
                          {table.seats.map((seat, idx) => {
                            // Use trig to position seats around circle
                            const radius = 54; // distance from center
                            const x = Math.cos((seat.angle * Math.PI) / 180) * radius;
                            const y = Math.sin((seat.angle * Math.PI) / 180) * radius;

                            return (
                              <button
                                key={seat._id}
                                disabled={seat.isBooked || !date || !time}
                                onClick={() => toggleSeat(seat._id)}
                                style={{
                                  transform: `translate(${x}px, ${y}px) rotate(${seat.angle}deg)`,
                                }}
                                className={`
                                        absolute w-11 h-11 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 z-0
                                        ${getSeatColor(seat)}
                                      `}
                              >
                                <Armchair className="w-5 h-5 pointer-events-none" />
                                {/* Tooltip */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-950 text-white text-[9px] font-black rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest border border-white/10 shadow-2xl">
                                  Seat {seat.seatNumber}
                                </div>
                              </button>
                            );
                          })}

                          {/* Interactive Aura */}
                          <div className="absolute inset-0 bg-amber-500/[0.03] rounded-full scale-[1.8] blur-[60px] opacity-0 group-hover:opacity-100 transition-all duration-700" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Floor Info Footer */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Floor Status</span>
                  <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Ground Level Hub</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Layout Mode</span>
                  <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Seat-Based Grid</span>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 px-6 py-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <Info className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Selected seats held for 15 minutes</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <BookingCheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSuccess={handleBookingSuccess}
        bookingData={bookingData}
      />
    </main>
  );
}
