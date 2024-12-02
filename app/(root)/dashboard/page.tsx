import { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth/auth";

import { Separator } from "@/components/ui/separator";
import { Wrapper } from "@/components/layout/wrapper";
import { AccountUpdate } from "@/components/dashboard/account-update";
import { changeTypeToText } from "@/lib/utils";
import { UserProfilePhoto } from "@/components/dashboard/user-profile-photo";
import { Requests } from "@/components/dashboard/requests";
import { PromotionTransferRequest, VerificationStatus } from "@prisma/client";
import { FormMessage } from "@/components/ui/form-message";
import { PageBackground } from "@/components/layout/page-background";
import ChangePassword from "@/components/dashboard/change-password";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Account Details | AOEK",
  description: "View and manage your account details",
};
async function getData(membershipId: number) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/request?membershipId=${membershipId}`,
    );

    if (!response.ok) {
      return null;
    }

    const request: PromotionTransferRequest = await response.json();
    if (!request) {
      return {
        status: "VERIFIED" as VerificationStatus,
        id: null,
        adminComments: null,
        showAgain: false,
      };
    }
    const { status, id, adminComments, showAgain } = request;
    return {
      status,
      id,
      adminComments,
      showAgain,
    };
  } catch (error) {
    console.error("Error fetching request:", error);
    return notFound();
  }
}

export default async function DashboardPage() {
  const user = await auth();
  if (!user) {
    redirect("/login");
  }
  const data = await getData(user.membershipId!);

  return (
    <main className="relative overflow-hidden">
      <PageBackground imageType="body" className="opacity-5" />
      <Wrapper className="flex flex-col justify-center items-center mb-[5rem] relative z-20">
        <h1 className="text-3xl font-bold my-5 lg:my-10">Account Details</h1>
        {data?.status === "REJECTED" && data?.showAgain && (
          <FormMessage
            type="error"
            message={`Request Rejected: ${data?.adminComments || "No comments"}`}
            visible={data?.showAgain}
            requestId={data?.id || ""}
          />
        )}
        {data?.status === "VERIFIED" && data?.showAgain && (
          <FormMessage
            type="success"
            message={`Request Accepted: ${data?.adminComments || "No comments"}`}
            visible={data?.showAgain}
            requestId={data?.id || ""}
          />
        )}
        <div className="flex w-full gap-14 md:max-w-[90%] lg:flex-row flex-col-reverse mt-5 lg:mt-10">
          {/* Left Column */}
          <div className="flex flex-col gap-10 flex-[1.5]">
            {/* Personal Information */}
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Personal Information</h2>
              <div className="grid grid-cols-2 capitalize gap-5">
                <div>Name</div>
                <div>{user.name}</div>
                <div>Date of Birth</div>
                <div>
                  {new Date(user.dob).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div>Gender</div>
                <div>{changeTypeToText(user.gender)}</div>
                <div>Blood Group</div>
                <div>{changeTypeToText(user.bloodGroup)}</div>
                <div>User Role</div>
                <div>{user.userRole.toLowerCase()}</div>
                <div>Membership ID</div>
                <div>{user.membershipId}</div>
              </div>
            </div>

            <Separator />

            {/* Employment Information */}
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Employment Information</h2>
              <div className="grid grid-cols-2 capitalize gap-5">
                <div>Employment Status</div>
                <div>{user.userStatus.toLowerCase()}</div>
                {user.userStatus === "WORKING" && (
                  <>
                    <div>Department</div>
                    <div>{user.department!.toLowerCase()}</div>
                    <div>Designation</div>
                    <div>{changeTypeToText(user.designation!)}</div>
                    <div>Office Address</div>
                    <div>{user.officeAddress!}</div>
                    <div>Work District</div>
                    <div>{changeTypeToText(user.workDistrict!)}</div>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* Account Update Section - Will be replaced with actual component */}
            <AccountUpdate user={user} />
          </div>

          {/* Right Column */}
          <div className="flex-[0.5] flex flex-col gap-5">
            <UserProfilePhoto name={user.name} photoUrl={user.photoUrl || ""} />
            <Separator />
            {user.userStatus === "WORKING" && (
              <>
                <Requests requestStatus={data?.status || "VERIFIED"} />
                <Separator />
              </>
            )}
            <ChangePassword />
          </div>
        </div>
      </Wrapper>
    </main>
  );
}
