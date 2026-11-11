import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import DashboardPreview from "./DashboardPreview";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Pricing from "./Pricing";
import Contact from "./Contact";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <DashboardPreview />
        <Features />
        <HowItWorks />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

