import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import AdminTabs from "./admin-tabs";
import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";

export default async function Admin() {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }
  if (user.userRole !== "ADMIN") {
    redirect("/dashboard");
  }
  return (
    <main className="relative overflow-hidden">
      <PageBackground imageType="body" className="opacity-5" />
      <Wrapper className="flex w-full flex-col justify-center items-center mb-[5rem] relative z-20">
        <PageHeader
          title="Admin Dashboard"
          description="Manage members and content here."
          className="my-5 lg:my-10"
        />
        {/* <h1 className="text-4xl font-bold mt-5 lg:mt-10">
          Welcome Admin, {user.name.split(" ")[0]}
        </h1>
        <div className="hidden lg:flex flex-col gap-5">
          <h2 className="text-lg font-semibold">
            Manage members and content here.
          </h2> */}
        <AdminTabs />
        {/* </div> */}
        <Card className="flex lg:hidden items-center justify-center text-xl p-4 h-[80vh]">
          Admin Dashboard is only available on bigger screens.
        </Card>
      </Wrapper>
    </main>
  );
}
