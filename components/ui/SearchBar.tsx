'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import apiClient from '@/lib/axios';
import { Establishment, Site } from '@/types';

interface SearchBarProps {
  onSearch: (query: string, location: string, category: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const router = useRouter();
  const t = useTranslations();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [suggestions, setSuggestions] = useState<Array<(Establishment | Site) & { resultType: 'establishment' | 'site' }>>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const queryInputRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLDivElement>(null);

  const categories = [
    { value: '', label: t('hero.allCategories') },
    { value: 'HOTEL', label: t('categories.hotels') },
    { value: 'RESTAURANT', label: t('categories.restaurants') },
    { value: 'BAR', label: t('categories.bars') },
    { value: 'CAFE', label: t('categories.cafes') },
    { value: 'ATTRACTION', label: t('categories.attractions') },
    { value: 'SHOP', label: t('categories.shops') },
    { value: 'SERVICE', label: t('types.SERVICE') },
  ];

  // Fetch establishments and sites for suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        // Fetch both establishments and sites in parallel
        const [establishmentsRes, sitesRes] = await Promise.all([
          apiClient.get('/establishments'),
          apiClient.get('/sites')
        ]);

        const allSuggestions = [];

        // Filter establishments
        if (establishmentsRes.data.success) {
          const filteredEstablishments = establishmentsRes.data.data
            .filter((est: Establishment) =>
              est.name.toLowerCase().includes(query.toLowerCase()) ||
              est.description?.toLowerCase().includes(query.toLowerCase())
            )
            .map((est: Establishment) => ({ ...est, resultType: 'establishment' as const }));
          allSuggestions.push(...filteredEstablishments);
        }

        // Filter sites
        if (sitesRes.data.success) {
          const filteredSites = sitesRes.data.data
            .filter((site: Site) =>
              site.name.toLowerCase().includes(query.toLowerCase()) ||
              site.description?.toLowerCase().includes(query.toLowerCase())
            )
            .map((site: Site) => ({ ...site, resultType: 'site' as const }));
          allSuggestions.push(...filteredSites);
        }

        // Limit to 5 results total
        const limitedSuggestions = allSuggestions.slice(0, 5);
        setSuggestions(limitedSuggestions);
        setShowSuggestions(limitedSuggestions.length > 0);
      } catch (error) {
        console.error('Erreur lors de la récupération des suggestions:', error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Fetch location suggestions from both establishments and sites
  useEffect(() => {
    const fetchLocationSuggestions = async () => {
      if (location.length < 2) {
        setLocationSuggestions([]);
        setShowLocationSuggestions(false);
        return;
      }

      try {
        const [establishmentsRes, sitesRes] = await Promise.all([
          apiClient.get('/establishments'),
          apiClient.get('/sites')
        ]);

        const allLocations: string[] = [];

        if (establishmentsRes.data.success) {
          const estLocations = establishmentsRes.data.data
            .map((est: Establishment) => est.address)
            .filter((addr: string) => addr && addr.toLowerCase().includes(location.toLowerCase()));
          allLocations.push(...estLocations);
        }

        if (sitesRes.data.success) {
          const siteLocations = sitesRes.data.data
            .map((site: Site) => site.address)
            .filter((addr: string) => addr && addr.toLowerCase().includes(location.toLowerCase()));
          allLocations.push(...siteLocations);
        }

        // Remove duplicates and limit to 5
        const uniqueLocations = Array.from(new Set(allLocations)).slice(0, 5);
        setLocationSuggestions(uniqueLocations);
        setShowLocationSuggestions(uniqueLocations.length > 0);
      } catch (error) {
        console.error('Erreur lors de la récupération des suggestions de lieux:', error);
      }
    };

    const debounceTimer = setTimeout(fetchLocationSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [location]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (queryInputRef.current && !queryInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    setShowLocationSuggestions(false);

    // 📊 Track search
    const { default: telemetryService } = await import('@/lib/services/telemetry');
    telemetryService.trackSearch(query, suggestions.length);

    onSearch(query, location, category);
  };

  const selectSuggestion = async (item: (Establishment | Site) & { resultType: 'establishment' | 'site' }) => {
    setShowSuggestions(false);

    // 📊 Track suggestion click
    const { default: telemetryService } = await import('@/lib/services/telemetry');
    telemetryService.trackClick('search_suggestion', {
      itemId: item.id,
      itemType: item.resultType,
      itemName: item.name
    });

    // Navigate directly to the establishment or site detail page
    if (item.resultType === 'establishment') {
      router.push(`/establishments/${item.id}`);
    } else {
      router.push(`/sites/${item.id}`);
    }
  };

  const selectLocationSuggestion = (addr: string) => {
    setLocation(addr);
    setShowLocationSuggestions(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Recherche par nom */}
          <div className="md:col-span-4 relative" ref={queryInputRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('searchBar.whatLookingFor')}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('hero.searchPlaceholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder:text-gray-500"
              />

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto"
                  >
                    {isLoadingSuggestions ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                      </div>
                    ) : (
                      suggestions.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => selectSuggestion(item)}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 transition flex items-start gap-3 border-b border-gray-100 last:border-b-0"
                        >
                          {item.images && item.images.length > 0 ? (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Search className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{item.name}</p>
                            <p className="text-sm text-gray-500 truncate">{item.address}</p>
                            <span className={`inline-block mt-1 text-xs px-2 py-1 rounded ${item.resultType === 'site'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                              }`}>
                              {item.resultType === 'site'
                                ? t(`siteCategories.${(item as Site).category}`)
                                : categories.find(c => c.value === (item as Establishment).type)?.label || (item as Establishment).type
                              }
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Recherche par lieu */}
          <div className="md:col-span-3 relative" ref={locationInputRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('searchBar.where')}
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('hero.locationPlaceholder')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => location.length >= 2 && locationSuggestions.length > 0 && setShowLocationSuggestions(true)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder:text-gray-500"
              />

              {/* Location Suggestions Dropdown */}
              <AnimatePresence>
                {showLocationSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto"
                  >
                    {locationSuggestions.map((addr, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectLocationSuggestion(addr)}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 transition flex items-center gap-2 border-b border-gray-100 last:border-b-0"
                      >
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-900">{addr}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Catégorie */}
          <div className="md:col-span-3 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('hero.category')}
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white text-gray-900"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bouton de recherche */}
          <div className="md:col-span-2 flex items-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              {t('hero.search')}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.form>
  );
}
