// hooks/useGuestRequest.ts
'use client';

import { useState } from 'react';
import { fetchApi } from '@/lib/api';
import Cookies from 'js-cookie';

export function useGuestRequest(qrToken: string) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendRequest = async (params: {
        type: 'menu' | 'service' | 'excursion';
        item_id: number;
        quantity?: number;
        notes?: string;
    }) => {
        setIsSubmitting(true);
        setError(null);

        // ✅ Explicitly get the session_id from the cookie
        const sessionId = Cookies.get('riadkit_session_id');

        if (!sessionId) {
            const msg = 'No active session. Please re‑scan the QR code.';
            setError(msg);
            setIsSubmitting(false);
            return { success: false, error: msg };
        }

        try {
            // Build the payload with explicit session_id
            const payload = {
                qr_token: qrToken,
                session_id: sessionId,
                ...params,
            };

            // The fetchApi will still inject session_id if configured, but we now send it explicitly.
            // To avoid duplication, you could choose to rely solely on this explicit payload.
            // Here we keep both for safety (if auto-injection is disabled, this still works).
            await fetchApi('/api/guest/requests', {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            return { success: true };
        } catch (error: any) {
            const errorMessage = error.data?.message || 'Request failed. Session might be expired.';
            setError(errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        } finally {
            setIsSubmitting(false);
        }
    };

    const clearError = () => setError(null);

    return {
        sendRequest,
        isSubmitting,
        error,
        clearError,
    };
}