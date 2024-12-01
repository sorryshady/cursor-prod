"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, District } from "@prisma/client";
import { Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { changeTypeToText } from "@/lib/utils";

// Schema definition
const updateProfileSchema = z.object({
  personalAddress: z
    .string()
    .min(1, { message: "Personal address is required" }),
  homeDistrict: z.nativeEnum(District),
  phoneNumber: z
    .string()
    .optional()
    .refine((value) => !value || /^(\+91)?\d{10}$/.test(value), {
      message:
        "Phone number must be exactly 10 digits or start with +91 followed by 10 digits",
    }),
  mobileNumber: z
    .string()
    .min(10)
    .refine((value) => !value || /^(\+91)?\d{10}$/.test(value), {
      message:
        "Phone number must be exactly 10 digits or start with +91 followed by 10 digits",
    }),
});

type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

interface AccountUpdateProps {
  user: User;
}

export function AccountUpdate({ user }: AccountUpdateProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(false);

  const initialData = useMemo(
    () => ({
      personalAddress: user.personalAddress || "",
      homeDistrict: user.homeDistrict || "",
      phoneNumber: user.phoneNumber || "",
      mobileNumber: user.mobileNumber || "",
    }),
    [user],
  );

  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (values: UpdateProfileSchema) => {
    try {
      setIsSubmitting(true);
      const hasChanges = Object.keys(initialData).some(
        (key) =>
          initialData[key as keyof UpdateProfileSchema] !==
          values[key as keyof UpdateProfileSchema],
      );

      if (!hasChanges) {
        setError("");
        toast.error("No changes made");
        return;
      }

      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          membershipId: user.membershipId,
          ...values,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      form.reset(values);
      toast.success("Profile updated successfully");
      setEdit(false);
      setError("");
      router.refresh();
    } catch (error) {
      setError("An error occurred while submitting the form");
      form.reset(initialData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {edit ? (
        <Form {...form}>
          <form className="space-y-10" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Permanent Address Section */}
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Permanent Address</h2>
              <div className="grid grid-cols-2 capitalize gap-5">
                <div>Permanent Address</div>
                <FormField
                  control={form.control}
                  name="personalAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter permanent address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>Home District</div>
                <FormField
                  control={form.control}
                  name="homeDistrict"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select District" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(District).map((item) => (
                            <SelectItem key={item} value={item}>
                              <span className="capitalize">
                                {changeTypeToText(item)}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Contact Info Section */}
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Contact Info</h2>
              <div className="grid grid-cols-2 capitalize gap-5">
                <div>Email</div>
                <div className="lowercase w-full overflow-hidden text-ellipsis">
                  {user.email}
                </div>
                <div>Phone Number</div>
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>Mobile Number</div>
                <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter mobile number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Other Information Section */}
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Other Information</h2>
              <div className="grid grid-cols-2 capitalize gap-5">
                <div>Committee Member</div>
                <div>{changeTypeToText(user.committeeType || "-")}</div>
                <div>Committee Position</div>
                <div>
                  {changeTypeToText(
                    user.positionState || user.positionDistrict || "-"
                  )}
                </div>
              </div>
            </div>

            {error && <FormMessage>{error}</FormMessage>}

            <div className="flex w-full gap-5 mt-10">
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update details
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset(initialData);
                  setEdit(false);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="space-y-10">
          {/* View mode sections */}
          <div className="space-y-5">
            <h2 className="text-xl font-bold">Permanent Address</h2>
            <div className="grid grid-cols-2 capitalize gap-5">
              <div>Permanent Address</div>
              <div>{user.personalAddress || "-"}</div>
              <div>Home District</div>
              <div>{changeTypeToText(user.homeDistrict || "-")}</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-5">
            <h2 className="text-xl font-bold">Contact Info</h2>
            <div className="grid grid-cols-2 capitalize gap-5">
              <div>Email</div>
              <div className="lowercase w-full overflow-hidden text-ellipsis">
                {user.email}
              </div>
              <div>Phone Number</div>
              <div>{user.phoneNumber || "-"}</div>
              <div>Mobile Number</div>
              <div>{user.mobileNumber || "-"}</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-5">
            <h2 className="text-xl font-bold">Other Information</h2>
            <div className="grid grid-cols-2 capitalize gap-5">
              <div>Committee Member</div>
              <div>{changeTypeToText(user.committeeType || "-")}</div>
              <div>Committee Position</div>
              <div>
                {changeTypeToText(
                  user.positionState || user.positionDistrict || "-"
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!edit && (
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="absolute -top-5 right-0"
          onClick={() => setEdit(true)}
        >
          <Edit />
        </Button>
      )}
    </div>
  );
}
