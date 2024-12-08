import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { registrationSchema } from "@/lib/validations/auth";
import { parse } from "date-fns";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = registrationSchema.parse(body);

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: {
        name: data.name,
        dob: parse(data.dob, "dd/MM/yyyy", new Date()),
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        userStatus: data.userStatus,
        ...(data.userStatus === "WORKING"
          ? {
              department: data.department,
              designation: data.designation,
              officeAddress: data.officeAddress,
              workDistrict: data.workDistrict,
            }
          : {
              retiredDepartment: data.retiredDepartment,
            }),
        personalAddress: data.personalAddress,
        homeDistrict: data.homeDistrict,
        email: data.email,
        phoneNumber: data?.phoneNumber,
        mobileNumber: data.mobileNumber,
        photoUrl: data.photoUrl,
        photoId: data.photoId,
      },
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
