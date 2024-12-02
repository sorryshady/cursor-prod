import { auth } from '@/lib/auth/auth'
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const user = await auth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(user);
}
