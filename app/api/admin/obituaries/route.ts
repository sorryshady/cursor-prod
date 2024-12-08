import { NextRequest, NextResponse } from "next/server";
import { UserStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/auth";
import { parse } from "date-fns";

export async function POST(request: NextRequest) {
  try {
    // Check admin authorization
    const user = await auth();
    if (!user || user.userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { membershipId, additionalNote, dateOfDeath } = body;

    // Validate input
    if (!membershipId) {
      return NextResponse.json(
        { error: "Membership ID is required" },
        { status: 400 }
      );
    }
    if (!dateOfDeath) {
      return NextResponse.json(
        { error: "Date of death is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { membershipId: Number(membershipId) },
      select: { id: true, userStatus: true }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check for existing obituary
    const existingObituary = await prisma.obituary.findFirst({
      where: { membershipId: Number(membershipId) }
    });

    if (existingObituary) {
      return NextResponse.json(
        { error: "Obituary already exists for this user" },
        { status: 400 }
      );
    }

    // Create obituary and update user status in a transaction
    const obituary = await prisma.$transaction(async (tx) => {
      // Update user status
      await tx.user.update({
        where: { membershipId: Number(membershipId) },
        data: { userStatus: UserStatus.EXPIRED }
      });

      // Create obituary
      return await tx.obituary.create({
        data: {
          membershipId: Number(membershipId),
          dateOfDeath: parse(dateOfDeath, "dd/MM/yyyy", new Date()),
          additionalNote,
          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              membershipId: true,
              userStatus: true
            }
          }
        }
      });
    });

    return NextResponse.json({
      message: "Obituary created successfully",
      obituary
    }, { status: 201 });
  } catch (error) {
    console.error("Obituary creation error:", error);
    return NextResponse.json(
      { error: "Failed to create obituary" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await auth();
    if (!user || user.userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeExpired = searchParams.get("includeExpired") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const whereCondition = includeExpired
      ? {}
      : { expiryDate: { gt: new Date() } };

    // Get total count for pagination
    const totalCount = await prisma.obituary.count({
      where: whereCondition,
    });

    const totalPages = Math.ceil(totalCount / limit);

    // Get paginated obituaries
    const obituaries = await prisma.obituary.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            membershipId: true,
            userStatus: true,
            designation: true,
            workDistrict: true,
            department: true,
            photoUrl: true,
          }
        }
      },
      orderBy: { dateRecorded: "desc" },
      skip,
      take: limit,
    });

    return NextResponse.json({
      obituaries,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Fetching obituaries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch obituaries" },
      { status: 500 }
    );
  }
}
