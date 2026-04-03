"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, BedDouble, Layers, IndianRupee, Clock, 
  Loader2, Zap, LayoutGrid, CheckCircle2, User, Phone,
  ShieldAlert, Banknote, QrCode, Trash2, Calendar, FileText
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminRoomBookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/room-bookings/${id}`);
      const data = await res.json();
      if (data.success) setBooking(data.booking);
      else toast.error("Record not found");
    } catch (err) {
      toast.error("Communication failure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBookingDetail();
  }, [id]);

  const handleConfirmPayment = async () => {
    setConfirmLoading(true);
    try {
       const res = await fetch("/api/admin/room-bookings/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: booking._id })
       });
       const data = await res.json();
       if (data.success) {
          toast.success("Settlement Verified");
          router.push("/admin/rooms/bookings");
       } else toast.error(data.message);
    } catch (err) { toast.error("Sync error"); }
    finally { setConfirmLoading(false); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Syncing Record...</p>
    </div>
  );

  if (!booking) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* REFINED HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
        <div>
          <Link href="/admin/rooms/bookings" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-amber-500 mb-2 transition-colors">
            <ArrowLeft size={14} /> Back to Registry
          </Link>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
            Contract Details <span className="text-amber-500 font-medium opacity-50">/</span> <span className="text-sm font-mono text-zinc-400">ID-{booking._id.slice(-6).toUpperCase()}</span>
          </h1>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-2 ${
          booking.status === "booked" ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10" : "bg-amber-50 text-amber-600 border-amber-200 shadow-sm"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${booking.status === "booked" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
          {booking.status === "booked" ? "Active Stay" : "Awaiting Settlement"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ASSET & RESIDENT INFO */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* ASSET PREVIEW */}
          <div className="relative aspect-video sm:aspect-[21/9] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <Image src={booking.roomId.images[0]} alt="Asset" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6">
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Assigned Suite</p>
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">Room #{booking.roomId.roomNumber} <span className="text-sm font-normal text-white/60 ml-2">• Floor {booking.roomId.floorNumber}</span></h3>
            </div>
          </div>

          {/* INFORMATION GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Resident Card */}
            <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center gap-2 text-amber-600">
                <User size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Resident Profile</span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase">Legal Name</p>
                  <p className="text-sm font-bold dark:text-white uppercase">{booking.name}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase">Comm. Line</p>
                  <p className="text-sm font-bold dark:text-white tabular-nums">{booking.mobile}</p>
                </div>
              </div>
            </div>

            {/* Logistics Card */}
            <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center gap-2 text-amber-600">
                <Clock size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Logistics</span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase">Arrival Timestamp</p>
                  <p className="text-sm font-bold dark:text-white">{new Date(booking.bookingStartTime).toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'})}</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase">
                  <CheckCircle2 size={12} /> Standard 24h Cycle applied
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FINANCIALS & ACTIONS */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* SETTLEMENT CARD */}
          <div className="bg-zinc-900 dark:bg-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Settlement Balance</p>
                <h2 className="text-3xl font-black text-white dark:text-zinc-950 tabular-nums">₹{booking.dueAmount}</h2>
              </div>

              <div className="space-y-4 border-t border-white/10 dark:border-zinc-100 pt-4">
                <div>
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Payment Protocol</p>
                  <div className="flex items-center gap-3 text-xs font-bold text-zinc-200 dark:text-zinc-800 uppercase tracking-tight">
                    {booking.paymentMethod === "Cash" ? (
                      <><Banknote size={18} className="text-emerald-500" /> Physical Cash Flow</>
                    ) : booking.paymentMethod === "Online" ? (
                      <><QrCode size={18} className="text-amber-500" /> Digital Gateway</>
                    ) : (
                      <><ShieldAlert size={18} className="text-zinc-500" /> Unset</>
                    )}
                  </div>
                </div>

                {booking.status === "pending_checkout" ? (
                  <button 
                    onClick={handleConfirmPayment}
                    disabled={confirmLoading}
                    className="w-full py-4 bg-amber-500 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg hover:bg-amber-600 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {confirmLoading ? <Loader2 size={14} className="animate-spin" /> : "Verify & Release Asset"}
                  </button>
                ) : (
                  <div className="py-3 px-4 border border-dashed border-white/20 dark:border-zinc-200 rounded-xl">
                    <p className="text-[9px] font-medium text-zinc-500 text-center uppercase leading-relaxed">Residency In Progress. Settlement protocol locked.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DANGER ZONE */}
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-500">
              <ShieldAlert size={14} />
              <span className="text-[9px] font-bold uppercase tracking-widest">Admin Control</span>
            </div>
            <button className="w-full py-3 rounded-xl border border-red-200 dark:border-red-900/50 text-red-500 text-[10px] font-bold uppercase hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
              <Trash2 size={14} /> Force Terminate Contract
            </button>
            <p className="text-[8px] font-medium text-zinc-400 text-center uppercase leading-tight">
              Terminating bypasses settlement verification. Only for system errors.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}