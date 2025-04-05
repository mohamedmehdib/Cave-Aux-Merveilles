"use client";

import { useEffect, useState } from "react";

export default function LoadingWebsite({ visible }: { visible: boolean }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return (
    <div className={`
      fixed inset-0 h-screen w-screen flex items-center justify-center bg-primary z-50
      transition-opacity duration-500 ease-in-out
      ${isMounted && visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `}>
      <i className="uil uil-spin animate-spin text-accent text-5xl"></i>
    </div>
  );
}