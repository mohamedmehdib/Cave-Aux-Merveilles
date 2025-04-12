'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Map() {
  useEffect(() => {
    const svgIcon = L.divIcon({
      html: `
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="red" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      `,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
    });
    L.Marker.prototype.options.icon = svgIcon;
  }, []);

  const defaultPosition = [36.824654221987934, 10.097077147779267] as [number, number];

  if (typeof window === 'undefined') {
    return <div className="h-[400px] w-full bg-gray-100" />;
  }

  return (
    <div className="py-10">
      {/* Responsive Title Section */}
      <div className="flex items-center justify-center py-10 space-x-4">
        <hr className="bg-accent h-1 w-10 sm:w-14" />
        <span className="text-accent text-2xl sm:text-4xl font-semibold">
          Visitez nous
        </span>
        <hr className="bg-accent h-1 w-10 sm:w-14" />
      </div>

      {/* Responsive Map Container */}
      <div className="w-3/4 md:w-1/2 mx-auto relative z-0">
        <MapContainer
          center={defaultPosition}
          zoom={13}
          scrollWheelZoom={window.innerWidth > 640} // Disable scroll zoom on small screens
          className="h-full w-full rounded-xl"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={defaultPosition}>
            <Popup>
              <Link target='_blank' href="https://maps.app.goo.gl/w4e5tsjLE7SJbis17">Cave aux Merveilleux</Link>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}