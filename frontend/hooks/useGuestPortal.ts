// hooks/useGuestPortal.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { fetchApi } from '@/lib/api';

export type GuestPortalData = {
    riad: {
        name: string;
        description: string;
        wifiName: string;
        wifiPassword: string;
        whatsappNumber: string;
    };
    room?: string;
    menu_categories: any[];
    services: any[];
    excursions: any[];
    session_status: 'active' | 'expired' | 'none';
    current_session_id?: string;
};

export function useGuestPortal(qrToken: string) {
    const [data, setData] = useState<GuestPortalData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExpired, setIsExpired] = useState(false);

    const bootstrapPortal = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch bootstrap data from Laravel
            // fetchApi handles appending ?session_id=... automatically if cookie exists
            const res = await fetchApi<GuestPortalData>(`/api/guest/portal/${qrToken}`);
            
            setData(res);

            // �️ STICKY TOKEN LOGIC:
            // Save the session_id from backend - NO EXPIRATION
            // The backend controls session validity via session_status
            if (res.current_session_id) {
                Cookies.set('riadkit_session_id', res.current_session_id, { 
                    path: '/',
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax'
                    // ✅ NO 'expires' - cookie is session-only (sticky)
                });
            }

            if (res.session_status === 'expired') {
                setIsExpired(true);
            } else if (res.session_status === 'active') {
                setIsExpired(false);
            }

        } catch (error: any) {
            console.error('Failed to load guest portal:', error);
            if (error.status === 403) {
                setIsExpired(true);
                // ✅ Keep the cookie - it's the backend that says it's expired
                // We keep it for Sticky Token Defense
            }
        } finally {
            setIsLoading(false);
        }
    }, [qrToken]);

    // Listen for the custom event from lib/api.ts for mid-session expiration
    useEffect(() => {
        bootstrapPortal();

        const handleExpire = () => setIsExpired(true);
        window.addEventListener('guest-session-expired', handleExpire);
        return () => window.removeEventListener('guest-session-expired', handleExpire);
    }, [bootstrapPortal]);

    return { data, isLoading, isExpired, refresh: bootstrapPortal };
}