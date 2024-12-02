import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { signJWT } from "@/lib/auth/jwt";


export async function POST(req: NextRequest) {
  try {
    const { userId, password } = await req.json();
    const isMobileApp = req.headers.get("x-client-type") === "mobile";

    // Get current user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        membershipId: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if new password is same as old password
    if (user.password) {
      const isSamePassword = await verifyPassword(password, user.password);
      if (isSamePassword) {
        return NextResponse.json(
          { error: "New password cannot be the same as your old password" },
          { status: 400 }
        );
      }
    }

    // Hash and update the new password
    const hashedPassword = await hashPassword(password);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
      select: {
        id: true,
        name: true,
        email: true,
        membershipId: true,
        userRole: true,
      },
    });

    // Generate JWT for mobile clients
    if (isMobileApp) {
      const token = await signJWT({
        userId: updatedUser.id,
        role: updatedUser.userRole,
        membershipId: updatedUser.membershipId,
      });

      return NextResponse.json({
        message: "Password reset successful",
        token,
        user: updatedUser,
      });
    }

    // For web clients, just return success message
    return NextResponse.json({
      message: "Password reset successful",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
