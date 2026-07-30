// hooks/useRooms.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { getEcho } from '@/lib/echo';
import { toast } from '@/lib/toast';

export type Room = {
  id: number;
  room_number: string;
  type: string;
  qr_token: string;
  status: 'vacant' | 'occupied';
  active_session?: {
    session_id: string;
    check_in_at: string;
  };
};

export function useRooms() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const riadId = user?.riad_id;

  const roomsRef = useRef(rooms);
  roomsRef.current = rooms;

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchApi<any>('/api/rooms');
      
      let roomsData = [];
      
      if (response) {
        if (Array.isArray(response)) {
          roomsData = response;
        } else if (response.data && Array.isArray(response.data)) {
          roomsData = response.data;
        } else if (response.rooms && Array.isArray(response.rooms)) {
          roomsData = response.rooms;
        } else if (typeof response === 'object' && !Array.isArray(response)) {
          roomsData = [response];
        }
      }
      
      setRooms(roomsData);
    } catch (error: any) {
      setError(error.message || 'Failed to load rooms');
      setRooms([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // ─── Real-Time WebSocket Listener for Room Status ─────────
  useEffect(() => {
    if (isAuthLoading || !user || !riadId) return;

    const echo = getEcho();
    if (!echo) return;

    const channelName = `riad.${riadId}.reception`;
    const channel = echo.private(channelName);

    channel.listen('.room.status.updated', (data: any) => {

      const prevRoom = roomsRef.current.find((r) => r.id === data.id);
      const prevStatus = prevRoom?.status;

      if (prevStatus === data.status) return;

      if (data.status === 'occupied') {
        toast.checkedIn(data.room_number, {
          duration: 8000,
          action: prevStatus === 'vacant'
            ? {
                label: 'Undo',
                onClick: async () => {
                  await fetchApi(`/api/rooms/${data.id}/checkout`, { method: 'POST' });
                  fetchRooms();
                },
              }
            : undefined,
        });
      } else if (data.status === 'vacant') {
        toast.checkedOut(data.room_number, {
          duration: 8000,
          action: prevStatus === 'occupied'
            ? {
                label: 'Undo',
                onClick: async () => {
                  await fetchApi(`/api/rooms/${data.id}/checkin`, { method: 'POST' });
                  fetchRooms();
                },
              }
            : undefined,
        });
      }

      setRooms((prev) =>
        prev.map((room) =>
          room.id === data.id
            ? { ...room, status: data.status }
            : room
        )
      );
    });

    return () => {
      channel.stopListening('.room.status.updated');
    };
  }, [riadId, isAuthLoading, user]);

  const createRoom = async (room_number: string, type: string) => {
    try {
      setError(null);
      await fetchApi('/api/rooms', {
        method: 'POST',
        body: JSON.stringify({ room_number, type })
      });
      await fetchRooms();
    } catch (error: any) {
      setError(error.message || 'Failed to create room');
      throw error;
    }
  };

  const checkIn = async (roomId: number) => {
    try {
      setError(null);
      await fetchApi(`/api/rooms/${roomId}/checkin`, { method: 'POST' });
      await fetchRooms();
    } catch (error: any) {
      setError(error.message || 'Failed to check in');
      throw error;
    }
  };

  const checkOut = async (roomId: number) => {
    try {
      setError(null);
      await fetchApi(`/api/rooms/${roomId}/checkout`, { method: 'POST' });
      await fetchRooms();
    } catch (error: any) {
      setError(error.message || 'Failed to check out');
      throw error;
    }
  };

  const deleteRoom = async (roomId: number) => {
    const room = rooms.find((r) => r.id === roomId);

    try {
      setError(null);
      await fetchApi(`/api/rooms/${roomId}`, { method: 'DELETE' });
      await fetchRooms();

      if (room) {
        toast.undo(`Deleted ${room.room_number}`, {
          onUndo: async () => {
            await fetchApi('/api/rooms', {
              method: 'POST',
              body: JSON.stringify({ room_number: room.room_number, type: room.type }),
            });
            await fetchRooms();
          },
          duration: 8000,
        });
      }
    } catch (error: any) {
      setError(error.message || 'Failed to delete room');
      throw error;
    }
  };

  return { 
    rooms, 
    isLoading, 
    error,
    createRoom, 
    checkIn, 
    checkOut, 
    deleteRoom, 
    refresh: fetchRooms 
  };
}