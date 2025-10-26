'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Briefcase, LogIn, User as UserIcon, Heart, Menu, X, ChevronLeft, ChevronRight, Hotel, UtensilsCrossed, Coffee, MapPinned, ShoppingBag, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import apiClient from '@/lib/axios';
import { Establishment } from '@/types';
import SearchBar from '@/components/ui/SearchBar';
import ListingCard from '@/components/ui/ListingCard';
import AuthModal from '@/components/modals/AuthModal';

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

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [establishments, setEstablishments] = useState<(Establishment & { averageRating?: number; reviewCount?: number })[]>([]);
  const [filteredEstablishments, setFilteredEstablishments] = useState<(Establishment & { averageRating?: number; reviewCount?: number })[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchEstablishments();
  }, []);

  // Auto-advance slider every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const fetchEstablishments = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/establishments');
      if (response.data.success) {
        const data = response.data.data.map((est: any) => {
          // Calculer la moyenne des reviews
          const reviews = est.reviews || [];
          const averageRating = reviews.length > 0
            ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
            : 0;
          
          return {
            ...est,
            averageRating,
            reviewCount: reviews.length,
          };
        });
        setEstablishments(data);
        setFilteredEstablishments(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des établissements:', error);
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
    
    if (category === '') {
      setFilteredEstablishments(establishments);
    } else {
      const filtered = establishments.filter((est) => est.type === category);
      setFilteredEstablishments(filtered);
    }
  };

  // Calcul de la pagination
  const totalPages = Math.ceil(filteredEstablishments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEstablishments = filteredEstablishments.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 800, behavior: 'smooth' });
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🇭🇹</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Discover Haiti
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {isAuthenticated && user ? (
                <>
                  <Link href="/favorites" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
                    <Heart className="w-5 h-5" />
                    Favoris
                  </Link>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <span className="text-gray-700">
                    Bonjour, {user.firstName}
                  </span>
                  {user.role === 'PARTNER' && (
                    <Link
                      href="/partner/dashboard"
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <Briefcase className="w-5 h-5" />
                      Mon espace
                    </Link>
                  )}
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Briefcase className="w-5 h-5" />
                      Administration
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-gray-700 hover:text-red-600 transition"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                  >
                    <LogIn className="w-5 h-5" />
                    Connexion
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
                  >
                    <UserIcon className="w-5 h-5" />
                    Inscription
                  </button>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition"
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
              className="md:hidden py-4 border-t border-gray-200"
            >
              <nav className="flex flex-col gap-3">
                {isAuthenticated && user ? (
                  <>
                    <Link href="/favorites" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                      <Heart className="w-5 h-5" />
                      Favoris
                    </Link>
                    <span className="px-4 py-2 text-gray-700">
                      Bonjour, {user.firstName}
                    </span>
                    {user.role === 'PARTNER' && (
                      <Link
                        href="/partner/dashboard"
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        <Briefcase className="w-5 h-5" />
                        Mon espace
                      </Link>
                    )}
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <Briefcase className="w-5 h-5" />
                        Administration
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        openAuthModal('login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                      <LogIn className="w-5 h-5" />
                      Connexion
                    </button>
                    <button
                      onClick={() => {
                        openAuthModal('register');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
                    >
                      <UserIcon className="w-5 h-5" />
                      Inscription
                    </button>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </div>
      </header>

      {/* Hero Section with Slider */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[650px] flex items-center">
        {/* Background Image Slider */}
        <div className="absolute inset-0">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === index 
                  ? 'bg-white w-12 h-3' 
                  : 'bg-white/50 w-3 h-3 hover:bg-white/75'
              }`}
              aria-label={`Aller à la diapositive ${index + 1}`}
            />
          ))}
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6">
              <span className="text-white font-semibold text-sm tracking-wide">🌴 Bienvenue en Haïti</span>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl leading-tight"
          >
            Découvrez la Perle des <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">Antilles</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto drop-shadow-lg font-medium"
          >
            Explorez les plus beaux hôtels, restaurants, sites touristiques et attractions d'Haïti
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <SearchBar onSearch={handleSearch} />
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Explorer par catégorie
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.value;
                return (
                  <motion.button
                    key={cat.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryChange(cat.value)}
                    className={`
                      relative overflow-hidden px-6 py-3 rounded-full font-semibold transition-all duration-300
                      ${
                        isActive
                          ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                          : 'bg-white text-gray-700 hover:shadow-md border border-gray-200'
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      {cat.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeCategory"
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Listings Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedCategory ? categories.find(c => c.value === selectedCategory)?.label : 'Tous les établissements'}
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
                              ${
                                currentPage === page
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="text-xl font-bold mb-4">Discover Haiti</h3>
              <p className="text-gray-400">
                Plateforme de tourisme dédiée à la promotion des merveilles d'Haïti.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Liens rapides</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/admin" className="hover:text-white transition">Administration</Link></li>
                <li><Link href="/partner/dashboard" className="hover:text-white transition">Espace Partenaire</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Port-au-Prince, Haïti
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  +509 XXXX XXXX
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  contact@discoverhaiti.com
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 Discover Haiti. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authModalMode}
      />
    </div>
  );
}
