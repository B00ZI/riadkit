import { useState, useEffect, useCallback, useRef } from 'react';
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
    created_at_raw?: string;
    notes?: string;
};

export type UseRequestsOptions = {
    status?: string;
    days?: number;
    from?: string;
    to?: string;
    sort?: 'asc' | 'desc';
};

export function useRequests(options?: UseRequestsOptions) {
    const [requests, setRequests] = useState<GuestRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Stable serialized representation of options to prevent infinite interval resets
    const optionsKey = JSON.stringify(options ?? {});
    const optionsRef = useRef(options);
    optionsRef.current = options;

    // ─── Build Query String ──────────────────────────────────
    const buildQueryString = useCallback((opts?: UseRequestsOptions) => {
        const params = new URLSearchParams();
        if (opts?.status) params.append('status', opts.status);
        if (opts?.days) params.append('days', String(opts.days));
        if (opts?.from) params.append('from', opts.from);
        if (opts?.to) params.append('to', opts.to);
        if (opts?.sort) params.append('sort', opts.sort);
        
        const query = params.toString();
        return query ? `?${query}` : '';
    }, []);

    // ─── Fetch Requests (Silent Background Support) ─────────
    const fetchRequests = useCallback(async (fetchOptions?: UseRequestsOptions, isSilent = false) => {
        const token = Cookies.get('riadkit_staff_token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        const opts = fetchOptions || optionsRef.current;
        const queryString = buildQueryString(opts);
        
        try {
            // Only toggle loading UI if it's the initial load, not a background poll
            if (!isSilent && requests.length === 0) {
                setIsLoading(true);
            }

            const response = await fetchApi<any>(`/api/requests${queryString}`);
            
            let requestsData = response;
            if (response && typeof response === 'object' && !Array.isArray(response)) {
                if (response.data && Array.isArray(response.data)) {
                    requestsData = response.data;
                } else if (response.requests && Array.isArray(response.requests)) {
                    requestsData = response.requests;
                } else {
                    requestsData = Array.isArray(response) ? response : [response];
                }
            }
            
            setRequests(Array.isArray(requestsData) ? requestsData : []);
            setError(null);
        } catch (err: any) {
            console.error('Failed to fetch requests:', err);
            // Only surface error if we have no existing requests to display
            if (requests.length === 0) {
                setError(err.message || 'Failed to load requests');
            }
        } finally {
            setIsLoading(false);
        }
    }, [buildQueryString]);

    // ─── Refresh Handler ─────────────────────────────────────
    const refresh = useCallback((newOptions?: UseRequestsOptions) => {
        return fetchRequests(newOptions, false);
    }, [fetchRequests]);

    // ─── Initial Fetch & Controlled Polling ─────────────────
    useEffect(() => {
        // Initial fetch (shows loader if empty)
        fetchRequests(undefined, false);

        // Silent background polling every 20 seconds
        const interval = setInterval(() => {
            fetchRequests(undefined, true);
        }, 20000);

        return () => clearInterval(interval);
    }, [optionsKey, fetchRequests]);

    // ─── Optimistic Update Status ────────────────────────────
    const updateStatus = async (requestId: number, status: GuestRequest['status']) => {
        // 1. Instant local state mutation
        setRequests(prev => prev.map(req =>
            req.id === requestId ? { ...req, status } : req
        ));

        try {
            setError(null);
            await fetchApi(`/api/requests/${requestId}`, {
                method: 'PATCH',
                body: JSON.stringify({ status })
            });

            // 2. Silent sync after update completes
            fetchRequests(undefined, true);
        } catch (err: any) {
            console.error('Failed to update status:', err);
            setError(err.message || 'Failed to update request status');
            // Revert state by re-fetching
            await fetchRequests(undefined, false);
            throw err;
        }
    };

    return { 
        requests, 
        isLoading, 
        error,
        updateStatus, 
        refresh,
        fetch: fetchRequests,
    };
}