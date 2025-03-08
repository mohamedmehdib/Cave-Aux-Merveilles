"use client";
import Hero from "./Hero";
import Navbar from "./Navbar";

export default function Home() {

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      <Hero />
    </div>
  );
}