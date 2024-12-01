import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventsLoading() {
  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" withGradient />

      <main className="relative z-10">
        <Wrapper className="py-20">
          <PageHeader
            title="Events"
            description="Join us in our upcoming events or explore our past events"
            className="mb-12"
            titleClassName="text-white"
            descriptionClassName="text-gray-200"
          />

          {/* Upcoming Events Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex h-[280px] bg-white/5 rounded-lg overflow-hidden">
                  <Skeleton className="w-[45%] h-full" />
                  <div className="flex-1 p-6">
                    <Skeleton className="h-6 w-32 mb-3" />
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Past Events Section */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-8">
              Past Events
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex h-[280px] bg-white/5 rounded-lg overflow-hidden">
                  <Skeleton className="w-[45%] h-full" />
                  <div className="flex-1 p-6">
                    <Skeleton className="h-6 w-32 mb-3" />
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Wrapper>
      </main>
    </div>
  );
} 
