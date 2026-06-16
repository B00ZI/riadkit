// hooks/useRooms.ts
import { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '@/lib/api';

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
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchApi<any>('/api/rooms');
      
      // ✅ Handle both array and object responses
      let roomsData = [];
      
      if (response) {
        if (Array.isArray(response)) {
          roomsData = response;
        } else if (response.data && Array.isArray(response.data)) {
          // Laravel pagination or resource collection
          roomsData = response.data;
        } else if (response.rooms && Array.isArray(response.rooms)) {
          roomsData = response.rooms;
        } else if (typeof response === 'object' && !Array.isArray(response)) {
          // If it's a single object, wrap it
          roomsData = [response];
        }
      }
      
      setRooms(roomsData);
    } catch (error: any) {
      console.error('Failed to fetch rooms:', error);
      setError(error.message || 'Failed to load rooms');
      setRooms([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const createRoom = async (room_number: string, type: string) => {
    try {
      setError(null);
      await fetchApi('/api/rooms', {
        method: 'POST',
        body: JSON.stringify({ room_number, type })
      });
      await fetchRooms();
    } catch (error: any) {
      console.error('Failed to create room:', error);
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
      console.error('Check-in failed:', error);
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
      console.error('Check-out failed:', error);
      setError(error.message || 'Failed to check out');
      throw error;
    }
  };

  const deleteRoom = async (roomId: number) => {
    try {
      setError(null);
      await fetchApi(`/api/rooms/${roomId}`, { method: 'DELETE' });
      await fetchRooms();
    } catch (error: any) {
      console.error('Delete room failed:', error);
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