"use client";

import React, { useState } from "react";
import ProductList from "@/components/admin/ProductList";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function AdminProductsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <>
      <div className="flex flex-col gap-3 md:mb-6 mb-2 border-b border-zinc-200 dark:border-zinc-800 pb-6 sm:pb-8">
        <div className="flex flex-row justify-between items-center gap-4">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Food itms
          </h1>
          
          <Link 
             href="/admin/add-product"
             className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl sm:rounded-2xl font-bold text-[11px] sm:text-sm uppercase tracking-widest sm:tracking-normal sm:normal-case transition-all shadow-lg shadow-amber-500/20 active:scale-95 min-h-[38px] sm:h-auto"
          >
             <PlusCircle className="w-4 h-4" />
             <span className="hidden min-[375px]:inline">Add New Product</span>
             <span className="min-[375px]:hidden">Add</span>
          </Link>
        </div>
        {/* <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Manage your restaurant menu, pricing, and availability.
        </p> */}
      </div>

      <div className="mb-4">
        {/* We reuse the generic ProductList component here */}
        <ProductList 
          refreshTrigger={refreshTrigger} 
          onAddClick={() => {}} // Disabled here since we use a standalone route to add products
        />
      </div>
    </>
  );
}
