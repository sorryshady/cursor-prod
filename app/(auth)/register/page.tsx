"use client";

import { useState } from "react";
import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";
import { PersonalInfoForm } from "@/components/auth/register/personal-info-form";
import { ProfessionalInfoForm } from "@/components/auth/register/professional-info-form";
import { ContactInfoForm } from "@/components/auth/register/contact-info-form";
import { PhotoUploadForm } from "@/components/auth/register/photo-upload-form";
import { Steps } from "@/components/auth/register/steps";
import { Card, CardContent } from "@/components/ui/card";
import type {
  PersonalInfoInput,
  ProfessionalInfoInput,
  ContactInfoInput,
  PhotoInput,
} from "@/lib/validations/auth";
import Link from "next/link";

type RegistrationStep = 1 | 2 | 3 | 4;

export default function RegisterPage() {
  const [step, setStep] = useState<RegistrationStep>(1);
  const [formData, setFormData] = useState({
    personalInfo: null as PersonalInfoInput | null,
    professionalInfo: null as ProfessionalInfoInput | null,
    contactInfo: null as ContactInfoInput | null,
    photo: null as PhotoInput | null,
  });

  const updateFormData = (
    step: RegistrationStep,
    data:
      | PersonalInfoInput
      | ProfessionalInfoInput
      | ContactInfoInput
      | PhotoInput,
  ) => {
    setFormData((prev) => {
      switch (step) {
        case 1:
          return { ...prev, personalInfo: data as PersonalInfoInput };
        case 2:
          return { ...prev, professionalInfo: data as ProfessionalInfoInput };
        case 3:
          return { ...prev, contactInfo: data as ContactInfoInput };
        case 4:
          return { ...prev, photo: data as PhotoInput };
        default:
          return prev;
      }
    });
    if (step < 4) setStep((prev) => (prev + 1) as RegistrationStep);
  };

  return (
    <>
      <PageBackground className="opacity-10" imageType="body" />
      <Wrapper className="relative z-10 py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <PageHeader
            title="Register"
            description="Join our engineering community by completing the registration process."
          />

          <Card className="border bg-card text-card-foreground shadow-lg">
            <CardContent className="pt-6 px-6">
              <div className="mb-8">
                <Steps currentStep={step} />
              </div>

              {step === 1 && (
                <PersonalInfoForm
                  onSubmit={(data) => updateFormData(1, data)}
                  initialData={formData.personalInfo}
                />
              )}

              {step === 2 && (
                <ProfessionalInfoForm
                  onSubmit={(data) => updateFormData(2, data)}
                  onBack={() => setStep(1)}
                  initialData={formData.professionalInfo}
                />
              )}

              {step === 3 && (
                <ContactInfoForm
                  onSubmit={(data) => updateFormData(3, data)}
                  onBack={() => setStep(2)}
                  initialData={formData.contactInfo}
                />
              )}

              {step === 4 && (
                <PhotoUploadForm
                  type="register"
                  onSubmit={(data) => updateFormData(4, data)}
                  onBack={() => setStep(3)}
                  initialData={formData.photo}
                  allFormData={formData}
                />
              )}

              <div className="mt-6 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary underline">
                  Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Wrapper>
    </>
  );
}
