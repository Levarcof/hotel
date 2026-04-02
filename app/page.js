import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FoodShowcaseSection from "@/components/FoodShowcaseSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black font-sans">
      <Navbar />
      <HeroSection />
      <FoodShowcaseSection />
    </main>
  );
}
