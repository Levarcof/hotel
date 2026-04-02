"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, ShoppingCart, Home,
  Utensils, ClipboardList, Info,
  User, LogOut, ChevronRight
} from "lucide-react";

// --- Sub-Components ---

const NavItem = ({ href, name, isActive, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className={`relative text-sm font-medium transition-colors px-1 py-2 group ${isActive
      ? "text-amber-600 dark:text-amber-500"
      : "text-zinc-600 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-500"
      }`}
  >
    {name}
    <span className={`absolute bottom-0 left-0 h-0.5 bg-amber-500 transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
      }`} />
  </Link>
);

const CartIcon = ({ cartCount }) => (
  <Link
    href="/cart"
    className="relative p-2 rounded-full transition-colors text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-amber-600 active:scale-95"
  >
    <ShoppingCart className="w-6 h-6" />
    {cartCount > 0 && (
      <span className="absolute top-0 right-0 translate-x-1 -translate-y-1 flex items-center justify-center min-w-[20px] h-[20px] px-1 bg-amber-500 text-white text-[10px] font-black rounded-full shadow-sm animate-in zoom-in">
        {cartCount > 99 ? "99+" : cartCount}
      </span>
    )}
  </Link>
);

const MobileMenuButton = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    className="p-3 -mr-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors active:scale-95 md:hidden"
    aria-label="Toggle menu"
  >
    {isOpen ? <X className="w-6 h-6 sm:w-7 sm:h-7" /> : <Menu className="w-6 h-6 sm:w-7 sm:h-7" />}
  </button>
);

