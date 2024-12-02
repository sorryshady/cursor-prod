
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, status } = await req.json();
    const numberOfUsers = await prisma.user.count({
      where: { verificationStatus: "VERIFIED" },
    });
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (existingUser.membershipId) {
      return NextResponse.json(
        { error: "User already verified" },
        { status: 400 },
      );
    }
    const membershipId = numberOfUsers + 1;
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        verificationStatus: status,
        membershipId: status === "VERIFIED" ? membershipId : null,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json(
      { error: "Failed to update user status" },
      { status: 500 },
    );
  }
}
