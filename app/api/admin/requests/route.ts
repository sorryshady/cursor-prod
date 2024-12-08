import { NextRequest, NextResponse } from "next/server";
import { VerificationStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/auth";

function isValidStatus(status: VerificationStatus): status is VerificationStatus {
  return Object.values(VerificationStatus).includes(status);
}

export async function GET() {
  try {
    // Check admin authorization
    const user = await auth();
    if (!user || user.userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = await prisma.promotionTransferRequest.findMany({
      where: { status: VerificationStatus.PENDING },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            membershipId: true,
            userRole: true,
            userStatus: true,
            designation: true,
            workDistrict: true,
          }
        }
      },
      orderBy: { requestedAt: "asc" },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Fetching pending requests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending requests" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check admin authorization
    const user = await auth();
    if (!user || user.userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { requestId, status, adminComments } = body;

    // Validate input
    if (!requestId || !status) {
      return NextResponse.json(
        { error: "Request ID and Status are required" },
        { status: 400 }
      );
    }

    if (!isValidStatus(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Fetch the existing request
    const existingRequest = await prisma.promotionTransferRequest.findUnique({
      where: { id: requestId },
      include: {
        user: {
          select: {
            id: true,
            userStatus: true,
          }
        }
      },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    // Update request and user based on approval
    const updatedRequest = await prisma.$transaction(async (tx) => {
      // Update the request
      const request = await tx.promotionTransferRequest.update({
        where: { id: requestId },
        data: {
          status,
          adminComments,
          approvedAt: status === VerificationStatus.VERIFIED ? new Date() : null,
          expiryDate: status === VerificationStatus.VERIFIED
            ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            : null,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              membershipId: true,
              userStatus: true,
              designation: true,
              workDistrict: true,
              department: true,
            }
          }
        }
      });

      // If approved, update user details
      if (status === VerificationStatus.VERIFIED) {
        await tx.user.update({
          where: { id: existingRequest.user.id },
          data: {
            userStatus: request.retirementDate ? "RETIRED" : undefined,
            retiredDepartment: request.retirementDate ? request.user.department : undefined,
            designation: request.newPosition || undefined,
            workDistrict: request.newWorkDistrict || undefined,
            officeAddress: request.newOfficeAddress || undefined,
          },
        });
      }

      return request;
    });

    return NextResponse.json({
      message: "Request processed successfully",
      request: updatedRequest
    });
  } catch (error) {
    console.error("Request approval error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
