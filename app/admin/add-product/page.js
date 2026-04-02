"use client";

import React from "react";
import AddFoodForm from "@/components/admin/AddFoodForm";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminAddProductPage() {
  const router = useRouter();

  const handleProductAdded = () => {
     // Navigate back to the products list upon successful save
     router.push("/admin/products");
  };

  const handleCancelClick = () => {
     router.push("/admin/products");
  };

  return (
    <>
      <div className="mb-6 md:mb-8">
         <Link href="/admin/products" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors mb-4 group">
           <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
         </Link>
         <h1 className="font-serif text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1.5 md:mb-2">
           Create New Product
         </h1>
         <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
           Add a stunning new item to your hotel's menu interface.
         </p>
      </div>

      <div className="bg-white dark:bg-[#1C1C1E] border border-zinc-100 dark:border-zinc-800 rounded-2xl md:rounded-3xl p-0 md:p-10 shadow-sm relative overflow-hidden">
         <AddFoodForm 
           onProductAdded={handleProductAdded} 
           onCancel={handleCancelClick} 
         />
      </div>
    </>
  );
}
