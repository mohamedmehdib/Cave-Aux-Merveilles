import Image from 'next/image';
import React from 'react';

export default function Hero() {
  return (
    <div className='md:pt-48 pt-20 md:h-[80vh] relative'>
      <div className="relative w-full h-full flex justify-center items-center">
        <Image
          src="/hero.jpg"
          alt='Hero ( By freepik )'
          layout="fill"
          objectFit="cover"
          className="mx-auto"
          unoptimized
        />
        <p className='absolute'></p>
      </div>
    </div>
  );
}