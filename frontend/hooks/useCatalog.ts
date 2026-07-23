// hooks/useCatalog.ts
import { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '@/lib/api';

// ─── TYPES ────────────────────────────────────────────────────

export type Category = {
    id: number;
    name: string;
    type: 'menu' | 'service';
    sort_order: number;
    created_at?: string;
    updated_at?: string;
};

export type MenuItem = {
    id: number;
    category_id: number;
    name: string;
    description?: string;
    price: number;
    is_available: boolean;
    created_at?: string;
    updated_at?: string;
};

export type Service = {
    id: number;
    category_id?: number;
    name: string;
    price?: number;
    requires_quantity: boolean;
    is_available: boolean;
    created_at?: string;
    updated_at?: string;
};

export type Excursion = {
    id: number;
    name: string;
    description?: string;
    price: number;
    duration: string;
    is_available: boolean;
    created_at?: string;
    updated_at?: string;
};

export type CreateCategoryPayload = {
    name: string;
    type: 'menu' | 'service';
    sort_order?: number;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload> & {
    id: number;
};

export type CreateMenuItemPayload = {
    category_id: number;
    name: string;
    description?: string;
    price: number;
    is_available?: boolean;
};

export type UpdateMenuItemPayload = Partial<CreateMenuItemPayload> & {
    id: number;
};

export type CreateServicePayload = {
    name: string;
    price?: number;
    requires_quantity?: boolean;
    category_id?: number;
    is_available?: boolean;
};

export type UpdateServicePayload = Partial<CreateServicePayload> & {
    id: number;
};

export type CreateExcursionPayload = {
    name: string;
    description?: string;
    price: number;
    duration: string;
    is_available?: boolean;
};

export type UpdateExcursionPayload = Partial<CreateExcursionPayload> & {
    id: number;
};

// ─── HOOK ─────────────────────────────────────────────────────

export function useCatalog() {
    // ─── State ──────────────────────────────────────────────────
    const [categories, setCategories] = useState<Category[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [excursions, setExcursions] = useState<Excursion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ─── Fetch All Data ─────────────────────────────────────────
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [cats, items, svcs, excs] = await Promise.all([
                fetchApi<Category[]>('/api/categories'),
                fetchApi<MenuItem[]>('/api/menu-items'),
                fetchApi<Service[]>('/api/services'),
                fetchApi<Excursion[]>('/api/excursions'),
            ]);
            setCategories(cats || []);
            setMenuItems(items || []);
            setServices(svcs || []);
            setExcursions(excs || []);
        } catch (error: any) {
            console.error('Failed to fetch catalog data:', error);
            setError(error.message || 'Failed to load catalog data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // ─── Helper: refresh ──────────────────────────────────────
    const refresh = fetchData;

    // ─── Category CRUD ──────────────────────────────────────────
    const addCategory = async (name: string, type: 'menu' | 'service') => {
        setIsSubmitting(true);
        setError(null);
        try {
            const payload: CreateCategoryPayload = {
                name,
                type,
                sort_order: categories.filter(c => c.type === type).length + 1,
            };
            await fetchApi<Category>('/api/categories', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            await refresh();
        } catch (error: any) {
            setError(error.message || 'Failed to add category');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateCategory = async (id: number, data: Partial<CreateCategoryPayload>) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await fetchApi<Category>(`/api/categories/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            await refresh();
        } catch (error: any) {
            setError(error.message || 'Failed to update category');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteCategory = async (id: number) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await fetchApi(`/api/categories/${id}`, {
                method: 'DELETE',
            });
            await refresh();
        } catch (error: any) {
            setError(error.message || 'Failed to delete category');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Menu Item CRUD ─────────────────────────────────────────
    const addMenuItem = async (data: CreateMenuItemPayload) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await fetchApi<MenuItem>('/api/menu-items', {
                method: 'POST',
                body: JSON.stringify({
                    ...data,
                    is_available: data.is_available ?? true,
                }),
            });
            await refresh();
        } catch (error: any) {
            setError(error.message || 'Failed to add menu item');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateMenuItem = async (id: number, data: Partial<CreateMenuItemPayload>) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await fetchApi<MenuItem>(`/api/menu-items/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            await refresh();
        } catch (error: any) {
            setError(error.message || 'Failed to update menu item');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteMenuItem = async (id: number) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await fetchApi(`/api/menu-items/${id}`, {
                method: 'DELETE',
            });
            await refresh();
        } catch (error: any) {
            setError(error.message || 'Failed to delete menu item');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleMenuItemAvailability = async (id: number, isAvailable: boolean) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await fetchApi<MenuItem>(`/api/menu-items/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ is_available: isAvailable }),
            });
            await refresh();
        } catch (error: any) {
            setError(error.message || 'Failed to update availability');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Service CRUD ───────────────────────────────────────────
    const addService = async (data: CreateServicePayload) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await fetchApi<Service>('/api/services', {
                method: 'POST',
                body: JSON.stringify({
                    ...data,
                    requires_quantity: data.requires_quantity ?? false,
                }),
            });
            await refresh();
        } catch (error: any) {
            setError(error.message || 'Failed to add service');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateService = async (id: number, data: Partial<CreateServicePayload>) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await fetchApi<Service>(`/api/services/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            await refresh();
        } catch (error: any) {
            setError(error.message || 'Failed to update service');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteService = async (id: number) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await fetchApi(`/api/services/${id}`, {
                method: 'DELETE',
            });
            await refresh();
        } catch (error: any) {
            setError(error.message || 'Failed to delete service');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    // ✅ Toggle service availability (receptionist use)
    const toggleServiceAvailability = async (id: number, isAvailable: boolean) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await fetchApi<Service>(`/api/services/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ is_available: isAvailable }),
            });
            await refresh();
        } catch (error: any) {
            setError(error.message || 'Failed to update service availability');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Excursion CRUD ─────────────────────────────────────────
    const addExcursion = async (data: CreateExcursionPayload) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await fetchApi<Excursion>('/api/excursions', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            await refresh();
        } catch (error: any) {
            setError(error.message || 'Failed to add excursion');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateExcursion = async (id: number, data: Partial<CreateExcursionPayload>) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await fetchApi<Excursion>(`/api/excursions/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            await refresh();
        } catch (error: any) {
            setError(error.message || 'Failed to update excursion');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteExcursion = async (id: number) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await fetchApi(`/api/excursions/${id}`, {
                method: 'DELETE',
            });
            await refresh();
        } catch (error: any) {
            setError(error.message || 'Failed to delete excursion');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    // ✅ Toggle excursion availability (receptionist use)
    const toggleExcursionAvailability = async (id: number, isAvailable: boolean) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await fetchApi<Excursion>(`/api/excursions/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ is_available: isAvailable }),
            });
            await refresh();
        } catch (error: any) {
            setError(error.message || 'Failed to update excursion availability');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Return ──────────────────────────────────────────────────
    return {
        // Data
        categories,
        menuItems,
        services,
        excursions,
        isLoading,
        error,
        isSubmitting,

        // Categories
        addCategory,
        updateCategory,
        deleteCategory,

        // Menu Items
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleMenuItemAvailability,

        // Services
        addService,
        updateService,
        deleteService,
        toggleServiceAvailability, // ✅ exported

        // Excursions
        addExcursion,
        updateExcursion,
        deleteExcursion,
        toggleExcursionAvailability, // ✅ exported

        // Utilities
        refresh,
    };
}