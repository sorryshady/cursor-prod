import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: {
        id: true,
        name: true,
        securityQuestion: {
          take: 1,
          select: {
            question: true,
          },
        },
      },
    });

    if (!user || !user.securityQuestion) {
      return NextResponse.json(
        { error: "User or security question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        securityQuestion: user.securityQuestion[0].question,
      },
    });
  } catch (error) {
    console.error("Get security question error:", error);
    return NextResponse.json(
      { error: "Failed to get security question" },
      { status: 500 }
    );
  }
}
