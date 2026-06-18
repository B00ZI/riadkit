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

const DEFAULT_SETTINGS: Settings = {
  name: '',
  description: '',
  wifiName: '',
  wifiPassword: '',
  whatsappNumber: '',
  instagramUrl: '',
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchApi<{ riad: Settings }>('/api/settings');
      // Merge with defaults to ensure all fields exist
      const riad = response.riad;
      setSettings({
        ...DEFAULT_SETTINGS,
        ...riad,
      });
    } catch (error: any) {
      console.error('Failed to fetch settings:', error);
      setError(error.message || 'Failed to load settings');
      // Keep default settings (no change)
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSettings = async (data: Partial<Settings>) => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await fetchApi<{ message: string; riad: Settings }>('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      // Merge with defaults
      const riad = response.riad;
      setSettings({
        ...DEFAULT_SETTINGS,
        ...riad,
      });
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
    settings,      // Now always a Settings object
    isLoading,
    isUpdating,
    error,
    updateSettings,
    refresh: fetchSettings,
  };
}