"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormMessage as CustomFormMessage } from "@/components/ui/form-message";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { PasswordStrength } from "@/components/auth/password-strength";
import { toast } from "sonner";

interface SecurityQuestionFormProps {
  userDetails: {
    id: string;
    name: string;
    securityQuestion: string;
  };
  onBack: () => void;
}

// Separate components for each step
const SecurityAnswerForm = ({
  userDetails,
  onBack,
  onSuccess,
}: {
  userDetails: { id: string; name: string; securityQuestion: string };
  onBack: () => void;
  onSuccess: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const form = useForm<{ answer: string }>({
    resolver: zodResolver(
      z.object({
        answer: z.string().min(1, "Security answer is required"),
      }),
    ),
    defaultValues: { answer: "" },
  });

  const onSubmit = async (data: { answer: string }) => {
    setIsLoading(true);
    setFormError("");
    try {
      const response = await fetch("/api/auth/forgot-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userDetails.id,
          answer: data.answer,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      onSuccess();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Security Question:{" "}
                {userDetails.securityQuestion
                  .replace(/_/g, " ")
                  .toLowerCase()
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {formError && <CustomFormMessage type="error" message={formError} />}
        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full bg-[#20333C] hover:bg-[#20333C]/90"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Continue"
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </div>
      </form>
    </Form>
  );
};

const ResetPasswordForm = ({
  userDetails,
}: {
  userDetails: { id: string };
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<{
    password: string;
    confirmPassword: string;
  }>({
    resolver: zodResolver(
      z
        .object({
          password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
              /[A-Z]/,
              "Password must contain at least one uppercase letter",
            )
            .regex(
              /[a-z]/,
              "Password must contain at least one lowercase letter",
            )
            .regex(/[0-9]/, "Password must contain at least one number"),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords don't match",
          path: ["confirmPassword"],
        }),
    ),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: {
    password: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    setFormError("");
    try {
      const response = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userDetails.id,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      toast.success("Password reset successful", {
        description: "You can now login with your new password",
      });

      router.push("/login");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} {...field} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
              <PasswordStrength password={field.value} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {formError && <CustomFormMessage type="error" message={formError} />}
        <Button
          type="submit"
          className="w-full bg-[#20333C] hover:bg-[#20333C]/90"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting Password...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </Form>
  );
};

export function SecurityQuestionForm({
  userDetails,
  onBack,
}: SecurityQuestionFormProps) {
  const [step, setStep] = useState<"answer" | "reset">("answer");

  if (step === "answer") {
    return (
      <SecurityAnswerForm
        userDetails={userDetails}
        onBack={onBack}
        onSuccess={() => setStep("reset")}
      />
    );
  }

  return <ResetPasswordForm userDetails={userDetails} />;
}
