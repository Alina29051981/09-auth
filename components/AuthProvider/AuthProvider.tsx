'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useAuthStore } from '../../lib/store/authStore';
import { checkSession } from '../../lib/api/clientApi';
import Loader from '../../app/loading';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const user = await checkSession();
        if (user) setUser(user);
        else clearIsAuthenticated();
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [setUser, clearIsAuthenticated]);

  if (loading) return <Loader />;

  return <>{children}</>;
}
