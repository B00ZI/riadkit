'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '@/lib/api';
import { toast } from '@/lib/toast';

export type AccountUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
};

export type AccountRiad = {
  name: string;
  currency: string;
};

export type AccountData = {
  user: AccountUser;
  riad: AccountRiad;
};

export function useAccount() {
  const [data, setData] = useState<AccountData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAccount = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi<AccountData>('/api/account');
      setData(res);
    } catch (error: any) {
      toast.error('Failed to load account details');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  const updateProfile = useCallback(async (profile: {
    name: string;
    email: string;
    phone: string;
  }) => {
    setIsUpdatingProfile(true);
    try {
      const res = await fetchApi<{ message: string; user: AccountUser }>('/api/account/profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
      });
      setData(prev => prev ? { ...prev, user: res.user } : null);
      toast.success(res.message);
      return { success: true };
    } catch (error: any) {
      const message = error.data?.message || 'Failed to update profile.';
      toast.error(message);
      return { success: false, error: error.data?.errors || null };
    } finally {
      setIsUpdatingProfile(false);
    }
  }, []);

  const updatePassword = useCallback(async (passwords: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) => {
    setIsUpdatingPassword(true);
    try {
      const res = await fetchApi<{ message: string }>('/api/account/password', {
        method: 'PUT',
        body: JSON.stringify(passwords),
      });
      toast.success(res.message);
      return { success: true };
    } catch (error: any) {
      const message = error.data?.message || 'Failed to update password.';
      toast.error(message);
      return { success: false, error: error.data?.errors || null };
    } finally {
      setIsUpdatingPassword(false);
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    setIsDeleting(true);
    try {
      const res = await fetchApi<{ message: string }>('/api/account', {
        method: 'DELETE',
      });
      toast.success(res.message);
      return { success: true };
    } catch (error: any) {
      const message = error.data?.message || 'Failed to delete account.';
      toast.error(message);
      return { success: false };
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    data,
    isLoading,
    isUpdatingProfile,
    isUpdatingPassword,
    isDeleting,
    updateProfile,
    updatePassword,
    deleteAccount,
    refresh: fetchAccount,
  };
}
