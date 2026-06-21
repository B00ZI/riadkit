// hooks/useStaff.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchApi } from "@/lib/api";
import Cookies from "js-cookie";

export type StaffMember = {
  id: number;
  name: string;
  email: string;
  role: "receptionist";
  riad_id: number;
  created_at: string;
};

export function useStaff() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Fetch all staff ──────────────────────────────────────
  const fetchStaff = useCallback(async () => {
    const token = Cookies.get("riadkit_staff_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchApi<StaffMember[]>("/api/staff");
      setStaff(data);
    } catch (err: any) {
      setError(err.message || "Failed to load staff");
      setStaff([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── Create a new staff member ──────────────────────────
  const createStaff = async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    setError(null);
    try {
      const response = await fetchApi<{ user: StaffMember }>("/api/staff", {
        method: "POST",
        body: JSON.stringify(data),
      });
      await fetchStaff(); // Refresh list
      return response.user;
    } catch (err: any) {
      setError(err.message || "Failed to create staff");
      throw err;
    }
  };

  // ─── Update a staff member ──────────────────────────────
  const updateStaff = async (
    id: number,
    data: {
      name?: string;
      email?: string;
      password?: string;
      password_confirmation?: string;
    }
  ) => {
    setError(null);
    try {
      const response = await fetchApi<{ user: StaffMember }>(
        `/api/staff/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
        }
      );
      await fetchStaff(); // Refresh list
      return response.user;
    } catch (err: any) {
      setError(err.message || "Failed to update staff");
      throw err;
    }
  };

  // ─── Delete a staff member ──────────────────────────────
  const deleteStaff = async (id: number) => {
    setError(null);
    try {
      await fetchApi(`/api/staff/${id}`, {
        method: "DELETE",
      });
      await fetchStaff(); // Refresh list
    } catch (err: any) {
      setError(err.message || "Failed to delete staff");
      throw err;
    }
  };

  // ─── Initial fetch ──────────────────────────────────────
  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return {
    staff,
    isLoading,
    error,
    fetchStaff,
    createStaff,
    updateStaff,
    deleteStaff,
  };
}