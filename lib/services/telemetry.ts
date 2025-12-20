import axios from 'axios';

// URL du backend de télémétrie
const TELEMETRY_API_URL = process.env.NEXT_PUBLIC_TELEMETRY_API_URL || 'https://discover-ht-production.up.railway.app';

// Générer un ID de session unique
const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Récupérer ou créer un ID de session
const getSessionId = (): string => {
    if (typeof window === 'undefined') return '';

    let sessionId = sessionStorage.getItem('telemetry_session_id');
    if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem('telemetry_session_id', sessionId);
        sessionStorage.setItem('telemetry_session_start', new Date().toISOString());
    }
    return sessionId;
};

// Récupérer l'ID utilisateur s'il est connecté
const getUserId = (): string | undefined => {
    if (typeof window === 'undefined') return undefined;

    try {
        const authData = localStorage.getItem('authToken');
        if (authData) {
            // Extraire l'userId du token ou du localStorage
            const userId = localStorage.getItem('userId');
            return userId || undefined;
        }
    } catch (error) {
        console.warn('Could not retrieve userId:', error);
    }
    return undefined;
};

// Détecter le type d'appareil
const getDeviceType = (): string => {
    if (typeof window === 'undefined') return 'unknown';

    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'mobile';
    }
    return 'desktop';
};

// Obtenir des infos sur l'appareil
const getDeviceInfo = () => {
    if (typeof window === 'undefined') return {};

    return {
        deviceType: getDeviceType(),
        browser: navigator.userAgent,
        os: navigator.platform,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language
    };
};

/**
 * Service de télémétrie pour tracker l'activité utilisateur
 */
class TelemetryService {
    private sessionId: string;
    private pageStartTime: number;
    private currentPath: string;

    constructor() {
        this.sessionId = '';
        this.pageStartTime = 0;
        this.currentPath = '';
    }

    /**
     * Initialiser une session de télémétrie
     */
    async initSession() {
        if (typeof window === 'undefined') return;

        this.sessionId = getSessionId();
        const deviceInfo = getDeviceInfo();
        const userId = getUserId();

        try {
            await axios.post(`${TELEMETRY_API_URL}/api/telemetry/session/start`, {
                sessionId: this.sessionId,
                userId,
                deviceId: `device_${deviceInfo.deviceType}_${Date.now()}`,
                deviceType: deviceInfo.deviceType,
                browser: deviceInfo.browser,
                os: deviceInfo.os,
                screenResolution: deviceInfo.screenResolution,
                language: deviceInfo.language
            });

            console.log('✅ Telemetry session started:', this.sessionId);
        } catch (error) {
            console.error('❌ Failed to start telemetry session:', error);
        }
    }

    /**
     * Terminer la session de télémétrie
     */
    async endSession() {
        if (!this.sessionId) return;

        try {
            await axios.post(`${TELEMETRY_API_URL}/api/telemetry/session/end`, {
                sessionId: this.sessionId
            });

            console.log('✅ Telemetry session ended');
        } catch (error) {
            console.error('❌ Failed to end telemetry session:', error);
        }
    }

    /**
     * Tracker une vue de page
     */
    async trackPageview(path: string, title?: string) {
        if (typeof window === 'undefined') return;

        // Terminer le tracking de la page précédente
        if (this.currentPath && this.pageStartTime) {
            const timeOnPage = Math.floor((Date.now() - this.pageStartTime) / 1000);
            await this.updatePageTime(this.currentPath, timeOnPage);
        }

        // Commencer le tracking de la nouvelle page
        this.currentPath = path;
        this.pageStartTime = Date.now();
        const userId = getUserId();

        try {
            await axios.post(`${TELEMETRY_API_URL}/api/telemetry/pageview`, {
                sessionId: this.sessionId,
                userId,
                path,
                url: window.location.href,
                title: title || document.title,
                referrer: document.referrer
            });

            console.log('📄 Pageview tracked:', path);
        } catch (error) {
            console.error('❌ Failed to track pageview:', error);
        }
    }

