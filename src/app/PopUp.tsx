"use client";
import { useEffect, useState } from "react";

export default function PopUp() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPopupOpen(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
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
              Bienvenue sur notre site ! 
            </h2>

            <p className="text-sm sm:text-base mb-4">
              Nous sommes ravis de vous accueillir. Explorez nos services et découvrez tout ce que nous avons à offrir. Si vous avez des questions ou besoin d’aide, n’hésitez pas à nous contacter. Bonne navigation !
            </p>
          </div>
        </div>
      )}
    </>
  );
}