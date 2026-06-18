// hooks/useSettings.ts
import { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '@/lib/api';

export type Settings = {
  id?: number;
  name: string;
  description?: string;
  wifiName?: string;
  wifiPassword?: string;
  whatsappNumber: string;
  instagramUrl?: string;
  created_at?: string;
  updated_at?: string;
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // The API returns { riad: { ... } }
      const response = await fetchApi<{ riad: Settings }>('/api/settings');
      // Extract the riad object
      setSettings(response.riad);
    } catch (error: any) {
      console.error('Failed to fetch settings:', error);
      setError(error.message || 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSettings = async (data: Partial<Settings>) => {
    setIsUpdating(true);
    setError(null);
    try {
      // The update endpoint expects the fields directly, not nested under 'riad'
      const response = await fetchApi<{ message: string; riad: Settings }>('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      // Update state with the returned riad
      setSettings(response.riad);
      return response.riad;
    } catch (error: any) {
      setError(error.message || 'Failed to update settings');
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    isLoading,
    isUpdating,
    error,
    updateSettings,
    refresh: fetchSettings,
  };
}