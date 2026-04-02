"use client";

import { useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";

export default function AddFoodForm({ onProductAdded, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
  });
  const [images, setImages] = useState([]); // File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Data URLs for preview
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 3) {
      setError("Maximum 3 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...files].slice(0, 3));
    
    // Generate previews
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
      throw new Error("Cloudinary env variables are missing.");
    }

    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
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
    setError("");
    setSuccess("");

    try {
      if (images.length === 0) {
        throw new Error("Please select at least 1 image");
      }

      // 1. Upload images to Cloudinary
      const uploadedImageUrls = await uploadImagesToCloudinary(images);

      // 2. Prepare product data
      const productData = {
        name: formData.name,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        description: formData.description,
        images: uploadedImageUrls,
      };

      // 3. Call product API
      const res = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess("Product added successfully!");
      setFormData({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: "",
      });
      setImages([]);
      setImagePreviews([]);
      
      if (onProductAdded) {
        onProductAdded();
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-5 md:p-8 relative">
      <div className="flex justify-between items-center mb-5 md:mb-6">
        <h2 className="font-serif text-lg md:text-2xl font-bold text-gray-900 dark:text-white">Add New Food Product</h2>
        <button 
          onClick={onCancel}
          className="p-1.5 md:p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors flex-shrink-0"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-medium border border-red-100">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 text-sm font-medium border border-green-100">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">Food Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all dark:text-white text-sm"
              placeholder="e.g., Truffle Pasta"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">Category</label>
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all dark:text-white text-sm"
            >
              <option value="">Select a category</option>
              <option value="Starters">Starters</option>
              <option value="Main Course">Main Course</option>
              <option value="Desserts">Desserts</option>
              <option value="Beverages">Beverages</option>
              <option value="Specials">Specials</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">Price ($)</label>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              required
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all dark:text-white text-sm"
              placeholder="e.g., 24.99"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">Stock</label>
            <input
              type="number"
              name="stock"
              min="0"
              required
              value={formData.stock}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all dark:text-white text-sm"
              placeholder="e.g., 50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">Description</label>
          <textarea
            name="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all dark:text-white text-sm resize-none"
            placeholder="Describe the dish here..."
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload Images (Max 3)
          </label>
          {images.length < 3 && (
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors cursor-pointer relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />
              <div className="space-y-2 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-amber-600 font-medium">Click to upload</span> or drag and drop
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB (Max 3)</p>
              </div>
            </div>
          )}

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200 dark:border-zinc-800">
                  <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1.5 bg-red-600 sm:bg-red-600 sm:bg-opacity-100 text-white rounded-full transition-opacity shadow-lg z-10"
                  >
                    <X className="w-3 h-3 sm:w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 hover:bg-amber-600 dark:bg-white dark:text-black dark:hover:bg-amber-500 text-white rounded-xl font-medium transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Publishing Product...</span>
              </>
            ) : (
              "Add Food Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
