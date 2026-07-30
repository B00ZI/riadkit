import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { getEcho } from '@/lib/echo';
import { toast } from '@/lib/toast';
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

  const requestsRef = useRef(requests);
  requestsRef.current = requests;

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
    if (isAuthLoading || !user || !riadId) return;

    const echo = getEcho();
    if (!echo) return;

    const channelName = `riad.${riadId}.reception`;

    const channel = echo.private(channelName);

    channel.listen('.request.created', (data: ReverbRequestPayload) => {

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
      toast.orderNew(
        newRequest.room_number,
        `${data.quantity}x ${resolvedItemName}${data.notes ? ` (${data.notes})` : ''}`,
        { duration: 8000 }
      );

      // Prepend new request into state & prevent duplicates
      setRequests((prev) => {
        if (prev.some((r) => r.id === newRequest.id)) return prev;
        return [newRequest, ...prev];
      });
    });

    channel.listen('.request.updated', (data: ReverbRequestPayload) => {

      const prevRequest = requestsRef.current.find((r) => r.id === data.id);
      const prevStatus = prevRequest?.status;

      // If local state already matches, skip toast (current user initiated this)
      if (prevStatus === data.status) {
        return;
      }

      const statusLabels: Record<string, string> = {
        pending: 'Pending',
        in_progress: 'In Progress',
        completed: 'Completed',
        cancelled: 'Cancelled',
      };

      const roomLabel = data.room_name || `Room #${data.room_id}`;
      const itemLabel = data.item_name || data.type;
      const newStatus = statusLabels[data.status] || data.status;

      toast.statusChanged(roomLabel, itemLabel, newStatus, {
        duration: 8000,
        action: prevStatus
          ? {
              label: 'Undo',
              onClick: () => {
                setRequests((prev) =>
                  prev.map((r) => (r.id === data.id ? { ...r, status: prevStatus } : r))
                );
                fetchApi(`/api/requests/${data.id}`, {
                  method: 'PATCH',
                  body: JSON.stringify({ status: prevStatus }),
                }).catch(() => {});
              },
            }
          : undefined,
      });

      setRequests((prev) =>
        prev.map((req) => (req.id === data.id ? { ...req, status: data.status } : req))
      );
    });

    return () => {
      channel.stopListening('.request.created');
      channel.stopListening('.request.updated');
    };
  }, [riadId, isAuthLoading, user]);

  // ─── Optimistic Update Status ────────────────────────────
  const updateStatus = async (requestId: number, status: GuestRequest['status']) => {
    const prevRequest = requestsRef.current.find((r) => r.id === requestId);
    const prevStatus = prevRequest?.status;

    setRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status } : req))
    );

    try {
      setError(null);
      await fetchApi(`/api/requests/${requestId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });

      if (prevStatus && prevStatus !== status) {
        const request = requestsRef.current.find((r) => r.id === requestId);
        const statusLabels: Record<string, string> = {
          pending: 'Pending',
          in_progress: 'In Progress',
          completed: 'Completed',
          cancelled: 'Cancelled',
        };
        toast.statusChanged(
          request?.room_number || `Room #${requestId}`,
          request?.item_name || 'Request',
          statusLabels[status] || status,
          {
            duration: 8000,
            action: {
              label: 'Undo',
              onClick: async () => {
                setRequests((prev) =>
                  prev.map((r) => (r.id === requestId ? { ...r, status: prevStatus } : r))
                );
                await fetchApi(`/api/requests/${requestId}`, {
                  method: 'PATCH',
                  body: JSON.stringify({ status: prevStatus }),
                });
              },
            },
          }
        );
      }
    } catch (err: any) {
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