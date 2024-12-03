import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const isMobileApp =
    req.headers.get("x-client-type") === "mobile" ||
    req.headers.get("User-Agent")?.includes("okhttp");

  if (!isMobileApp) {
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");
  }

  return NextResponse.json({ message: "Logged out successfully" });
}
