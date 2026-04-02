"use client";

import { Hotel, Package, Utensils, IndianRupee } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {

  const quickStats = [
    { title: "Total Revenue", value: "0", label: "Monthly", icon: IndianRupee, route: "/admin/orders" },
    { title: "Active Orders", value: "0", label: "To Fulfill", icon: Package, route: "/admin/orders" },
    { title: "Menu Items", value: "0", label: "Available", icon: Utensils, route: "/admin/products" }
  ];

  return (
    <>
      <div className="mb-6 md:mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
          Welcome to Admin Hub
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-lg">
          Here's a quick overview of your hotel's operational status today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickStats.map((stat, idx) => (
           <Link href={stat.route} key={idx} className="bg-white dark:bg-[#1C1C1E] border border-zinc-100 dark:border-zinc-800 rounded-2xl md:rounded-3xl p-5 md:p-8 flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
             <div>
                <p className="text-[10px] md:text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">{stat.title}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors">{stat.value}</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">{stat.label}</span>
                </div>
             </div>
             <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-amber-50 dark:bg-amber-900/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform shadow-inner">
                <stat.icon className="w-6 h-6 md:w-7 md:h-7" />
             </div>
           </Link>
        ))}
      </div>
    </>
  );
}
