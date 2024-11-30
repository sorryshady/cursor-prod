import { cookies } from "next/headers";
import { headers } from "next/headers";
import { verifyJWT } from "./jwt";
import { prisma } from "@/lib/db";

type JWTPayload = {
  userId: string;
  membershipId: number;
};

export async function auth() {
  const headersList = await headers();
  const isMobileApp = headersList.get("x-client-type") === "mobile";
  let token: string | undefined;

  if (isMobileApp) {
    const authHeader = headersList.get("authorization");
    token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : undefined;
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get("auth-token")?.value;
  }

  if (!token) return null;

  try {
    const payload = await verifyJWT<JWTPayload>(token);

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
        membershipId: payload.membershipId,
        verificationStatus: "VERIFIED",
      },
    });

    if (!user) return null;

    return user;
  } catch {
    return null;
  }
}
