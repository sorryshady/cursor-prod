/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo, useEffect } from "react";
import { Button } from "../ui/button";
import {
  CommitteeType,
  DistrictPositionTitle,
  StatePositionTitle,
  UserRole,
  UserStatus,
  User,
} from "@prisma/client";
import { Edit, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { changeTypeToText } from "@/lib/utils";
import { z } from "zod";
import { FormMessage as CustomFormMessage } from "@/components/ui/form-message";
import { Switch } from "../ui/switch";

const adminUpdateSchema = z.object({
  userStatus: z.nativeEnum(UserStatus),
  committeeType: z.nativeEnum(CommitteeType),
  userRole: z.nativeEnum(UserRole),
  positionState: z.nativeEnum(StatePositionTitle).optional(),
  positionDistrict: z.nativeEnum(DistrictPositionTitle).optional(),
});

type AdminUpdateSchema = z.infer<typeof adminUpdateSchema>;

export const AdminUpdate = ({ user }: { user: User }) => {
  const searchParams = useSearchParams();
  const query = searchParams.get("status");
  const router = useRouter();
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(false);
  const [switchValue, setSwitchValue] = useState(
    user.positionDistrict ? true : false,
  );
  const [committeeStatus, setCommitteeStatus] = useState<CommitteeType>(
    user.committeeType,
  );

  const initialData = useMemo(
    () => ({
      userStatus: user.userStatus,
      committeeType: user.committeeType,
      userRole: user.userRole,
      positionState: user.positionState ? user.positionState : undefined,
      positionDistrict: user.positionDistrict
        ? user.positionDistrict
        : undefined,
    }),
    [user],
  );

  const form = useForm<AdminUpdateSchema>({
    resolver: zodResolver(adminUpdateSchema),
    defaultValues: initialData,
  });
  const { reset } = form;

  useEffect(() => {
    if (!switchValue && committeeStatus === "STATE") {
      form.setValue("positionDistrict", undefined);
    }
  }, [switchValue, committeeStatus, form]);

  const onSubmit = async (values: AdminUpdateSchema) => {
    try {
      const hasChanges = Object.keys(initialData).some(
        (key) =>
          initialData[key as keyof AdminUpdateSchema] !==
          values[key as keyof AdminUpdateSchema],
      );
      if (!hasChanges) {
        setError("");
        toast.error("No changes made");
        return;
      }
      if (values.committeeType === "NONE") {
        values.positionDistrict = undefined;
        values.positionState = undefined;
      } else {
        if (values.committeeType === "STATE" && !values.positionState) {
          setError(
            "Position State is required if user belongs to State committee.",
          );
          toast.error(
            "Position State is required if user belongs to State committee.",
          );
          return;
        }
        if (values.committeeType === "DISTRICT" && !values.positionDistrict) {
          setError(
            "Position District is required if user belongs to District committee.",
          );
          toast.error(
            "Position District is required if user belongs to District committee.",
          );
          return;
        }
      }
      const submissionData = {
        ...values,
        positionState: values.positionState ? values.positionState : null,
        positionDistrict: values.positionDistrict
          ? values.positionDistrict
          : null,
      };
      const response = await fetch(`/api/admin/update-user`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          membershipId: user.membershipId,
          ...submissionData,
        }),
      });
      const data = await response.json();

      if (data.error) {
        console.error("error encountered");
        throw new Error(data.error);
      }

      reset(values);
      toast.success("Profile updated successfully");
      setEdit(false);
      setError("");
      router.refresh();
    } catch (error) {
      setError("An error occurred while submitting the form");
      reset(initialData);
    }
  };

  const isRetired = user.userStatus === "RETIRED";

  return (
    <>
      <div className="relative">
        {edit ? (
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 gap-x-5 gap-y-4">
                  <InfoField label="Name" value={user.name} />
                  <InfoField
                    label="Date of Birth"
                    value={
                      user.dob
                        ? new Date(user.dob).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"
                    }
                  />
                  <InfoField
                    label="Gender"
                    value={user.gender ? changeTypeToText(user.gender) : "N/A"}
                  />
                  <InfoField
                    label="Blood Group"
                    value={
                      user.bloodGroup
                        ? user.bloodGroup
                            .replace("_POS", " +ve")
                            .replace("_NEG", " -ve")
                        : "N/A"
                    }
                  />
                  <InfoField
                    label="User Status"
                    value={changeTypeToText(user.userStatus)}
                  />
                  {user.userRole && (
                    <FormField
                      control={form.control}
                      name="userRole"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-2 items-center">
                          <span className="w-32 font-medium text-muted-foreground">
                            User Role
                          </span>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select User Role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                              <SelectItem value="REGULAR">User</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {user.membershipId && (
                    <InfoField
                      label="Membership ID"
                      value={user.membershipId.toString()}
                    />
                  )}
                </div>
              </section>
              <Separator />
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Employment Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                  {user.userStatus === "WORKING" && (
                    <>
                      <InfoField
                        label="Department"
                        value={user.department || "-"}
                      />
                      <InfoField
                        label="Designation"
                        value={changeTypeToText(user.designation || "-")}
                      />
                      <InfoField
                        label="Office Address"
                        value={user.officeAddress || "-"}
                      />
                      <InfoField
                        label="Work District"
                        value={changeTypeToText(user.workDistrict || "-")}
                      />
                    </>
                  )}
                  {user.userStatus === "RETIRED" && (
                    <>
                      <InfoField
                        label="Status"
                        value={changeTypeToText(user.userStatus)}
                      />
                      <InfoField
                        label="Retired from"
                        value={user.retiredDepartment || "-"}
                      />
                    </>
                  )}
                </div>
              </section>
              <Separator />
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Permanent Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                  <InfoField label="Address" value={user.personalAddress} />
                  <InfoField
                    label="Home District"
                    value={changeTypeToText(user.homeDistrict)}
                  />
                </div>
              </section>
              <Separator />
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                  <InfoField label="Email" value={user.email || "-"} />
                  <InfoField
                    label="Phone Number"
                    value={user.phoneNumber || "-"}
                  />
                  <InfoField
                    label="Mobile Number"
                    value={user.mobileNumber || "-"}
                  />
                </div>
              </section>
              <Separator />
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Committee Information
                </h2>
                <div className="grid grid-cols-1 gap-x-5 gap-y-4">
                  <FormField
                    control={form.control}
                    name="committeeType"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-2 items-center">
                        <span className="w-32 font-medium text-muted-foreground">
                          Committee Type
                        </span>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setCommitteeStatus(value as CommitteeType);
                            form.setValue("positionState", undefined);
                            form.setValue("positionDistrict", undefined);
                            setSwitchValue(false);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select committee" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(CommitteeType).map((item) => (
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
                  {committeeStatus === "STATE" && (
                    <>
                      <FormField
                        control={form.control}
                        name="positionState"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-2 items-center">
                            <span className="w-32 font-medium text-muted-foreground">
                              Position
                            </span>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.values(StatePositionTitle)
                                  .filter(
                                    (position) =>
                                      !isRetired ||
                                      position ===
                                        StatePositionTitle.DISTRICT_NOMINEE,
                                  )
                                  .map((item) => (
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
                      {!isRetired && (
                        <>
                          <div className="grid grid-cols-2 items-center">
                            <span className="w-44 md:w-fit font-medium text-muted-foreground">
                              Is user a part of the district committee as well?
                            </span>
                            <Switch
                              checked={switchValue}
                              onCheckedChange={(checked) => {
                                setSwitchValue(checked);
                                if (!checked) {
                                  form.setValue("positionDistrict", undefined);
                                }
                              }}
                            />
                          </div>
                          {switchValue && (
                            <FormField
                              control={form.control}
                              name="positionDistrict"
                              render={({ field }) => (
                                <FormItem className="grid grid-cols-2 items-center">
                                  <span className="w-32 font-medium text-muted-foreground">
                                    District Position
                                  </span>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select position" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {Object.values(DistrictPositionTitle).map(
                                        (item) => (
                                          <SelectItem key={item} value={item}>
                                            <span className="capitalize">
                                              {changeTypeToText(item)}
                                            </span>
                                          </SelectItem>
                                        ),
                                      )}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </>
                      )}
                    </>
                  )}

                  {committeeStatus === "DISTRICT" && (
                    <FormField
                      control={form.control}
                      name="positionDistrict"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-2 items-center">
                          <span className="w-32 font-medium text-muted-foreground">
                            Position
                          </span>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select position" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(DistrictPositionTitle).map(
                                (item) => (
                                  <SelectItem key={item} value={item}>
                                    <span className="capitalize">
                                      {changeTypeToText(item)}
                                    </span>
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </section>

              {error && <CustomFormMessage type="error" message={error} />}
              <div className="flex w-full gap-5 mt-10">
                <Button
                  type="submit"
                  className="w-full flex-1"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Update"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    reset(initialData);
                    setError("");
                    setCommitteeStatus(user.committeeType);
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
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                <InfoField label="Name" value={user.name} />
                <InfoField
                  label="Date of Birth"
                  value={
                    user.dob
                      ? new Date(user.dob).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"
                  }
                />
                <InfoField
                  label="Gender"
                  value={user.gender ? changeTypeToText(user.gender) : "N/A"}
                />
                <InfoField
                  label="Blood Group"
                  value={
                    user.bloodGroup
                      ? user.bloodGroup
                          .replace("_POS", " +ve")
                          .replace("_NEG", " -ve")
                      : "N/A"
                  }
                />
                <InfoField
                  label="User Status"
                  value={changeTypeToText(user.userStatus)}
                />
                {user.userRole && (
                  <InfoField
                    label="User Role"
                    value={changeTypeToText(user.userRole!)}
                  />
                )}
                {user.membershipId && (
                  <InfoField
                    label="Membership ID"
                    value={user.membershipId.toString()}
                  />
                )}
              </div>
            </section>
            <Separator />
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Employment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                {user.userStatus === "WORKING" && (
                  <>
                    <InfoField
                      label="Department"
                      value={user.department || "-"}
                    />
                    <InfoField
                      label="Designation"
                      value={changeTypeToText(user.designation || "-")}
                    />
                    <InfoField
                      label="Office Address"
                      value={user.officeAddress || "-"}
                    />
                    <InfoField
                      label="Work District"
                      value={changeTypeToText(user.workDistrict || "-")}
                    />
                  </>
                )}
                {user.userStatus === "RETIRED" && (
                  <>
                    <InfoField
                      label="Status"
                      value={changeTypeToText(user.userStatus)}
                    />
                    <InfoField
                      label="Retired from"
                      value={user.retiredDepartment || "-"}
                    />
                  </>
                )}
              </div>
            </section>
            <Separator />
            <section>
              <h2 className="text-2xl font-semibold mb-4">Permanent Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                <InfoField label="Address" value={user.personalAddress} />
                <InfoField
                  label="Home District"
                  value={changeTypeToText(user.homeDistrict)}
                />
              </div>
            </section>
            <Separator />
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                <InfoField label="Email" value={user.email || "-"} />
                <InfoField
                  label="Phone Number"
                  value={user.phoneNumber || "-"}
                />
                <InfoField
                  label="Mobile Number"
                  value={user.mobileNumber || "-"}
                />
              </div>
            </section>
            <Separator />
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Committee Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                <InfoField
                  label="Committee Type"
                  value={changeTypeToText(user.committeeType || "-")}
                />
                {user.committeeType === "STATE" && (
                  <>
                    <InfoField
                      label="Position State"
                      value={changeTypeToText(user.positionState || "-")}
                    />
                    {user.positionDistrict && (
                      <InfoField
                        label="Position District"
                        value={changeTypeToText(user.positionDistrict || "-")}
                      />
                    )}
                  </>
                )}

                {user.committeeType === "DISTRICT" && (
                  <>
                    <InfoField
                      label="Position District"
                      value={changeTypeToText(user.positionDistrict || "-")}
                    />
                    <InfoField
                      label="District"
                      value={changeTypeToText(user.workDistrict || "-")}
                    />
                  </>
                )}
              </div>
            </section>
          </div>
        )}
        {!edit && query === "verified" && (
          <Button
            type="button"
            size={"icon"}
            className="absolute -top-5 right-0"
            onClick={() => setEdit(true)}
          >
            <Edit />
          </Button>
        )}
      </div>
    </>
  );
};
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 items-start">
      <span className="w-32 font-medium text-muted-foreground">{label}</span>
      <span className="overflow-hidden text-ellipsis">{value}</span>
    </div>
  );
}
