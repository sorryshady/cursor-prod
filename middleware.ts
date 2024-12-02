import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth/jwt";
import { LRUCache } from "lru-cache";
import { prisma } from './lib/db'

// Define protected routes
const protectedRoutes = [
  "/gallery",
  "/downloads",
  "/news-letter",
  "/dashboard",
  "/admin",
];

// In-memory cache for user roles - using Edge compatible options
const userRoleCache = new LRUCache<string, string>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});

// Rate limiter - using Edge compatible options
const ratelimit = new LRUCache<string, number>({
  max: 500,
  ttl: 1000 * 60, // 1 minute
});

// Rate limit function
function getRateLimit(ip: string): boolean {
  const tokenCount = ratelimit.get(ip) || 0;
  if (tokenCount > 10) return false;
  ratelimit.set(ip, tokenCount + 1);
  return true;
}

interface JWTPayload {
  userId: string;
}

// Add auth routes that should redirect to dashboard if logged in
const authRoutes = ["/login", "/register", "/forgot-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

  // Apply rate limiting to API routes
  if (pathname.startsWith("/api")) {
    const isAllowed = getRateLimit(ip);
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }
  }

  // Check if it's an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (isAuthRoute) {
    // If token exists, verify it
    const token = request.cookies.get("auth-token")?.value;
    if (token) {
      try {
        await verifyJWT(token);
        // Token is valid, redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch {
        // Token is invalid, allow access to auth routes
        return NextResponse.next();
      }
    }
  }

  // Check if it's a protected route
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const isMobileApp = request.headers.get("x-client-type") === "mobile";
    let isAuthenticated = false;
    let userId: string | null = null;

    if (isMobileApp) {
      const authHeader = request.headers.get("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        try {
          const decoded = await verifyJWT(token);
          if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
            // Handle invalid token
            isAuthenticated = false;
          } else {
            const payload = decoded as unknown as JWTPayload;
            userId = payload.userId;
            isAuthenticated = true;
          }
        } catch {
          isAuthenticated = false;
        }
      }
    } else {
      const token = request.cookies.get("auth-token");
      if (token) {
        try {
          const decoded = await verifyJWT(token.value);
          if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
            // Handle invalid token
            isAuthenticated = false;
          } else {
            const payload = decoded as unknown as JWTPayload;
            userId = payload.userId;
            isAuthenticated = true;
          }
        } catch {
          isAuthenticated = false;
        }
      }
    }

    if (!isAuthenticated) {
      if (isMobileApp) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      } else {
        const returnUrl = encodeURIComponent(pathname);
        return NextResponse.redirect(
          new URL(`/login?returnUrl=${returnUrl}`, request.url)
        );
      }
    }

    // Check for admin routes with caching
    if (pathname.startsWith("/admin") && userId) {
      // Try to get role from cache first
      let userRole = userRoleCache.get(userId);

      if (!userRole) {
        // If not in cache, get from database
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { userRole: true },
        });
        userRole = user?.userRole;

        // Cache the result
        if (userRole) {
          userRoleCache.set(userId, userRole);
        }
      }

      if (userRole !== "ADMIN") {
        if (isMobileApp) {
          return NextResponse.json(
            { error: "Forbidden: Admin access required" },
            { status: 403 }
          );
        } else {
          return NextResponse.redirect(new URL("/", request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
