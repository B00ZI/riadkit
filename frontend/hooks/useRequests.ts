// hooks/useRequests.ts
import { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '@/lib/api';
import Cookies from 'js-cookie';

export type GuestRequest = {
    id: number;
    room_id: number;
    room_number: string;
    type: 'menu' | 'service' | 'excursion';
    item_name: string;
    quantity: number;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    total_price: string;
    created_at: string;
    notes?: string;
};

export function useRequests() {
    const [requests, setRequests] = useState<GuestRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRequests = useCallback(async () => {
        const token = Cookies.get('riadkit_staff_token');
        if (!token) {
            setIsLoading(false);
            return;
        }
        
        try {
            setError(null);
            const response = await fetchApi<any>('/api/requests');
            
            // ✅ Handle both array and object responses
            let requestsData = response;
            
            // If response is an object with a data property (Laravel pagination/collection)
            if (response && typeof response === 'object' && !Array.isArray(response)) {
                // Check for common Laravel response patterns
                if (response.data && Array.isArray(response.data)) {
                    requestsData = response.data;
                } else if (response.requests && Array.isArray(response.requests)) {
                    requestsData = response.requests;
                } else {
                    // If it's a single object or unexpected structure, wrap in array
                    console.warn('Unexpected requests response structure:', response);
                    requestsData = Array.isArray(response) ? response : [response];
                }
            }
            
            // Ensure we have an array
            setRequests(Array.isArray(requestsData) ? requestsData : []);
        } catch (error: any) {
            console.error('Failed to fetch requests:', error);
            setError(error.message || 'Failed to load requests');
            setRequests([]); // Set empty array on error
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Poll for new orders every 30 seconds
    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 30000);
        return () => clearInterval(interval);
    }, [fetchRequests]);

    const updateStatus = async (requestId: number, status: GuestRequest['status']) => {
        try {
            setError(null);
            await fetchApi(`/api/requests/${requestId}`, {
                method: 'PATCH',
                body: JSON.stringify({ status })
            });
            // Optimistic update
            setRequests(prev => prev.map(req =>
                req.id === requestId ? { ...req, status } : req
            ));
        } catch (error: any) {
            console.error('Failed to update status:', error);
            setError(error.message || 'Failed to update request status');
            await fetchRequests();
            throw error;
        }
    };

    return { 
        requests, 
        isLoading, 
        error,
        updateStatus, 
        refresh: fetchRequests 
    };
}