"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Hotel, BedDouble, Layers, IndianRupee, Filter, 
  Loader2, ChevronRight, MapPin 
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function RoomsListingPage() {
  const [rooms, setRooms] = useState([]);
  const [floors, setFloors] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchRoomsData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/rooms");
      const data = await res.json();
      if (data.success) {
        setRooms(data.rooms);
        setFloors(["All", ...data.floors]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRoomsData();
  }, []);

  const filteredRooms = selectedFloor === "All" 
    ? rooms 
    : rooms.filter(r => r.floorNumber === selectedFloor);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Syncing Suites...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-black font-sans selection:bg-amber-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-3 md:px-10 pb-12">
        
        {/* --- PROFESSIONAL FLOOR FILTER --- */}
        <div className="flex flex-col items-center text-center py-6 md:py-10">
          <div className="w-full overflow-x-auto no-scrollbar flex justify-start md:justify-center">
            <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-2">
              {floors.map((floor) => (
                <button
                  key={floor}
                  onClick={() => setSelectedFloor(floor)}
                  className={`px-4 py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                    selectedFloor === floor 
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-md" 
                      : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {floor === "All" ? "All Levels" : `L-${floor}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- ROOM GRID: 2 COLUMNS ON MOBILE --- */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {filteredRooms.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <Hotel className="w-10 h-10 text-zinc-300 mx-auto mb-3 opacity-50" />
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">No listings found</p>
            </div>
          ) : (
            filteredRooms.map((room) => (
              <Link 
                href={`/rooms/${room._id}`} 
                key={room._id}
                className="group bg-white dark:bg-zinc-900 rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 hover:border-amber-500/30 transition-all duration-500 shadow-sm hover:shadow-lg"
              >
                {/* Media Section */}
                <div className="relative h-40 md:h-64 w-full overflow-hidden">
                  <Image 
                    src={room.images[0]} 
                    alt={room.roomNumber} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Status Overlay */}
                  <div className="absolute top-2 md:top-4 left-2 md:left-4">
                    <div className={`px-2 md:px-3 py-1 rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-widest backdrop-blur-md border ${
                      room.isBooked 
                        ? "bg-zinc-900/80 text-white border-white/10" 
                        : "bg-emerald-500/90 text-white border-emerald-400/50"
                    }`}>
                      {room.isBooked ? "Reserved" : "Available"}
                    </div>
                  </div>

                  <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4">
                    <div className="bg-black/40 backdrop-blur-md px-2 py-1 md:p-3 rounded-lg border border-white/10">
                      <h3 className="text-xs md:text-xl font-black text-white tracking-tight">#{room.roomNumber}</h3>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-3 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-3 md:mb-6">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-2.5 h-2.5 text-amber-500" />
                      <p className="text-[8px] md:text-xs font-bold text-zinc-600 dark:text-zinc-300">Level {room.floorNumber}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BedDouble className="w-2.5 h-2.5 text-amber-500" />
                      <p className="text-[8px] md:text-xs font-bold text-zinc-600 dark:text-zinc-300 truncate">{room.bedType}</p>
                    </div>
                  </div>

                  <div className="pt-2 md:pt-5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[7px] md:text-[8px] font-black text-zinc-400 uppercase tracking-widest">Rate</span>
                      <p className="text-xs md:text-xl font-black text-zinc-950 dark:text-white tracking-tighter">
                        ₹{room.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
                      <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}