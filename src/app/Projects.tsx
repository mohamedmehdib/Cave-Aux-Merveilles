'use client';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper as SwiperType } from 'swiper';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { loadTranslations } from '../utils/loadTranslations';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function Projects() {
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [translations, setTranslations] = useState<{
    projects: {
      latest_projects: string;
    };
  }>({
    projects: {
      latest_projects: "Nos derniers projets",
    },
  });

  const swiperRef = React.useRef<SwiperType | null>(null);

  useEffect(() => {
    // Detect the user's browser language
    const userLanguage = navigator.language || "en";
    const loadedTranslations = loadTranslations(userLanguage);
    setTranslations(loadedTranslations);

    // Fetch project images from Supabase
    async function fetchImages() {
      const { data, error } = await supabase
        .from('projects')
        .select('image_url');

      if (error) {
        console.error('Error fetching project images:', error);
      } else if (data) {
        setProjectImages(data.map((item) => item.image_url));
      }
    }

    fetchImages();
  }, []);

  return (
    <div id='projects' className='py-10'>
      <link
        rel='stylesheet'
        href='https://unicons.iconscout.com/release/v4.0.8/css/solid.css'
      />
      <div className='flex items-center justify-center space-x-4 py-10 sm:py-14 px-3'>
        <hr className='bg-[#305eb8] h-1 w-10 md:w-14' />
        <span className='text-[#305eb8] text-2xl sm:text-4xl font-semibold text-center'>
          {translations.projects.latest_projects}
        </span>
        <hr className='bg-[#305eb8] h-1 w-10 md:w-14' />
      </div>

      <div className='relative px-4 sm:px-10'>
        <Swiper
          modules={[Autoplay, Pagination]}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
          loop={true}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {projectImages.map((image, index) => (
            <SwiperSlide key={index}>
              <div className='relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden'>
                <Image
                  width={500}
                  height={500}
                  src={image}
                  alt={`Project ${index + 1}`}
                  className='w-full h-full object-cover'
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div
          className='swiper-button-prev absolute flex items-center justify-center top-1/2 left-2 transform -translate-y-1/2 z-10 bg-white h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-lg cursor-pointer hover:bg-[#305eb8] text-[#305eb8] hover:text-white transition-all duration-300'
          aria-label='Previous Slide'
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <i className='uil uil-arrow-left text-xl sm:text-2xl'></i>
        </div>
        <div
          className='swiper-button-next absolute flex items-center justify-center top-1/2 right-2 transform -translate-y-1/2 z-10 bg-white h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-lg cursor-pointer hover:bg-[#305eb8] text-[#305eb8] hover:text-white transition-all duration-300'
          aria-label='Next Slide'
          onClick={() => swiperRef.current?.slideNext()}
        >
          <i className='uil uil-arrow-right text-xl sm:text-2xl'></i>
        </div>
      </div>
    </div>
  );
}