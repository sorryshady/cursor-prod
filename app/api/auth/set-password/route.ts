import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, hashSecurityAnswer } from "@/lib/auth/password";
import { signJWT } from "@/lib/auth/jwt";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { userId, password, securityQuestion, securityAnswer } =
      await req.json();

    const isMobileApp = req.headers.get("x-client-type") === "mobile";

    // Hash password and security answer
    const hashedPassword = await hashPassword(password);
    const hashedAnswer = await hashSecurityAnswer(securityAnswer);

    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        securityQuestion: {
          create: {
            question: securityQuestion,
            answer: hashedAnswer,
          },
        },
      },
    });

    // Generate JWT
    const token = await signJWT({
      userId: user.id,
      role: user.userRole,
      membershipId: user.membershipId,
    });

    const response = {
      message: "Password set successfully",
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
    console.error("Set password error:", error);
    return NextResponse.json(
      { error: "Failed to set password" },
      { status: 500 },
    );
  }
}
