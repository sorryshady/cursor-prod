"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <main className="relative min-h-screen">
          <PageBackground imageType="body" withGradient />
          <Wrapper className="h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-6 max-w-md text-center">
              <AlertTriangle className="h-12 w-12 text-red-500" />
              <h1 className="text-2xl font-bold">Something went wrong!</h1>
              <p className="text-gray-600">
                We apologize for the inconvenience. Our team has been notified
                and is working to fix the issue.
              </p>
              <div className="flex gap-4">
                <Button onClick={reset} variant="destructive">
                  Try again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/")}
                >
                  Go Home
                </Button>
              </div>
            </div>
          </Wrapper>
        </main>
      </body>
    </html>
  );
}
