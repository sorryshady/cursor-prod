import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function StateCommitteeLoading() {
  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" withGradient />

      <main className="relative z-10">
        <Wrapper className="py-20">
          <PageHeader
            title="State Committee"
            description="Meet all our state committee members"
            className="mb-12"
            titleClassName="text-white"
            descriptionClassName="text-gray-200"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="aspect-square w-full mx-auto mb-4 rounded-md" />
                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/2 mx-auto mb-2" />
                <Skeleton className="h-4 w-2/3 mx-auto" />
              </div>
            ))}
          </div>
        </Wrapper>
      </main>
    </div>
  );
}
