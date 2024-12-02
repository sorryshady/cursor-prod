import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/auth";
import { VerificationStatus, RequestType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "date-fns";
import { cookies } from "next/headers";
import { verifyJWT } from '@/lib/auth/jwt'
import { JWTPayload } from 'jose'


export async function POST(request: Request) {
  try {
    const user = await auth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.userStatus !== "WORKING") {
      return NextResponse.json(
        { error: "Only working users can submit requests" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const {
      requestType,
      newPosition,
      newWorkDistrict,
      newOfficeAddress,
      retirementDate,
    } = body;

    // Check for existing pending request
    const existingRequest = await prisma.promotionTransferRequest.findFirst({
      where: {
        membershipId: user.membershipId!,
        status: VerificationStatus.PENDING,
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "You already have a pending request" },
        { status: 400 },
      );
    }

    // Validate request type
    if (!Object.values(RequestType).includes(requestType)) {
      return NextResponse.json(
        { error: "Invalid request type" },
        { status: 400 },
      );
    }

    let parsedDate;
    if (retirementDate) {
      parsedDate = parse(retirementDate, "dd/MM/yyyy", new Date());
    }

    // Check if new position is same as old position for promotion requests
    if (requestType === RequestType.PROMOTION) {
      if (newPosition === user.designation) {
        return NextResponse.json(
          { error: "New position cannot be same as current position" },
          { status: 400 },
        );
      }
    }

    // Check if new work district is same as old work district for transfer requests
    if (requestType === RequestType.TRANSFER) {
      if (newWorkDistrict === user.workDistrict) {
        return NextResponse.json(
          {
            error: "New work district cannot be same as current work district",
          },
          { status: 400 },
        );
      }
    }

    // Create the request
    const newRequest = await prisma.promotionTransferRequest.create({
      data: {
        membershipId: user.membershipId!,
        requestType,
        oldPosition: user.designation,
        newPosition:
          requestType === RequestType.PROMOTION ? newPosition : undefined,
        oldWorkDistrict: user.workDistrict,
        newWorkDistrict:
          requestType === RequestType.TRANSFER ? newWorkDistrict : undefined,
        oldOfficeAddress: user.officeAddress,
        newOfficeAddress:
          requestType === RequestType.TRANSFER ? newOfficeAddress : undefined,
        retirementDate:
          requestType === RequestType.RETIREMENT ? parsedDate : undefined,
        status: VerificationStatus.PENDING,
      },
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("Request creation error:", error);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const membershipId = searchParams.get("membershipId");

    if (!membershipId) {
      return NextResponse.json(
        { error: "Membership ID is required" },
        { status: 400 },
      );
    }
    const requests = await prisma.promotionTransferRequest.findFirst({
      where: { membershipId: parseInt(membershipId) },
      orderBy: { requestedAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await auth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get requestId from URL params
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("requestId");

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 },
      );
    }

    // Update the request visibility
    const updatedRequest = await prisma.promotionTransferRequest.update({
      where: {
        id: requestId,
        membershipId: user.membershipId!, // Ensure user owns this request
      },
      data: {
        showAgain: false,
      },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error updating request visibility:", error);

    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        { error: "Request not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update request visibility" },
      { status: 500 },
    );
  }
}
