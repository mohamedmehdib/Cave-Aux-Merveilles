"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { supabase } from "@/lib/supabase";
import { loadTranslations } from "../utils/loadTranslations";

interface Logo {
  id: number;
  src: string;
  alt: string;
  type: "client" | "partenaire";
}

const Clients: React.FC = () => {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [translations, setTranslations] = useState<{
    clients: {
      our_clients: string;
      our_partners: string;
    };
  }>({
    clients: {
      our_clients: "Nos Clients",
      our_partners: "Nos Partenaires",
    },
  });

  useEffect(() => {
    // Detect the user's browser language
    const userLanguage = navigator.language || "en";
    const loadedTranslations = loadTranslations(userLanguage);
    setTranslations(loadedTranslations);

    // Fetch logos from Supabase
    const fetchLogos = async () => {
      try {
        const { data, error } = await supabase.from("logos").select("*");
        if (error) throw error;
        setLogos(data || []);
      } catch (error) {
        console.error("Error fetching logos:", error);
      }
    };

    fetchLogos();
  }, []);

  const clientLogos = logos.filter((logo) => logo.type === "client");
  const partenaireLogos = logos.filter((logo) => logo.type === "partenaire");

  return (
    <div>
      {/* Clients Section */}
      <div className="flex items-center justify-center py-5 space-x-4">
        <hr className="bg-[#305eb8] h-1 w-10 sm:w-14" />
        <span className="text-[#305eb8] text-2xl sm:text-4xl font-semibold">
          {translations.clients.our_clients}
        </span>
        <hr className="bg-[#305eb8] h-1 w-10 sm:w-14" />
      </div>
      <div className="">
        <Marquee speed={50} gradient={false} direction="left" pauseOnHover loop={0}>
          {clientLogos.map((logo) => (
            <div key={logo.id} className="flex-shrink-0 px-5">
              <Image
                src={logo.src}
                alt={logo.alt}
                className="h-32 w-32 rounded-lg border-2 border-black"
                width={500}
                height={500}
              />
            </div>
          ))}
        </Marquee>
      </div>

      {/* Partners Section */}
      <div className="flex items-center justify-center py-5 space-x-4 mt-8">
        <hr className="bg-[#305eb8] h-1 w-10 sm:w-14" />
        <span className="text-[#305eb8] text-2xl sm:text-4xl font-semibold">
          {translations.clients.our_partners}
        </span>
        <hr className="bg-[#305eb8] h-1 w-10 sm:w-14" />
      </div>
      <div className="">
        <Marquee speed={50} gradient={false} direction="right" pauseOnHover loop={0}>
          {[...partenaireLogos, ...partenaireLogos, ...partenaireLogos].map((logo, index) => (
            <div key={index} className="flex-shrink-0 px-5">
              <Image
                src={logo.src}
                alt={logo.alt}
                className="h-32 w-32 rounded-lg border-2 border-black"
                width={500}
                height={500}
              />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default Clients;