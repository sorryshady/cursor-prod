'use client';

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { RefreshCcw } from "lucide-react";

export default function GalleryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" className="opacity-10" />

      <main className="relative z-10">
        <Wrapper className="py-20">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold text-black mb-4">
              Something went wrong!
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              We encountered an error while loading the gallery. Please try again.
            </p>
            <Button
              onClick={reset}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </Wrapper>
      </main>
    </div>
  );
} 
