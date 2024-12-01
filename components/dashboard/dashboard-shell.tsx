import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" className="opacity-10" />

      <main className="relative z-10">
        <Wrapper className="py-20">
          <PageHeader
            title="My Account"
            description="Manage your profile and settings"
            className="mb-12"
            titleClassName="text-black"
            descriptionClassName="text-muted-foreground"
          />

          {children}
        </Wrapper>
      </main>
    </div>
  );
} 
