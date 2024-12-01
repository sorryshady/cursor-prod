"use client";

import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { useAuth } from "@/contexts/auth-context";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const photoSchema = z
  .custom<File>()
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "File size must be less than 5MB",
  })
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: "Only .jpg, .jpeg, .png and .webp formats are supported",
  });

interface UserProfilePhotoProps {
  photoUrl?: string | null;
  name: string;
}

export function UserProfilePhoto({ photoUrl, name }: UserProfilePhotoProps) {
  const { updateSession } = useAuth();
  const [photo, setPhoto] = useState(photoUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { startUpload } = useUploadThing("imageUploader");

  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      toast.error("No file selected");
      return;
    }

    // Validate file using Zod
    const validation = photoSchema.safeParse(file);

    if (!validation.success) {
      toast.error("Invalid file", {
        description: validation.error.issues[0].message,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await startUpload([file], {});

      if (!res?.[0]) {
        throw new Error("Upload failed");
      }

      const uploadedPhoto = res[0];

      const response = await fetch("/api/user/update-photo", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          photoUrl: uploadedPhoto.url,
          photoId: uploadedPhoto.key,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update photo");
      }

      const data = await response.json();
      setPhoto(data.photoUrl);

      await updateSession();

      toast.success("Photo updated successfully");
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Upload failed", {
        description: "Error uploading photo",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-fit flex flex-col">
      <div className="overflow-hidden rounded-lg w-full md:w-[50%] mx-auto lg:w-full max-h-72">
        <Image
          src={photo || "/fall-back.webp"}
          alt={name}
          width={500}
          height={500}
          className={`${isSubmitting ? "animate-pulse" : ""} object-cover object-top`}
        />
      </div>
      <Input
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
        id="photo-upload"
      />
      <Button
        variant="outline"
        className="mt-5 w-full md:w-[50%] lg:w-full mx-auto"
        disabled={isSubmitting}
        onClick={() => document.getElementById("photo-upload")?.click()}
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Upload
      </Button>
    </div>
  );
}
