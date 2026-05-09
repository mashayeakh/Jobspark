/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/layouts/AdminShell';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { authService } from '@/services/authService';

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setUser(authService.getUser());
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <AdminShell title="Dashboard">
      <AdminDashboard user={user} />
    </AdminShell>
  );
}