    /**
     * Mettre à jour le temps passé sur une page
     */
    private async updatePageTime(path: string, timeOnPage: number) {
        try {
            await axios.post(`${TELEMETRY_API_URL}/api/telemetry/pageview`, {
                sessionId: this.sessionId,
                userId: getUserId(),
                path,
                url: window.location.href,
                timeOnPage
            });
        } catch (error) {
            console.error('❌ Failed to update page time:', error);
        }
    }

    /**
     * Tracker un événement personnalisé
     */
    async trackEvent(eventType: string, eventName: string, metadata?: any) {
        if (typeof window === 'undefined') return;

        const userId = getUserId();

        try {
            await axios.post(`${TELEMETRY_API_URL}/api/telemetry/event`, {
                sessionId: this.sessionId,
                userId,
                eventType,
                eventName,
                metadata: metadata ? JSON.stringify(metadata) : undefined
            });

            console.log('⚡ Event tracked:', eventType, eventName);
        } catch (error) {
            console.error('❌ Failed to track event:', error);
        }
    }

    /**
     * Tracker un clic
     */
    trackClick(elementName: string, metadata?: any) {
        return this.trackEvent('click', elementName, metadata);
    }

    /**
     * Tracker un partage
     */
    trackShare(itemType: string, itemId: string, platform: string) {
        return this.trackEvent('share', `${itemType}_shared`, {
            itemType,
            itemId,
            platform
        });
    }

    /**
     * Tracker un favori
     */
    trackFavorite(itemType: string, itemId: string, action: 'add' | 'remove') {
        return this.trackEvent('favorite', `${itemType}_${action}_favorite`, {
            itemType,
            itemId,
            action
        });
    }

    /**
     * Tracker la consultation d'un établissement
     */
    trackEstablishmentView(establishmentId: string, metadata?: any) {
        return this.trackEvent('establishment_view', 'establishment_viewed', {
            establishmentId,
            establishmentName: metadata?.name,
            establishmentType: metadata?.type,
            category: metadata?.category,
            ...metadata
        });
    }

    /**
     * Tracker la consultation d'un événement
     */
    trackEventView(eventId: string, metadata?: any) {
        return this.trackEvent('event_view', 'event_viewed', {
            eventId,
            eventName: metadata?.name,
            eventCategory: metadata?.category,
            ...metadata
        });
    }

    /**
     * Tracker la navigation par catégorie
     */
    trackCategoryBrowse(category: string, metadata?: any) {
        return this.trackEvent('category_browse', 'category_browsed', {
            category,
            ...metadata
        });
    }

    /**
     * Tracker une recherche
     */
    trackSearch(query: string, resultsCount: number) {
        return this.trackEvent('search', 'search_performed', {
            query,
            resultsCount
        });
    }

    /**
     * Tracker une erreur
     */
    async trackError(message: string, stack?: string, url?: string) {
        if (typeof window === 'undefined') return;

        const userId = getUserId();

        try {
            await axios.post(`${TELEMETRY_API_URL}/api/telemetry/error`, {
                sessionId: this.sessionId,
                userId,
                errorMessage: message,
                stackTrace: stack,
                url: url || window.location.href,
                userAgent: navigator.userAgent
            });

            console.log('🚨 Error tracked:', message);
        } catch (error) {
            console.error('❌ Failed to track error:', error);
        }
    }

    /**
     * Tracker la localisation
     */
    async trackLocation(latitude: number, longitude: number) {
        const userId = getUserId();

        try {
            await axios.post(`${TELEMETRY_API_URL}/api/telemetry/location`, {
                sessionId: this.sessionId,
                userId,
                latitude,
                longitude
            });

            console.log('📍 Location tracked');
        } catch (error) {
            console.error('❌ Failed to track location:', error);
        }
    }
}

// Instance singleton
const telemetryService = new TelemetryService();

export default telemetryService;
