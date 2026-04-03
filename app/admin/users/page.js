"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, ShieldCheck, Loader2, Search, Trash2, Calendar, Fingerprint } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) {
      if (!isBackground) toast.error("Database sync failed");
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(() => fetchUsers(true), 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteUser = async (id) => {
    if (!confirm("Confirm permanent deletion?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if ((await res.json()).success) {
        toast.success("Identity Purged");
        fetchUsers();
      }
    } catch (err) {
      toast.error("Process failed");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Accessing Directory...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 px-1 md:px-4">
      
      {/* --- COMPACT HEADER --- */}
      <div className="flex justify-between items-start sm:items-center gap-4 border-b border-zinc-100 dark:border-zinc-800 ">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Fingerprint className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Security Audit</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Community Directory</h1>
        </div>
        
        <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
          <p className="text-[10px] font-bold text-zinc-400 uppercase">Total</p>
          <p className="text-sm font-black text-zinc-900 dark:text-white tabular-nums">{users.length}</p>
        </div>
      </div>

      {/* --- FILTER BAR --- */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input 
          type="text" 
          placeholder="Filter by name, phone or identification..."
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-1 focus:ring-amber-500 outline-none transition-all text-sm font-medium shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* --- USER LISTING --- */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Table Header (Hidden on Mobile) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
          <div className="col-span-4 text-[10px] font-black uppercase text-zinc-400 tracking-widest">User Profile</div>
          <div className="col-span-3 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Contact Info</div>
          <div className="col-span-2 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Registration</div>
          <div className="col-span-2 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Permissions</div>
          <div className="col-span-1"></div>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {filteredUsers.length === 0 ? (
            <div className="py-20 text-center">
              <User className="w-10 h-10 text-zinc-200 mx-auto mb-3" />
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">No identities found in current scope</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-6 py-4 items-center hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors group">
                
                {/* Profile Info */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex-shrink-0">
                    {user.profileImage ? (
                      <Image src={user.profileImage} alt="User" fill className="object-cover" />
                    ) : (
                      <User className="w-full h-full p-2 text-zinc-400" />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase truncate">
                      {user.name || "Anonymous"}
                    </p>
                    <p className="text-[9px] font-medium text-zinc-400 uppercase tracking-tighter">ID: #{user._id.slice(-8)}</p>
                  </div>
                </div>

                {/* Contact (Mobile optimization: visible inline) */}
                <div className="col-span-3 flex items-center gap-2">
                  <Phone size={14} className="text-amber-500 md:hidden" />
                  <p className="text-[11px] md:text-xs font-semibold text-zinc-600 dark:text-zinc-300 tabular-nums">
                    {user.phone}
                  </p>
                </div>

                {/* Registration Date */}
                <div className="col-span-2 hidden md:flex items-center gap-2 text-zinc-500">
                  <Calendar size={14} className="text-zinc-400" />
                  <span className="text-[10px] font-medium">{new Date(user.createdAt).toLocaleDateString([], {day:'2-digit', month:'short', year:'numeric'})}</span>
                </div>

                {/* Role/Badge */}
                <div className="col-span-2 flex items-center justify-between md:justify-start gap-2">
                  {user.role === "admin" ? (
                    <span className="px-2 py-0.5 bg-amber-500 text-white text-[8px] font-black uppercase rounded shadow-sm flex items-center gap-1">
                      <ShieldCheck size={10} /> Root
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[8px] font-black uppercase rounded">
                      Member
                    </span>
                  )}
                  
                  {/* Action (Visible on mobile right side) */}
                  <button 
                    onClick={() => deleteUser(user._id)}
                    className="md:hidden p-2 text-zinc-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Desktop Delete */}
                <div className="col-span-1 hidden md:flex justify-end">
                  <button 
                    onClick={() => deleteUser(user._id)}
                    className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}