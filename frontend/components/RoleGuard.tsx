// components/RoleGuard.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: ('owner' | 'receptionist')[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (user && !allowedRoles.includes(user.role)) {
        // Redirect to the correct dashboard
        const redirectPath = user.role === 'owner' ? '/dashboard' : '/reception';
        router.push(redirectPath);
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router]);

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}