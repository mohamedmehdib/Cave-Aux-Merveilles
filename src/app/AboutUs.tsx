"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { loadTranslations } from "../utils/loadTranslations";

interface StatCardProps {
  number: number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div ref={ref} className='text-center'>
      <h3 className='text-[#274e9d] text-5xl font-semibold'>
        {inView ? <CountUp end={number} duration={2.5} /> : 0}
      </h3>
      <p className='text-zinc-500 text-lg font-medium'>{label}</p>
    </div>
  );
};

const AboutUs: React.FC = () => {
  const [translations, setTranslations] = useState<{
    about: {
      about_us: string;
      heading: string;
      description: string;
      completed_projects: string;
      team_members: string;
      satisfied_clients: string;
    };
  }>({
    about: {
      about_us: "À propos de nous",
      heading: "Nager en toute sérénité avec Piscines Fildair Frères Tunisie",
      description:
        "Fildair Frères vous offre des services complets pour vos projets de piscine : conception sur mesure, rénovation, entretien annuel, vente en gros d'équipements et de mosaïques, ainsi que l'installation de chauffage et de climatisation. Avec plus de 20 ans d'expérience, nous vous garantissons des solutions personnalisées et de qualité pour répondre à tous vos besoins. Confiez-nous votre projet et obtenez un devis gratuit !",
      completed_projects: "Projets terminés",
      team_members: "Membres de l'équipe",
      satisfied_clients: "Clients satisfaits",
    },
  });

  useEffect(() => {
    // Detect the user's browser language
    const userLanguage = navigator.language || "en";
    const loadedTranslations = loadTranslations(userLanguage);
    setTranslations(loadedTranslations);
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": translations.about.about_us,
    "description": translations.about.description,
    "url": "https://piscinesfildairfrerestunisie.com/a-propos",
    "image": "https://piscinesfildairfrerestunisie.com/about.jpeg",
    "mainEntity": {
      "@type": "Organization",
      "name": "Fildair Frères",
      "description": "Avec plus de 20 ans d'expérience, Fildair Frères vous garantit des solutions personnalisées et de qualité pour répondre à tous vos besoins en matière de piscines.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "km 13 av Fatouma Bourguiba",
        "addressLocality": "La Soukra",
        "postalCode": "2036",
        "addressCountry": "Tunisia",
      },
      "telephone": "+216 71 865 319",
      "email": "fildairfreres@gmail.com",
      "founder": {
        "@type": "Person",
        "name": "Bilel Abassi",
      },
      "foundingDate": "2003",
      "numberOfEmployees": 30,
      "awards": "N°1 en Tunisie pour les piscines en béton",
    },
  };

  return (
    <section className='flex flex-col lg:flex-row'>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <div className='w-full lg:w-1/2 flex items-center justify-center px-10'>
        <Image
          src="/bdl.jpeg"
          alt={translations.about.about_us}
          width={5000}
          height={5000}
          className='rounded-xl'
          priority
        />
      </div>

      <div className='w-full lg:w-1/2 space-y-6 p-10'>
        <div className='flex items-center space-x-3'>
          <span className='text-[#305eb8] text-xl font-semibold'>
            {translations.about.about_us}
          </span>
          <hr className='bg-[#305eb8] h-1 w-14' />
        </div>

        <div>
          <h1 className='py-5 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight'>
            {translations.about.heading}
          </h1>
          <p className='text-zinc-500 text-sm sm:text-base'>
            {translations.about.description}
          </p>
        </div>

        {/* Replaced grid with flex */}
        <div className='flex flex-wrap justify-center gap-5'>
          <StatCard number={500} label={translations.about.completed_projects} />
          <StatCard number={30} label={translations.about.team_members} />
          <StatCard number={1000} label={translations.about.satisfied_clients} />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;