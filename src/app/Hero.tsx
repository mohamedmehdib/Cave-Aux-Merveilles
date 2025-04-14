import Image from 'next/image';
import React from 'react';
import { Rouge_Script } from "next/font/google";
const font = Rouge_Script({ subsets: ["latin"], weight: "400" });

export default function Hero() {
  return (
    <div className='relative md:pt-48 pt-20 h-[60vh] md:h-[80vh] w-full'>
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt='Hero (By freepik)'
          fill
          priority
          className="object-cover blur-sm"
          quality={80}
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      <div className="relative h-full flex items-center justify-center px-4">
        <p className={`${font.className} text-3xl md:text-5xl lg:text-6xl text-center text-white max-w-4xl px-4 leading-snug md:leading-normal`}>
          Les moments les plus précieux de la vie sont ceux qui touchent nos âmes, parfumés de douceur et de partage.
        </p>
      </div>
    </div>
  );
}