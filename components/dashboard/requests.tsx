"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Designation, District, VerificationStatus } from "@prisma/client";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { FormMessage as FormErrorMessage } from "@/components/ui/form-message";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomDate from "@/components/form/custom-date";
import { changeTypeToText } from "@/lib/utils";
import { isValid, parse } from "date-fns";

// Schema definitions
const transferSchema = z.object({
  newWorkDistrict: z.nativeEnum(District, {
    message: "Please select your new work district",
  }),
  newOfficeAddress: z.string().optional(),
});

const promotionSchema = z.object({
  newPosition: z.nativeEnum(Designation, {
    message: "Please select your new designation",
  }),
});

const retirementSchema = z.object({
  retirementDate: z
    .string()
    .min(1, "Date of birth is required.")
    .refine((val) => {
      const date = parse(val, "dd/MM/yyyy", new Date());
      return (
        isValid(date) && date <= new Date() && date >= new Date("1900-01-01")
      );
    }, "Please enter a valid date in DD/MM/YYYY format"),
});

type RequestType = "promotion" | "transfer" | "retirement";

interface RequestsProps {
  requestStatus: VerificationStatus;
}

interface RequestFormProps {
  type: RequestType;
  setOpen: (open: boolean) => void;
}

function RequestForm({ type, setOpen }: RequestFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");

  const schema =
    type === "promotion"
      ? promotionSchema
      : type === "transfer"
        ? transferSchema
        : retirementSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      newOfficeAddress: "",
      newWorkDistrict: undefined,
      newPosition: undefined,
      retirementDate: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      setError("");
      const response = await fetch("/api/user/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: type.toUpperCase(),
          ...data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit request");
      }

      toast.success("Request submitted successfully");
      router.refresh();
      setOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  if (type === "transfer") {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="newWorkDistrict"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a district" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(District).map((district) => (
                      <SelectItem key={district} value={district}>
                        {changeTypeToText(district)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select your new work district.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newOfficeAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Office Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter new office address" {...field} />
                </FormControl>
                <FormDescription>
                  Enter your new office address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <FormErrorMessage type="error" message={error} />}
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Transfer Request"
            )}
          </Button>
        </form>
      </Form>
    );
  }

  if (type === "promotion") {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="newPosition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Designation</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new designation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(Designation).map((designation) => (
                      <SelectItem key={designation} value={designation}>
                        {changeTypeToText(designation)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select your new position</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <FormErrorMessage type="error" message={error} />}
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Promotion Request"
            )}
          </Button>
        </form>
      </Form>
    );
  }

  // Retirement form
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="retirementDate"
          render={() => (
            <FormItem>
              <FormLabel>Retirement Date</FormLabel>
              <FormControl>
                <CustomDate
                  name="retirementDate"
                  control={form.control}
                  placeholder="DD/MM/YYYY"
                />
              </FormControl>
              <FormDescription>Enter your date of retirement</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <FormErrorMessage type="error" message={error} />}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Retirement Request"
          )}
        </Button>
      </form>
    </Form>
  );
}

export function Requests({ requestStatus }: RequestsProps) {
  const [open, setOpen] = useState(false);
  const [requestType, setRequestType] = useState<RequestType>("promotion");

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-bold text-nowrap">
        Transfer, Promotion or Retirement?
      </h3>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={requestStatus === "PENDING"}>
            {requestStatus === "PENDING" ? "Pending Request" : "Update Request"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] lg:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Submit a Request</DialogTitle>
            <DialogDescription>
              Submit your transfer, promotion, or retirement request for
              approval.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Request Type</Label>
              <Select
                onValueChange={(value) => setRequestType(value as RequestType)}
                defaultValue={requestType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="promotion">Promotion</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="retirement">Retirement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <RequestForm type={requestType} setOpen={setOpen} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
