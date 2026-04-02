import React from "react";
import Image from "next/image";
import { User, Phone, Mail, ShieldAlert, MapPin, Navigation } from "lucide-react";

export default function CustomerCard({ user, address, location }) {
  if (!user && !address) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 p-6 rounded-[2rem] flex items-center gap-4">
        <ShieldAlert className="w-8 h-8 text-red-500" />
        <div>
          <h3 className="text-lg font-black text-red-700 dark:text-red-400">Customer Data Missing</h3>
          <p className="text-sm font-medium text-red-600 dark:text-red-500 mt-1">This order does not have full customer details.</p>
        </div>
      </div>
    );
  }
  const name = address?.fullName || user?.name || "Guest User";
  const userPhone = address?.phone || user?.phone;

  const handleFollowLocation = () => {
    if (!location || !location.mapLink) return;

    if (location.type === "current" && location.latitude && location.longitude) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const adminLat = pos.coords.latitude;
          const adminLng = pos.coords.longitude;
          const userLat = location.latitude;
          const userLng = location.longitude;
          const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${adminLat},${adminLng}&destination=${userLat},${userLng}`;
          window.open(directionsUrl, "_blank");
        }, (err) => {
          console.error("Admin geolocation failed", err);
          window.open(location.mapLink, "_blank");
        });
      } else {
        window.open(location.mapLink, "_blank");
      }
    } else {
      window.open(location.mapLink, "_blank");
    }
  };

  return (
    <div className="bg-white dark:bg-[#1C1C1E] border border-zinc-100 dark:border-zinc-800 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg md:text-xl font-black tracking-tight mb-6 md:mb-8 pb-3 md:pb-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2 text-zinc-900 dark:text-white font-serif">
        <User className="w-5 h-5 text-amber-500" /> Customer Information
      </h3>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

        {/* Profile Image Column */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-4 border-white dark:border-[#1C1C1E] shadow-xl flex-shrink-0 z-10">
          {user?.profileImage ? (
            <Image src={user.profileImage} alt="Customer Avatar" fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-2xl md:text-4xl font-black text-zinc-300 dark:text-zinc-700 uppercase">
              {name.substring(0, 2)}
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="flex-1 space-y-4 md:space-y-5 text-center md:text-left w-full">
          <div>
            <h4 className="text-xl sm:text-2xl md:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{name}</h4>
            <p className="text-[10px] md:text-sm font-bold text-amber-600 mt-1 uppercase tracking-widest">{user?.role || 'Guest'}</p>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">

            {userPhone && (
              <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                   <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Mobile</p>
                  <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">{userPhone}</p>
                </div>
              </div>
            )}

            {user?.email && (
              <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-500">
                   <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Email</p>
                  <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white truncate max-w-[140px] sm:max-w-[200px]">{user.email}</p>
                </div>
              </div>
            )}

          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-left space-y-4">
            <div className="flex items-start gap-3 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 rounded-xl sm:rounded-2xl relative group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1 min-w-0 pr-24">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-0.5">Delivery Address</p>
                {location?.type === "current" ? (
                  <>
                    <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white leading-tight mb-0.5">
                      {location.addressLine || "GPS Verified Location"}
                    </p>
                    <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400">
                      {location.city}{location.city && location.state ? "" : ""}{location.state}{location.pincode ? ` - ${location.pincode}` : ""}
                    </p>
                    <p className="text-[9px] text-zinc-400 mt-1 font-mono">
                      {location.latitude?.toFixed(6)}, {location.longitude?.toFixed(6)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">{location?.addressLine || address?.addressLine}</p>
                    <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400">
                      {(location?.city || address?.city)}, {(location?.state || address?.state)} - {(location?.pincode || address?.pincode)}
                    </p>
                  </>
                )}
              </div>

              <button
                onClick={handleFollowLocation}
                disabled={!location}
                className={`absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all enabled:hover:bg-amber-500 dark:enabled:hover:bg-amber-500 enabled:hover:text-white ${!location ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                <Navigation className="w-3 h-3" />
                <p className="hidden md:block">Follow</p>
              </button>
            </div>

            {location && location.type === "current" && (
              <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/10 px-4 py-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">GPS Verified • Active Precision</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
