"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper as SwiperType } from "swiper/types";
import { loadTranslations } from "../utils/loadTranslations";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  stars: number;
  feedback: string;
}

export default function Testimonials(): React.ReactElement {
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const [translations, setTranslations] = useState<{
    testimonials: {
      heading: string;
      testimonials: Testimonial[];
    };
  }>({
    testimonials: {
      heading: "Avis Clients",
      testimonials: [
        {
          id: 1,
          name: "Karim Ben Fradj",
          role: "Directeur d'hôtel",
          stars: 5,
          feedback:
            "Du début à la fin du projet, Fildair Frères a su répondre à toutes mes attentes. Ils m'ont guidé dans le choix du design et des équipements, et le résultat est au-delà de mes espérances. Service client au top, je recommande vivement !",
        },
        {
          id: 2,
          name: "Amin Trabelsi",
          role: "Professeur",
          stars: 4,
          feedback:
            "J’avais peur que la construction d’une piscine prenne des mois, mais avec Fildair Frères, tout a été fait dans les délais annoncés et avec un grand souci du détail. Leur équipe est sérieuse et efficace. Je profite maintenant d’une magnifique piscine chez moi. Merci encore !",
        },
        {
          id: 3,
          name: "Chokri Mansour",
          role: "Investisseur immobilier",
          stars: 5,
          feedback:
            "J’ai fait appel à Fildair Frères pour la construction de ma piscine, et je suis ravi du résultat ! L’équipe a été très professionnelle, respectant les délais et apportant des conseils précieux. La qualité des matériaux et la finition sont irréprochables. Merci pour ce travail exceptionnel !",
        },
        {
          id: 4,
          name: "Amina Chaouech",
          role: "Femme d’affaire",
          stars: 5,
          feedback:
            "Non seulement Fildair Frères a réalisé une superbe piscine pour nous, mais leur service après-vente est tout aussi remarquable. Ils restent disponibles pour l’entretien et répondent rapidement à toutes nos questions. Une entreprise de confiance que je recommande sans hésitation !",
        },
      ],
    },
  });

  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const userLanguage = navigator.language || "fr";
    const loadedTranslations = loadTranslations(userLanguage);
    setTranslations(loadedTranslations);
  }, []);

  useEffect(() => {
    if (swiperRef.current) {
      const updateMaxHeight = () => {
        const slides = swiperRef.current?.el?.querySelectorAll(".swiper-slide");
        let tallestHeight = 0;
        slides?.forEach((slide: Element) => {
          tallestHeight = Math.max(tallestHeight, (slide as HTMLElement).offsetHeight);
        });
        setMaxHeight(tallestHeight);
      };

      updateMaxHeight();
      window.addEventListener("resize", updateMaxHeight);
      return () => window.removeEventListener("resize", updateMaxHeight);
    }
  }, [translations.testimonials.testimonials]);

  return (
    <div className="pt-10 sm:pt-20">
      <link
        rel="stylesheet"
        href="https://unicons.iconscout.com/release/v4.0.8/css/line.css"
      />
      <div className="flex items-center justify-center py-5 space-x-4">
        <hr className="bg-[#305eb8] h-1 w-10 sm:w-14" />
        <span className="text-[#305eb8] text-2xl sm:text-4xl font-semibold">
          {translations.testimonials.heading}
        </span>
        <hr className="bg-[#305eb8] h-1 w-10 sm:w-14" />
      </div>
      <div className="px-4 sm:px-10 pb-10 mx-4 sm:mx-10">
        <Swiper
          modules={[Autoplay, Pagination]}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 3, spaceBetween: 40 },
          }}
          loop={true}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {translations.testimonials.testimonials.map((testimonial) => (
            <SwiperSlide
              key={testimonial.id}
              style={{ height: maxHeight > 0 ? `${maxHeight}px` : "auto" }}
            >
              <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg text-center flex flex-col justify-between h-full mx-2 sm:mx-4">
                <p className="text-gray-600 italic text-sm sm:text-base mb-4 sm:mb-6">
                  &quot;{testimonial.feedback}&quot;
                </p>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#305eb8]">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base">
                    {testimonial.role}
                  </p>
                </div>
                <div className="flex justify-center mt-3 sm:mt-4">
                  {Array.from({ length: testimonial.stars }).map((_, index) => (
                    <i key={index} className="uis uis-favorite text-yellow-500 mx-1"></i>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}