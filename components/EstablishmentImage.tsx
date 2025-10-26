'use client';

import { useState } from 'react';

interface EstablishmentImageProps {
  src?: string;
  alt: string;
  fallbackIcon?: string;
  className?: string;
}

export default function EstablishmentImage({ 
  src, 
  alt, 
  fallbackIcon = '🏢',
  className = 'w-full h-48 object-cover'
}: EstablishmentImageProps) {
  const [error, setError] = useState(false);

  // Si pas d'image ou erreur de chargement, afficher le fallback
  if (!src || error) {
    return (
      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-5xl">{fallbackIcon}</span>
      </div>
    );
  }

  // Vérifier si c'est un chemin local ou une URL
  const isLocalPath = src.startsWith('/uploads') || src.startsWith('uploads') || src.startsWith('./uploads');
  const imageUrl = isLocalPath 
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/${src.replace(/^\.?\/?/, '')}` 
    : src;

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
