"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PageBackground } from "@/components/layout/page-background";
import { Wrapper } from "@/components/layout/wrapper";

export default function NewsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log to error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="relative min-h-screen">
      <PageBackground imageType="body" withGradient />
      <Wrapper className="py-20">
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold">Something went wrong!</h2>
          <p className="text-gray-600 text-center max-w-md">
            We apologize for the inconvenience. Please try again later or
            contact support if the problem persists.
          </p>
          <Button onClick={reset} variant="destructive" className="mt-4">
            Try again
          </Button>
        </div>
      </Wrapper>
    </main>
  );
}
