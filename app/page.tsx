'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Briefcase, LogIn, User as UserIcon, Heart, Menu, X, ChevronLeft, ChevronRight, Hotel, UtensilsCrossed, Coffee, MapPinned, ShoppingBag, Sparkles, ChevronDown, Award, Globe, Mountain, Palmtree, Users, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import apiClient from '@/lib/axios';
import { Establishment } from '@/types';
import SearchBar from '@/components/ui/SearchBar';
import ListingCard from '@/components/ui/ListingCard';
import AuthModal from '@/components/modals/AuthModal';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import LocationPermissionModal from '@/components/modals/LocationPermissionModal';
import { useTranslations } from 'next-intl';

const heroImages = [
  'https://visithaiti.com/wp-content/uploads/2023/03/beach-Ile-a-Rat-Amiga-Island-cap-haitien-jean-oscar-augustin_hero.jpg',
  'https://visithaiti.com/wp-content/uploads/2019/03/DJI_0382-scaled.jpg',
  'https://visithaiti.com/wp-content/uploads/2025/03/cathedral-cap-haitien-verdy-verna_hero.jpg',
];

const categories = [
  { value: '', label: 'Tous', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  { value: 'HOTEL', label: 'Hôtels', icon: Hotel, color: 'from-blue-500 to-cyan-500' },
  { value: 'RESTAURANT', label: 'Restaurants', icon: UtensilsCrossed, color: 'from-orange-500 to-red-500' },
  { value: 'BAR', label: 'Bars', icon: Coffee, color: 'from-amber-500 to-yellow-500' },
  { value: 'CAFE', label: 'Cafés', icon: Coffee, color: 'from-brown-500 to-amber-600' },
  { value: 'ATTRACTION', label: 'Attractions', icon: MapPinned, color: 'from-green-500 to-emerald-500' },
  { value: 'SHOP', label: 'Boutiques', icon: ShoppingBag, color: 'from-pink-500 to-rose-500' },
];

// Couleurs distinctes pour les boutons catégories
const categoryColors: Record<string, string> = {
  'RESTAURANT': 'from-orange-500 to-red-600',
  'HOTEL': 'from-blue-500 to-cyan-600',
  'CAFE': 'from-amber-500 to-yellow-600',
  'SITES': 'from-green-500 to-emerald-600',
  'EVENTS': 'from-purple-500 to-pink-600',
  'SHOP': 'from-pink-500 to-rose-600',
};

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const t = useTranslations();
  const [establishments, setEstablishments] = useState<(Establishment & { averageRating?: number; reviewCount?: number; isSite?: boolean })[]>([]);
  const [filteredEstablishments, setFilteredEstablishments] = useState<(Establishment & { averageRating?: number; reviewCount?: number; isSite?: boolean })[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showSites, setShowSites] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  // Auto-advance slider every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const fetchEstablishments = async () => {
    try {
      const response = await apiClient.get('/establishments');
      if (response.data.success) {
        const data = response.data.data.map((est: Establishment & { reviews?: { rating: number }[] }) => {
          // Calculer la moyenne des reviews
          const reviews = est.reviews || [];
          const averageRating = reviews.length > 0
            ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
            : 0;

          return {
            ...est,
            averageRating,
            reviewCount: reviews.length,
            isSite: false,
          };
        });
        return data;
      }
    } catch (error) {
      console.error('Erreur lors du chargement des établissements:', error);
    }
    return [];
  };

  const fetchSites = async () => {
    try {
      const response = await apiClient.get('/sites');
      if (response.data.success) {
        const sitesAsEstablishments = response.data.data.map((site: any) => ({
          id: site.id,
          name: site.name,
          description: site.description,
          type: 'ATTRACTION' as const,
          address: site.address,
          ville: site.ville,
          departement: site.departement,
          latitude: site.latitude,
          longitude: site.longitude,
          images: site.images || [],
          price: 0,
          averageRating: 0,
          reviewCount: 0,
          isSite: true,
        }));
        return sitesAsEstablishments;
      }
    } catch (error) {
      console.error('Erreur lors du chargement des sites:', error);
    }
    return [];
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [establishmentsData, sitesData] = await Promise.all([
        fetchEstablishments(),
        fetchSites(),
      ]);
      const allData = [...establishmentsData, ...sitesData];
      setEstablishments(allData);
      setFilteredEstablishments(allData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string, location: string, category: string) => {
    let filtered = establishments;

    if (query) {
      filtered = filtered.filter((est) =>
        est.name.toLowerCase().includes(query.toLowerCase()) ||
        est.description?.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (location) {
      filtered = filtered.filter((est) =>
        est.address?.toLowerCase().includes(location.toLowerCase()) ||
        est.ville?.toLowerCase().includes(location.toLowerCase()) ||
        est.departement?.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter((est) => est.type === category);
    }

    setFilteredEstablishments(filtered);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setShowSites(false); // Reset sites view

    if (category === '') {
      setFilteredEstablishments(establishments);
    } else {
      const filtered = establishments.filter((est) => est.type === category);
      setFilteredEstablishments(filtered);
    }

    // Scroll to results section
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleShowSites = async () => {
    setShowSites(true);
    setSelectedCategory('');
    setCurrentPage(1);
    setIsLoading(true);

    try {
      const response = await apiClient.get('/sites');
      if (response.data.success) {
        // Convertir les sites au format Establishment pour réutiliser les composants existants
        const sitesAsEstablishments = response.data.data.map((site: any) => ({
          id: site.id,
          name: site.name,
          description: site.description,
          type: 'ATTRACTION' as const,
          address: site.address,
          ville: site.ville,
          departement: site.departement,
          latitude: site.latitude,
          longitude: site.longitude,
          images: site.images || [],
          averageRating: 0,
          reviewCount: 0,
          isSite: true, // Flag to indicate this is a tourist site
        }));
        setFilteredEstablishments(sitesAsEstablishments);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des sites:', error);
    } finally {
      setIsLoading(false);
    }

    // Scroll to results section
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Calcul de la pagination
  const totalPages = Math.ceil(filteredEstablishments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEstablishments = filteredEstablishments.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header / Navbar */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="bg-gradient-to-b from-black/30 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
                  <span className="text-2xl">🇭🇹</span>
                </div>
                <span className="text-2xl font-bold text-white drop-shadow-lg">
                  Discover Haiti
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-4">
                <LanguageSwitcher />
                {isAuthenticated && user ? (
                  <>
                    <Link href="/favorites" className="flex items-center gap-2 text-white hover:text-blue-300 transition">
                      <Heart className="w-5 h-5" />
                      {t('nav.favorites')}
                    </Link>
                    <div className="h-6 w-px bg-white/30"></div>
                    <span className="text-white">
                      {t('nav.hello')}, {user.firstName || 'Utilisateur'}
                    </span>
                    {user.role === 'PARTNER' && (
                      <Link
                        href="/partner/dashboard"
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        <Briefcase className="w-5 h-5" />
                        {t('nav.mySpace')}
                      </Link>
                    )}
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 border border-white/20 transition"
                      >
                        <Briefcase className="w-5 h-5" />
                        {t('nav.administration')}
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="px-4 py-2 text-white hover:text-red-300 transition"
                    >
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => openAuthModal('login')}
                      className="flex items-center gap-2 text-white hover:text-blue-300 transition"
                    >
                      <LogIn className="w-5 h-5" />
                      {t('nav.login')}
                    </button>
                    <button
                      onClick={() => openAuthModal('register')}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 border border-white/20 transition"
                    >
                      <UserIcon className="w-5 h-5" />
                      {t('nav.register')}
                    </button>
                  </>
                )}
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-white hover:text-blue-300 transition"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden py-4 border-t border-white/20 bg-black/50 backdrop-blur-md"
              >
                <nav className="flex flex-col gap-3">
                  <div className="px-4 pb-3 border-b border-white/20">
                    <LanguageSwitcher />
                  </div>
                  {isAuthenticated && user ? (
                    <>
                      <Link href="/favorites" className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition">
                        <Heart className="w-5 h-5" />
                        {t('nav.favorites')}
                      </Link>
                      <span className="px-4 py-2 text-white">
                        {t('nav.hello')}, {user.firstName || 'Utilisateur'}
                      </span>
                      {user.role === 'PARTNER' && (
                        <Link
                          href="/partner/dashboard"
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          <Briefcase className="w-5 h-5" />
                          {t('nav.mySpace')}
                        </Link>
                      )}
                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 border border-white/20 transition"
                        >
                          <Briefcase className="w-5 h-5" />
                          {t('nav.administration')}
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="px-4 py-2 text-left text-white hover:bg-white/10 rounded-lg transition"
                      >
                        {t('nav.logout')}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          openAuthModal('login');
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition"
                      >
                        <LogIn className="w-5 h-5" />
                        {t('nav.login')}
                      </button>
                      <button
                        onClick={() => {
                          openAuthModal('register');
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 border border-white/20 transition"
                      >
                        <UserIcon className="w-5 h-5" />
                        {t('nav.register')}
                      </button>
                    </>
                  )}
                </nav>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Slider */}
      <section className="relative py-0 px-0 overflow-hidden min-h-[750px] flex items-center pt-24 sm:pt-0">
        {/* Background Image Slider */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <motion.div
              key={image}
              initial={{ opacity: 0 }}
              animate={{
                opacity: currentSlide === index ? 1 : 0,
                scale: currentSlide === index ? 1 : 1.1,
              }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>

        {/* Dark Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-[1]"></div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${currentSlide === index
                  ? 'bg-white w-12 h-3'
                  : 'bg-white/50 w-3 h-3 hover:bg-white/75'
                }`}
              aria-label={`Aller à la diapositive ${index + 1}`}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto text-center z-20 px-4 sm:px-6 lg:px-8 mt-8 sm:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-4 sm:mb-6"
          >
            <div className="inline-block px-3 sm:px-6 py-1.5 sm:py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-4 sm:mb-6">
              <span className="text-white font-semibold text-xs sm:text-sm tracking-wide">🌴 {t('hero.welcome')}</span>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl leading-tight"
          >
            {t('hero.title')} <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">{t('hero.titleHighlight')}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto drop-shadow-lg font-medium px-4"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <SearchBar onSearch={handleSearch} />
          </motion.div>

          {/* Categories Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            {[
              { value: 'RESTAURANT', key: 'restaurants', icon: UtensilsCrossed, type: 'category' },
              { value: 'HOTEL', key: 'hotels', icon: Hotel, type: 'category' },
              { value: 'CAFE', key: 'cafes', icon: Coffee, type: 'category' },
              { value: 'SITES', key: 'sites', icon: MapPinned, type: 'sites' },
              { value: 'EVENTS', key: 'events', icon: Calendar, type: 'events' },
              { value: 'SHOP', key: 'shops', icon: ShoppingBag, type: 'category' },
            ].map((cat) => {
              const Icon = cat.icon;
              const gradientColor = categoryColors[cat.value] || 'from-blue-600 to-purple-600';
              return (
                <motion.button
                  key={cat.value}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (cat.type === 'sites') {
                      handleShowSites();
                    } else if (cat.type === 'events') {
                      window.location.href = '/events';
                    } else {
                      handleCategoryChange(cat.value);
                    }
                  }}
                  className={`flex flex-col items-center justify-center w-28 h-28 bg-gradient-to-br ${gradientColor} hover:shadow-xl text-white rounded-xl shadow-lg transition-all duration-300`}
                >
                  <Icon className="w-10 h-10 mb-2" />
                  <span className="text-sm font-semibold text-center">{t(`categories.${cat.key}`)}</span>
                </motion.button>
              );
            })}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-white/90 text-xs sm:text-sm max-w-lg mx-auto pb-20 px-4 text-center"
          >
            <button onClick={() => {
              setSelectedCategory('');
              setShowSites(false);
              setFilteredEstablishments(establishments);
              setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
            }} className="underline hover:text-white transition">{t('suggestText')}</button>
          </motion.p>
        </div>
      </section>

      {/* Why Haiti Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pourquoi découvrir <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Haïti</span> ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              La Perle des Antilles vous réserve des expériences uniques, entre histoire fascinante,
              paysages à couper le souffle et une culture vibrante.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Histoire Vivante</h3>
              <p className="text-gray-600">
                Première république noire indépendante au monde, Haïti possède un patrimoine historique exceptionnel avec ses forts, cathédrales et musées.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <Mountain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Paysages Spectaculaires</h3>
              <p className="text-gray-600">
                Des plages paradisiaques aux montagnes verdoyantes, en passant par les cascades et grottes, Haïti offre une diversité naturelle extraordinaire.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                <UtensilsCrossed className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gastronomie Créole</h3>
              <p className="text-gray-600">
                Savourez les délices de la cuisine haïtienne : griot, diri kole ak pwa, tasso, lambi... Une explosion de saveurs à découvrir.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hospitalité Légendaire</h3>
              <p className="text-gray-600">
                Les Haïtiens sont reconnus pour leur chaleur et leur générosité. Vous serez accueillis comme un membre de la famille.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Destinations Incontournables
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explorez les lieux emblématiques qui font la renommée d’Haïti
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 h-[400px]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{
                  backgroundImage: `url('https://dancingpandas.com/wp-content/uploads/2024/01/Notre-Dame-Cathedral-Haiti.png')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                <h3 className="text-2xl font-bold mb-2">Cap-Haïtien</h3>
                <p className="text-white/90 text-sm">
                  La capitale du Nord, riche en histoire coloniale avec la Citadelle Laferrière et le Palais Sans-Souci.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 h-[400px]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{
                  backgroundImage: `url('https://visithaiti.com/wp-content/uploads/2025/03/ile-a-vache-island-anton-lau_hero.jpg')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                <h3 className="text-2xl font-bold mb-2">Île-à-Vache</h3>
                <p className="text-white/90 text-sm">
                  Un paradis insulaire aux plages de sable blanc et eaux turquoise, idéal pour la détente et la plongée.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 h-[400px]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{
                  backgroundImage: `url('https://visithaiti.com/wp-content/uploads/2018/07/city-center-jacmel-anton-lau.jpg')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                <h3 className="text-2xl font-bold mb-2">Jacmel</h3>
                <p className="text-white/90 text-sm">
                  Ville d’art et de culture célèbre pour son carnaval coloré, son artisanat et son architecture victorienne.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Haïti en chiffres
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Découvrez la richesse de notre destination touristique
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl mb-4">
                <Hotel className="w-10 h-10 text-white" />
              </div>
              <p className="text-5xl font-bold text-white mb-2">{establishments.length}+</p>
              <p className="text-white/90 font-medium">Établissements</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl mb-4">
                <MapPinned className="w-10 h-10 text-white" />
              </div>
              <p className="text-5xl font-bold text-white mb-2">10+</p>
              <p className="text-white/90 font-medium">Départements</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl mb-4">
                <Award className="w-10 h-10 text-white" />
              </div>
              <p className="text-5xl font-bold text-white mb-2">UNESCO</p>
              <p className="text-white/90 font-medium">Sites classés</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl mb-4">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <p className="text-5xl font-bold text-white mb-2">1804</p>
              <p className="text-white/90 font-medium">Indépendance</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <section ref={resultsRef} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {showSites ? 'Sites Touristiques' : selectedCategory ? categories.find(c => c.value === selectedCategory)?.label : 'Découvertes d\'Haïti'}
              </h2>
              <p className="text-gray-600">
                {filteredEstablishments.length} résultat{filteredEstablishments.length > 1 ? 's' : ''}
                {totalPages > 1 && (
                  <span className="ml-2">• Page {currentPage} sur {totalPages}</span>
                )}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-gray-200 rounded-2xl h-96 animate-pulse"
                ></motion.div>
              ))}
            </div>
          ) : currentEstablishments.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {currentEstablishments.map((establishment, index) => (
                    <motion.div
                      key={establishment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ListingCard
                        establishment={establishment}
                        onAuthRequired={() => openAuthModal('login')}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-12 flex justify-center items-center gap-2"
                >
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Afficher les 5 premières pages, puis la dernière
                      if (page <= 5 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`
                              min-w-[40px] h-10 rounded-lg font-semibold transition-all duration-300
                              ${currentPage === page
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                              }
                            `}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === 6 && currentPage > 7) {
                        return <span key={page} className="flex items-center px-2">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white rounded-2xl shadow-sm"
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-gray-600 mb-4">Aucun établissement trouvé</p>
              <button
                onClick={() => {
                  setFilteredEstablishments(establishments);
                  setSelectedCategory('');
                  setShowSites(false);
                  setCurrentPage(1);
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
              >
                Réinitialiser les filtres
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Foire aux questions sur Haïti</h2>
            <p className="text-lg text-gray-600">
              Quel est le moment le moins cher pour voyager ? Ai-je besoin d&apos;un visa ? Combien dois-je donner de pourboire ?<br />
              Voici les réponses à vos questions les plus fréquentes sur Haïti.
            </p>
          </motion.div>

          <div className="space-y-4">
            {/* Question 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? null : 0)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-black/5 transition"
              >
                <h3 className="text-xl font-bold text-gray-900 pr-4">
                  Quel est le moment le moins cher pour voyager en Haïti ?
                </h3>
                <motion.div
                  animate={{ rotate: openFaqIndex === 0 ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-gray-600 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openFaqIndex === 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-gray-700 space-y-4">
                      <p>
                        Le moment le plus économique pour voyager en Haïti se situe généralement entre <strong>mai et octobre</strong>, pendant la basse saison touristique.
                        Durant cette période, les tarifs des vols et des hébergements sont souvent plus abordables, et les sites touristiques sont moins fréquentés, ce qui permet de profiter d&apos;une expérience plus paisible et authentique.
                      </p>
                      <p>
                        Cependant, si vous préférez un climat plus sec et animé, la haute saison (de <strong>décembre à mars</strong>) offre un ensoleillement idéal, des festivals culturels comme le <strong>Carnaval de Jacmel</strong>, et une ambiance particulièrement festive — mais à des prix un peu plus élevés.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Question 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 1 ? null : 1)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-black/5 transition"
              >
                <h3 className="text-xl font-bold text-gray-900 pr-4">
                  Où se trouvent les meilleurs endroits où séjourner en Haïti ?
                </h3>
                <motion.div
                  animate={{ rotate: openFaqIndex === 1 ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-gray-600 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openFaqIndex === 1 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-gray-700 space-y-4">
                      <p>
                        Vous cherchez une véritable immersion dans la cuisine haïtienne ?
                        Port-au-Prince abrite certains des meilleurs établissements du pays : <strong>La Coquille</strong>, <strong>La Réserve</strong>, <strong>Presse Café</strong> à Pétion-Ville, <strong>Gingerbread</strong> à Pacot, ou encore <strong>Le Plaza</strong> au centre-ville.
                        Ces restaurants sont parfaits pour découvrir les saveurs typiques d&apos;Haïti.
                      </p>
                      <p>
                        Pour une expérience encore plus spéciale, <strong>Le Florville</strong> à Kenscoff propose un brunch dominical très prisé — une excellente façon de savourer la gastronomie haïtienne dans une ambiance détendue et authentique.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Question 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? null : 2)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-black/5 transition"
              >
                <h3 className="text-xl font-bold text-gray-900 pr-4">
                  Ai-je besoin d&apos;un visa pour voyager en Haïti ?
                </h3>
                <motion.div
                  animate={{ rotate: openFaqIndex === 2 ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-gray-600 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openFaqIndex === 2 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-gray-700 space-y-4">
                      <p>
                        La plupart des visiteurs n&apos;ont pas besoin de visa pour entrer en Haïti pour un séjour touristique de moins de <strong>90 jours</strong>.
                        Les citoyens de nombreux pays, dont les <strong>États-Unis</strong>, le <strong>Canada</strong>, la <strong>France</strong>, la <strong>Belgique</strong>, la <strong>Suisse</strong> et la majorité des pays de la Caraïbe, peuvent entrer simplement avec un passeport valide et un billet de retour.
                      </p>
                      <p>
                        À l&apos;arrivée, une petite taxe touristique peut être demandée (souvent incluse dans le prix du billet d&apos;avion).
                      </p>
                      <p>
                        Pour les séjours plus longs ou les voyages d&apos;affaires, il est recommandé de contacter l&apos;ambassade ou le consulat d&apos;Haïti le plus proche afin d&apos;obtenir les informations les plus récentes sur les exigences de visa.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Question 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 3 ? null : 3)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-black/5 transition"
              >
                <h3 className="text-xl font-bold text-gray-900 pr-4">
                  Est-il sûr de voyager en Haïti ?
                </h3>
                <motion.div
                  animate={{ rotate: openFaqIndex === 3 ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-gray-600 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openFaqIndex === 3 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-gray-700 space-y-4">
                      <p>
                        Comme dans tout pays, il est important de rester attentif à son environnement, mais Haïti offre une expérience unique et chaleureuse à ceux qui prennent le temps de la découvrir.
                        Les visiteurs trouvent souvent que les Haïtiens sont parmi les peuples les plus accueillants des Caraïbes, toujours prêts à partager leur culture, leur musique et leur art.
                      </p>
                      <p>
                        Les zones touristiques comme <strong>Jacmel</strong>, <strong>Cap-Haïtien</strong>, <strong>Kenscoff</strong> ou <strong>Île-à-Vache</strong> sont particulièrement appréciées pour leur tranquillité, leurs plages magnifiques et leur atmosphère conviviale.
                        Avec un peu de préparation et en suivant les conseils locaux, votre séjour en Haïti sera à la fois sûr, enrichissant et inoubliable.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="text-xl font-bold mb-4">{t('footer.about')}</h3>
              <p className="text-gray-400">
                {t('footer.description')}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">{t('footer.quickLinks')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/admin" className="hover:text-white transition">{t('footer.administration')}</Link></li>
                <li><Link href="/partner/dashboard" className="hover:text-white transition">{t('footer.partnerSpace')}</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">{t('footer.privacy')}</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-bold mb-4">{t('footer.contact')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Port-au-Prince, Haïti
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  +509 3816 0006
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  mdt@tourisme.gov.ht
                </li>
              </ul>
            </div>
          </div>

          {/* Logo Ministère du Tourisme */}
          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col items-center">
            <img
              src="/images-mt.png"
              alt="Ministère du Tourisme d'Haïti"
              className="h-24 w-auto mb-4"
            />
            <p className="text-gray-400">&copy; 2025 Discover Haiti. {t('footer.copyright')}</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authModalMode}
      />

      {/* Location Permission Modal */}
      <LocationPermissionModal />
    </div>
  );
}
