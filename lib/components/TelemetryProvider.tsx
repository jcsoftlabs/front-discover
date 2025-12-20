'use client';

import { ReactNode } from 'react';
import { useTelemetry, useTrackError } from '../hooks/useTelemetry';

interface TelemetryProviderProps {
    children: ReactNode;
}

export function TelemetryProvider({ children }: TelemetryProviderProps) {
    // Initialiser le tracking automatique des pages
    useTelemetry();

    // Tracker les erreurs automatiquement
    useTrackError();

    return <>{children}</>;
}
