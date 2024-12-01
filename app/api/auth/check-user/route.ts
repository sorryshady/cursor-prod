import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { identifier } = await req.json();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { membershipId: parseInt(identifier) || 0 },
        ],
      },
      select: {
        id: true,
        name: true,
        photoUrl: true,
        verificationStatus: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        photoUrl: user.photoUrl,
        verificationStatus: user.verificationStatus,
        hasPassword: !!user.password,
      },
    });
  } catch (error) {
    console.error("Check user error:", error);
    return NextResponse.json(
      { error: "Failed to check user" },
      { status: 500 }
    );
  }
}
