import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";

import { Separator } from "@/components/ui/separator";
// import UserProfilePhoto from "@/components/custom/user-profile-photo";

// import Requests from "@/components/custom/requests";
// import ChangePassword from "@/components/custom/change-password";
import { Wrapper } from "@/components/layout/wrapper";
import { AccountUpdate } from "@/components/dashboard/account-update";
import { changeTypeToText } from "@/lib/utils";
import { UserProfilePhoto } from "@/components/dashboard/user-profile-photo";

export const metadata: Metadata = {
  title: "Account Details | AOEK",
  description: "View and manage your account details",
};

export default async function DashboardPage() {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }

  return (
    <Wrapper className="flex flex-col justify-center items-center mb-[5rem]">
      <h1 className="text-3xl font-bold my-5 lg:my-10">Account Details</h1>

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
          {/* {user.userStatus === "WORKING" && (
            <>
              <Requests requestStatus="VERIFIED" />
              <Separator />
            </>
          )}
          <ChangePassword /> */}
        </div>
      </div>
    </Wrapper>
  );
}
