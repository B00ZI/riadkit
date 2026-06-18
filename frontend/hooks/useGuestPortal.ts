// hooks/useGuestPortal.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { fetchApi } from '@/lib/api';

export type GuestPortalData = {
    room_id?: number;
    room_number?: string;
    riad: {
        name: string;
        description: string;
        wifiName: string;
        wifiPassword: string;
        whatsappNumber: string;
        instagramUrl?: string;
        logoUrl?: string;
        currency?: string;
    };
    menu: any[];
    services: any[];
    excursions: any[];
    session_id?: string | null;          // ✅ Backend uses this
    session_status: 'active' | 'expired' | 'none';
    // current_session_id is not used by backend, but kept for compatibility if needed
    current_session_id?: string;
};

export function useGuestPortal(qrToken: string) {
    const [data, setData] = useState<GuestPortalData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExpired, setIsExpired] = useState(false);

    const bootstrapPortal = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetchApi<GuestPortalData>(`/api/guest/portal/${qrToken}`);
            setData(res);

            // ✅ Use 'session_id' from backend (not 'current_session_id')
            const sessionId = res.session_id ?? res.current_session_id; // fallback
            if (sessionId) {
                Cookies.set('riadkit_session_id', sessionId, {
                    path: '/',
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    // ✅ No expiration – sticky token
                });
            } else {
                // If no session_id, remove any stale cookie
                Cookies.remove('riadkit_session_id', { path: '/' });
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
                // Keep the cookie – backend says it's expired, but we keep it for sticky token defense
            }
        } finally {
            setIsLoading(false);
        }
    }, [qrToken]);

    useEffect(() => {
        bootstrapPortal();
        const handleExpire = () => setIsExpired(true);
        window.addEventListener('guest-session-expired', handleExpire);
        return () => window.removeEventListener('guest-session-expired', handleExpire);
    }, [bootstrapPortal]);

    return { data, isLoading, isExpired, refresh: bootstrapPortal };
}