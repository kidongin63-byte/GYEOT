// app/page.tsx
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/home");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-12 h-[100dvh] py-8 px-6 animate-in fade-in duration-700 overflow-hidden">
      {/* Top Section: Logo + Content */}
      <div className="flex flex-col items-center space-y-2">
        {/* Logo Section */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          {/* Soft Glow Background */}
          <div className="absolute inset-0 bg-brand-purple/5 blur-3xl rounded-full" />
          <Image
            src="/gyeot-logo.svg"
            alt="GYEOT Service Logo"
            width={150}
            height={150}
            className="relative object-contain drop-shadow-sm"
          />
        </div>

        {/* Main Content Section */}
        <div className="flex flex-col items-center space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-brand-purple font-nanum-myeongjo">
            곁
          </h1>
          <p className="text-sm font-medium tracking-[0.2em] text-brand-purple/60">
            G Y E O T
          </p>
          <p className="text-lg italic font-serif text-slate-500 mt-1 font-gowun-batang">
            Warmth By Your Side
          </p>

          {/* Pagination Dots */}
          <div className="flex space-x-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-purple/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-purple/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-purple/20" />
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="w-full max-w-[260px] flex flex-col items-center space-y-3">
        <Button
          onClick={handleStart}
          className="w-full h-12 text-lg font-semibold rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90 transition-all shadow-lg shadow-brand-purple/20 flex items-center justify-center gap-2"
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </Button>

        <p className="text-[9px] tracking-[0.2em] text-slate-400 font-medium whitespace-nowrap">
          ALWAYS BY YOUR SIDE
        </p>
      </div>
    </div>



  );
}