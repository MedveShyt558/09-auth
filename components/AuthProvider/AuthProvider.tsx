"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  children: React.ReactNode;
};

const PRIVATE_PREFIXES = ["/profile", "/notes"];

const AuthProvider = ({ children }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, setUser, clearIsAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));

    const run = async () => {
      setIsLoading(true);
      try {
        const user = await checkSession();
        if (user) {
          setUser(user);
          setIsLoading(false);
          return;
        }

        clearIsAuthenticated();

        if (isPrivate) {
          await logout();
          router.push("/sign-in");
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
      } catch {
        clearIsAuthenticated();

        if (isPrivate || isAuthenticated) {
          try {
            await logout();
          } catch {}
          router.push("/sign-in");
        }

        setIsLoading(false);
      }
    };

    run();
  }, [pathname, router, setUser, clearIsAuthenticated, isAuthenticated]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
};

export default AuthProvider;
