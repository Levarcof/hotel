"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Layout, Save, X, Users, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminTableControl() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    tableNumber: "",
    seatCount: "",
    positionX: 1,
    positionY: 1
  });

  const fetchTables = async () => {
    try {
      const res = await fetch("/api/admin/tables");
      const data = await res.json();
      if (data.success) setTables(data.tables);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingTable ? `/api/admin/tables/${editingTable._id}` : "/api/admin/tables";
    const method = editingTable ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editingTable ? "Updated" : "Added");
        setIsModalOpen(false);
        setEditingTable(null);
        setFormData({ tableNumber: "", seatCount: "", positionX: 1, positionY: 1 });
        fetchTables();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/tables/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Deleted");
        fetchTables();
      }
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const startEdit = (table) => {
    setEditingTable(table);
    setFormData({
      tableNumber: table.tableNumber,
      seatCount: table.seatCount,
      positionX: table.positionX,
      positionY: table.positionY
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-white dark:bg-black">
      {/* Small & Clean Header */}
      <div className="flex items-center justify-between mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white flex items-center gap-2">
            <Layout className="w-4 h-4 text-amber-500" /> Infrastructure
          </h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-tighter mt-0.5">Floor Plan Management</p>
        </div>
        <button
          onClick={() => { setEditingTable(null); setFormData({ tableNumber: "", seatCount: "", positionX: 1, positionY: 1 }); setIsModalOpen(true); }}
          className="p-2 md:px-4 md:py-2 bg-amber-500 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> <span className="hidden md:block">New Table</span>
        </button>
      </div>

      {/* Table Grid: 2 columns on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {tables.map(table => (
          <div key={table._id} className="bg-zinc-50 dark:bg-[#0C0C0E] border border-zinc-100 dark:border-zinc-800 rounded-2xl md:rounded-[2.5rem] p-3 md:p-6 relative overflow-hidden group">
            <div className="flex items-start justify-between mb-3 md:mb-6">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-white dark:bg-zinc-900 flex flex-col items-center justify-center border border-zinc-200 dark:border-zinc-800 shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-all">
                <span className="text-[8px] font-bold opacity-40 uppercase leading-none">T</span>
                <span className="text-lg md:text-2xl font-black leading-none">{table.tableNumber}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <button onClick={() => startEdit(table)} className="p-1.5 rounded-lg bg-white dark:bg-zinc-900 text-zinc-400 hover:text-amber-500 border border-zinc-100 dark:border-zinc-800 transition-all">
                  <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
                </button>
                <button onClick={() => handleDelete(table._id)} className="p-1.5 rounded-lg bg-white dark:bg-zinc-900 text-zinc-400 hover:text-red-500 border border-zinc-100 dark:border-zinc-800 transition-all">
                  <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 md:space-y-4">
              <div className="flex items-center gap-2 text-zinc-500">
                <Users className="w-3 h-3 text-amber-500" />
                <span className="text-[9px] md:text-xs font-bold uppercase tracking-tight">{table.seatCount} Seats</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                <MapPin className="w-3 h-3 text-zinc-400" />
                <span className="text-[9px] md:text-xs font-medium uppercase tracking-tighter">Pos: {table.positionX}, {table.positionY}</span>
              </div>
            </div>

            {/* Visual Indicator of seats */}
            <div className="mt-3 flex gap-0.5">
              {[...Array(Math.min(table.seatCount, 6))].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-500/20" />
              ))}
            </div>
          </div>
        ))}

        {/* Small Add Trigger Card */}
        <button
          onClick={() => { setEditingTable(null); setFormData({ tableNumber: "", seatCount: "", positionX: 1, positionY: 1 }); setIsModalOpen(true); }}
          className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl md:rounded-[2.5rem] flex flex-col items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-[#0C0C0E] transition-all min-h-[140px] md:min-h-[200px]"
        >
          <Plus className="w-5 h-5 text-zinc-300" />
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400">Add Unit</span>
        </button>
      </div>

      {/* Responsive Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-black w-full max-w-md rounded-t-[2rem] md:rounded-[3rem] p-6 md:p-10 relative animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-500 border-t md:border border-white/10">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-black text-zinc-950 dark:text-white uppercase tracking-tighter">
                {editingTable ? "Edit Table" : "Register Unit"}
              </h2>
              <p className="text-[9px] font-bold uppercase text-amber-500 tracking-widest">Database Sync</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-zinc-400 ml-1">Table ID</label>
                  <input required type="number" value={formData.tableNumber} onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })} className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-sm font-bold focus:border-amber-500 outline-none transition-all" placeholder="101" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-zinc-400 ml-1">Capacity</label>
                  <input required type="number" value={formData.seatCount} onChange={(e) => setFormData({ ...formData, seatCount: e.target.value })} className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-sm font-bold focus:border-amber-500 outline-none transition-all" placeholder="4" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-zinc-400 ml-1">Floor X</label>
                  <input required type="number" value={formData.positionX} onChange={(e) => setFormData({ ...formData, positionX: e.target.value })} className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-sm font-bold outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-zinc-400 ml-1">Floor Y</label>
                  <input required type="number" value={formData.positionY} onChange={(e) => setFormData({ ...formData, positionY: e.target.value })} className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-sm font-bold outline-none" />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-zinc-950 dark:bg-amber-500 text-white dark:text-zinc-950 font-black uppercase text-[10px] tracking-widest rounded-xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> {editingTable ? "Update Info" : "Add to Layout"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}