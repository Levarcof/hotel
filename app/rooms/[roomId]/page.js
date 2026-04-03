"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, BedDouble, Layers, Star, 
  ShieldCheck, Loader2, Zap, CheckCircle2,
  Phone, User as UserIcon, X, Info
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "react-hot-toast";

export default function RoomDetailsPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  const [bookingData, setBookingData] = useState({ name: "", mobile: "" });

  const fetchRoomDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/rooms/${roomId}`);
      const data = await res.json();
      if (data.success) setRoom(data.room);
      else toast.error("Configuration not found");
    } catch (err) {
      toast.error("Network synchronization failure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roomId) fetchRoomDetail();
  }, [roomId]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      const res = await fetch("/api/room-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room._id,
          name: bookingData.name,
          mobile: bookingData.mobile,
          dueAmount: room.price
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Suite Secured Successfully");
        setIsModalOpen(false);
        router.push("/my-room");
      } else {
        toast.error(data.message || "Booking rejected");
      }
    } catch (err) {
      toast.error("Sync error");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
    </div>
  );

  if (!room) return null;

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 font-sans">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
        
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/rooms" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-amber-600 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Collection
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Gallery - 7 cols */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <Image src={room.images[activeImage]} alt={room.roomNumber} fill className="object-cover" priority />
              <div className="absolute top-4 left-4">
                <div className="px-3 py-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-full flex items-center gap-2 shadow-sm">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-300">Verified Listing</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {room.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 aspect-square flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === idx ? "border-amber-500 shadow-md" : "border-transparent opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
                  }`}
                >
                  <Image src={img} alt="Angle" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details - 5 cols */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 rounded">Floor {room.floorNumber}</span>
                <span className="text-zinc-300">•</span>
                <span>Platinum Tier</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Executive Suite <span className="text-amber-500 font-medium">#{room.roomNumber}</span>
              </h1>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />)}
                <span className="ml-2 text-[10px] font-medium text-zinc-400 uppercase tracking-tighter">5.0 Security Rating</span>
              </div>
              <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                A meticulously tailored architectural space offering panoramic serenity and a {room.bedType} configuration designed for total privacy.
              </p>
            </div>

            {/* Utility Specs */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                <Layers className="w-4 h-4 text-amber-500" />
                <div>
                  <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Level</p>
                  <p className="text-xs font-bold dark:text-white">{room.floorNumber}</p>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                <BedDouble className="w-4 h-4 text-amber-500" />
                <div>
                  <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Setup</p>
                  <p className="text-xs font-bold dark:text-white">{room.bedType} Bed</p>
                </div>
              </div>
            </div>

            {/* Transaction Card */}
            <div className="mt-auto bg-zinc-900 dark:bg-white p-6 rounded-[2rem] shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Daily Investment</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white dark:text-zinc-950 tabular-nums">₹{room.price}</span>
                    <span className="text-[10px] font-medium text-zinc-500 lowercase opacity-60">/ 24h</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    if (!token) {
                      toast.error("Please login to reserve a room");
                      router.push(`/login?redirect=${window.location.pathname}`);
                      return;
                    }
                    setIsModalOpen(true);
                  }}
                  disabled={room.isBooked}
                  className={`px-6 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 ${
                    room.isBooked ? "bg-zinc-800 text-zinc-600 cursor-not-allowed" : "bg-amber-500 text-white hover:bg-amber-600"
                  }`}
                >
                  {room.isBooked ? "Unavailable" : "Secure Suite"}
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 px-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Encrypted Residency Protocol</p>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in">
          <div className="bg-white dark:bg-zinc-950 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col relative animate-in slide-in-from-bottom-10 border border-zinc-200 dark:border-zinc-800">
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold dark:text-white">Registry Initialization</h2>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Operational Residency Contract</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleBooking} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase text-zinc-400 tracking-widest ml-1 flex items-center gap-1.5">
                    <UserIcon className="w-3 h-3" /> Full Legal Name
                  </label>
                  <input required type="text" placeholder="Designate Full Name" className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-1 focus:ring-amber-500 outline-none text-sm font-medium" value={bookingData.name} onChange={(e) => setBookingData({...bookingData, name: e.target.value})} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase text-zinc-400 tracking-widest ml-1 flex items-center gap-1.5">
                    <Phone className="w-3 h-3" /> Contact Identification
                  </label>
                  <input required type="tel" placeholder="Mobile Identifier" className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-1 focus:ring-amber-500 outline-none text-sm font-medium" value={bookingData.mobile} onChange={(e) => setBookingData({...bookingData, mobile: e.target.value})} />
                </div>

                <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex items-center justify-between">
                  <div>
                    <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Contract Value</p>
                    <span className="text-xl font-bold text-amber-600">₹{room.price}</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-zinc-800 rounded-lg text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">
                    <Info className="w-2.5 h-2.5" /> 24h Mandatory Duration
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={bookingLoading}
                  className="w-full h-14 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-lg hover:bg-amber-600 dark:hover:bg-amber-500 dark:hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {bookingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Execute Booking <Zap className="w-3.5 h-3.5 fill-current" /></>}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}