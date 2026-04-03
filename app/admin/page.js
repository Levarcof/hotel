"use client";

import React, { useState, useEffect } from "react";
import { Hotel, Package, Utensils, IndianRupee, Calendar, Users, Activity, ChevronRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    bookings: 0,
    tables: 0,
    users: 0
  });

  // HYDRATION FIX: Time state banayein
  const [currentTime, setCurrentTime] = useState("");

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch admin stats", err);
    }
  };

  useEffect(() => {
    fetchStats();
    // Samay ko sirf client side par set karein
    setCurrentTime(new Date().toLocaleTimeString());

    const interval = setInterval(() => {
      fetchStats();
      setCurrentTime(new Date().toLocaleTimeString()); // Update time with stats
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const quickStats = [
    { title: "Revenue", value: `₹${stats.revenue.toLocaleString()}`, label: "Net Earnings", icon: IndianRupee, color: "text-emerald-500", route: "/admin/orders" },
    { title: "Orders", value: stats.orders, label: "Total Sales", icon: Package, color: "text-blue-500", route: "/admin/orders" },
    { title: "Menu", value: stats.products, label: "Live Dishes", icon: Utensils, color: "text-amber-500", route: "/admin/products" },
    { title: "Bookings", value: stats.bookings, label: "Reservations", icon: Calendar, color: "text-rose-500", route: "/admin/bookings" },
    { title: "Tables", value: stats.tables, label: "Floor Units", icon: Hotel, color: "text-indigo-500", route: "/admin/tables" },
    { title: "Members", value: stats.users, label: "Active Users", icon: Users, color: "text-cyan-500", route: "/admin" }
  ];

  return (
    <div className="space-y-6">
      {/* --- COMPACT PREMIUM HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Last Updated</p>
            {/* FIX: Yaha ab dynamic state use ho rahi hai */}
            <p className="text-xs font-medium text-zinc-900 dark:text-zinc-300 min-w-[80px]">
              {currentTime || "Loading..."}
            </p>
          </div>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-6">
        {quickStats.map((stat, idx) => (
          <Link 
            href={stat.route} 
            key={idx} 
            className="bg-white dark:bg-[#0C0C0E] border border-zinc-100 dark:border-zinc-800 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex flex-col justify-between hover:border-amber-500/50 transition-all group relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1"
          >
            <div className="relative z-10">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center ${stat.color} mb-4 border border-zinc-100 dark:border-zinc-800 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              
              <div className="space-y-0.5">
                <p className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                  {stat.title}
                </p>
                <p className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white tracking-tight tabular-nums">
                  {stat.value}
                </p>
                <p className="text-[8px] md:text-[9px] font-medium text-zinc-500 uppercase tracking-tighter">
                  {stat.label}
                </p>
              </div>
            </div>

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-3 h-3 text-zinc-300" />
            </div>

            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-full -z-0 group-hover:scale-150 transition-transform duration-700" />
          </Link>
        ))}
      </div>

      {/* --- QUICK INSIGHT FOOTER --- */}
      <div className="p-4 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <TrendingUp size={14} />
          </div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Cloud Sync <span className="text-emerald-500 ml-1">Active</span>
          </p>
        </div>
        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">
          Admin Console v2.4.0
        </p>
      </div>
    </div>
  );
}