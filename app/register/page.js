"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Upload, X, Camera } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  
  const [status, setStatus] = useState({ loading: false, error: "", currentAction: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = (e) => {
    e.preventDefault();
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", currentAction: "Starting registration..." });

    try {
      let profileImageUrl = "";

      // Step 1: Upload Image to Cloudinary if file exists
      if (imageFile) {
        setStatus({ loading: true, error: "", currentAction: "Uploading profile image..." });
        
        // Use environment variables or fallback to known user defaults
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        
        const imageData = new FormData();
        imageData.append("file", imageFile);
        imageData.append("upload_preset", uploadPreset);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: imageData }
        );

        if (!uploadRes.ok) {
          throw new Error("Failed to upload image to Cloudinary. Check your CloudName/Preset.");
        }

        const uploadedImage = await uploadRes.json();
        profileImageUrl = uploadedImage.secure_url;
      }

      // Step 2: Register User via API
      setStatus({ loading: true, error: "", currentAction: "Creating your account..." });
      
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          profileImage: profileImageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Redirect to login on success
      router.push("/");
    } catch (err) {
      setStatus({ loading: false, error: err.message, currentAction: "" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4 sm:px-6 lg:px-8 py-20 pb-32">
      <div className="w-full max-w-lg space-y-8 bg-white dark:bg-zinc-900 p-8 sm:p-12 rounded-3xl shadow-2xl dark:border dark:border-zinc-800 animate-fade-in-up">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-tight text-gray-900 dark:text-white">
            Create an Account
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Join our luxury hotel network
          </p>
        </div>

        {status.error && (
          <div className="bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm text-center font-medium shadow-sm">
            {status.error}
          </div>
        )}

        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          
          {/* Circular Image Upload Area */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full border-2 border-dashed border-gray-300 dark:border-zinc-700 hover:border-amber-500 transition-colors flex items-center justify-center bg-gray-50 dark:bg-zinc-950 overflow-hidden group shadow-inner">
              {imagePreview ? (
                <>
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <button type="button" onClick={clearImage} className="p-1.5 sm:p-2 bg-red-500/80 rounded-full text-white hover:bg-red-600 transition-colors transform hover:scale-105">
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                  <div className="p-2 sm:p-3 bg-amber-50 dark:bg-amber-900/20 rounded-full text-amber-600 dark:text-amber-500 group-hover:scale-110 transition-transform duration-300 mb-1.5 sm:mb-2">
                    <Camera className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Photo</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={status.loading} />
                </label>
              )}
            </div>
            
            {status.loading && status.currentAction === "Uploading profile image..." && (
               <span className="text-xs sm:text-sm text-amber-600 dark:text-amber-500 font-medium animate-pulse flex items-center gap-2">
                 <Upload className="w-3 h-3 sm:w-4 sm:h-4 animate-bounce" /> Uploading image...
               </span>
            )}
          </div>

          {/* Form Inputs */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={status.loading}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                disabled={status.loading}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={status.loading}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status.loading}
            className="w-full flex justify-center py-3.5 sm:py-4 px-4 rounded-full shadow-xl shadow-amber-600/20 text-sm sm:text-base font-medium text-white bg-amber-600 hover:bg-amber-700 hover:shadow-amber-600/40 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {status.loading ? status.currentAction : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-zinc-800 pt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
