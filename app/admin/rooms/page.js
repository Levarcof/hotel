"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Hotel, Plus, Search, Loader2, ArrowRight,
  BedDouble, Layers, Trash2, ShieldCheck
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/rooms");
      const data = await res.json();
      if (data.success) setRooms(data.rooms);
    } catch (err) {
      toast.error("Manifest load failure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(r => 
    r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.floorNumber.toString().includes(searchQuery)
  );

  if (loading) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
           <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
           <p className="text-zinc-400 font-bold uppercase tracking-widest text-[9px]">Inventory Sync...</p>
        </div>
     );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1 md:px-4">
      
      {/* --- HEADER --- */}
      <div className="flex flex-row justify-between items-center gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Inventory Control</span>
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Suite Management</h1>
        </div>
        
        <Link 
          href="/admin/rooms/add"
          className="flex items-center gap-2 px-4 py-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl font-bold uppercase text-[9px] tracking-widest shadow-lg hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> New Deployment
        </Link>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input 
          type="text" 
          placeholder="Filter by Room # or Floor..."
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-1 focus:ring-amber-500 outline-none transition-all text-sm font-medium"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* --- ROOM GRID --- */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {filteredRooms.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
             <Hotel className="w-10 h-10 text-zinc-300 mx-auto mb-3 opacity-50" />
             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Manifest Empty</p>
          </div>
        ) : (
          filteredRooms.map((room) => (
            <div key={room._id} className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
               
               {/* Media Layer */}
               <div className="relative h-28 md:h-48 w-full overflow-hidden">
                  <Image 
                    src={room.images[0]} 
                    alt={room.roomNumber} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-2 right-2">
                    <div className={`px-2 py-0.5 rounded-md text-[7px] md:text-[9px] font-black uppercase tracking-tighter backdrop-blur-md border ${room.isBooked ? 'bg-red-500/90 text-white border-red-400' : 'bg-emerald-500/90 text-white border-emerald-400'}`}>
                      {room.isBooked ? 'Occupied' : 'Vacant'}
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-2 md:p-4 bg-gradient-to-t from-black/80 to-transparent">
                     <h3 className="text-xs md:text-xl font-bold text-white tracking-tight">#{room.roomNumber}</h3>
                  </div>
               </div>

               {/* Details Layer */}
               <div className="p-3 md:p-5 space-y-3 md:space-y-4">
                  <div className="flex flex-col gap-1.5 md:flex-row md:justify-between">
                     <div className="flex items-center gap-1.5">
                        <Layers className="w-3 h-3 text-amber-500" />
                        <span className="text-[8px] md:text-[11px] font-bold text-zinc-500 uppercase">Lvl {room.floorNumber}</span>
                     </div>
                     <div className="flex items-center gap-1.5">
                        <BedDouble className="w-3 h-3 text-amber-500" />
                        <span className="text-[8px] md:text-[11px] font-bold text-zinc-500 uppercase truncate">{room.bedType}</span>
                     </div>
                  </div>

                  <div className="pt-2 md:pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-[7px] md:text-[8px] font-black text-zinc-400 uppercase">24hr Rate</span>
                        <p className="text-[10px] md:text-base font-black text-zinc-900 dark:text-white tabular-nums">₹{room.price}</p>
                     </div>
                     <div className="flex gap-1.5">
                        <button className="p-1.5 md:p-2 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-red-500 rounded-lg transition-all active:scale-90 border border-zinc-100 dark:border-zinc-700">
                           <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                        
                        {/* FIX: Redirect to /rooms/roomId */}
                        <Link 
                          href={`/rooms/${room._id}`} 
                          className="p-1.5 md:p-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-amber-600 dark:hover:bg-amber-500 transition-all active:scale-90"
                        >
                           <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}