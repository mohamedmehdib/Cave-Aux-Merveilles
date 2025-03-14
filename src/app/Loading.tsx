import React from 'react'

export default function Loading() {
  return (
    <div className='bg-primary text-accent h-screen duration-500 flex justify-center items-center'>
        <link
          rel="stylesheet"
          href="https://unicons.iconscout.com/release/v4.0.8/css/line.css"
        />
        <div className='text-5xl animate-spin w-fit'>
            <i className="uil uil-spin"></i>
        </div>
    </div>
  )
}
