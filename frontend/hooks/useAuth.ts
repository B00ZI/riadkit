'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { fetchApi } from '@/lib/api';

export type User = {
    id: number;
    user_name: string;
    email: string;
    role: 'owner' | 'receptionist';
    riad_id?: number;
};

export type RegisterData = {
    user_name: string;
    email: string;
    password: string;
    riad_name: string;
    whatsapp_number: string;
};

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('riadkit_staff_token');

        if (!token) {
            setIsLoading(false);
            return;
        }

        fetchApi<User>('/api/user')
            .then((data) => {
                setUser(data);
            })
            .catch((error) => {
                if (error.status === 401) {
                    Cookies.remove('riadkit_staff_token', { path: '/' });
                    setUser(null);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const res = await fetchApi<{ 
                message: string; 
                access_token: string;
                user: User;
            }>('/api/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            Cookies.set('riadkit_staff_token', res.access_token, {
                expires: 7,
                path: '/',
                sameSite: 'Lax',
                secure: process.env.NODE_ENV === 'production',
            });

            setUser(res.user);

            setTimeout(() => {
                if (res.user.role === 'owner') {
                    router.replace('/dashboard');
                } else {
                    router.replace('/reception');
                }
            }, 100);

            return { success: true, user: res.user };
        } catch (error: any) {
            return { success: false, error: error.data?.message || 'Invalid credentials' };
        }
    }, [router]);

    const register = useCallback(async (data: RegisterData) => {
        try {
            const res = await fetchApi<{ 
                message: string; 
                access_token: string;
                user: User;
            }>('/api/register', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            Cookies.set('riadkit_staff_token', res.access_token, {
                expires: 7,
                path: '/',
                sameSite: 'Lax',
                secure: process.env.NODE_ENV === 'production',
            });
            
            setUser(res.user);
            router.replace('/dashboard');
            
            return { success: true, user: res.user };
        } catch (error: any) {
            return { 
                success: false, 
                error: error.data?.message || 'Registration failed. Check your details.' 
            };
        }
    }, [router]);

    const logout = useCallback(async () => {
        try {
            await fetchApi('/api/logout', { method: 'POST' });
        } catch (error) {
            // Ignore logout errors
        } finally {
            Cookies.remove('riadkit_staff_token', { path: '/' });
            setUser(null);
            router.push('/login');
        }
    }, [router]);

    return { 
        user, 
        isLoading, 
        isAuthenticated: !!user, 
        login, 
        register, 
        logout 
    };
}