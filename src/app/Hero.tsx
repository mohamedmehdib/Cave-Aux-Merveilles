"use client";
import { useState, useEffect } from "react";
import Image from "next/image";


export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div id="accueil" className="md:h-[80vh] flex md:flex-row flex-col-reverse items-center md:justify-around justify-center bg-[#274e9d] relative overflow-hidden py-16 md:py-10">
      <Image priority src="/hero.jpeg" alt="Hero" width={1000} height={1000} style={{ transform: `translateY(${scrollY * 3}px)` }}/>
    </div>
  );
}
