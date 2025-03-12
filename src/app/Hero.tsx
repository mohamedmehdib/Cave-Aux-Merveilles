import Image from 'next/image';
import React from 'react';

export default function Hero() {
  return (
    
      <div className='md:pt-48 pt-20'>
        <Image
          src="/hero.jpg"
          alt='Hero ( By freepik )'
          height={50000}
          width={50000}
          className="mx-auto"
          unoptimized
        />
      </div>
   
  );
}