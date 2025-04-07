'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Map() {
  // Create a simple SVG marker (no external images)
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

  // Default location (Eiffel Tower)
  const defaultPosition = [48.8584, 2.2945] as [number, number];

  if (typeof window === 'undefined') {
    return <div className="h-[400px] w-full bg-gray-100" />;
  }

  return (
    <div className="h-[400px] w-full">
      <MapContainer
        center={defaultPosition}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={defaultPosition}>
          <Popup>
            <Link href="">Cave aux Merveilleux</Link>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}