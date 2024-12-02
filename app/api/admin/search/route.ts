
import { prisma } from '@/lib/db'
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { search } = body;

    // Validate search parameter
    if (!search) {
      return NextResponse.json({ error: "Empty search" }, { status: 400 });
    }

    // Construct dynamic where clause
    const where: Prisma.UserWhereInput = {
      OR: search
        ? [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { membershipId: parseInt(search) },
          ]
        : undefined,
    };

    // Search users
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        membershipId: true,
        name: true,
        email: true,
        userStatus: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("User search error:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 },
    );
  }
}
