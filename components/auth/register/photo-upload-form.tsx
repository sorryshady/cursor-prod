"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { photoSchema, type PhotoInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useUploadThing } from "@/lib/uploadthing";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface PhotoUploadFormProps {
  onSubmit: (data: PhotoInput) => void;
  onBack: () => void;
  initialData?: PhotoInput | null;
  allFormData: any;
}

export function PhotoUploadForm({
  onSubmit,
  onBack,
  initialData,
  allFormData,
}: PhotoUploadFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<PhotoInput>({
    resolver: zodResolver(photoSchema),
    defaultValues: initialData || {
      photoUrl: "",
      photoId: "",
    },
  });

  const { startUpload } = useUploadThing("profileImage", {
    onClientUploadComplete: (res) => {
      if (res?.[0]) {
        form.setValue("photoUrl", res[0].url);
        form.setValue("photoId", res[0].key);
        toast.success("Photo uploaded successfully");
      }
      setIsUploading(false);
    },
    onUploadError: (error) => {
      toast.error(error.message);
      setIsUploading(false);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("image")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploading(true);
    await startUpload([file]);
  };

  const handleSubmit = async (data: PhotoInput) => {
    setIsSubmitting(true);
    try {
      const completeFormData = {
        name: allFormData.personalInfo.name,
        dob: allFormData.personalInfo.dob,
        gender: allFormData.personalInfo.gender,
        bloodGroup: allFormData.personalInfo.bloodGroup,

        userStatus: allFormData.professionalInfo.userStatus,
        department: allFormData.professionalInfo.department,
        designation: allFormData.professionalInfo.designation,
        officeAddress: allFormData.professionalInfo.officeAddress,
        workDistrict: allFormData.professionalInfo.workDistrict,

        personalAddress: allFormData.contactInfo.personalAddress,
        homeDistrict: allFormData.contactInfo.homeDistrict,
        email: allFormData.contactInfo.email,
        phoneNumber: allFormData.contactInfo.phoneNumber,
        mobileNumber: allFormData.contactInfo.mobileNumber,

        photoUrl: data.photoUrl,
        photoId: data.photoId,
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeFormData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      toast.success(
        "Registration successful! You can login after admin verification.",
      );
      router.push("/login");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="photoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Photo</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {field.value ? (
                      <div className="relative h-48 w-48 mx-auto">
                        <Image
                          src={field.value}
                          alt="Profile photo"
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    ) : null}

                    <Input
                      placeholder="Enter your photo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Previous Step
          </Button>
          <Button
            type="submit"
            className="bg-[#20333C] hover:bg-[#20333C]/90"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting
              </>
            ) : (
              "Complete Registration"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
