import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { utapi } from "@/lib/utapi";
import {
  personalInfoSchema,
  professionalInfoSchema,
  contactInfoSchema,
  photoSchema,
} from "@/lib/validations/auth";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Determine which schema to use based on the data
    let validatedData;
    if ("name" in body) {
      validatedData = personalInfoSchema.parse(body);
    } else if ("designation" in body) {
      validatedData = professionalInfoSchema.parse(body);
    } else if ("email" in body) {
      validatedData = contactInfoSchema.parse(body);
    } else if ("photoUrl" in body) {
      validatedData = photoSchema.parse(body);

      // Handle photo deletion if needed
      if (session.photoId) {
        try {
          await utapi.deleteFiles(session.photoId);
        } catch (error) {
          console.error("Error deleting old photo:", error);
        }
      }
    } else {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 },
      );
    }

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: validatedData,
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
