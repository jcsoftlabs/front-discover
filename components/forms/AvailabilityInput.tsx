'use client';

import { useState } from 'react';
import { X, Plus, Clock } from 'lucide-react';

interface AvailabilityInputProps {
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  error?: string;
}

const QUICK_TEMPLATES = [
  { label: 'Tous les jours 9h-18h', days: 'Lundi-Dimanche', hours: '9h-18h' },
  { label: 'Semaine 8h-17h', days: 'Lundi-Vendredi', hours: '8h-17h' },
  { label: 'Weekend 10h-22h', days: 'Samedi-Dimanche', hours: '10h-22h' },
  { label: '24h/24 7j/7', days: 'Tous les jours', hours: '24h/24' },
];

export default function AvailabilityInput({ value, onChange, error }: AvailabilityInputProps) {
  const [days, setDays] = useState('');
  const [hours, setHours] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const handleAdd = () => {
    const trimmedDays = days.trim();
    const trimmedHours = hours.trim();

    if (trimmedDays && trimmedHours) {
      onChange({
        ...value,
        [trimmedDays]: trimmedHours,
      });
      setDays('');
      setHours('');
    }
  };

  const handleRemove = (key: string) => {
    const newValue = { ...value };
    delete newValue[key];
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const applyTemplate = (template: typeof QUICK_TEMPLATES[0]) => {
    onChange({
      ...value,
      [template.days]: template.hours,
    });
    setShowTemplates(false);
  };

  const entries = Object.entries(value);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Horaires d&apos;ouverture
        <span className="text-gray-400 font-normal ml-1">(optionnel)</span>
      </label>

      {/* Templates rapides */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowTemplates(!showTemplates)}
          className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
        >
          <Clock className="w-4 h-4" />
          Utiliser un modèle rapide
        </button>

        {showTemplates && (
          <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2 space-y-1 min-w-[200px]">
            {QUICK_TEMPLATES.map((template, index) => (
              <button
                key={index}
                type="button"
                onClick={() => applyTemplate(template)}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 rounded transition text-sm"
              >
                {template.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Liste des horaires */}
      {entries.length > 0 && (
        <div className="space-y-2">
          {entries.map(([day, time]) => (
            <div
              key={day}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex-1">
                <span className="font-medium text-gray-900">{day}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600">{time}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(day)}
                className="p-1 hover:bg-gray-200 rounded transition"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Formulaire d'ajout */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input
            type="text"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Jour(s) (ex: Lundi-Vendredi)"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Horaires (ex: 9h-18h)"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!days.trim() || !hours.trim()}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Ajouter un horaire
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-gray-500">
        Ajoutez les jours et horaires d&apos;ouverture. Exemple: &quot;Lundi-Vendredi&quot; → &quot;9h-18h&quot;
      </p>
    </div>
  );
}
