import Image from 'next/image';
import React from 'react';
import { Rouge_Script } from "next/font/google";
const font = Rouge_Script({ subsets: ["latin"], weight: "400" });


export default function Hero() {
  return (
    <div className='md:pt-48 pt-20 md:h-[80vh] relative'>
      <div className="relative w-full h-full flex justify-center items-center">
        <Image
          src="/hero.jpg"
          alt='Hero ( By freepik )'
          layout="fill"
          objectFit="cover"
          className="mx-auto blur-sm"
          unoptimized
        />
        <p className={`absolute ${font.className} text-6xl text-center w-2/3 mx-auto bg-bl`}>
          Les moments les plus précieux de la vie sont ceux qui touchent nos âmes, parfumés de douceur et de partage.
        </p>
      </div>
    </div>
  );
}