"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Edit, Trash2, X, UploadCloud, AlertCircle, Utensils, Plus } from "lucide-react";

export default function ProductList({ refreshTrigger, onAddClick }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for modals
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Refs for file inputs in edit mode
  const fileInputRefs = useRef([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/product");
      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
      } else {
        throw new Error(data.message || "Failed to fetch products");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]);

  const uploadToCloudinary = async (file) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary setup missing");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await response.json();
    return data.secure_url;
  };

  const handleImageReplace = async (index, file) => {
    if (!file) return;

    // Show a local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      const newImages = [...editingProduct.images];
      newImages[index] = e.target.result; // temporary preview
      setEditingProduct({ ...editingProduct, images: newImages, _pendingFiles: { ...editingProduct._pendingFiles, [index]: file } });
    };
    reader.readAsDataURL(file);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      let finalImages = [...editingProduct.images];

      // Upload any pending files
      if (editingProduct._pendingFiles) {
        const indices = Object.keys(editingProduct._pendingFiles);
        for (const idx of indices) {
          const url = await uploadToCloudinary(editingProduct._pendingFiles[idx]);
          finalImages[idx] = url;
        }
      }

      const { _id, name, description, stock } = editingProduct;
      const res = await fetch(`/api/product/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, stock, images: finalImages })
      });

      const data = await res.json();
      if (data.success) {
        setProducts(products.map(p => p._id === _id ? { ...p, ...data.product } : p));
        setEditingProduct(null);
      } else {
        alert(data.message || "Failed to update product");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating product");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/product/${deletingProduct._id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter(p => p._id !== deletingProduct._id));
        setDeletingProduct(null);
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-zinc-500 font-medium animate-pulse">Loading menu systems...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center text-red-500">
          <AlertCircle className="w-8 h-8" />
        </div>
        <p className="text-red-500 font-bold max-w-xs">{error}</p>
        <button onClick={fetchProducts} className="text-sm font-bold text-zinc-900 dark:text-zinc-100 underline">Try again</button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-4 sm:p-8">
      <div className="flex justify-between items-center mb-8 px-2">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Active Menu Items</h2>
          <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-500 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest hidden sm:inline-block">
            {products.length} Total
          </span>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 text-zinc-500 dark:text-zinc-400 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[2rem] flex flex-col items-center gap-4">
          <Utensils className="w-12 h-12 opacity-20" />
          <p className="font-medium">No food products found. Add some to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-white dark:bg-zinc-950 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between p-3"
            >
              <div className="relative h-28 md:h-52 w-full overflow-hidden bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <Image
                  src={product.images[0] || "/placeholder-food.jpg"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-white/90 dark:bg-zinc-950/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white shadow-sm border border-white/20">
                  {product.category}
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2 flex-1">
                <div className="flex justify-between items-center gap-2">
                  <h3 className="font-bold text-zinc-900 dark:text-white text-xs sm:text-lg tracking-tight truncate">
                    {product.name}
                  </h3>
                  <span className="text-xs sm:text-2xl font-black text-amber-600 dark:text-amber-500 tabular-nums shrink-0">
                    Rs. {product.price?.toFixed(2)}
                  </span>
                </div>

                {/* Bottom Row: Stock & Icons */}
                <div className="mt-auto pt-2 border-t border-zinc-50 dark:border-zinc-900 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50 p-2 rounded-lg">
                  <span className={`text-[9px] sm:text-xs font-bold uppercase tracking-tight ${product.stock < 10 ? 'text-red-600' : 'text-zinc-500'}`}>
                    Stock: {product.stock}
                  </span>

                  <div className="flex items-center gap-3 sm:gap-2">
                    <button
                      className="text-zinc-400 hover:text-amber-600 transition-colors"
                      onClick={() => setEditingProduct(product)}
                      title="Edit Product"
                    >
                      <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-lg" />
                    </button>
                    <button
                      className="text-zinc-400 hover:text-red-600 transition-colors"
                      onClick={() => setDeletingProduct(product)}
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-zinc-200/50 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 sm:p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Edit Product</h3>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1 italic">Update menu specifications</p>
              </div>
              <button onClick={() => setEditingProduct(null)} className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all active:rotate-90 duration-300">
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 custom-scrollbar">
              <form id="edit-product-form" onSubmit={handleEditSubmit} className="space-y-6">
                {/* Image Update Section */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 ml-1">Images (Click to replace)</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2].map((idx) => (
                      <div
                        key={idx}
                        onClick={() => fileInputRefs.current[idx]?.click()}
                        className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 border-2 border-dashed border-zinc-200 dark:border-zinc-800 group cursor-pointer hover:border-amber-500 transition-colors"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          ref={el => fileInputRefs.current[idx] = el}
                          onChange={(e) => handleImageReplace(idx, e.target.files[0])}
                          className="hidden"
                        />
                        {editingProduct.images[idx] ? (
                          <>
                            <img src={editingProduct.images[idx]} alt={`Preview ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <UploadCloud className="w-6 h-6 text-white" />
                            </div>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-700">
                            <Plus className="w-6 h-6 mb-1" />
                            <span className="text-[8px] font-black uppercase">Add Image</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 ml-1">Product Name</label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full px-4 py-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-bold text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 ml-1">Stock Quantity</label>
                    <input
                      type="number"
                      min="0"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-bold text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 ml-1">Description</label>
                  <textarea
                    rows="4"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full px-4 py-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 resize-none"
                    required
                  />
                </div>
              </form>
            </div>

            <div className="p-6 sm:p-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-end gap-3 shrink-0 bg-zinc-50 dark:bg-zinc-900/50">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all order-2 sm:order-1"
              >
                Discard
              </button>
              <button
                type="submit"
                form="edit-product-form"
                disabled={isUpdating}
                className="px-8 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all shadow-xl shadow-zinc-900/20 dark:shadow-none disabled:opacity-50 active:scale-95 order-1 sm:order-2"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Authorize Updates"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] w-full max-w-sm shadow-2xl border border-red-100 dark:border-red-900/20 overflow-hidden text-center p-8 sm:p-10">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
              <Trash2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">Delete Product?</h3>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-zinc-900 dark:text-white">"{deletingProduct.name}"</span>?
              This action is destructive and cannot be undone.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20 active:scale-95"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Destruction"}
              </button>
              <button
                onClick={() => setDeletingProduct(null)}
                className="w-full py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-95"
              >
                Cancel Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
