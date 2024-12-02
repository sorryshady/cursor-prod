
import { prisma } from '@/lib/db'
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [promotions, transfers, retirements, obituaries] = await Promise.all([
      // fetching promotions
      prisma.promotionTransferRequest.findMany({
        where: {
          requestType: "PROMOTION",
          status: "VERIFIED",
          expiryDate: { gt: new Date() },
        },
        select: {
          oldPosition: true,
          newPosition: true,
          user: {
            select: {
              name: true,
              photoUrl: true,
              department: true,
            },
          },
        },
      }),
      //   fetching transfers
      prisma.promotionTransferRequest.findMany({
        where: {
          requestType: "TRANSFER",
          status: "VERIFIED",
          expiryDate: { gt: new Date() },
        },
        select: {
          oldWorkDistrict: true,
          newWorkDistrict: true,
          oldPosition: true,
          user: {
            select: {
              name: true,
              photoUrl: true,
              department: true,
            },
          },
        },
      }),
      //   fetching retirements
      prisma.promotionTransferRequest.findMany({
        where: {
          requestType: "RETIREMENT",
          status: "VERIFIED",
          expiryDate: { gt: new Date() },
        },
        select: {
          retirementDate: true,
          oldPosition: true,
          user: {
            select: {
              name: true,
              photoUrl: true,
              department: true,
            },
          },
        },
      }),
      //   fetching obituaries
      prisma.obituary.findMany({
        where: {
          expiryDate: { gt: new Date() },
        },
        select: {
          dateOfDeath: true,
          additionalNote: true,
          user: {
            select: {
              name: true,
              photoUrl: true,
              department: true,
              designation: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json(
      { promotions, transfers, retirements, obituaries },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fetching obituaries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch obituaries" },
      { status: 500 },
    );
  }
}
