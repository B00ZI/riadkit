// hooks/useRequests.ts
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
    created_at_raw?: string; // ISO date string for frontend filtering
    notes?: string;
};

export type UseRequestsOptions = {
    status?: string;       // comma-separated, e.g., 'pending,in_progress'
    days?: number;         // only restricts 'completed' orders
    from?: string;         // YYYY-MM-DD
    to?: string;           // YYYY-MM-DD
    sort?: 'asc' | 'desc';
};

export function useRequests(options?: UseRequestsOptions) {
    const [requests, setRequests] = useState<GuestRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Store options in ref to avoid re-creating the fetch function on every change
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

    // ─── Fetch Requests ──────────────────────────────────────
    const fetchRequests = useCallback(async (fetchOptions?: UseRequestsOptions) => {
        const token = Cookies.get('riadkit_staff_token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        // Use provided options or fallback to the hook's options
        const opts = fetchOptions || optionsRef.current;
        const queryString = buildQueryString(opts);
        
        try {
            setError(null);
            const response = await fetchApi<any>(`/api/requests${queryString}`);
            
            // Handle both array and object responses
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
        } catch (error: any) {
            console.error('Failed to fetch requests:', error);
            setError(error.message || 'Failed to load requests');
            setRequests([]);
        } finally {
            setIsLoading(false);
        }
    }, [buildQueryString]);

    // ─── Refresh with New Options ────────────────────────────
    const refresh = useCallback((newOptions?: UseRequestsOptions) => {
        return fetchRequests(newOptions);
    }, [fetchRequests]);

    // ─── Initial Fetch & Polling ─────────────────────────────
    useEffect(() => {
        fetchRequests();

        const interval = setInterval(() => {
            fetchRequests();
        }, 30000); // Poll every 30 seconds

        return () => clearInterval(interval);
    }, [fetchRequests]);

    // ─── Update Status ────────────────────────────────────────
    const updateStatus = async (requestId: number, status: GuestRequest['status']) => {
        try {
            setError(null);
            await fetchApi(`/api/requests/${requestId}`, {
                method: 'PATCH',
                body: JSON.stringify({ status })
            });
            
            // Optimistic update – keep the request in the list with new status
            setRequests(prev => prev.map(req =>
                req.id === requestId ? { ...req, status } : req
            ));
            
            // After a moment, re-fetch to sync with server (optional)
            // This ensures any server-side changes are reflected
            setTimeout(() => fetchRequests(), 500);
        } catch (error: any) {
            console.error('Failed to update status:', error);
            setError(error.message || 'Failed to update request status');
            // Revert by re-fetching
            await fetchRequests();
            throw error;
        }
    };

    return { 
        requests, 
        isLoading, 
        error,
        updateStatus, 
        refresh,
        // Convenience: re-fetch with new options
        fetch: fetchRequests,
    };
}