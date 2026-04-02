"use client";

import React, { useState, useEffect } from "react";
import { Loader2, X, MapPin, Banknote, QrCode, CreditCard, ChevronRight, Check } from "lucide-react";

export default function CheckoutModal({ isOpen, onClose, onSuccess, amount, itemsToOrder }) {
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [locationType, setLocationType] = useState("manual"); // "manual" or "current"
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // "COD" or "UPI"
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
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setFetchingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates(prev => ({ ...prev, latitude, longitude }));
        
        try {
          // Attempt to get approximate address name automatically
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
             setCoordinates(prev => ({ 
               ...prev, 
               addressName: data.display_name,
               city: data.address.city || data.address.town || data.address.village || "",
               state: data.address.state || "",
               pincode: data.address.postcode || ""
             }));
          }
        } catch (err) {
          console.error("Reverse geocoding error:", err);
        } finally {
          setFetchingLocation(false);
        }
      },
      (err) => {
        console.error(err);
        setError("Unable to retrieve location. Please allow location access.");
        setFetchingLocation(false);
        setLocationType("manual");
      }
    );
  };

  const isAddressValid = locationType === "current"
    ? (address.fullName && address.phone && coordinates.latitude)
    : Object.values(address).every(val => val.trim() !== "");

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!isAddressValid) {
      setError("Please provide all required details.");
      return;
    }

    setLoading(true);
    setError(null);

    // Generate location data
    let locationData = {};

    if (locationType === "current") {
      locationData = {
        type: "current",
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        addressLine: coordinates.addressName || "GPS Location",
        city: coordinates.city || "",
        state: coordinates.state || "",
        pincode: coordinates.pincode || "",
        mapLink: `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`
      };
    } else {
      const fullAddress = `${address.addressLine}, ${address.city}, ${address.state}, ${address.pincode}`;
      locationData = {
        type: "manual",
        addressLine: address.addressLine,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
      };
    }

    try {
      if (paymentMethod === "COD") {
        const res = await fetch("/api/orders/create-cod", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: itemsToOrder, address, location: locationData })
        });
        const data = await res.json();

        if (data.success) {
          onSuccess();
        } else {
          setError(data.message || "Failed to create order");
        }
      } else if (paymentMethod === "UPI") {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          setError("Razorpay SDK failed to load. Are you online?");
          setLoading(false);
          return;
        }

        const createOrderRes = await fetch("/api/payment/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount })
        });
        const orderData = await createOrderRes.json();

        if (!orderData.success) {
          setError(orderData.message || "Failed to initiate payment");
          setLoading(false);
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: Math.round(amount * 100),
          currency: "INR",
          name: "Hotel Food Store",
          description: "Order Checkout",
          order_id: orderData.razorpayOrderId,
          handler: async function (response) {
            setLoading(true);
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                items: itemsToOrder,
                address,
                location: locationData
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              onSuccess();
            } else {
              setError(verifyData.message || "Payment verification failed");
              setLoading(false);
            }
          },
          prefill: {
            name: address.fullName,
            contact: address.phone
          },
          theme: {
            color: "#f59e0b"
          }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on("payment.failed", function (response) {
          setError(response.error.description || "Payment failed");
          setLoading(false);
        });

        paymentObject.open();
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-zinc-950 w-full sm:w-[500px] max-h-[90vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col relative animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-500" />
            Complete Your Order
          </h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-8">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* User Details */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Personal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" name="fullName" value={address.fullName} onChange={handleInputChange} placeholder="Name" className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold" />
              <input type="tel" name="phone" value={address.phone} onChange={handleInputChange} placeholder="Phone" className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold" />
            </div>
          </div>

          {/* Delivery Location Options */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Delivery Location</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setLocationType("current"); handleGetCurrentLocation(); }}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${locationType === "current" ? "border-amber-500 bg-amber-50/30 text-amber-600" : "border-zinc-100 dark:border-zinc-800 text-zinc-400"}`}
              >
                <MapPin className="w-6 h-6 mb-2" />
                <span className="text-[10px] font-black uppercase">GPS Location</span>
              </button>
              <button
                onClick={() => setLocationType("manual")}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${locationType === "manual" ? "border-amber-500 bg-amber-50/30 text-amber-600" : "border-zinc-100 dark:border-zinc-800 text-zinc-400"}`}
              >
                <QrCode className="w-6 h-6 mb-2" />
                <span className="text-[10px] font-black uppercase">Manual Address</span>
              </button>
            </div>

            {locationType === "current" && (
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center animate-in fade-in slide-in-from-top-2">
                {fetchingLocation ? (
                  <div className="flex items-center justify-center gap-2 text-zinc-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-widest">Pinpointing...</span>
                  </div>
                ) : coordinates.latitude ? (
                  <div className="space-y-1">
                    <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1">
                      <Check className="w-3 h-3" /> Location Secured
                    </span>
                    <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-tighter">Lat: {coordinates.latitude.toFixed(4)}, Lng: {coordinates.longitude.toFixed(4)}</p>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-zinc-400">Click icon to detect location</span>
                )}
              </div>
            )}

            {locationType === "manual" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                <div className="sm:col-span-2">
                  <input type="text" name="addressLine" value={address.addressLine} onChange={handleInputChange} placeholder="Address Line" className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium" />
                </div>
                <input type="text" name="city" value={address.city} onChange={handleInputChange} placeholder="City" className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium" />
                <input type="text" name="state" value={address.state} onChange={handleInputChange} placeholder="State" className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium" />
                <input type="text" name="pincode" value={address.pincode} onChange={handleInputChange} placeholder="Pincode" className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium sm:col-span-2" />
              </div>
            )}
          </div>

          <hr className="border-zinc-100 dark:border-zinc-800" />

          {/* Payment Method */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setPaymentMethod("COD")} className={`relative p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === "COD" ? "border-zinc-950 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-400"}`}>
                <Banknote className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase">COD</span>
              </button>
              <button onClick={() => setPaymentMethod("UPI")} className={`relative p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === "UPI" ? "border-amber-500 bg-amber-500 text-white" : "border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-400"}`}>
                <QrCode className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase">UPI</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <button
            onClick={handlePayment}
            disabled={!isAddressValid || loading}
            className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-xl bg-amber-500 hover:bg-amber-600 text-white active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                {paymentMethod === "COD" ? `Confirm Order • Rs. ${amount}` : `Pay Rs. ${amount} Online`}
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
