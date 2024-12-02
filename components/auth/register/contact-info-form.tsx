"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactInfoSchema,
  type ContactInfoInput,
} from "@/lib/validations/auth";
import { District } from "@prisma/client";
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
import { Textarea } from "@/components/ui/textarea";
import { changeTypeToText } from "@/lib/utils";

interface ContactInfoFormProps {
  onSubmit: (data: ContactInfoInput) => void;
  onBack: () => void;
  initialData?: ContactInfoInput | null;
}

export function ContactInfoForm({
  onSubmit,
  onBack,
  initialData,
}: ContactInfoFormProps) {
  const form = useForm<ContactInfoInput>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: initialData || {
      personalAddress: "",
      homeDistrict: undefined,
      email: "",
      phoneNumber: "",
      mobileNumber: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="personalAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personal Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your personal address"
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
            name="homeDistrict"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Home District</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your home district" />
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

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Enter your mobile number"
                    {...field}
                  />
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
          <Button type="submit" className="bg-[#20333C] hover:bg-[#20333C]/90">
            Next Step
          </Button>
        </div>
      </form>
    </Form>
  );
}
