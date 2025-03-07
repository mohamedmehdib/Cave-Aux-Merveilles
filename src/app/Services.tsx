"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { loadTranslations } from "../utils/loadTranslations";

export default function Services() {
  const [translations, setTranslations] = useState<{
    services: {
      best_services: string;
      heading: string;
      description: string;
      founder_name: string;
      founder_title: string;
      founder_description: string;
      founder_experience: string;
      custom_pool_design: string;
      custom_pool_description: string;
      pool_maintenance: string;
      pool_maintenance_description: string;
      wholesale_sales: string;
      wholesale_sales_description: string;
      heating_cooling: string;
      heating_cooling_description: string;
      learn_more: string;
    };
  }>({
    services: {
      best_services: "Nos meilleurs services",
      heading: "Nos meilleurs services de piscine pour vous !",
      description:
        "N°1 en Tunisie pour les piscines en béton, 20 ans d'expérience à votre service. Découvrez toutes les possibilités qui s'offrent à vous pour que votre projet de construction, de rénovation ou d'aménagement (équipement, décoration, piscine connectée) réponde parfaitement à vos exigences.",
      founder_name: "Bilel Abassi",
      founder_title: "Fondateur",
      founder_description:
        "Pisciniste de père en fils, expert en construction et équipement de piscines publiques et privées.",
      founder_experience:
        "Depuis plus de 20 ans, Bilel Abassi accompagne l'entreprise familiale pour la réalisation, la rénovation et l'équipement de piscines et spas de luxe.",
      custom_pool_design: "Conception de piscine sur mesure",
      custom_pool_description:
        "Contactez-nous pour un devis gratuit de construction ou de rénovation de piscine.",
      pool_maintenance: "Entretien Piscine & SAV",
      pool_maintenance_description:
        "Confiez l'entretien annuel de votre piscine à un professionnel pour garantir son bon fonctionnement.",
      wholesale_sales: "Vente en gros matériel Piscines & Mosaïque",
      wholesale_sales_description:
        "Confiez vos projets à un fournisseur spécialisé pour du matériel de piscine et mosaïque de qualité.",
      heating_cooling: "Chauffage & Climatisation",
      heating_cooling_description:
        "Confiez l'installation et l'entretien à un professionnel pour un confort optimal.",
      learn_more: "En savoir plus",
    },
  });

  useEffect(() => {
    // Detect the user's browser language
    const userLanguage = navigator.language || "en";
    const loadedTranslations = loadTranslations(userLanguage);
    setTranslations(loadedTranslations);
  }, []);


  return (
    <section id='services' className='flex flex-col lg:flex-row p-6 sm:p-10 lg:p-20 gap-8 lg:gap-12'>
      <div className='w-full lg:w-1/2 space-y-6'>
        <div className='flex items-center space-x-3'>
          <span className='text-[#305eb8] text-xl font-semibold'>
            {translations.services.best_services}
          </span>
          <hr className='bg-[#305eb8] h-1 w-14' />
        </div>
        <div>
          <h1 className='py-5 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight'>
            {translations.services.heading}
          </h1>
          <p className='text-zinc-500 text-sm sm:text-base'>
            {translations.services.description}
          </p>
        </div>
        <div className='flex items-center space-x-5'>
          <Image
            src="/ceo.jpeg"
            alt='Bilel Abassi, Fondateur de Fildair Frères'
            width={100}
            height={100}
            className='rounded-full w-14 sm:w-16 border-2 border-indigo-500'
          />
          <div className='flex flex-col'>
            <span className='font-medium text-lg'>
              {translations.services.founder_name}
            </span>
            <span className='text-zinc-600 text-sm sm:text-base'>
              {translations.services.founder_title}
            </span>
          </div>
          <Image
            src="/signature.jpeg"
            alt='Signature de Bilel Abassi'
            width={100}
            height={100}
            className='pl-4 w-16 sm:w-24 transition-transform duration-300'
          />
        </div>
        <div className='text-zinc-600 font-medium py-4 text-sm sm:text-base'>
          <p>{translations.services.founder_description}</p>
          <p className='mt-2'>{translations.services.founder_experience}</p>
        </div>
      </div>

      <div className='w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
        {[
          { icon: "/one.svg", title: translations.services.custom_pool_design, description: translations.services.custom_pool_description, url: "Conception-de-piscine-sur-mesure" },
          { icon: "/cleaning.svg", title: translations.services.pool_maintenance, description: translations.services.pool_maintenance_description, url: "Entretien-Piscine-&-SAV" },
          { icon: "/cart.svg", title: translations.services.wholesale_sales, description: translations.services.wholesale_sales_description, url: "Vente-en-gros-materiel-Piscines-&-Mosaique" },
          { icon: "/heating.svg", title: translations.services.heating_cooling, description: translations.services.heating_cooling_description, url: "Chauffage-&-climatisation" },
        ].map((service, index) => (
          <article
            key={index}
            className='flex flex-col justify-between shadow-xl text-center rounded-md px-4 py-6 sm:py-8 space-y-3 sm:space-y-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl'
          >
            <div className='rounded-full bg-[#274e9d] w-fit mx-auto p-3 sm:p-4 transition-transform duration-300 hover:rotate-12'>
              <Image
                src={service.icon}
                alt={service.title}
                width={60}
                height={60}
                className='w-10 h-10 sm:w-12 sm:h-12'
              />
            </div>
            <h2 className='text-xl sm:text-2xl font-semibold'>{service.title}</h2>
            <p className='text-zinc-500 text-sm sm:text-base'>{service.description}</p>
            <Link
              href={`/${service.url}`}
              className='inline-block px-4 py-2 sm:px-5 sm:py-3 rounded-md bg-[#274e9d] text-white text-sm sm:text-base border-2 border-[#274e9d] hover:bg-white hover:text-[#274e9d] transition-colors duration-300'
              aria-label={`En savoir plus sur ${service.title}`}
            >
              {translations.services.learn_more}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}