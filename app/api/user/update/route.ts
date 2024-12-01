import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { District } from "@prisma/client";

// Schema for validation
const updateProfileSchema = z.object({
  membershipId: z.number(),
  personalAddress: z
    .string()
    .min(1, { message: "Personal address is required" }),
  homeDistrict: z.nativeEnum(District),
  phoneNumber: z
    .string()
    .optional()
    .refine((value) => !value || /^(\+91)?\d{10}$/.test(value), {
      message:
        "Phone number must be exactly 10 digits or start with +91 followed by 10 digits",
    }),
  mobileNumber: z
    .string()
    .min(10)
    .refine((value) => !value || /^(\+91)?\d{10}$/.test(value), {
      message:
        "Phone number must be exactly 10 digits or start with +91 followed by 10 digits",
    }),
});

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    // Validate request body
    const validation = updateProfileSchema.safeParse(body);
    if (!validation.success) {
      return new Response(JSON.stringify({ error: validation.error.errors[0].message }), {
        status: 400,
      });
    }

    const { membershipId, ...updateData } = validation.data;

    // Verify user exists and matches the session
    const user = await prisma.user.findUnique({
      where: { membershipId }
    });

    if (!user || user.membershipId !== session.membershipId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { membershipId },
      data: updateData,
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("[USER_UPDATE_ERROR]", error);
    return new Response("Internal Server Error", { status: 500 });
  }
} 
