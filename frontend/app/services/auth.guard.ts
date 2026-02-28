// app/services/auth.guard.ts

"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getUser, isAuthenticated } from "./token.service";

// Re-export AuthUser type for consistency across the app
export type { AuthUser } from "./token.service";

interface GuardOptions {
  role?: "ADMIN" | "SECURITY";
}

export const useAuthGuard = (options?: GuardOptions) => {
  const router = useRouter();

  const checkAuth = useCallback(() => {
    const authenticated = isAuthenticated();

    // 🔒 1. If not authenticated → redirect to login
    if (!authenticated) {
      router.replace("/login");
      return;
    }

    // 🔐 2. If role-based access is required
    if (options?.role) {
      const user = getUser();

      // If user data missing or role mismatch → redirect
      if (!user || user.role !== options.role) {
        router.replace("/unauthorized");
        return;
      }
    }
  }, [router, options?.role]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
};
