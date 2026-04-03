"use client";

import React, { useState, useEffect } from "react";
import { Loader2, X, Banknote, QrCode, CreditCard, ChevronRight, Check, User, Phone } from "lucide-react";
import { toast } from "react-hot-toast";

export default function BookingCheckoutModal({ isOpen, onClose, onSuccess, bookingData }) {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("COD"); // "COD" or "Online"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBookingSubmit = async (params = {}) => {
    setLoading(true);
    setError(null);

    const payload = {
      ...bookingData,
      name: formData.name,
      mobileNumber: formData.mobileNumber,
      paymentMethod,
      ...params
    };

    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Booking Confirmed Successfully!");
        onSuccess(data.bookingId);
      } else {
        setError(data.message || "Failed to create booking");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError("Razorpay SDK failed to load. Are you online?");
      return;
    }

    setLoading(true);
    try {
      // Create dummy order on server for Razorpay
      const createOrderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1 }) // Dummy amount ₹1 for booking
      });
      const orderData = await createOrderRes.json();

      if (!orderData.success) {
        setError(orderData.message || "Failed to initiate payment");
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: 100, // ₹1 in paise
        currency: "INR",
        name: "Restaurant Table Booking",
        description: `Booking for Table ${bookingData.tableNumber || ""}`,
        order_id: orderData.razorpayOrderId,
        handler: async function (response) {
          // On success, finalize the booking
          await handleBookingSubmit({
            paymentStatus: "paid",
            razorpayPaymentId: response.razorpay_payment_id
          });
        },
        prefill: {
          name: formData.name,
          contact: formData.mobileNumber
        },
        theme: {
          color: "#f59e0b"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        toast.error(response.error.description || "Payment failed");
        setLoading(false);
      });

      paymentObject.open();
    } catch (err) {
      console.error(err);
      setError("Payment initialization failed");
      setLoading(false);
    }
  };

  const validateAndProceed = () => {
    if (!formData.name || !formData.mobileNumber) {
      setError("Please fill in your name and mobile number.");
      return;
    }

    if (paymentMethod === "Online") {
      handleOnlinePayment();
    } else {
      handleBookingSubmit({ paymentStatus: "pending" });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-zinc-950 w-full sm:w-[500px] max-h-[90vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col relative animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 uppercase flex items-center gap-3">
             <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                <CreditCard className="w-5 h-5" />
             </div>
             Reservation Checkout
          </h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/20 rounded-2xl text-xs font-black uppercase tracking-widest">
              {error}
            </div>
          )}

          {/* Booking Summary Mini-Card */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
             <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest leading-none">Seats Selected</p>
                <p className="text-sm font-black text-zinc-900 dark:text-white uppercase leading-none">{bookingData.seatIds?.length || 0} Premium Seats</p>
             </div>
             <div className="h-8 w-px bg-zinc-200 dark:border-zinc-800 mx-2" />
             <div className="text-right space-y-1">
                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest leading-none">{bookingData.date}</p>
                <p className="text-sm font-black text-amber-500 leading-none uppercase">{bookingData.time} Slot</p>
             </div>
          </div>

          {/* Personal Details */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-1">Guest Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-amber-500 transition-colors" />
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Full Name" 
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500/20 outline-none transition-all" 
                />
              </div>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-amber-500 transition-colors" />
                <input 
                  type="tel" 
                  name="mobileNumber" 
                  value={formData.mobileNumber} 
                  onChange={handleInputChange} 
                  placeholder="Mobile Number" 
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500/20 outline-none transition-all" 
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-1">Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setPaymentMethod("COD")} 
                className={`relative p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${paymentMethod === "COD" ? "border-zinc-900 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xl" : "border-zinc-100 dark:border-zinc-800 bg-transparent text-zinc-400 hover:border-zinc-200"}`}
              >
                <Banknote className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-widest">Pay on Arrival</span>
                {paymentMethod === "COD" && <Check className="absolute top-2 right-2 w-4 h-4" />}
              </button>
              <button 
                onClick={() => setPaymentMethod("Online")} 
                className={`relative p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${paymentMethod === "Online" ? "border-amber-500 bg-amber-500 text-white shadow-xl shadow-amber-500/20" : "border-zinc-100 dark:border-zinc-800 bg-transparent text-zinc-400 hover:border-zinc-200"}`}
              >
                <QrCode className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-widest">Pay Online</span>
                {paymentMethod === "Online" && <Check className="absolute top-2 right-2 w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-5 sm:p-8 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={validateAndProceed}
            disabled={loading}
            className="w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-2 transition-all shadow-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                {paymentMethod === "COD" ? "Confirm Reservation" : "Pay & Book Now"}
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
          <p className="text-[9px] font-bold text-zinc-400 text-center mt-4 uppercase tracking-widest opacity-60">Secure SSL Encrypted Transaction</p>
        </div>
      </div>
    </div>
  );
}
