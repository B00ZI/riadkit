import { useState, useEffect, useCallback, useRef } from 'react';
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
    image_url?: string;
    image_public_id?: string;
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
    image_url?: string;
    image_public_id?: string;
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

export type HouseRule = {
    id: number;
    title: string;
    description?: string;
    value: string;
    icon: string;
    is_active: boolean;
    sort_order: number;
    created_at?: string;
    updated_at?: string;
};

export type CreateHouseRulePayload = {
    title: string;
    description?: string;
    value: string;
    icon: string;
    is_active?: boolean;
    sort_order?: number;
};

export type UpdateHouseRulePayload = Partial<CreateHouseRulePayload> & {
    id: number;
};

// ─── Snapshot type ──────────────────────────────────────────────

type Snapshot = {
    categories: Category[];
    menuItems: MenuItem[];
    services: Service[];
    excursions: Excursion[];
    houseRules: HouseRule[];
};

// ─── Helpers ────────────────────────────────────────────────────

let tempIdCounter = 0;
function nextTempId(): number {
    tempIdCounter -= 1;
    return tempIdCounter;
}

// ─── HOOK ─────────────────────────────────────────────────────

export function useCatalog() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [excursions, setExcursions] = useState<Excursion[]>([]);
    const [houseRules, setHouseRules] = useState<HouseRule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const snapshotRef = useRef<Snapshot | null>(null);

    const saveSnapshot = useCallback(() => {
        snapshotRef.current = {
            categories: [...categories],
            menuItems: [...menuItems],
            services: [...services],
            excursions: [...excursions],
            houseRules: [...houseRules],
        };
    }, [categories, menuItems, services, excursions, houseRules]);

    const rollback = useCallback(() => {
        if (snapshotRef.current) {
            setCategories(snapshotRef.current.categories);
            setMenuItems(snapshotRef.current.menuItems);
            setServices(snapshotRef.current.services);
            setExcursions(snapshotRef.current.excursions);
            setHouseRules(snapshotRef.current.houseRules);
            snapshotRef.current = null;
        }
    }, []);

    // ─── Fetch All Data ─────────────────────────────────────────
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [cats, items, svcs, excs, rules] = await Promise.all([
                fetchApi<Category[]>('/api/categories'),
                fetchApi<MenuItem[]>('/api/menu-items'),
                fetchApi<Service[]>('/api/services'),
                fetchApi<Excursion[]>('/api/excursions'),
                fetchApi<HouseRule[]>('/api/house-rules'),
            ]);
            setCategories(cats || []);
            setMenuItems(items || []);
            setServices(svcs || []);
            setExcursions(excs || []);
            setHouseRules(rules || []);
        } catch (error: any) {
            setError(error.message || 'Failed to load catalog data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refresh = fetchData;

    // ─── Optimistic helper ───────────────────────────────────────

    async function optimisticMutation<T>(
        mutation: () => Promise<T>,
        onSuccess?: (result: T) => void,
    ): Promise<T> {
        saveSnapshot();
        setIsSubmitting(true);
        setError(null);
        try {
            const result = await mutation();
            snapshotRef.current = null;
            onSuccess?.(result);
            return result;
        } catch (error: any) {
            rollback();
            const message = error.message || 'Something went wrong';
            setError(message);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    }

    // ─── Category CRUD ──────────────────────────────────────────

    const addCategory = async (name: string, type: 'menu' | 'service') => {
        const payload: CreateCategoryPayload = {
            name,
            type,
            sort_order: categories.filter(c => c.type === type).length + 1,
        };
        const temp: Category = {
            id: nextTempId(),
            name,
            type,
            sort_order: payload.sort_order!,
        };

        return optimisticMutation(async () => {
            setCategories(prev => [...prev, temp]);
            const created = await fetchApi<Category>('/api/categories', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            setCategories(prev => prev.map(c => c.id === temp.id ? created : c));
            return created;
        });
    };

    const updateCategory = async (id: number, data: Partial<CreateCategoryPayload>) => {
        return optimisticMutation(async () => {
            setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
            const updated = await fetchApi<Category>(`/api/categories/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            setCategories(prev => prev.map(c => c.id === id ? updated : c));
            return updated;
        });
    };

    const deleteCategory = async (id: number) => {
        return optimisticMutation(async () => {
            setCategories(prev => prev.filter(c => c.id !== id));
            await fetchApi(`/api/categories/${id}`, { method: 'DELETE' });
        });
    };

    // ─── Menu Item CRUD ─────────────────────────────────────────

    const addMenuItem = async (data: CreateMenuItemPayload) => {
        const temp: MenuItem = {
            id: nextTempId(),
            category_id: data.category_id,
            name: data.name,
            description: data.description,
            price: data.price,
            is_available: data.is_available ?? true,
        };

        return optimisticMutation(async () => {
            setMenuItems(prev => [...prev, temp]);
            const created = await fetchApi<MenuItem>('/api/menu-items', {
                method: 'POST',
                body: JSON.stringify({
                    ...data,
                    is_available: data.is_available ?? true,
                }),
            });
            setMenuItems(prev => prev.map(i => i.id === temp.id ? created : i));
            return created;
        });
    };

    const updateMenuItem = async (id: number, data: Partial<CreateMenuItemPayload>) => {
        return optimisticMutation(async () => {
            setMenuItems(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
            const updated = await fetchApi<MenuItem>(`/api/menu-items/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            setMenuItems(prev => prev.map(i => i.id === id ? updated : i));
            return updated;
        });
    };

    const deleteMenuItem = async (id: number) => {
        return optimisticMutation(async () => {
            setMenuItems(prev => prev.filter(i => i.id !== id));
            await fetchApi(`/api/menu-items/${id}`, { method: 'DELETE' });
        });
    };

    const toggleMenuItemAvailability = async (id: number, isAvailable: boolean) => {
        return updateMenuItem(id, { is_available: isAvailable });
    };

    // ─── Service CRUD ───────────────────────────────────────────

    const addService = async (data: CreateServicePayload) => {
        const temp: Service = {
            id: nextTempId(),
            name: data.name,
            price: data.price,
            requires_quantity: data.requires_quantity ?? false,
            is_available: data.is_available ?? true,
        };

        return optimisticMutation(async () => {
            setServices(prev => [...prev, temp]);
            const created = await fetchApi<Service>('/api/services', {
                method: 'POST',
                body: JSON.stringify({
                    ...data,
                    requires_quantity: data.requires_quantity ?? false,
                }),
            });
            setServices(prev => prev.map(s => s.id === temp.id ? created : s));
            return created;
        });
    };

    const updateService = async (id: number, data: Partial<CreateServicePayload>) => {
        return optimisticMutation(async () => {
            setServices(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
            const updated = await fetchApi<Service>(`/api/services/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            setServices(prev => prev.map(s => s.id === id ? updated : s));
            return updated;
        });
    };

    const deleteService = async (id: number) => {
        return optimisticMutation(async () => {
            setServices(prev => prev.filter(s => s.id !== id));
            await fetchApi(`/api/services/${id}`, { method: 'DELETE' });
        });
    };

    const toggleServiceAvailability = async (id: number, isAvailable: boolean) => {
        return updateService(id, { is_available: isAvailable });
    };

    // ─── Excursion CRUD ─────────────────────────────────────────

    const addExcursion = async (data: CreateExcursionPayload) => {
        const temp: Excursion = {
            id: nextTempId(),
            name: data.name,
            description: data.description,
            price: data.price,
            duration: data.duration,
            is_available: data.is_available ?? true,
        };

        return optimisticMutation(async () => {
            setExcursions(prev => [...prev, temp]);
            const created = await fetchApi<Excursion>('/api/excursions', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            setExcursions(prev => prev.map(e => e.id === temp.id ? created : e));
            return created;
        });
    };

    const updateExcursion = async (id: number, data: Partial<CreateExcursionPayload>) => {
        return optimisticMutation(async () => {
            setExcursions(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
            const updated = await fetchApi<Excursion>(`/api/excursions/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            setExcursions(prev => prev.map(e => e.id === id ? updated : e));
            return updated;
        });
    };

    const deleteExcursion = async (id: number) => {
        return optimisticMutation(async () => {
            setExcursions(prev => prev.filter(e => e.id !== id));
            await fetchApi(`/api/excursions/${id}`, { method: 'DELETE' });
        });
    };

    const toggleExcursionAvailability = async (id: number, isAvailable: boolean) => {
        return updateExcursion(id, { is_available: isAvailable });
    };

    // ─── House Rule CRUD ─────────────────────────────────────────

    const addHouseRule = async (data: CreateHouseRulePayload) => {
        const temp: HouseRule = {
            id: nextTempId(),
            title: data.title,
            description: data.description,
            value: data.value,
            icon: data.icon,
            is_active: data.is_active ?? true,
            sort_order: data.sort_order ?? houseRules.length,
        };

        return optimisticMutation(async () => {
            setHouseRules(prev => [...prev, temp]);
            const created = await fetchApi<HouseRule>('/api/house-rules', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            setHouseRules(prev => prev.map(r => r.id === temp.id ? created : r));
            return created;
        });
    };

    const updateHouseRule = async (id: number, data: Partial<CreateHouseRulePayload>) => {
        return optimisticMutation(async () => {
            setHouseRules(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
            const updated = await fetchApi<HouseRule>(`/api/house-rules/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            setHouseRules(prev => prev.map(r => r.id === id ? updated : r));
            return updated;
        });
    };

    const deleteHouseRule = async (id: number) => {
        return optimisticMutation(async () => {
            setHouseRules(prev => prev.filter(r => r.id !== id));
            await fetchApi(`/api/house-rules/${id}`, { method: 'DELETE' });
        });
    };

    const toggleHouseRule = async (id: number, isActive: boolean) => {
        return updateHouseRule(id, { is_active: isActive });
    };

    // ─── Return ──────────────────────────────────────────────────
    return {
        categories,
        menuItems,
        services,
        excursions,
        houseRules,
        isLoading,
        error,
        isSubmitting,

        addCategory,
        updateCategory,
        deleteCategory,

        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleMenuItemAvailability,

        addService,
        updateService,
        deleteService,
        toggleServiceAvailability,

        addExcursion,
        updateExcursion,
        deleteExcursion,
        toggleExcursionAvailability,

        addHouseRule,
        updateHouseRule,
        deleteHouseRule,
        toggleHouseRule,

        refresh,
    };
}
