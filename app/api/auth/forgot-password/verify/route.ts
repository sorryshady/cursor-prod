import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySecurityAnswer } from "@/lib/auth/password";

export async function POST(req: NextRequest) {
  try {
    const { userId, answer } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        securityQuestion: {
          take: 1
        }
      },
    });

    if (!user || !user.securityQuestion) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const isValid = await verifySecurityAnswer(
      answer,
      user.securityQuestion[0].answer
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Incorrect security answer" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify security answer error:", error);
    return NextResponse.json(
      { error: "Failed to verify security answer" },
      { status: 500 }
    );
  }
}
