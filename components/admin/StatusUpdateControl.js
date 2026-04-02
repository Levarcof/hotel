import React, { useState } from "react";
import { Loader2, Settings2 } from "lucide-react";

export default function StatusUpdateControl({ orderId, currentStatus, onStatusUpdated }) {
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    if (status === currentStatus) return;
    
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ status })
      });
      const data = await res.json();
      
      if (data.success) {
         onStatusUpdated(data.order);
      } else {
         alert(data.message || "Failed to update status");
         setStatus(currentStatus); // Revert
      }
    } catch (err) {
      console.error(err);
      alert("Error saving status");
      setStatus(currentStatus);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-amber-50 dark:bg-amber-950/20 rounded-[2.5rem] p-8 border border-amber-100 dark:border-amber-900/30">
      <h3 className="text-xl font-black text-amber-900 dark:text-amber-500 tracking-tight mb-6 flex items-center gap-2">
         <Settings2 className="w-5 h-5" /> Manage Status
      </h3>
      
      <div className="flex flex-col gap-4">
         <select 
           value={status}
           onChange={(e) => setStatus(e.target.value)}
           disabled={updating}
           className="w-full appearance-none px-5 py-4 bg-white dark:bg-[#1C1C1E] border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer disabled:opacity-50"
         >
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
         </select>
         
         <button 
           onClick={handleUpdate}
           disabled={updating || status === currentStatus}
           className="w-full h-14 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center transition-all shadow-md shadow-amber-500/20 disabled:shadow-none active:scale-95"
         >
           {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Update"}
         </button>
      </div>
    </div>
  );
}
