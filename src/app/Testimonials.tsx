"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper as SwiperType } from "swiper/types";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Loading from "./Loading";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface Testimonial {
  id: number;
  name: string;
  stars: number;
  feedback: string;
}

export default function Testimonials(): React.ReactElement {
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const swiperRef = useRef<SwiperType | null>(null);

  // Fetch testimonials from Supabase
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("testimonials").select("*");

        if (error) {
          throw error;
        }

        setTestimonials(data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to fetch testimonials");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (swiperRef.current) {
      const updateMaxHeight = () => {
        const slides = swiperRef.current?.el?.querySelectorAll(".swiper-slide");
        let tallestHeight = 0;
        
        slides?.forEach((slide: Element) => {
          const height = (slide as HTMLElement).offsetHeight;
          if (height > tallestHeight) {
            tallestHeight = height;
          }
        });
        
        setMaxHeight(tallestHeight);
      };

      updateMaxHeight();
      window.addEventListener("resize", updateMaxHeight);
      return () => window.removeEventListener("resize", updateMaxHeight);
    }
  }, [testimonials]);

  if (loading) {
    return <div><Loading/></div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }

  return (
    <div className="pt-10">
      <link
        rel="stylesheet"
        href="https://unicons.iconscout.com/release/v4.0.8/css/solid.css"
      />
      <div className="flex items-center justify-center py-5 space-x-4">
        <hr className="bg-accent h-1 w-10 sm:w-14" />
        <span className="text-accent text-2xl sm:text-4xl font-semibold">
          Avis Clients
        </span>
        <hr className="bg-accent h-1 w-10 sm:w-14" />
      </div>
      <div className="px-4 pb-10 mx-4">
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
          {testimonials.map((testimonial) => (
            <SwiperSlide
              key={testimonial.id}
              style={{ height: maxHeight > 0 ? `${maxHeight}px` : "auto" }}
            >
              <div className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col justify-between h-full">
                <div>
                  <Image src="/quote.png" alt="quote" height={100} width={100} className="w-10 rotate-180" />
                </div>
                <p className="text-gray-600 italic text-sm sm:text-base sm:mb-2">
                  {testimonial.feedback}
                </p>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-accent">
                    {testimonial.name}
                  </h3>
                </div>
                <div className="flex justify-center">
                  {Array.from({ length: testimonial.stars }).map((_, index) => (
                    <i key={index} className="uis uis-favorite text-yellow-500 mx-1"></i>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Image src="/quote.png" alt="quote" height={100} width={100} className="w-10" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}