import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { Skeleton } from "@/components/ui/skeleton";

export default function GalleryLoading() {
  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" className="opacity-10" />

      <main className="relative z-10">
        <Wrapper className="py-20">
          <div className="mb-12">
            <Skeleton className="h-12 w-[300px] mb-4" />
            <Skeleton className="h-6 w-[400px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <Skeleton key={index} className="aspect-square rounded-lg" />
            ))}
          </div>
        </Wrapper>
      </main>
    </div>
  );
}
