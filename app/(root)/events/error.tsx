'use client';

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { RefreshCcw } from "lucide-react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function EventsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative min-h-screen">
      <PageBackground imageType="body" withGradient />

      <main className="relative z-10">
        <Wrapper className="py-20">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-200 mb-8 max-w-md">
              We encountered an error while loading the events. Please try again later.
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