const MobileSidebar = ({ isOpen, onClose, navLinks, token, isAdmin, handleLogout, cartCount, pathname }) => (
  <>
    {/* Overlay */}
    <div
      className={`fixed inset-0 z-[100] bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 pointer-events-none"
        }`}
      onClick={onClose}
    />

    {/* Sidebar Drawer */}
    <div
      className={`fixed top-0 left-0 bottom-0 z-[110] w-[85vw] max-w-[340px] bg-white dark:bg-zinc-950 shadow-[20px_0_40px_rgba(0,0,0,0.1)] transform transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] md:hidden flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* Top Profile / Greeting Area (Premium App Style) */}
      <div className="flex flex-col px-6 pt-10 pb-8 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800/50">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden border border-zinc-100 dark:border-zinc-800">
              <Image
                src="/log.png"
                alt="Logo"
                width={32}
                height={32}
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="flex flex-col -space-y-1">
              <h1 className="text-xl font-black text-zinc-900 dark:text-white uppercase font-serif tracking-tighter">Luxe</h1>
            </div>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors bg-white dark:bg-zinc-800 rounded-full shadow-sm active:scale-95 border border-zinc-100 dark:border-zinc-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6">
          {token ? (
            <div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Welcome back!</h2>
              <Link href="/profile" onClick={onClose} className="text-sm font-bold text-amber-600 hover:text-amber-700 mt-1.5 inline-block">View Profile</Link>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">Gourmet Food, <br />Delivered Fast.</h2>
              <Link href="/login" onClick={onClose} className="mt-5 inline-flex items-center justify-center px-8 py-3 bg-amber-500 text-white rounded-full font-bold text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition-all">
                Sign In / Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <nav className="flex flex-col">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-5 px-6 py-4 transition-colors ${isActive
                  ? "bg-amber-50/50 dark:bg-amber-900/10 border-r-4 border-amber-500"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-900/50 border-r-4 border-transparent"
                  }`}
              >
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? "text-amber-600 dark:text-amber-500" : "text-zinc-400 dark:text-zinc-500"}`} />
                <span className={`text-base sm:text-lg transition-colors ${isActive ? "font-black text-amber-600 dark:text-amber-500" : "font-medium text-zinc-700 dark:text-zinc-200"}`}>
                  {link.name}
                </span>
              </Link>
            );
          })}

          <div className="my-2 border-t border-zinc-100 dark:border-zinc-800/50 mx-6" />

          {/* Action Links */}
          <Link
            href="/cart"
            onClick={onClose}
            className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
          >
            <div className="flex items-center gap-5">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400 dark:text-zinc-500" />
              <span className="text-base sm:text-lg font-medium text-zinc-700 dark:text-zinc-200">Cart</span>
            </div>
            {cartCount > 0 && (
              <span className="bg-amber-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-sm">
                {cartCount} Items
              </span>
            )}
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center gap-5 px-6 py-4 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors"
            >
              <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
              <span className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">Admin Dashboard</span>
            </Link>
          )}
        </nav>
      </div>

      {/* Footer Footer */}
      {token && (
        <div className="p-6">
          <button
            onClick={() => {
              onClose();
              handleLogout();
            }}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 rounded-2xl font-bold text-base transition-colors"
          >
            <LogOut className="w-5 h-5 opacity-70" /> Sign Out
          </button>
        </div>
      )}
    </div>
  </>
);

// --- Main Navbar Component ---

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const pathname = usePathname();

  const fetchCartCount = async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.cartItems) {
          const total = data.cartItems.reduce((acc, item) => acc + item.quantity, 0);
          setCartCount(total);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkAuth = () => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);

      if (storedToken) {
        try {
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          setIsAdmin(payload.role === "admin");
        } catch (e) {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    return () => window.removeEventListener("auth-change", checkAuth);
  }, []);

  useEffect(() => {
    if (token) fetchCartCount();
  }, [token]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("token");
      checkAuth();
      window.location.href = "/";
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Menu", href: "/food", icon: Utensils },
    { name: "Orders", href: "/orders", icon: ClipboardList },
    { name: "About", href: "/about", icon: Info },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full h-[64px] md:h-[72px] bg-white dark:bg-zinc-950 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-b border-zinc-100 dark:border-zinc-800 backdrop-blur-md flex items-center transition-all duration-300">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between w-full">

            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-3.5 active:scale-95 transition-transform group">
                <div className="relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-zinc-900 dark:bg-white rounded-xl shadow-xl group-hover:shadow-amber-500/20 group-hover:rotate-6 transition-all duration-300 overflow-hidden border border-zinc-200/5 dark:border-zinc-800">
                  {/* Visual Accent */}
                  <div className="absolute top-0 right-0 w-4 h-4 bg-amber-500/20 -mr-2 -mt-2 rounded-full" />
                  <Image
                    src="/log.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="w-7 h-7 object-contain brightness-0 invert dark:invert-0"
                    priority
                  />
                </div>
                <div className="flex flex-col -space-y-1.5">
                  <span className="text-xl md:text-2xl font-black tracking-tight text-zinc-950 dark:text-white uppercase font-serif">
                    Luxe<span className="text-amber-500 font-sans">.</span>
                  </span>
                  <span className="text-[8px] md:text-[9px] font-black tracking-[0.4em] text-zinc-400 dark:text-zinc-500 uppercase">
                    Gourmet Kitchen
                  </span>
                </div>
              </Link>
            </div>

            {/* Nav Links - Center (Desktop) */}
            <div className="hidden md:flex flex-1 items-center justify-center space-x-8 lg:space-x-12">
              {navLinks.map((link) => (
                <NavItem
                  key={link.name}
                  href={link.href}
                  name={link.name}
                  isActive={link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href)}
                />
              ))}
              {isAdmin && (
                <NavItem
                  href="/admin"
                  name="Admin"
                  isActive={pathname?.startsWith("/admin")}
                />
              )}
            </div>

            {/* Action Area - Right (Desktop) */}
            <div className="hidden md:flex items-center space-x-5 lg:space-x-6">
              <CartIcon cartCount={cartCount} />

              <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />

              {token ? (
                <div className="flex items-center space-x-4">
                  <Link href="/profile" className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-200 hover:text-amber-600 transition-colors">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 text-sm font-bold text-zinc-500 hover:text-red-500 bg-zinc-50 dark:bg-zinc-900 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-6 py-2.5 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-full shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Actions - Right */}
            <div className="flex md:hidden items-center gap-4">
              <CartIcon cartCount={cartCount} />
              <MobileMenuButton isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
            </div>

          </div>
        </div>
      </nav>

      {/* Render Mobile Sidebar OUTSIDE the sticky nav to prevent stacking context/clipping issues on iOS/Mobile */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navLinks={navLinks}
        token={token}
        isAdmin={isAdmin}
        handleLogout={handleLogout}
        cartCount={cartCount}
        pathname={pathname}
      />
    </>
  );
}
