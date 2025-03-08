import Image from 'next/image'
import React from 'react'

export default function Hero() {
  return (
    <div className='h-[200vh]'>
        <div className='pt-52'>
          <Image src="/test.jpg" alt='test' fill/>
        </div>
    </div>
  )
}
