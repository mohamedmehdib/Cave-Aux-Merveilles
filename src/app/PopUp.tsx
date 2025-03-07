"use client";
import { useEffect, useState } from "react";
import { loadTranslations } from "../utils/loadTranslations";

export default function PopUp({ onDevisClick }: { onDevisClick: () => void }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [translations, setTranslations] = useState<{
    popup: {
      get_quote: string;
      welcome: string;
      message: string;
      get_quote_button: string;
    };
  }>({
    popup: {
      get_quote: "Obtenir un devis",
      welcome: "Bienvenue!",
      message: "Merci de visiter notre site Web. Voici une offre spéciale pour vous !",
      get_quote_button: "Obtenir un devis",
    },
  });

  useEffect(() => {
    const userLanguage = navigator.language || "en";
    const loadedTranslations = loadTranslations(userLanguage);
    setTranslations(loadedTranslations);

    const timer = setTimeout(() => {
      setIsPopupOpen(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleDevisClick = () => {
    onDevisClick();
    setIsPopupOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsPopupOpen(true)}
        className="fixed bottom-4 right-4 bg-[#274e9d] text-white px-4 py-2 rounded hover:bg-[#305eb8] duration-200 focus:outline-none shadow-lg z-50"
      >
        {translations.popup.get_quote}
      </button>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-[90%] sm:max-w-sm relative"
            style={{ width: "100%" }}
          >
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
              {translations.popup.welcome}
            </h2>

            <p className="text-sm sm:text-base mb-4">
              {translations.popup.message}
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleDevisClick}
                className="bg-[#274e9d] text-white px-4 py-2 rounded hover:bg-[#305eb8] duration-200 focus:outline-none"
              >
                {translations.popup.get_quote_button}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}