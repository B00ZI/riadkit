import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { getEcho } from '@/lib/echo';
import { toast } from 'sonner';
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

// Shape of the Reverb WebSocket payload from RequestCreated.php / RequestUpdated.php
interface ReverbRequestPayload {
  id: number;
  riad_id: number;
  room_id: number;
  room_name?: string;
  session_id?: string;
  type: 'menu' | 'service' | 'excursion';
  item_id?: number;
  item_name?: string;
  quantity: number;
  total_price?: string;
  notes: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

export function useRequests(options?: UseRequestsOptions) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [requests, setRequests] = useState<GuestRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stable options reference
  const optionsKey = JSON.stringify(options ?? {});
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Track riad_id as a primitive to prevent unnecessary effect re-runs
  const riadId = user?.riad_id;

  // Initialize notification sound safely
  useEffect(() => {
    const audio = new Audio('/sounds/notification.mp3');
    audio.onerror = () => {
      // Prevent unhandled 404 error logs if audio file is missing
      audioRef.current = null;
    };
    audioRef.current = audio;
  }, []);

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

  // ─── Fetch Requests (Initial Load Only) ─────────────────
  const fetchRequests = useCallback(async (fetchOptions?: UseRequestsOptions) => {
    const token = Cookies.get('riadkit_staff_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    const opts = fetchOptions || optionsRef.current;
    const queryString = buildQueryString(opts);

    try {
      if (requests.length === 0) {
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
      if (requests.length === 0) {
        setError(err.message || 'Failed to load requests');
      }
    } finally {
      setIsLoading(false);
    }
  }, [buildQueryString, requests.length]);

  // Manual Refresh Handler
  const refresh = useCallback((newOptions?: UseRequestsOptions) => {
    return fetchRequests(newOptions);
  }, [fetchRequests]);

  // Initial Fetch on Mount
  useEffect(() => {
    fetchRequests();
  }, [optionsKey, fetchRequests]);

  // ─── Real-Time WebSocket Listener ─────────────────────────
  useEffect(() => {
    if (isAuthLoading) {
      console.log('⏳ Waiting for auth check to finish...');
      return;
    }

    if (!user) {
      console.warn('⚠️ WebSocket setup skipped: No logged-in user detected.');
      return;
    }

    if (!riadId) {
      console.warn('⚠️ WebSocket setup skipped: user.riad_id is missing!', user);
      return;
    }

    const echo = getEcho();
    if (!echo) {
      console.warn('⚠️ WebSocket setup skipped: getEcho() returned null (missing token cookie).');
      return;
    }

    const channelName = `riad.${riadId}.reception`;
    console.log(`� Initializing WebSocket listener on private channel: ${channelName}`);

    const channel = echo.private(channelName);

    // 1. Listen for New Orders
    channel.listen('.request.created', (data: ReverbRequestPayload) => {
      console.log('⚡ Real-Time Request Created Event Received:', data);

      // Audio notification
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // Prevent unhandled autoplay restriction rejections
        });
      }

      // Resolve dynamic item name or fallback to formatted type
      const resolvedItemName =
        data.item_name ||
        `${data.type.charAt(0).toUpperCase() + data.type.slice(1)} Request`;

      // Map incoming payload into GuestRequest shape
      const newRequest: GuestRequest = {
        id: data.id,
        room_id: data.room_id,
        room_number: data.room_name || `Room #${data.room_id}`,
        type: data.type,
        item_name: resolvedItemName,
        quantity: data.quantity,
        status: data.status,
        total_price: data.total_price || '0.00',
        created_at: data.created_at
          ? new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notes: data.notes ?? undefined,
      };

      // Toast Notification
      toast.info(`New Order from ${newRequest.room_number}`, {
        description: `${data.quantity}x ${resolvedItemName}${data.notes ? ` ("${data.notes}")` : ''}`,
        duration: 8000,
      });

      // Prepend new request into state & prevent duplicates
      setRequests((prev) => {
        if (prev.some((r) => r.id === newRequest.id)) return prev;
        return [newRequest, ...prev];
      });
    });

    // 2. Listen for Request Status Updates (e.g. pending -> in_progress -> completed)
    channel.listen('.request.updated', (data: ReverbRequestPayload) => {
      console.log('⚡ Real-Time Request Updated Event Received:', data);

      setRequests((prev) =>
        prev.map((req) => (req.id === data.id ? { ...req, status: data.status } : req))
      );
    });

    return () => {
      console.log(`� Cleaning up event listeners on: ${channelName}`);
      channel.stopListening('.request.created');
      channel.stopListening('.request.updated');
    };
  }, [riadId, isAuthLoading, user]);

  // ─── Optimistic Update Status ────────────────────────────
  const updateStatus = async (requestId: number, status: GuestRequest['status']) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status } : req))
    );

    try {
      setError(null);
      await fetchApi(`/api/requests/${requestId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch (err: any) {
      console.error('Failed to update status:', err);
      setError(err.message || 'Failed to update request status');
      await fetchRequests();
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