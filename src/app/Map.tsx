"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { LatLngExpression } from "leaflet";
import Link from "next/link";
import { useEffect, useState } from "react";
import { loadTranslations } from "../utils/loadTranslations";

const Map = () => {
  const [translations, setTranslations] = useState<{
    map: {
      visit_us: string;
      popup_text: string;
      popup_aria_label: string;
    };
  }>({
    map: {
      visit_us: "Visitez-nous !",
      popup_text: "FILDAIR FRERES",
      popup_aria_label: "Ouvrir l'emplacement de Fildair Frères sur Google Maps",
    },
  });

  useEffect(() => {
    // Detect the user's browser language
    const userLanguage = navigator.language || "en";
    const loadedTranslations = loadTranslations(userLanguage);
    setTranslations(loadedTranslations);
  }, []);

  const position: LatLngExpression = [36.87884987742904, 10.26525650200852];

  const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });


  return (
    <section className="flex flex-col items-center py-10">

      <div className="flex items-center justify-center py-5 space-x-4">
        <hr className="bg-[#305eb8] h-1 w-10 sm:w-14" />
        <h2 className="text-[#305eb8] text-2xl sm:text-4xl font-semibold">
          {translations.map.visit_us}
        </h2>
        <hr className="bg-[#305eb8] h-1 w-10 sm:w-14" />
      </div>

      <div className="relative w-full sm:w-3/4 lg:w-1/2 rounded-lg overflow-hidden px-4 sm:px-6 md:px-8">
        <MapContainer
          center={position}
          zoom={15}
          className="relative z-10 h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] w-full"
          aria-label="Carte de localisation de Fildair Frères"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} icon={customIcon}>
            <Popup>
              <Link
                href="https://www.google.com/maps/place/Fildair+La+Soukra/@36.8786954,10.2651814,17z/data=!3m1!4b1!4m6!3m5!1s0x12e2b5b16a9ce5af:0x2309fb1d7f736219!8m2!3d36.8786954!4d10.2651814!16s%2Fg%2F11kptsd4hs?entry=ttu&g_ep=EgoyMDI1MDIxMS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                aria-label={translations.map.popup_aria_label}
              >
                {translations.map.popup_text}
              </Link>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  );
};

export default Map;