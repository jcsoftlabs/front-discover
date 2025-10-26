'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Establishment } from '@/types';
import RatingStars from './RatingStars';
import FavoriteButton from './FavoriteButton';

interface ListingCardProps {
  establishment: Establishment & {
    averageRating?: number;
    reviewCount?: number;
  };
  onAuthRequired?: () => void;
  onClick?: () => void;
}

const typeLabels: Record<string, string> = {
  HOTEL: 'Hôtel',
  RESTAURANT: 'Restaurant',
  BAR: 'Bar',
  CAFE: 'Café',
  ATTRACTION: 'Attraction',
  SHOP: 'Boutique',
  SERVICE: 'Service',
};

export default function ListingCard({
  establishment,
  onAuthRequired,
  onClick,
}: ListingCardProps) {
  const [imageError, setImageError] = useState(false);
  const mainImage = establishment.images?.[0];
  const hasValidImage = mainImage && !imageError;

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-200">
        {hasValidImage ? (
          <Image
            src={mainImage}
            alt={establishment.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
            unoptimized={mainImage.startsWith('http')}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
            <span className="text-4xl">🏖️</span>
          </div>
        )}

        {/* Favorite button */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton
            establishmentId={establishment.id}
            size="md"
            onAuthRequired={onAuthRequired}
          />
        </div>

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
            {typeLabels[establishment.type] || establishment.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Location */}
        {establishment.address && (
          <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{establishment.address}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {establishment.name}
        </h3>

        {/* Description */}
        {establishment.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {establishment.description}
          </p>
        )}

        {/* Rating and Reviews */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <RatingStars
              rating={establishment.averageRating || 0}
              size="sm"
              showNumber={false}
            />
            <span className="text-sm font-medium text-gray-700">
              {(establishment.averageRating || 0).toFixed(1)}
            </span>
            {establishment.reviewCount !== undefined && (
              <div className="flex items-center gap-1 text-gray-500">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">({establishment.reviewCount})</span>
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        {establishment.price > 0 && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-sm text-gray-600">À partir de</span>
            <span className="text-2xl font-bold text-gray-900">
              ${establishment.price}
              <span className="text-sm font-normal text-gray-600">/nuit</span>
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );

  // Wrap with Link if no custom onClick is provided
  if (!onClick) {
    return (
      <Link href={`/establishments/${establishment.id}`} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
