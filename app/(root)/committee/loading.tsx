import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommitteeLoading() {
  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" withGradient />

      <main className="relative z-10">
        <Wrapper className="py-20">
          <PageHeader
            title="Committee"
            description="Meet our dedicated committee members"
            className="mb-12"
            titleClassName="text-white"
            descriptionClassName="text-gray-200"
          />

          {/* State Committee Section */}
          <section className="mb-20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-white">
                State Committee
              </h2>
              <Skeleton className="h-10 w-32" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 rounded-lg overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* District Committee Section */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-8">
              District Committee
            </h2>
            {/* We'll add district committee loading state later */}
          </section>
        </Wrapper>
      </main>
    </div>
  );
} 