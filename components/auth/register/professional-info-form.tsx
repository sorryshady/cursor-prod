"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  professionalInfoSchema,
  type ProfessionalInfoInput,
} from "@/lib/validations/auth";
import { Department, Designation, District } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { changeTypeToText } from "@/lib/utils";

interface ProfessionalInfoFormProps {
  onSubmit: (data: ProfessionalInfoInput) => void;
  onBack: () => void;
  initialData?: ProfessionalInfoInput | null;
}

export function ProfessionalInfoForm({
  onSubmit,
  onBack,
  initialData,
}: ProfessionalInfoFormProps) {
  const form = useForm<ProfessionalInfoInput>({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues: initialData || {
      userStatus: undefined,
      department: undefined,
      designation: undefined,
      officeAddress: "",
      workDistrict: undefined,
      retiredDepartment: undefined,
    },
  });

  const userStatus = form.watch("userStatus");
  const isWorking = userStatus === "WORKING";
  const isRetired = userStatus === "RETIRED";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="userStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="WORKING">Working</SelectItem>
                    <SelectItem value="RETIRED">Retired</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {isWorking && (
            <>
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(Department).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {key.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your designation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(Designation).map(([key, value]) => (
                          <SelectItem
                            key={key}
                            value={value}
                            className="capitalize"
                          >
                            {changeTypeToText(key)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="officeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your office address"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workDistrict"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work District</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your work district" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(District).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {changeTypeToText(key)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          {isRetired && (
            <FormField
              control={form.control}
              name="retiredDepartment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retired from?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the department you retired from" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(Department).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {key.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Previous Step
          </Button>
          <Button type="submit" className="bg-[#20333C] hover:bg-[#20333C]/90">
            Next Step
          </Button>
        </div>
      </form>
    </Form>
  );
}
