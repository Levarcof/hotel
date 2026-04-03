"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Hotel, User, Phone, IndianRupee, Clock, Loader2, 
  Search, Layers, ShieldCheck, ChevronRight, Calendar
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminRoomBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [roomQuery, setRoomQuery] = useState("");
  const [floorQuery, setFloorQuery] = useState("");

  const fetchAllBookings = async () => {
    try {
      const res = await fetch("/api/admin/room-bookings");
      const data = await res.json();
      if (data.success) setBookings(data.bookings);
    } catch (err) {
      toast.error("Failed to sync registry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesRoom = b.roomId?.roomNumber?.toLowerCase().includes(roomQuery.toLowerCase());
      const matchesFloor = b.roomId?.floorNumber?.toString().includes(floorQuery);
      return matchesRoom && matchesFloor;
    });
  }, [bookings, roomQuery, floorQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-zinc-400 font-bold uppercase tracking-widest text-[9px]">Loading Registry...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* --- PROFESSIONAL FILTER BAR --- */}
      <div className="flex flex-col md:flex-row gap-3 bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Room #" 
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:ring-1 focus:ring-amber-500 outline-none transition-all"
            value={roomQuery}
            onChange={(e) => setRoomQuery(e.target.value)}
          />
        </div>
        <div className="relative flex-1">
          <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Floor #" 
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:ring-1 focus:ring-amber-500 outline-none transition-all"
            value={floorQuery}
            onChange={(e) => setFloorQuery(e.target.value)}
          />
        </div>
      </div>

      {/* --- COMPACT BOOKING LIST --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBookings.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white dark:bg-zinc-950 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <Hotel className="w-8 h-8 text-zinc-300 mx-auto mb-2 opacity-50" />
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">No active deployments found</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <Link 
              key={booking._id} 
              href={`/admin/rooms/bookings/${booking._id}`}
              className="group bg-white dark:bg-[#0C0C0E] border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-500/50 hover:shadow-lg transition-all"
            >
              {/* Card Header: Room Number & Status */}
              <div className="p-4 flex items-center justify-between border-b border-zinc-50 dark:border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-zinc-50 dark:bg-zinc-900 rounded-lg flex items-center justify-center text-amber-600 border border-zinc-100 dark:border-zinc-800">
                    <Hotel size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-none dark:text-white">R-{booking.roomId?.roomNumber}</h3>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase mt-1">Floor {booking.roomId?.floorNumber}</p>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border ${
                  booking.status === "booked" 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/20" 
                  : "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20"
                }`}>
                  {booking.status === "booked" ? "Active" : "Settling"}
                </div>
              </div>

              {/* Card Body: Data Grid */}
              <div className="p-4 space-y-3">
                {/* Entry 1: Resident Name */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-400 uppercase text-[9px] font-bold">
                    <User size={12} className="text-amber-500" /> Resident
                  </div>
                  <p className="text-[10px] font-bold dark:text-zinc-200 uppercase truncate max-w-[140px]">{booking.name}</p>
                </div>

                {/* Entry 2: Contact */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-400 uppercase text-[9px] font-bold">
                    <Phone size={12} className="text-amber-500" /> Contact
                  </div>
                  <p className="text-[10px] font-bold dark:text-zinc-200 tabular-nums">{booking.mobile}</p>
                </div>

                {/* Entry 3: Check-in Time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-400 uppercase text-[9px] font-bold">
                    <Calendar size={12} className="text-zinc-400" /> Since
                  </div>
                  <p className="text-[9px] font-medium text-zinc-500">
                    {new Date(booking.bookingStartTime).toLocaleDateString([], { day: '2-digit', month: 'short' })} • {new Date(booking.bookingStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Card Footer: Final Amount */}
              <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-50 dark:border-zinc-800/50 flex items-center justify-between group-hover:bg-amber-500/5 transition-colors">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Total Value</span>
                <div className="flex items-center gap-1">
                  <span className="text-base font-black text-zinc-950 dark:text-white tabular-nums">
                    ₹{booking.dueAmount}
                  </span>
                  <ChevronRight size={14} className="text-zinc-300 group-hover:translate-x-1 group-hover:text-amber-500 transition-all" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}