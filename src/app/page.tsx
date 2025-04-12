"use client";
import { useState , useEffect } from "react";
import dynamic from "next/dynamic";
import Footer from "./Footer";
import Hero from "./Hero";
import Informations from "./Informations";
import Navbar from "./Navbar";
import Welcome from "./Welcome";
import Testimonials from "./Testimonials";
import LoadingWebsite from "./LoadingWebsite";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
});

export default function Home() {
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-primary">
      <LoadingWebsite visible={showSpinner} />

      <div className={`transition-opacity duration-500 ${!showSpinner ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar />
        <Hero />
        <Welcome />
        <Map />
        <Testimonials />
        <Informations />
        <Footer />
      </div>
    </div>
  );
}