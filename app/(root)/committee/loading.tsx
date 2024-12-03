import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
export default function CommitteeLoading() {
  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" className="opacity-10" />

      <main className="relative z-10">
        <Wrapper className="py-20">
          <PageHeader
            title="Committee"
            description="Meet our dedicated committee members"
            className="mb-12"
            titleClassName="text-black"
            descriptionClassName="text-muted-foreground"
          />

          {/* State Committee Section */}
          <section className="mb-20">
            <h2 className="text-2xl font-semibold text-center text-black mb-8">
              State Committee
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white/80 rounded-lg p-4 w-full max-w-[300px]"
                >
                  <Skeleton className="aspect-square w-full bg-gray-400/20" />
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-6 w-3/4 bg-gray-400/20" />
                    <Skeleton className="h-4 w-1/2 bg-gray-400/20" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center w-fit mx-auto">
              <Skeleton className="h-10 w-32 bg-gray-400/20" />
            </div>
          </section>

          {/* District Committee Section */}
          <section>
            <h2 className="text-2xl font-semibold text-center text-black mb-8">
              District Committee
            </h2>
            <div className="bg-white/80 rounded-lg p-6 max-w-3xl mx-auto">
              <Skeleton className="h-12 w-full mb-4 bg-gray-400/20" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 w-full bg-gray-400/20" />
                ))}
              </div>
            </div>
          </section>
        </Wrapper>
      </main>
    </div>
  );
}
