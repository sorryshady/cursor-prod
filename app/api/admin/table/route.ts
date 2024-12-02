
import { prisma } from '@/lib/db'
import { CommitteeType, Department, Prisma, UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      page = 0,
      pageSize = 10,
      search = "",
      userRole = [], // Now expects an array
      committeeType = [], // Now expects an array
      department = [],
      status = "VERIFIED",
    } = body;

    // Construct dynamic where clause
    const where: Prisma.UserWhereInput = {
      OR: search
        ? [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
      // Handle multiple roles
      userRole:
        userRole.length > 0
          ? { in: userRole as UserRole[] } // Use 'in' operator for array of values
          : undefined,
      // Handle multiple statuses
      committeeType:
        committeeType.length > 0
          ? { in: committeeType as CommitteeType[] } // Use 'in' operator for array of values
          : undefined,
      department:
        department.length > 0 ? { in: department as Department[] } : undefined,
      verificationStatus: status,
    };

    // Fetch users with pagination and filtering
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: page * pageSize,
        take: pageSize,
        select: {
          membershipId: true,
          name: true,
          email: true,
          designation: true,
          department: true,
          workDistrict: true,
          userRole: true,
          committeeType: true,
        },
        orderBy: {
          membershipId: "desc",
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
