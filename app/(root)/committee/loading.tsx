import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
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

            <Card className="w-full max-w-7xl mx-auto p-20 bg-gradient-to-b from-slate-700 to-slate-800 ">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white/5 rounded-lg overflow-hidden"
                  >
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2 mx-auto" />
                      <Skeleton className="h-4 w-1/2 mb-2 mx-auto" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* District Committee Section */}
          <section>
            <h2 className="text-2xl font-semibold text-center text-black mb-8">
              District Committee
            </h2>
            {/* We'll add district committee loading state later */}
          </section>
        </Wrapper>
      </main>
    </div>
  );
}
