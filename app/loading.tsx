import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <main className="relative min-h-screen">
      <PageBackground imageType="body" withGradient />
      <Wrapper className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#35718E]" />
          <p className="text-lg font-medium text-[#35718E]">Loading...</p>
        </div>
      </Wrapper>
    </main>
  );
}
