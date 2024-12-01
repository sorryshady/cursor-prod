import { auth } from '@/lib/auth/auth'
import { prisma } from "@/lib/db";
import { utapi } from "@/lib/utapi";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.membershipId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { membershipId: session.membershipId }
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const { photoUrl, photoId } = await req.json();

    // Delete the previous photo if it exists
    if (user.photoId) {
      try {
        await utapi.deleteFiles(user.photoId);
      } catch (error) {
        console.error("Error deleting previous photo:", error);
      }
    }

    // Update user with new photo information
    const updatedUser = await prisma.user.update({
      where: { membershipId: user.membershipId! },
      data: {
        photoUrl,
        photoId,
      },
    });

    return Response.json(updatedUser);
  } catch (error) {
    console.error("Error updating photo:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
