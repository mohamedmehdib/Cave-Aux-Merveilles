"use client";
import { useState , useEffect } from "react";
import Footer from "../Footer";
import Informations from "../Informations";
import Navbar from "../Navbar";
import LoadingWebsite from "../LoadingWebsite";
import Store from "../Store";

export default function Home() {
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-primary">
      <LoadingWebsite visible={showSpinner} />

      <div className={`transition-opacity duration-500 ${!showSpinner ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar />
        <Store />
        <Informations />
        <Footer />
      </div>
    </div>
  );
}