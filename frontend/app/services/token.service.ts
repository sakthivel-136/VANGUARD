// app/services/token.service.ts

const TOKEN_KEY = "sv_access_token";
const USER_KEY = "auth_user";

export interface AuthUser {
  user_id: string;
  username: string;
  role: string;
}

// ---------------------------
// Token Service (Updated)
// ---------------------------
export const tokenService = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  set(token: string) {
    if (typeof window === "undefined") return;

    localStorage.setItem(TOKEN_KEY, token);

    // 🔥 IMPORTANT: middleware can read cookies, not localStorage
    // Using the secure check from your original code for best practice
    const isSecure = window.location.protocol === "https:";
    
    document.cookie = `${TOKEN_KEY}=${token}; path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax; ${
      isSecure ? "Secure;" : ""
    }`;
  },

  remove() {
    if (typeof window === "undefined") return;

    localStorage.removeItem(TOKEN_KEY);
    
    // Clear cookie
    document.cookie = `${TOKEN_KEY}=; path=/; Max-Age=0; SameSite=Lax;`;
  },
};

// ---------------------------
// User helpers (Preserved)
// ---------------------------
export const setUser = (user: AuthUser) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    tokenService.remove();
    return null;
  }
};

// ---------------------------
// Auth check (Preserved)
// ---------------------------
export const isAuthenticated = (): boolean => {
  return !!tokenService.get() && !!getUser();
};

// ---------------------------
// Server-friendly token extractor (Preserved)
// ---------------------------
export const getTokenFromCookie = (cookieString?: string): string | null => {
  if (!cookieString) return null;
  const match = cookieString.match(new RegExp(`${TOKEN_KEY}=([^;]+)`));
  return match ? match[1] : null;
};

// ---------------------------
// BACKWARD COMPATIBILITY
// ---------------------------
// alias for Navbar imports that might still use removeToken
export const clearAuth = tokenService.remove; 