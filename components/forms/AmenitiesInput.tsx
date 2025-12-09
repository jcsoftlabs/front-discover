'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface AmenitiesInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

const COMMON_AMENITIES = [
  'WiFi gratuit',
  'Piscine',
  'Restaurant',
  'Parking gratuit',
  'Climatisation',
  'Bar',
  'Salle de sport',
  'Spa',
  'Service en chambre',
  'Petit-déjeuner inclus',
  'Accès plage',
  'Navette aéroport',
  'Animaux acceptés',
  'Blanchisserie',
  'Réception 24h/24',
];

export default function AmenitiesInput({ value, onChange, error }: AmenitiesInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAdd = (amenity: string) => {
    const trimmed = amenity.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const handleRemove = (amenity: string) => {
    onChange(value.filter((item) => item !== amenity));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd(inputValue);
    }
  };

  const filteredSuggestions = COMMON_AMENITIES.filter(
    (amenity) =>
      !value.includes(amenity) &&
      amenity.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Commodités
        <span className="text-gray-400 font-normal ml-1">(optionnel)</span>
      </label>

      {/* Liste des commodités ajoutées */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
            >
              {amenity}
              <button
                type="button"
                onClick={() => handleRemove(amenity)}
                className="hover:bg-green-200 rounded-full p-0.5 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input + suggestions */}
      <div className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Délai pour permettre le clic sur une suggestion
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ajouter une commodité..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="button"
            onClick={() => handleAdd(inputValue)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredSuggestions.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => handleAdd(amenity)}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 transition text-sm"
              >
                {amenity}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-gray-500">
        Appuyez sur Entrée ou cliquez sur Ajouter. Sélectionnez parmi les suggestions ou tapez votre propre commodité.
      </p>
    </div>
  );
}
