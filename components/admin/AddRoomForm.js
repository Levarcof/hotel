"use client";

import { useState } from "react";
import { UploadCloud, X, Loader2, Hotel, Layers, CreditCard, LayoutGrid } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AddRoomForm({ onRoomAdded, onCancel }) {
  const [formData, setFormData] = useState({
    roomNumber: "",
    floorNumber: "",
    price: "",
    bedType: "",
  });
  const [images, setImages] = useState([]); // File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Data URLs for preview
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...files].slice(0, 3));
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target.result].slice(0, 3));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToCloudinary = async (files) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration missing.");
    }

    const uploadedUrls = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: fd }
      );

      const data = await response.json();
      if (data.secure_url) {
        uploadedUrls.push(data.secure_url);
      } else {
        throw new Error("Image upload failed");
      }
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (images.length === 0) {
        throw new Error("Please select at least 1 image");
      }

      const uploadedImageUrls = await uploadImagesToCloudinary(images);

      const roomData = {
        roomNumber: formData.roomNumber,
        floorNumber: formData.floorNumber,
        price: Number(formData.price),
        bedType: formData.bedType,
        images: uploadedImageUrls,
      };

      const res = await fetch("/api/admin/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create room");
      }

      toast.success("Room created successfully!");
      if (onRoomAdded) onRoomAdded();

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 md:p-10 relative">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
           <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
             <Hotel className="w-6 h-6" />
           </div>
           <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Register New Room</h2>
        </div>
        <button 
          onClick={onCancel}
          className="p-2.5 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-all active:scale-95 flex-shrink-0 border border-zinc-100 dark:border-zinc-800"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Room Number */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1 flex items-center gap-2">
              <LayoutGrid className="w-3 h-3" /> Room Identifier
            </label>
            <input
              type="text"
              name="roomNumber"
              required
              value={formData.roomNumber}
              onChange={handleInputChange}
              className="w-full px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all dark:text-white text-sm font-bold"
              placeholder="e.g., 101, A-12"
            />
          </div>

          {/* Floor Number */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1 flex items-center gap-2">
              <Layers className="w-3 h-3" /> Floor Level
            </label>
            <input
              type="text"
              name="floorNumber"
              required
              value={formData.floorNumber}
              onChange={handleInputChange}
              className="w-full px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all dark:text-white text-sm font-bold"
              placeholder="e.g., Ground Floor, 2nd Floor"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1 flex items-center gap-2">
              <CreditCard className="w-3 h-3" /> Base Price (24 Hours)
            </label>
            <input
              type="number"
              name="price"
              required
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all dark:text-white text-sm font-bold"
              placeholder="e.g., 2500"
            />
          </div>

          {/* Bed Type */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1 flex items-center gap-2">
              <Hotel className="w-3 h-3" /> Bed Configuration
            </label>
            <select
              name="bedType"
              required
              value={formData.bedType}
              onChange={handleInputChange}
              className="w-full px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all dark:text-white text-sm font-bold appearance-none cursor-pointer"
            >
              <option value="">Select Bed Type</option>
              <option value="Single">Single Bed</option>
              <option value="Double">Double Bed</option>
              <option value="Triple">Triple Bed</option>
            </select>
          </div>
        </div>

        {/* Image Upload Area */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">
            Visual Assets (Min 1, Max 3)
          </label>
          
          {images.length < 3 && (
            <div className="relative group flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem] hover:border-amber-500 hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-all cursor-pointer overflow-hidden">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={loading}
              />
              <UploadCloud className="w-12 h-12 text-zinc-300 group-hover:text-amber-500 transition-colors mb-4" />
              <div className="text-center">
                <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">Tap to upload room media</span>
                <p className="text-[10px] text-zinc-400 mt-1 uppercase font-black tracking-widest">PNG, JPG, WEBP • Max 5MB each</p>
              </div>
            </div>
          )}

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-6 mt-4">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative group rounded-[1.5rem] overflow-hidden aspect-[4/3] border border-zinc-100 dark:border-zinc-800 shadow-sm animate-in zoom-in duration-300">
                  <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-3 bg-red-500 text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
           <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-10 py-5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-amber-600 dark:hover:bg-amber-500 dark:hover:text-white transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deploying Room...</span>
              </>
            ) : (
              "Initialize Room"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
