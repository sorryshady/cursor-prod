"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
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
import type { Department, Designation, District, User } from "@prisma/client";
import { useAuth } from "@/contexts/auth-context";

type CompletionStep = 1 | 2 | 3 | 4;

function determineStartingStep(user: User): CompletionStep {
  // Check personal info
  if (!user.name || !user.gender || !user.dob || !user.bloodGroup) {
    return 1;
  }
  // Check professional info
  if (!user.designation || !user.department || !user.workDistrict) {
    return 2;
  }
  // Check contact info
  if (!user.email || !user.mobileNumber || !user.personalAddress) {
    return 3;
  }
  // Check photo
  if (!user.photoUrl) {
    return 4;
  }
  return 1; // Fallback
}

export default function CompleteAccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState<CompletionStep>(1);
  const [formData, setFormData] = useState({
    personalInfo: null as PersonalInfoInput | null,
    professionalInfo: null as ProfessionalInfoInput | null,
    contactInfo: null as ContactInfoInput | null,
    photo: null as PhotoInput | null,
  });
  const { user: session } = useAuth();

  useEffect(() => {
    const initializeUser = async () => {
      if (!session) {
        redirect("/login");
      }

      const res = await fetch("/api/mobile");
      if (!res.ok) {
        redirect("/login");
      }
      const userData = await res.json();
      setUser(userData);

      // Initialize form data with existing user data
      setFormData({
        personalInfo: {
          name: userData.name || "",
          gender: userData.gender || "",
          dob: userData.dob
            ? new Date(userData.dob).toLocaleDateString("en-GB")
            : "",
          bloodGroup: userData.bloodGroup || "",
        },
        professionalInfo:
          userData.userStatus === "WORKING"
            ? {
                userStatus: "WORKING",
                designation: userData.designation as Designation,
                department: userData.department as Department,
                officeAddress: userData.officeAddress || "",
                workDistrict: userData.workDistrict as District,
              }
            : {
                userStatus: "RETIRED",
                retiredDepartment: userData.retiredDepartment!,
              },
        contactInfo: {
          email: userData.email || "",
          mobileNumber: userData.mobileNumber || "",
          phoneNumber: userData.phoneNumber || "",
          personalAddress: userData.personalAddress || "",
          homeDistrict: userData.homeDistrict || undefined,
        },
        photo: {
          photoUrl: userData.photoUrl || "",
          photoId: userData.photoId || "",
        },
      });

      // Set starting step based on missing data
      setStep(determineStartingStep(userData));
    };

    initializeUser();
  }, []);

  const updateFormData = (
    step: CompletionStep,
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
    if (step < 4) setStep((prev) => (prev + 1) as CompletionStep);
  };

  if (!user) {
    return null; // or loading state
  }

  return (
    <>
      <PageBackground className="opacity-10" imageType="body" />
      <Wrapper className="relative z-10 py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <PageHeader
            title="Complete Your Profile"
            description="Please provide the missing information to complete your profile."
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
                  type="update"
                  onSubmit={(data) => updateFormData(4, data)}
                  onBack={() => setStep(3)}
                  initialData={formData.photo}
                  allFormData={formData}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </Wrapper>
    </>
  );
}
