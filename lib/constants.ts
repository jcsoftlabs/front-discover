/**
 * Constantes pour l'application Touris
 */

/**
 * Les 10 départements d'Haïti
 */
export const DEPARTMENTS = [
  { code: 'OUEST', name: 'Ouest' },
  { code: 'NORD', name: 'Nord' },
  { code: 'SUD', name: 'Sud' },
  { code: 'ARTIBONITE', name: 'Artibonite' },
  { code: 'CENTRE', name: 'Centre' },
  { code: 'GRAND_ANSE', name: 'Grand\'Anse' },
  { code: 'NIPPES', name: 'Nippes' },
  { code: 'NORD_EST', name: 'Nord-Est' },
  { code: 'NORD_OUEST', name: 'Nord-Ouest' },
  { code: 'SUD_EST', name: 'Sud-Est' },
] as const;

/**
 * Principales villes d'Haïti par département
 */
export const CITIES_BY_DEPARTMENT: Record<string, string[]> = {
  OUEST: [
    'Port-au-Prince',
    'Pétion-Ville',
    'Carrefour',
    'Delmas',
    'Kenscoff',
    'Gressier',
    'Léogâne',
    'Croix-des-Bouquets',
  ],
  NORD: [
    'Cap-Haïtien',
    'Milot',
    'Limonade',
    'Quartier-Morin',
    'Plaine-du-Nord',
    'Grande-Rivière-du-Nord',
  ],
  SUD: [
    'Les Cayes',
    'Port-Salut',
    'Aquin',
    'Saint-Louis-du-Sud',
    'Chardonnières',
  ],
  ARTIBONITE: [
    'Gonaïves',
    'Saint-Marc',
    'Dessalines',
    'Petite-Rivière-de-l\'Artibonite',
  ],
  CENTRE: [
    'Hinche',
    'Mirebalais',
    'Thomassique',
    'Lascahobas',
  ],
  GRAND_ANSE: [
    'Jérémie',
    'Anse-d\'Hainault',
    'Dame-Marie',
    'Corail',
  ],
  NIPPES: [
    'Miragoâne',
    'Petit-Goâve',
    'Anse-à-Veau',
    'Baradères',
  ],
  NORD_EST: [
    'Fort-Liberté',
    'Ouanaminthe',
    'Trou-du-Nord',
    'Vallières',
  ],
  NORD_OUEST: [
    'Port-de-Paix',
    'Saint-Louis-du-Nord',
    'Môle-Saint-Nicolas',
    'Bombardopolis',
  ],
  SUD_EST: [
    'Jacmel',
    'Marigot',
    'Cayes-Jacmel',
    'Belle-Anse',
  ],
};

/**
 * Types d'établissements
 */
export const ESTABLISHMENT_TYPES = [
  { value: 'HOTEL', label: 'Hôtel' },
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'BAR', label: 'Bar' },
  { value: 'CAFE', label: 'Café' },
  { value: 'ATTRACTION', label: 'Attraction' },
  { value: 'SHOP', label: 'Boutique' },
  { value: 'SERVICE', label: 'Service' },
] as const;

/**
 * Catégories de sites touristiques
 */
export const SITE_CATEGORIES = [
  { value: 'MONUMENT', label: 'Monument' },
  { value: 'MUSEUM', label: 'Musée' },
  { value: 'PARK', label: 'Parc' },
  { value: 'BEACH', label: 'Plage' },
  { value: 'MOUNTAIN', label: 'Montagne' },
  { value: 'CULTURAL', label: 'Culturel' },
  { value: 'RELIGIOUS', label: 'Religieux' },
  { value: 'NATURAL', label: 'Naturel' },
  { value: 'HISTORICAL', label: 'Historique' },
  { value: 'ENTERTAINMENT', label: 'Divertissement' },
] as const;

/**
 * Statuts de partenaire
 */
export const PARTNER_STATUS = [
  { value: 'PENDING', label: 'En attente', color: 'yellow' },
  { value: 'APPROVED', label: 'Approuvé', color: 'green' },
  { value: 'REJECTED', label: 'Rejeté', color: 'red' },
  { value: 'SUSPENDED', label: 'Suspendu', color: 'orange' },
] as const;

/**
 * Statuts d'avis
 */
export const REVIEW_STATUS = [
  { value: 'PENDING', label: 'En attente', color: 'yellow' },
  { value: 'APPROVED', label: 'Approuvé', color: 'green' },
  { value: 'REJECTED', label: 'Rejeté', color: 'red' },
] as const;

/**
 * Types de notification
 */
export const NOTIFICATION_TYPES = [
  { value: 'REVIEW_INVITATION', label: 'Invitation avis' },
  { value: 'PROMOTION', label: 'Promotion' },
  { value: 'SYSTEM', label: 'Système' },
  { value: 'OTHER', label: 'Autre' },
] as const;

/**
 * Rôles utilisateur
 */
export const USER_ROLES = [
  { value: 'USER', label: 'Utilisateur' },
  { value: 'PARTNER', label: 'Partenaire' },
  { value: 'ADMIN', label: 'Administrateur' },
] as const;

/**
 * Équipements/Amenities courantes pour les établissements
 */
export const COMMON_AMENITIES = [
  'WiFi gratuit',
  'Parking',
  'Climatisation',
  'Piscine',
  'Restaurant',
  'Bar',
  'Spa',
  'Salle de sport',
  'Accès handicapé',
  'Animaux acceptés',
  'Service en chambre',
  'Blanchisserie',
  'Coffre-fort',
  'Réception 24h/24',
  'Terrasse',
  'Jardin',
  'Vue sur mer',
  'Vue sur montagne',
] as const;

/**
 * Obtenir le label d'un statut de partenaire
 */
export function getPartnerStatusLabel(status: string): string {
  return PARTNER_STATUS.find(s => s.value === status)?.label || status;
}

/**
 * Obtenir la couleur d'un statut de partenaire
 */
export function getPartnerStatusColor(status: string): string {
  return PARTNER_STATUS.find(s => s.value === status)?.color || 'gray';
}

/**
 * Obtenir le label d'un statut d'avis
 */
export function getReviewStatusLabel(status: string): string {
  return REVIEW_STATUS.find(s => s.value === status)?.label || status;
}

/**
 * Obtenir la couleur d'un statut d'avis
 */
export function getReviewStatusColor(status: string): string {
  return REVIEW_STATUS.find(s => s.value === status)?.color || 'gray';
}

/**
 * Obtenir le label d'un type d'établissement
 */
export function getEstablishmentTypeLabel(type: string): string {
  return ESTABLISHMENT_TYPES.find(t => t.value === type)?.label || type;
}

/**
 * Obtenir le label d'une catégorie de site
 */
export function getSiteCategoryLabel(category: string): string {
  return SITE_CATEGORIES.find(c => c.value === category)?.label || category;
}

/**
 * Obtenir le label d'un type de notification
 */
export function getNotificationTypeLabel(type: string): string {
  return NOTIFICATION_TYPES.find(t => t.value === type)?.label || type;
}

/**
 * Obtenir le label d'un rôle
 */
export function getUserRoleLabel(role: string): string {
  return USER_ROLES.find(r => r.value === role)?.label || role;
}
