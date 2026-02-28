// app/services/auth.guard.ts

"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getToken, getUser, isAuthenticated } from "./token.service";

// Re-using the AuthUser interface ensures type consistency
export type { AuthUser } from "./token.service";

interface GuardOptions {
  role?: "ADMIN" | "SECURITY";
}

export const useAuthGuard = (options?: GuardOptions) => {
  const router = useRouter();

  const checkAuth = useCallback(() => {
    const isAuth = isAuthenticated();

    // 🔒 1. Check if user is authenticated
    if (!isAuth) {
      router.replace("/login");
      return;
    }

    // 🔐 2. Check specific role requirements
    if (options?.role) {
      const user = getUser();
      
      // If a role is required, but user data is missing OR role doesn't match
      if (!user || user.role !== options.role) {
        // You can redirect to an unauthorized page or back to login
        router.replace("/unauthorized"); 
        // Or if you don't have an unauthorized page: router.replace("/login");
        return;
      }
    }
  }, [router, options?.role]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
};