"use client";
import Footer from "./Footer";
import Hero from "./Hero";
import Navbar from "./Navbar";
import PopUp from "./PopUp";

export default function Home() {

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      <Hero />
      <Footer />
      <PopUp />
    </div>
  );
}