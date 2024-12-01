"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  personalInfoSchema,
  type PersonalInfoInput,
} from "@/lib/validations/auth";
import { Gender, BloodGroup } from "@prisma/client";
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
import { Input } from "@/components/ui/input";
import CustomDate from "@/components/form/custom-date";

interface PersonalInfoFormProps {
  onSubmit: (data: PersonalInfoInput) => void;
  initialData?: PersonalInfoInput | null;
}

export function PersonalInfoForm({
  onSubmit,
  initialData,
}: PersonalInfoFormProps) {
  const form = useForm<PersonalInfoInput>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: initialData || {
      name: "",
      dob: "",
      gender: undefined,
      bloodGroup: undefined,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dob"
            render={() => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <CustomDate
                    name="dob"
                    control={form.control}
                    placeholder="DD/MM/YYYY"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(Gender).map(([key, value]) => (
                      <SelectItem
                        key={key}
                        value={value}
                        className="capitalize"
                      >
                        {key.replace(/_/g, " ").toLowerCase()}
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
            name="bloodGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Group</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your blood group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(BloodGroup).map(([key, value]) => (
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
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-[#20333C] hover:bg-[#20333C]/90">
            Next Step
          </Button>
        </div>
      </form>
    </Form>
  );
}
