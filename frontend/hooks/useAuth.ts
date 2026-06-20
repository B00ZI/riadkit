// hooks/useAuth.ts
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
        console.log('� Auth check - token exists:', !!token);
        
        if (!token) {
            setIsLoading(false);
            return;
        }

        fetchApi<User>('/api/user')
            .then((data) => {
                console.log('✅ User fetched:', data);
                setUser(data);
            })
            .catch((error) => {
                console.error('❌ Auth check failed:', error);
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
            console.log('1️⃣ Login attempt:', email);
            
            // ✅ FIX: Use 'access_token' instead of 'token'
            const res = await fetchApi<{ 
                message: string; 
                access_token: string;  // ✅ Changed from 'token'
                user: User;
            }>('/api/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            console.log('2️⃣ Login response:', res);

            // ✅ FIX: Use 'access_token'
            const token = res.access_token;
            console.log('3️⃣ Token from response:', token);

            // ✅ Set cookie with the token
            Cookies.set('riadkit_staff_token', token, {
                expires: 7,
                path: '/',
                sameSite: 'Lax',
                secure: false
            });

            const savedToken = Cookies.get('riadkit_staff_token');
            console.log('4️⃣ Cookie saved:', savedToken);

            if (!savedToken) {
                console.error('❌ Cookie was NOT saved!');
                return { success: false, error: 'Failed to save authentication token' };
            }

            setUser(res.user);

            // ✅ Small delay to ensure cookie is saved
            setTimeout(() => {
                if (res.user.role === 'receptionist') {
                    console.log('5️⃣ Redirecting to /dashboard');
                    router.push('/dashboard');
                } else {
                    console.log('5️⃣ Redirecting to /dashboard/reception');
                    router.push('/reception');
                }
            }, 100);

            return { success: true, user: res.user };
        } catch (error: any) {
            console.error("❌ Login failed:", error);
            return { success: false, error: error.data?.message || 'Invalid credentials' };
        }
    }, [router]);

    const register = useCallback(async (data: RegisterData) => {
        try {
            // ✅ FIX: Use 'access_token' for registration too
            const res = await fetchApi<{ 
                message: string; 
                access_token: string;  // ✅ Changed from 'token'
                user: User;
            }>('/api/register', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            // ✅ FIX: Use 'access_token'
            Cookies.set('riadkit_staff_token', res.access_token, {
                expires: 7,
                path: '/',
                sameSite: 'Lax',
                secure: false
            });
            
            setUser(res.user);
            router.push('/dashboard');
            
            return { success: true, user: res.user };
        } catch (error: any) {
            console.error("Registration failed:", error);
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
            console.warn("Logout request failed:", error);
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