import React, { useEffect, useState } from "react";
import Hero from "./components/home/Hero";
import Motivation from "./components/home/Motivation";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import Reviews from "./components/home/Reviews";
import { AboutUs } from "./components/home/AboutUs";
import { SecuritySection } from "./components/home/SecuritySection";
import { FaqSection } from "./components/home/FaqSection";
import { LegalModal } from "./components/home/LegalModal";
import { ScrollToTopBtn } from "./components/home/ScrollToTopBtn";

export const Index = () => {
  const [startAnimation, setStartAnimation] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState("terms");

  const handleOpenLegal = (tab = "terms") => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  useEffect(() => {
    const handleScroll = (_event) => {
      if (window.scrollY > window.innerHeight && !startAnimation) {
        setStartAnimation(true);
      }

      if (window.scrollY < window.innerHeight && startAnimation) {
        setStartAnimation(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [startAnimation]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 font-sans selection:bg-teal-500 selection:text-white">
      <Navbar onOpenLegal={handleOpenLegal} />
      <Hero onOpenLegal={handleOpenLegal} />
      <AboutUs />
      <SecuritySection />
      <Motivation />
      <Reviews />
      <FaqSection onOpenLegal={handleOpenLegal} />
      <Footer onOpenLegal={handleOpenLegal} />
      <ScrollToTopBtn startAnimation={startAnimation} />
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        initialTab={legalTab}
      />
    </div>
  );
};
