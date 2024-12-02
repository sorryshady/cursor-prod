import { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

import { Separator } from "@/components/ui/separator";
import { Wrapper } from "@/components/layout/wrapper";
import { AccountUpdate } from "@/components/dashboard/account-update";
import { changeTypeToText } from "@/lib/utils";
import { UserProfilePhoto } from "@/components/dashboard/user-profile-photo";
import { Requests } from "@/components/dashboard/requests";
import { PromotionTransferRequest } from "@prisma/client";
import { FormMessage } from "@/components/ui/form-message";
import { PageBackground } from "@/components/layout/page-background";

export const metadata: Metadata = {
  title: "Account Details | AOEK",
  description: "View and manage your account details",
};
async function getData() {
  const user = await auth();
  const host = (await headers()).get("host");
  const protocol = process?.env.NODE_ENV === "development" ? "http" : "https";

  try {
    const response = await fetch(
      `${protocol}://${host}/api/user/request?membershipId=${user?.membershipId}`,
    );

    if (!response.ok) {
      return null;
    }

    const request: PromotionTransferRequest = await response.json();
    if (request === null) {
      return {
        status: "VERIFIED",
        id: null,
        adminComments: null,
        showAgain: false,
      };
    }
    const { status, id, adminComments, showAgain } = request;
    return {
      user,
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
  const data = await getData();

  if (!data?.user) {
    redirect("/login");
  }
  const { user, status, id, adminComments, showAgain } = data;

  return (
    <main className="relative overflow-hidden">
      <PageBackground imageType="body" className="opacity-5" />
      <Wrapper className="flex flex-col justify-center items-center mb-[5rem] relative z-20">
        <h1 className="text-3xl font-bold my-5 lg:my-10">Account Details</h1>
        {status === "REJECTED" && showAgain && (
          <FormMessage
            type="error"
            message={`Request Rejected: ${adminComments || "No comments"}`}
            visible={showAgain}
            requestId={id || ""}
          />
        )}
        {status === "VERIFIED" && showAgain && (
          <FormMessage
            type="success"
            message={`Request Accepted: ${adminComments || "No comments"}`}
            visible={showAgain}
            requestId={id || ""}
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
                <Requests requestStatus={status || "VERIFIED"} />
                <Separator />
              </>
            )}
            {/* <ChangePassword />  */}
          </div>
        </div>
      </Wrapper>
    </main>
  );
}
