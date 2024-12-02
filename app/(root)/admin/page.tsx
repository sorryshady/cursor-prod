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
      <Wrapper className="flex flex-col gap-5 mb-[5rem] min-h-[70vh] relative">
        <PageHeader
          title="Admin Dashboard"
          description="Manage members and content here."
          className="my-5 lg:my-10"
        />
        <div className="hidden lg:flex flex-col gap-5 relative z-20">
          <AdminTabs />
        </div>
        <Card className="flex lg:hidden items-center justify-center text-xl p-4 h-[80vh]">
          Admin Dashboard is only available on bigger screens.
        </Card>
      </Wrapper>
    </main>
  );
}
