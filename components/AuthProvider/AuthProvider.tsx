'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useAuthStore } from '../../lib/store/authStore';
import { checkSession, getMe } from '../../lib/api/clientApi';
import { usePathname, useRouter } from 'next/navigation';
import Loader from '../../app/loading';

interface AuthProviderProps {
  children: ReactNode;
}

const privatePaths = ['/profile', '/notes'];

export default function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
            if (!privatePaths.some((path) => pathname.startsWith(path))) return;

      setLoading(true);

      try {
        const sessionActive = await checkSession();
        if (sessionActive) {
                  const currentUser = await getMe();
          setUser(currentUser);
        } else {
                   clearIsAuthenticated();
          router.push('/sign-in');
        }
      } catch {
        clearIsAuthenticated();
        router.push('/sign-in');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [pathname, setUser, clearIsAuthenticated, router]);

   if (loading) return <Loader />;

  return <>{children}</>;
}
