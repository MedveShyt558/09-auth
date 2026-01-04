"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  children: React.ReactNode;
};

const PRIVATE_PREFIXES = ["/profile", "/notes"];

const AuthProvider = ({ children }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));

    const run = async () => {
      try {
        const user = await checkSession();

        if (user) {
          setUser(user);
          setLoading(false);
          return;
        }

        clearIsAuthenticated();

        if (isPrivate) {
          router.push("/sign-in");
        }

        setLoading(false);
      } catch {
        clearIsAuthenticated();

        if (isPrivate) {
          router.push("/sign-in");
        }

        setLoading(false);
      }
    };

    run();
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (loading) return null;

  return <>{children}</>;
};

export default AuthProvider;
