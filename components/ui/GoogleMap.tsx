'use client';

import { GoogleMap as GoogleMapComponent, Marker } from '@react-google-maps/api';
import { useMemo, useState } from 'react';
import { useGoogleMaps } from '@/lib/GoogleMapsProvider';

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  name: string;
  height?: string;
}

const mapContainerStyle = {
  width: '100%',
};

const mapOptions = {
  disableDefaultUI: false,
  clickableIcons: true,
  scrollwheel: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: true,
  fullscreenControl: true,
};

export default function GoogleMap({ latitude, longitude, name, height = '400px' }: GoogleMapProps) {
  const [mapError, setMapError] = useState(false);
  const { isLoaded, loadError } = useGoogleMaps();

  const center = useMemo(() => {
    const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
    const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude;
    return { lat, lng };
  }, [latitude, longitude]);

  // Validate coordinates
  if (!latitude || !longitude || isNaN(center.lat) || isNaN(center.lng)) {
    return (
      <div className="w-full bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-3 p-6" style={{ height }}>
        <p className="text-gray-600 text-center">Coordonnées GPS non disponibles</p>
      </div>
    );
  }

  if (loadError || mapError) {
    console.error('Google Maps error:', loadError || 'Map rendering error');
    return (
      <div className="w-full bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-3 p-6" style={{ height }}>
        <p className="text-gray-600 text-center">La carte n'est pas disponible pour le moment</p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Voir sur Google Maps
        </a>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center animate-pulse" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg" style={{ height }}>
      <GoogleMapComponent
        mapContainerStyle={{ ...mapContainerStyle, height }}
        center={center}
        zoom={15}
        options={mapOptions}
        onLoad={() => console.log('Map loaded successfully')}
      >
        <Marker
          position={center}
          title={name}
        />
      </GoogleMapComponent>
    </div>
  );
}
