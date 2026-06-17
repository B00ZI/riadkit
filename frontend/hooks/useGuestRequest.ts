// hooks/useGuestRequest.ts
'use client';

import { useState } from 'react';
import { fetchApi } from '@/lib/api';

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
        
        try {
            // lib/api.ts will automatically inject qr_token and session_id into the body
            // Because GUEST_BODY_ROUTES includes '/api/guest/requests'
            await fetchApi('/api/guest/requests', {
                method: 'POST',
                body: JSON.stringify({
                    qr_token: qrToken,
                    ...params
                })
            });
            return { success: true };
        } catch (error: any) {
            const errorMessage = error.data?.message || 'Request failed. Session might be expired.';
            setError(errorMessage);
            return { 
                success: false, 
                error: errorMessage 
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
        clearError 
    };
}