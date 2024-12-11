import { prisma } from "@/lib/db";
import { AdminUpdate } from "@/components/admin/admin-update";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { Wrapper } from "@/components/layout/wrapper";
import ActionButtons from "./action-buttons";
import {
  CommitteeType,
  User,
  StatePositionTitle,
  DistrictPositionTitle,
  UserRole,
} from "@prisma/client";
import BackButton from "@/components/ui/back-button";

export type AdminUserView = Pick<
  User,
  | "name"
  | "email"
  | "dob"
  | "gender"
  | "bloodGroup"
  | "userStatus"
  | "department"
  | "designation"
  | "officeAddress"
  | "workDistrict"
  | "personalAddress"
  | "homeDistrict"
  | "phoneNumber"
  | "mobileNumber"
  | "verificationStatus"
  | "photoUrl"
> & {
  userRole?: UserRole;
  membershipId?: number | null;
  committeeType?: CommitteeType | null;
  positionState?: StatePositionTitle | null;
  positionDistrict?: DistrictPositionTitle | null;
};

async function getData(
  email: string,
  status: "verified" | "pending",
): Promise<{ user: AdminUserView }> {
  if (status === "verified") {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: {
        name: true,
        email: true,
        dob: true,
        gender: true,
        membershipId: true,
        bloodGroup: true,
        userStatus: true,
        userRole: true,
        department: true,
        designation: true,
        officeAddress: true,
        workDistrict: true,
        retiredDepartment: true,
        personalAddress: true,
        homeDistrict: true,
        phoneNumber: true,
        mobileNumber: true,
        verificationStatus: true,
        photoUrl: true,
        committeeType: true,
        positionState: true,
        positionDistrict: true,
      },
    });
    if (!existingUser) {
      return notFound();
    }
    return { user: existingUser };
  } else if (status === "pending") {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: {
        name: true,
        email: true,
        dob: true,
        gender: true,
        bloodGroup: true,
        userStatus: true,
        department: true,
        designation: true,
        officeAddress: true,
        workDistrict: true,
        retiredDepartment: true,
        personalAddress: true,
        homeDistrict: true,
        phoneNumber: true,
        mobileNumber: true,
        verificationStatus: true,
        photoUrl: true,
      },
    });
    if (!existingUser) {
      return notFound();
    }
    return { user: existingUser };
  } else {
    notFound();
  }
}
interface ProfilePageProps {
  params: Promise<{ email: string }>;
  searchParams: Promise<{ status: "verified" | "pending" }>;
}
export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const { email } = await params;
  const { status } = await searchParams;
  const { user } = await getData(decodeURIComponent(email), status);
  return (
    <Wrapper className="my-[5rem] min-h-[70vh] flex justify-center items-center relative">
      <BackButton label="Back to admin" type="black" />
      <div className="max-w-4xl mx-auto pt-10">
        <div className="space-y-8">
          <div className="flex flex-col  md:flex-row items-center md:items-start mb-8">
            <Image
              src={user.photoUrl || "/fall-back.webp"}
              alt={user.name}
              width={150}
              height={150}
              priority
              className="rounded-full mb-4 md:mb-0 md:mr-8 object-cover w-56 h-56"
            />
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-xl text-muted-foreground mb-4">{user.email}</p>
              {user.verificationStatus === "VERIFIED" ? (
                <Badge variant={"default"}>Verified</Badge>
              ) : (
                <ActionButtons email={user.email!} />
              )}
            </div>
          </div>
          <Separator />
          <AdminUpdate user={user as User} />
        </div>
      </div>
    </Wrapper>
  );
}
