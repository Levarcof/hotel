"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, ShieldCheck, Loader2, Search, Trash2 } from "lucide-react";
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
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error(err);
      if (!isBackground) toast.error("Failed to load users");
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(() => fetchUsers(true), 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteUser = async (id) => {
    if (!confirm("Are you sure? This will remove the user permanently.")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("User removed");
        fetchUsers();
      }
    } catch (err) {
      toast.error("Error deleting user");
    }
  };

  if (loading) {
     return (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
           <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
           <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Accessing Database...</p>
        </div>
     );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header section with Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 bg-zinc-950 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-zinc-950 font-black">U</div>
             <h1 className="font-serif text-3xl font-black tracking-tight uppercase">Platform Users</h1>
           </div>
           <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Manage and monitor registered community members.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white dark:bg-[#1C1C1E] p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
           <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
             <User className="w-6 h-6" />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Total Community</p>
              <p className="text-2xl font-black tracking-tighter tabular-nums text-zinc-950 dark:text-white leading-none">{users.length}</p>
           </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <input 
           type="text" 
           placeholder="Search via name or phone identifier..."
           className="w-full pl-12 pr-6 py-4 bg-white dark:bg-[#1C1C1E] border border-zinc-200 dark:border-zinc-800 rounded-[2rem] focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-bold text-sm outline-none"
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length === 0 ? (
           <div className="col-span-full py-20 text-center bg-white dark:bg-zinc-900 rounded-[3rem] border-2 border-dashed border-zinc-100 dark:border-zinc-800">
              <User className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">No users manifest in this search</p>
           </div>
        ) : (
          filteredUsers.map((user) => (
             <div key={user._id} className="group bg-white dark:bg-[#0C0C0E] border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="flex items-start justify-between mb-6">
                   <div className="relative w-16 h-16 rounded-[1.5rem] overflow-hidden border-2 border-zinc-100 dark:border-zinc-800 group-hover:border-amber-500/40 transition-all">
                      {user.profileImage ? (
                        <Image src={user.profileImage} alt={user.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-300">
                           <User className="w-8 h-8" />
                        </div>
                      )}
                   </div>
                   <div className="flex gap-2">
                       {user.role === "admin" && (
                         <div className="px-3 py-1.5 bg-amber-500 text-white rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-amber-500/20">
                            <ShieldCheck className="w-3 h-3" /> Root Ops
                         </div>
                       )}
                       <button 
                         onClick={() => deleteUser(user._id)}
                         className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                       </button>
                   </div>
                </div>

                <div className="space-y-4">
                   <div>
                      <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                         {user.name || "Anonymous User"}
                      </h3>
                      <div className="flex items-center gap-2 text-zinc-500 mt-1">
                         <Phone className="w-3.5 h-3.5 text-zinc-400" />
                         <span className="text-[11px] font-bold tracking-tight lowercase">{user.phone}</span>
                      </div>
                   </div>

                   <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between">
                       <div>
                          <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Register Date</p>
                          <p className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 mt-0.5 uppercase tracking-tighter">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                       </div>
                       <div className="text-right">
                          <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Member ID</p>
                          <p className="text-[10px] font-bold text-zinc-500 mt-0.5 lowercase tracking-tight">
                            #{user._id.slice(-6)}
                          </p>
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
