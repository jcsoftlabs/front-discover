export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  country?: string;
  role: 'USER' | 'ADMIN' | 'PARTNER';
  refreshToken?: string;
  resetToken?: string;
  resetTokenExpires?: string;
  // OAuth fields
  googleId?: string;
  provider?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  password?: string;
  refreshToken?: string;
  phone?: string;
  description?: string;
  website?: string;
  address?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  validatedBy?: string;
  validatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Establishment {
  id: string;
  name: string;
  description?: string;
  type: 'HOTEL' | 'RESTAURANT' | 'BAR' | 'CAFE' | 'ATTRACTION' | 'SHOP' | 'SERVICE';
  price: number;
  images?: string[];
  address?: string;
  ville?: string; // City
  departement?: string; // Department
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  amenities?: string[];
  menu?: any;
  availability?: any;
  isActive: boolean;
  partnerId?: string;
  createdAt: string;
  updatedAt: string;
  // Relations (populated)
  partner?: Partner;
  reviews?: Review[];
  promotions?: Promotion[];
}

// Alias pour compatibilité
export type Listing = Establishment;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  moderatedBy?: string;
  moderatedAt?: string;
  moderationNote?: string;
  userId: string;
  establishmentId: string;
  createdAt: string;
  updatedAt: string;
  // Relations (populated)
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  establishment?: {
    id: string;
    name: string;
    type: string;
  };
  moderator?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface Favorite {
  id: string;
  userId: string;
  establishmentId?: string;
  siteId?: string;
  createdAt: string;
  // Relations populateées
  establishment?: Establishment;
  site?: Site;
}

export interface Promotion {
  id: string;
  title: string;
  description?: string;
  discount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  establishmentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerStats {
  totalEstablishments: number;
  activeEstablishments: number;
  totalReviews: number;
  averageRating: number;
  activePromotions: number;
}

export interface PartnerDashboard {
  partner: {
    id: string;
    name: string;
    email: string;
    status: string;
    validatedAt?: string;
  };
  stats: PartnerStats;
  recentReviews: Review[];
}

export interface Site {
  id: string;
  name: string;
  description?: string;
  address: string;
  ville?: string; // City
  departement?: string; // Department
  latitude?: number;
  longitude?: number;
  images?: string[];
  category: 'MONUMENT' | 'MUSEUM' | 'PARK' | 'BEACH' | 'MOUNTAIN' | 'CULTURAL' | 'RELIGIOUS' | 'NATURAL' | 'HISTORICAL' | 'ENTERTAINMENT';
  openingHours?: any;
  entryFee?: number;
  website?: string;
  phone?: string;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  // Relations (populated)
  creator?: User;
}

export interface AdminStats {
  totalUsers: number;
  totalPartners: number;
  totalEstablishments: number;
  totalSites: number;
  totalReviews: number;
  totalPromotions: number;
  pendingPartners: number;
  pendingReviews: number;
  activeEstablishments: number;
  activeSites: number;
}

export interface AdminDashboard {
  stats: AdminStats;
  recentActivity: {
    recentPartners: Array<{
      id: string;
      name: string;
      status: string;
      createdAt: string;
    }>;
    recentPendingReviews: Array<Review & {
      establishment?: {
        name: string;
      };
    }>;
  };
}

export interface Statistics {
  period: number;
  newUsers: number;
  newPartners: number;
  newEstablishments: number;
  newReviews: number;
  distributions: {
    establishmentTypes: Array<{ type: string; _count: { type: number } }>;
    siteCategories: Array<{ category: string; _count: { category: number } }>;
    reviewRatings: Array<{ rating: number; _count: { rating: number } }>;
  };
}

export interface Notification {
  id: string;
  userId: string;
  type: 'REVIEW_INVITATION' | 'PROMOTION' | 'SYSTEM' | 'OTHER';
  title: string;
  message: string;
  establishmentId?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  // Relations (populated)
  user?: User;
}
