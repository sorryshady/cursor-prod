import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth/jwt";

// Define protected routes
const protectedRoutes = [
  "/dashboard",
  "/admin",
];

// Add auth routes that should redirect to dashboard if logged in
const authRoutes = ["/login", "/register", "/forgot-password"];

// Add paths that should bypass middleware
const publicPaths = [
  "/_next",
  "/favicon.ico",
  "/public",
  "/api/uploadthing"
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if it's an uploadthing route (allow all uploadthing routes)
  if (pathname.includes("/api/uploadthing")) {
    return NextResponse.next();
  }

  // Check if the path should bypass middleware
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if it's an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (isAuthRoute) {
    const token = request.cookies.get("auth-token")?.value;
    if (token) {
      try {
        await verifyJWT(token);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch {
        return NextResponse.next();
      }
    }
  }

  // Check if it's a protected route
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const isMobileApp = request.headers.get("x-client-type") === "mobile";
    let isAuthenticated = false;
    let decodedToken: any = null;

    if (isMobileApp) {
      const authHeader = request.headers.get("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        try {
          decodedToken = await verifyJWT(token);
          isAuthenticated = true;
        } catch {
          isAuthenticated = false;
        }
      }
    } else {
      const token = request.cookies.get("auth-token");
      if (token) {
        try {
          decodedToken = await verifyJWT(token.value);
          isAuthenticated = true;
        } catch {
          isAuthenticated = false;
        }
      }
    }

    if (!isAuthenticated || !decodedToken) {
      if (isMobileApp) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      } else {
        return NextResponse.redirect(
          new URL(`/login`, request.url)
        );
      }
    }

    // For admin routes, check the role from the JWT token
    if (pathname.startsWith("/admin")) {
      const userRole = decodedToken.role;
      if (userRole !== "ADMIN") {
        if (isMobileApp) {
          return NextResponse.json(
            { error: "Forbidden: Admin access required" },
            { status: 403 }
          );
        } else {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
