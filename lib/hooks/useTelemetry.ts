'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import telemetryService from '../services/telemetry';

/**
 * Hook pour tracker automatiquement les pages visitées
 */
export function useTelemetry() {
    const pathname = usePathname();
    const initialized = useRef(false);

    // Initialiser la session au premier chargement
    useEffect(() => {
        if (!initialized.current) {
            telemetryService.initSession();
            initialized.current = true;

            // Terminer la session quand l'utilisateur quitte
            const handleBeforeUnload = () => {
                telemetryService.endSession();
            };

            window.addEventListener('beforeunload', handleBeforeUnload);
            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
            };
        }
    }, []);

    // Tracker les changements de page
    useEffect(() => {
        if (pathname) {
            telemetryService.trackPageview(pathname);
        }
    }, [pathname]);

    return telemetryService;
}

/**
 * Hook pour tracker les clics
 */
export function useTrackClick() {
    return (elementName: string, metadata?: any) => {
        telemetryService.trackClick(elementName, metadata);
    };
}

/**
 * Hook pour tracker les erreurs
 */
export function useTrackError() {
    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            telemetryService.trackError(
                event.message,
                event.error?.stack,
                event.filename
            );
        };

        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            telemetryService.trackError(
                `Unhandled Promise Rejection: ${event.reason}`,
                event.reason?.stack
            );
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, []);
}
