import { RoleGuard } from '@/components/RoleGuard';

export default function ReceptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['receptionist', 'owner']}>
      {/* Your reception layout */}
      {children}
    </RoleGuard>
  );
}