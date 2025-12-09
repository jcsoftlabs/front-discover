'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface MenuInputProps {
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  error?: string;
}

export default function MenuInput({ value, onChange, error }: MenuInputProps) {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  const handleAdd = () => {
    const trimmedName = itemName.trim();
    const trimmedPrice = itemPrice.trim();

    if (trimmedName && trimmedPrice) {
      onChange({
        ...value,
        [trimmedName]: trimmedPrice,
      });
      setItemName('');
      setItemPrice('');
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

  const entries = Object.entries(value);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Menu
        <span className="text-gray-400 font-normal ml-1">(optionnel - pour restaurants/cafés)</span>
      </label>

      {/* Liste des items du menu */}
      {entries.length > 0 && (
        <div className="space-y-2">
          {entries.map(([name, price]) => (
            <div
              key={name}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex-1">
                <span className="font-medium text-gray-900">{name}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600">{price}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(name)}
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
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nom du plat/boisson..."
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Prix (ex: 250-500 HTG)"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!itemName.trim() || !itemPrice.trim()}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Ajouter au menu
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-gray-500">
        Ajoutez les plats/boissons avec leurs prix. Exemple: "Plat principal" → "250-500 HTG"
      </p>
    </div>
  );
}
