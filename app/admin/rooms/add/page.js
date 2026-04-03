"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PlusCircle, Hotel } from "lucide-react";
import AddRoomForm from "@/components/admin/AddRoomForm";

export default function AdminAddRoomPage() {
  const router = useRouter();

  const handleRoomAdded = () => {
    // Navigate back to the rooms list (to be implemented)
    router.push("/admin/rooms");
  };

  const handleCancelClick = () => {
    router.push("/admin/rooms");
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-zinc-100 dark:border-zinc-800 pb-10">
        <div className="space-y-4">
          <Link 
            href="/admin/rooms" 
            className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-amber-500 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> 
            Inventory Control
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-3xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
              Expand <br /> <span className="text-amber-500 font-sans not-italic">Infrastructure</span>
            </h1>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium max-w-md">
            Deploy elite living quarters to the platform database. Premium suites require verified high-resolution media.
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-3 px-6 py-4 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800">
           <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
             <PlusCircle className="w-5 h-5" />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Action Profile</p>
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase">New Asset Entry</p>
           </div>
        </div>
      </div>

      <div className="relative">
        {/* Decorative Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-zinc-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <AddRoomForm 
          onRoomAdded={handleRoomAdded} 
          onCancel={handleCancelClick} 
        />
      </div>
    </div>
  );
}
