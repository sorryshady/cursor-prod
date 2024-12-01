"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { SecurityQuestionForm } from "@/components/auth/security-question-form";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [userDetails, setUserDetails] = useState<{
    id: string;
    name: string;
    securityQuestion: string;
  } | null>(null);

  // Fetch user details and security question on mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`/api/auth/security-question/${userId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        setUserDetails(data.user);
      } catch (error) {
        router.push("/login");
      }
    };

    fetchUserDetails();
  }, [userId, router]);

  if (!userDetails) {
    return null; // or loading spinner
  }

  return (
    <>
      <PageBackground imageType="body" className="opacity-10" />
      <Wrapper className="relative z-10 py-8">
        <div className="mx-auto max-w-md space-y-6">
          <PageHeader
            title="Reset Password"
            description={`Hi ${userDetails.name}, please answer your security question to reset your password`}
          />
          <Card>
            <CardContent className="pt-6">
              <SecurityQuestionForm
                userDetails={userDetails}
                onBack={() => router.push("/login")}
              />
            </CardContent>
          </Card>
        </div>
      </Wrapper>
    </>
  );
}
