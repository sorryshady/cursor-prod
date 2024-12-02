import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { verifyJWT } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db";

type JWTPayload = {
  userId: string;
  membershipId: number;
};

export async function GET(req: NextRequest) {
  try {
    const isMobileApp =
      req.headers.get("x-client-type") === "mobile" ||
      req.headers.get("User-Agent")?.includes("okhttp");

    let user;

    if (isMobileApp) {
      const authHeader = req.headers.get("authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const token = authHeader.split(" ")[1];
      const payload = (await verifyJWT(token)) as JWTPayload;
      user = await prisma.user.findUnique({
        where: {
          id: payload.userId,
          membershipId: payload.membershipId,
          verificationStatus: "VERIFIED",
        },
      });
    } else {
      user = await auth();
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      membershipId: user.membershipId,
      photoUrl: user.photoUrl,
      userRole: user.userRole,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}
