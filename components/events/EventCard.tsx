import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import type { Event } from '@/types';

const EVENT_CATEGORIES = {
  CONCERT: { label: 'Concert', color: 'bg-purple-100 text-purple-800' },
  FESTIVAL: { label: 'Festival', color: 'bg-pink-100 text-pink-800' },
  CONFERENCE: { label: 'Conférence', color: 'bg-blue-100 text-blue-800' },
  SPORT: { label: 'Sport', color: 'bg-green-100 text-green-800' },
  EXHIBITION: { label: 'Exposition', color: 'bg-yellow-100 text-yellow-800' },
  CULTURAL: { label: 'Culturel', color: 'bg-indigo-100 text-indigo-800' },
  RELIGIOUS: { label: 'Religieux', color: 'bg-gray-100 text-gray-800' },
  CARNIVAL: { label: 'Carnaval', color: 'bg-red-100 text-red-800' },
  OTHER: { label: 'Autre', color: 'bg-gray-100 text-gray-600' },
};

interface EventCardProps {
  event: Event;
  onClick?: () => void;
  showOrganizer?: boolean;
}

export default function EventCard({ event, onClick, showOrganizer = true }: EventCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const category = EVENT_CATEGORIES[event.category] || EVENT_CATEGORIES.OTHER;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {event.images && event.images.length > 0 ? (
          <img
            src={event.images[0]}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${category.color}`}>
            {category.label}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>

        {event.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </span>
          </div>

          {event.ville && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">
                {event.ville}{event.departement ? `, ${event.departement}` : ''}
              </span>
            </div>
          )}

          {event.price !== undefined && event.price > 0 && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">{event.price} HTG</span>
            </div>
          )}

          {event.maxCapacity && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span>Capacité: {event.maxCapacity}</span>
            </div>
          )}
        </div>

        {showOrganizer && event.organizer && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Organisé par <span className="font-medium text-gray-700">{event.organizer.name}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
