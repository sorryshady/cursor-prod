import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function GalleryLoading() {
  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" className="opacity-10" />

      <main className="relative z-10">
        <Wrapper className="py-20">
          <PageHeader
            title={<Skeleton className="h-8 w-64" />}
            description={<Skeleton className="h-4 w-96" />}
            className="mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <Skeleton
                key={index}
                className="aspect-square rounded-lg"
              />
            ))}
          </div>
        </Wrapper>
      </main>
    </div>
  );
}
