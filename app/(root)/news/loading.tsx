import { PageBackground } from "@/components/layout/page-background";
import { Wrapper } from "@/components/layout/wrapper";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsLoading() {
  return (
    <main className="relative min-h-screen">
      <PageBackground imageType="body" withGradient />
      <Wrapper className="py-20">
        <Skeleton className="h-12 w-48 mx-auto mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex flex-col">
              <Skeleton className="aspect-video w-full rounded-t-lg" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Wrapper>
    </main>
  );
}
