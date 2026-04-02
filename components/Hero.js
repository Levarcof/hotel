"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 transform scale-105 animate-slow-zoom"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      />
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10" />

      {/* Content */}
      <div className="relative z-20 text-left px-8 sm:px-14 lg:px-20 flex flex-col items-start justify-center w-full animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-white font-bold tracking-tight mb-6 drop-shadow-xl">
          Luxury Hotel<br/> Experience
        </h1>
        <p className="mt-4 text-base sm:text-xl md:text-2xl text-gray-200 max-w-2xl font-light leading-relaxed mb-10 drop-shadow-md">
          Immerse yourself in unparalleled comfort and premium stays. 
          Discover a world where every detail is crafted for your perfect getaway.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto mt-4">
          <Link
            href="/room"
            className="px-8 py-4 text-base sm:text-lg font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(217,119,6,0.3)] whitespace-nowrap text-center"
          >
            Book Room
          </Link>
          
          <Link
            href="/food"
            className="px-8 py-4 text-base sm:text-lg font-medium text-white bg-transparent border-2 border-white/80 hover:bg-white hover:text-black hover:border-white rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm whitespace-nowrap text-center"
          >
            Explore Food Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
