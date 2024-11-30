import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { signJWT } from "@/lib/auth/jwt";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();
    const isMobileApp = req.headers.get("x-client-type") === "mobile";

    // Check if login is via email or membershipId
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { membershipId: parseInt(identifier) || 0 },
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check verification status
    if (user.verificationStatus === "REJECTED") {
      return NextResponse.json(
        { error: "Registration has been rejected" },
        { status: 403 },
      );
    }

    if (user.verificationStatus === "PENDING") {
      return NextResponse.json(
        { error: "Account is pending approval" },
        { status: 403 },
      );
    }

    // Check if password is set
    if (!user.password) {
      return NextResponse.json(
        {
          requiresPasswordSetup: true,
          userId: user.id,
          name: user.name,
        },
        { status: 200 },
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Generate JWT
    const token = await signJWT({
      userId: user.id,
      membershipId: user.membershipId,
    });

    const response = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        membershipId: user.membershipId,
      },
    };

    // For mobile clients, include token in response
    if (isMobileApp) {
      return NextResponse.json({
        ...response,
        token,
      });
    }

    // For web clients, set cookie
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
