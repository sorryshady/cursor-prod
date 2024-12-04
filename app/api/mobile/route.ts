import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { utapi } from "@/lib/utapi";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const user = await auth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(user);
}

export async function POST(req: NextRequest) {
  try {
    // Verify user authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get form data from request
    const formData = await req.formData();
    const photo = formData.get("photo") as File;

    if (!photo) {
      return NextResponse.json({ error: "No photo provided" }, { status: 400 });
    }
    const uploadedFile = await utapi.uploadFiles(photo);
    if (!uploadedFile.data?.url || !uploadedFile.data?.key) {
      return NextResponse.json(
        { error: "Failed to upload photo" },
        { status: 500 },
      );
    }
    if (session.photoId) {
      await utapi.deleteFiles(session.photoId);
    }

    const updatedUser = await prisma.user.update({
      where: { membershipId: session.membershipId! },
      data: {
        photoId: uploadedFile.data?.key,
        photoUrl: uploadedFile.data?.url,
      },
      select: {
        photoUrl: true,
      },
    });

    return NextResponse.json({
      photoUrl: updatedUser.photoUrl,
    });
  } catch (error) {
    console.error("Error in update-photo route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
